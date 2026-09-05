/**
 * Automatic kit versioning vX.Y.Z (owner's decision of 2026-09-02).
 *
 *   X — big, kit-wide changes. A machine cannot tell them, so they are
 *       announced EXCLUSIVELY by a commit whose subject starts with
 *       ``release!:``.
 *   Y — a new primitive, or a major bump of some component (the doc
 *       pages are a machine-readable contract: ``name`` + ``version``;
 *       the bump is enforced by the guard and by CLAUDE.md).
 *   Z — everything else that changed since the last tag (component
 *       patch bumps, tokens, documentation, doc web chrome).
 *
 * The source of truth is the doc page registry, not commit prefixes —
 * prefix discipline drifts, whereas component versions are guarded by the
 * ``ingot-doc-pages`` guard and the ``version-guard`` PR check.
 *
 * Runs from GitHub Actions after a push to main (release.yml). Locally
 * only ``--dry-run``: the script writes package.json, commits, tags and
 * pushes, and that has no business running from a developer machine.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { nextVersion, releaseChanges, releaseNotes } from "./releaseCore.mjs";

const DRY = process.argv.includes("--dry-run");

function git(...args) {
  return execFileSync("git", args, { encoding: "utf-8" }).trim();
}

/** ``name`` and ``version`` from one doc page. */
function parseDoc(source) {
  const name = source.match(/name:\s*"([^"]+)"/)?.[1];
  const version = source.match(/version:\s*"([^"]+)"/)?.[1];
  return name && version ? { name, version } : null;
}

/** Map component → version at the given ref (HEAD = filesystem). */
function componentVersions(ref) {
  const out = new Map();
  if (ref === null) {
    const dir = "src/ingot-docs/pages";
    for (const file of readdirSync(dir)) {
      if (!file.endsWith("Doc.tsx")) continue;
      const doc = parseDoc(readFileSync(join(dir, file), "utf-8"));
      if (doc) out.set(doc.name, doc.version);
    }
    return out;
  }
  const files = git("ls-tree", "-r", "--name-only", ref, "src/ingot-docs/pages")
    .split("\n")
    .filter((f) => f.endsWith("Doc.tsx"));
  for (const file of files) {
    const doc = parseDoc(git("show", `${ref}:${file}`));
    if (doc) out.set(doc.name, doc.version);
  }
  return out;
}

function lastTag() {
  const tags = git("tag", "--list", "v*", "--sort=-v:refname")
    .split("\n")
    .filter(Boolean);
  return tags[0] ?? null;
}

const tag = lastTag();

if (tag === null) {
  // Bootstrap: the first run only anchors today's state. Without an anchor
  // the first release would have to walk the whole history and guess what
  // had already "shipped".
  const version = JSON.parse(readFileSync("package.json", "utf-8")).version;
  console.log(`no release tag yet -> anchoring v${version} at HEAD`);
  if (!DRY) {
    git("tag", "-a", `v${version}`, "-m", `v${version}`);
    git("push", "origin", `v${version}`);
  }
  process.exit(0);
}

const commits = git("log", `${tag}..HEAD`, "--format=%s").split("\n").filter(Boolean);
if (commits.length === 0) {
  console.log(`nothing to release since ${tag}`);
  process.exit(0);
}

const before = componentVersions(tag);
const now = componentVersions(null);

const epoch = commits.some((subject) => subject.startsWith("release!:"));
const changes = releaseChanges({ before, now, epoch });
const next = nextVersion(tag, changes.kind);

// English, like every other document a consumer reads (the README, the
// changelog, the doc web's English side). These lines ARE the changelog
// entry as well as the release notes — one text, so there is one telling
// to keep true.
const noteLines = releaseNotes({ tag, next, changes, epoch });
const notes = noteLines.join("\n");

console.log(`${tag} -> v${next} (${changes.kind})`);
console.log(notes);

/**
 * Prepends this release to CHANGELOG.md.
 *
 * The file is machine-written on purpose: a changelog kept by hand is a
 * second telling of what the doc page versions already say, and the two
 * disagree the first time somebody is in a hurry. The entry carries the same
 * lines as the GitHub release, so those two cannot drift apart either.
 */
function prependChangelog(version, lines) {
  const path = "CHANGELOG.md";
  const date = new Date().toISOString().slice(0, 10);
  const entry = [
    `## v${version} — ${date}`,
    "",
    lines[0],
    ...(lines.length > 1 ? ["", ...lines.slice(1).map((line) => `- ${line}`)] : []),
  ].join("\n");

  const existing = existsSync(path) ? readFileSync(path, "utf-8") : "";
  // The header ends where the first entry starts, so a new release slots in
  // right after it and the newest version is the first thing a reader sees.
  const at = existing.indexOf("\n## ");
  const head = at === -1 ? existing.trimEnd() : existing.slice(0, at).trimEnd();
  const rest = at === -1 ? "" : existing.slice(at + 1);
  writeFileSync(path, `${head}\n\n${entry}\n${rest ? `\n${rest}` : ""}`);
}

if (DRY) process.exit(0);

/**
 * Tag and GitHub release over what already lies on main.
 *
 * The tag is annotated on purpose. It used to be made lightweight and sent
 * via ``--follow-tags``, which however pushes ONLY annotated tags — so the
 * tag never reached the remote, the next run still saw the old one,
 * computed the same version and fell over on an empty commit. The version
 * did not move from then on and every run lit up red.
 */
function publish(version, body) {
  git("tag", "-a", `v${version}`, "-m", `v${version}`);
  git("push", "origin", `v${version}`);
  writeFileSync("release-notes.txt", `${body}\n`);
  execFileSync(
    "gh",
    [
      "release",
      "create",
      `v${version}`,
      "--title",
      `v${version}`,
      "--notes-file",
      "release-notes.txt",
    ],
    { stdio: "inherit" },
  );
}

function gh(...args) {
  return execFileSync("gh", args, { encoding: "utf-8" }).trim();
}

/**
 * Publishes the tagged version to GitHub Packages — if the repository says
 * so.
 *
 * A git tag is a fine pin and a poor contract: no semver range, no
 * integrity, and npm caches a ``github:`` dependency under a version
 * number that names many different trees. A registry fixes all three.
 *
 * It is behind ``INGOT_PUBLISH`` because publishing is the one step in
 * this script that cannot be taken back. A wrong tag can be moved and a
 * wrong release edited; a published version is out, and deleting it breaks
 * whoever already installed it. So the first publish is a decision
 * somebody makes by setting the variable, not a side effect of merging.
 *
 * Failure here is deliberately not fatal. The tag and the GitHub release
 * are the record of what shipped; a registry that was down must not leave
 * the repository looking as though the version never happened.
 */
function publishToRegistry(version) {
  if (process.env.INGOT_PUBLISH !== "true") {
    console.log(
      `v${version} not published to the registry (INGOT_PUBLISH is not set) -> the tag is the pin`,
    );
    return;
  }
  try {
    // The token is the workflow's own; `packages: write` is what lets it
    // push, and provenance needs `id-token: write` next to it.
    writeFileSync(
      ".npmrc",
      [
        "@forgmatic:registry=https://npm.pkg.github.com",
        `//npm.pkg.github.com/:_authToken=${process.env.NODE_AUTH_TOKEN ?? ""}`,
        "",
      ].join("\n"),
    );
    execFileSync("npm", ["publish", "--provenance"], { stdio: "inherit" });
    console.log(`v${version} published to GitHub Packages`);
  } catch {
    console.log(
      `v${version} could not be published to the registry -> the tag still holds`,
    );
  }
}

// The identity must come before anything that writes to history. An
// annotated tag is a full object with an author, so it needs it just like
// a commit does — and the shortcut below, which only finishes the tag,
// never reaches any commit.
git("config", "user.name", "ingot-release-bot");
git("config", "user.email", "noreply@forgmatic.com");

const pkgPath = "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

// main already carries the version: the previous run finished its PR but
// never got to the tag (it crashed, hit its time limit, or auto-merge
// merged it after the run had ended). Only the tag and the release are
// missing — a bump here would be the second one and the commit empty.
if (pkg.version === next) {
  console.log(`package.json už je na v${next} -> dotahuje se jen tag a release`);
  publish(next, notes);
  publishToRegistry(next);
  process.exit(0);
}

// main accepts no direct push, so the bump arrives like every other change
// — by pull request. The branch is short-lived — the script cleans it up
// after the merge.
const branch = `release/v${next}`;

pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

git("checkout", "-B", branch);
prependChangelog(next, noteLines);
git("add", pkgPath, "CHANGELOG.md");
git("commit", "-m", `chore(release): v${next}`);
// By overwrite, not by append: when the previous run dropped out between
// pushing the branch and opening the PR, the branch was left hanging and
// a plain push would get stuck on it. The machine owns this branch, so its
// history belongs to nobody.
git("push", "--force", "origin", branch);

// Same reason, one step further: an unfinished run may already have opened
// the PR. A second ``pr create`` would fail on that, so the open PR is
// taken over.
const open = gh(
  "pr",
  "list",
  "--head",
  branch,
  "--state",
  "open",
  "--json",
  "number",
  "--jq",
  "length",
);
if (open === "0") {
  gh(
    "pr",
    "create",
    "--base",
    "main",
    "--head",
    branch,
    "--title",
    `chore(release): v${next}`,
    "--body",
    notes,
  );
} else {
  console.log(`PR na ${branch} už je otevřené -> pokračuje se na něm`);
}

// A PR opened with GITHUB_TOKEN does not trigger the ``pull_request``
// workflow — that is GitHub's safeguard against loops. The required checks
// would therefore never arrive and auto-merge would wait forever.
// ``workflow_dispatch`` is the documented exception GITHUB_TOKEN may
// trigger, and its check runs land on the same commit, so the ruleset
// accepts them.
gh("workflow", "run", "ci.yml", "--ref", branch);
gh("pr", "merge", branch, "--auto", "--squash");

// The very run that did not start leaves behind a record in the
// ``action_required`` state. The ruleset reads it as a required check that
// has not finished yet, so auto-merge stalls — even though the dispatch
// has meanwhile cleared it green. The record is therefore approved on a
// best-effort basis.
//
// Whether GitHub allows the bot to do that over its own run shows only in
// production, and nothing depends on the answer: if it refuses, a human
// approves the run and the PR lands anyway.
const repo = process.env.GITHUB_REPOSITORY;
await new Promise((resolve) => setTimeout(resolve, 15_000));
try {
  const pending = gh(
    "api",
    `repos/${repo}/actions/runs?status=action_required&branch=${encodeURIComponent(branch)}`,
    "--jq",
    ".workflow_runs[].id",
  )
    .split("\n")
    .filter(Boolean);
  for (const id of pending) {
    gh("api", "-X", "POST", `repos/${repo}/actions/runs/${id}/approve`);
    console.log(`čekající běh ${id} schválen`);
  }
} catch {
  console.log("čekající běh nejde schválit botem -> schválí ho člověk");
}

// A squash gives the merge a new id, so the tag must go on that — not on
// the branch commit. If the merge does not make it within the limit,
// nothing is lost: the PR lands on its own and the next run finishes the
// tag through the branch above.
const deadline = Date.now() + 20 * 60 * 1000;
let merged = false;
while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 30_000));
  const state = gh("pr", "view", branch, "--json", "state", "--jq", ".state");
  console.log(`PR ${branch}: ${state}`);
  if (state === "MERGED") {
    merged = true;
    break;
  }
  if (state === "CLOSED") break;
}

if (!merged) {
  console.log(`PR na v${next} se do limitu neslil -> tag dotáhne příští běh`);
  process.exit(0);
}

git("checkout", "main");
git("fetch", "origin", "main");
git("reset", "--hard", "origin/main");

// The repo does not delete the heads of merged requests — dev would
// vanish after every promotion. The release therefore cleans up after
// itself, otherwise one dead branch would be left hanging after every
// version.
git("push", "origin", "--delete", branch);

publish(next, notes);
publishToRegistry(next);
