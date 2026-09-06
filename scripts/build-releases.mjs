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
 * So the answer is computed from the tags themselves. ``gh`` is asked
 * first because a GitHub release carries the notes a human can read;
 * ``git tag`` is the fallback, and it is a real fallback rather than an
 * error path — a clone with no network still builds a site, it just gets
 * dates instead of notes.
 *
 * "Since which version" comes from the trees, not from a list somebody
 * maintains: for each tag, which doc pages existed in it. The first tag
 * that carries a page is the version the primitive shipped in.
 *
 * **This module is called by ``release.mjs``, not only by hand.** The file
 * used to be regenerated manually, which meant it was regenerated once and
 * then never again: the site shipped a version its own Changes page had
 * never heard of. The release now writes it in the same commit that moves
 * `package.json`, and `writeReleases` takes the pending release because at
 * that moment its tag does not exist yet.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { releasesData } from "./releasesCore.mjs";

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

const pageName = (file) => file.replace(/^.*\//, "").replace(/Doc\.tsx$/, "");

/** Primitive names documented at a tag. */
function pagesAt(tag) {
  return git("ls-tree", "-r", "--name-only", tag, "src/ingot-docs/pages")
    .split("\n")
    .filter((file) => file.endsWith("Doc.tsx"))
    .map(pageName);
}

/** Primitive names documented in the working tree — what a pending release carries. */
export function currentPages() {
  return readdirSync("src/ingot-docs/pages")
    .filter((file) => file.endsWith("Doc.tsx"))
    .map(pageName);
}

/** Every tagged release, newest first, with the pages it carried. */
export function collectTagged() {
  return tags().map((tag) => ({
    tag,
    date: git("log", "-1", "--format=%ad", "--date=short", tag),
    notes: notesFor(tag),
    pages: pagesAt(tag),
  }));
}

/**
 * Writes ``releases.json``.
 *
 * ``pending`` is the release being cut right now — its tag does not exist
 * yet, so it cannot be read out of git and has to be handed in.
 */
export function writeReleases({ pending = null } = {}) {
  const data = releasesData({ tagged: collectTagged(), pending });
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `releases: ${data.releases.length} tag(s), ${Object.keys(data.since).length} page(s)` +
      (pending ? ` (including the pending ${pending.tag})` : ""),
  );
  return data;
}

// Run as a script (`npm run releases`) rather than imported: regenerate
// from the tags that exist. Importing it must have no side effect, because
// `release.mjs` imports it to write a file it has more to say about.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  writeReleases();
}
