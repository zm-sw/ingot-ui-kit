/**
 * Writes what the "Changes" page reads: the releases, and when each
 * primitive first appeared in one.
 *
 * The versions are already true in three places — the tags, the changelog
 * and the doc pages — and none of them is reachable from the site. A
 * reader who wants to know whether the component they are looking at
 * exists in the version they pinned has to leave and go dig in the
 * repository.
 *
 * So the answer is computed here, at build time, from the tags themselves.
 * ``gh`` is asked first because a GitHub release carries the notes a human
 * can read; ``git tag`` is the fallback, and it is a real fallback rather
 * than an error path — a clone with no network still builds a site, it
 * just gets dates instead of notes.
 *
 * "Since which version" comes from the trees, not from a list somebody
 * maintains: for each tag, which doc pages existed in it. The first tag
 * that carries a page is the version the primitive shipped in.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUT = "src/ingot-docs/releases.json";

function git(...args) {
  return execFileSync("git", args, {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

/** Tags, newest first. */
function tags() {
  return git("tag", "--list", "v*", "--sort=-v:refname").split("\n").filter(Boolean);
}

/** Notes from the GitHub release, or null when there is nobody to ask. */
function notesFor(tag) {
  try {
    const body = execFileSync("gh", ["release", "view", tag, "--json", "body"], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: process.platform === "win32",
    });
    return JSON.parse(body).body?.trim() || null;
  } catch {
    return null;
  }
}

/** Primitive names documented at a tag. */
function pagesAt(tag) {
  const files = git("ls-tree", "-r", "--name-only", tag, "src/ingot-docs/pages")
    .split("\n")
    .filter((file) => file.endsWith("Doc.tsx"));
  return files.map((file) => file.replace(/^.*\//, "").replace(/Doc\.tsx$/, ""));
}

const all = tags();
const releases = all.map((tag) => ({
  tag,
  date: git("log", "-1", "--format=%ad", "--date=short", tag),
  notes: notesFor(tag),
}));

// Oldest first, so the first tag that carries a page is the one that wins.
const since = {};
for (const { tag } of [...releases].reverse()) {
  for (const name of pagesAt(tag)) {
    if (!(name in since)) since[name] = tag;
  }
}

writeFileSync(OUT, `${JSON.stringify({ releases, since }, null, 2)}\n`);
console.log(
  `releases: ${releases.length} tag(s), ${Object.keys(since).length} page(s)`,
);
