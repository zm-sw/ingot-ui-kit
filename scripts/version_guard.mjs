/**
 * PR check: a kit change without a version bump on the RIGHT page does not
 * pass.
 *
 * CLAUDE.md has had the rule from the start and it was still broken twice
 * in one day (the doc-page version arrived in a follow-up commit). The
 * automatic release (release.mjs) STANDS on those versions — a version that
 * does not move is a release that never ships. Hence a machine:
 *
 *   a file under ``src/ingot/`` (tests excluded) changed
 *   and the change is not comments-only
 *   and the pages that file belongs to did not move their ``version:``
 *   and no commit in the PR is a ``release!:``
 *   → FAIL.
 *
 * Two holes the first version had, both closed here:
 *
 * - It looked at ``.tsx`` only, so ``tokens.css``, ``fields.ts``,
 *   ``overlayChrome.ts`` and the Tailwind preset shipped unversioned.
 * - It accepted a bump on ANY page, so moving IngotBadge's version paid for
 *   a change to IngotTable. Which page owes the bump is now decided by
 *   ``versionGuardCore.mjs`` from the imports and from the tokens each page
 *   declares — the mapping is unit-tested in ``tests/versionGuard.test.ts``.
 *
 * Comments-only changes stay exempt: a translated or corrected comment does
 * not change what a consumer gets, so it must not force a bump — otherwise
 * the version would stop meaning "behaviour changed".
 *
 * The diff base arrives as an argument (the workflow passes the PR's base
 * ref).
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { pagesOwed } from "./versionGuardCore.mjs";

const base = process.argv[2];
if (!base) {
  console.error("usage: node scripts/version_guard.mjs <base-ref>");
  process.exit(2);
}

const ROOT = new URL("..", import.meta.url).pathname.replace(
  /^\/([A-Za-z]):\//,
  "$1:/",
);
const KIT_DIR = join(ROOT, "src/ingot");
const PAGES_DIR = join(ROOT, "src/ingot-docs/pages");

function git(...args) {
  return execFileSync("git", args, { encoding: "utf-8" }).trim();
}

/**
 * Source with every comment removed and whitespace normalised, so two
 * versions of a file that differ only in comments compare equal.
 * Handles block comments, line comments and JSX comment containers
 * (`{/* … *\/}`), which leave an empty `{}` behind that is stripped too.
 */
function withoutComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1")
    .replace(/\{\s*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fileAt(ref, file) {
  try {
    return git("show", `${ref}:${file}`);
  } catch {
    return "";
  }
}

function fileNow(file) {
  try {
    return readFileSync(join(ROOT, file), "utf-8");
  } catch {
    return "";
  }
}

const changed = git("diff", "--name-only", `${base}...HEAD`)
  .split("\n")
  .filter(Boolean);

const kitChanged = changed.filter(
  (file) => file.startsWith("src/ingot/") && !file.includes(".test."),
);
if (kitChanged.length === 0) {
  console.log("[version-guard] OK: no kit source changed");
  process.exit(0);
}

const substantive = kitChanged.filter(
  (file) => withoutComments(fileAt(base, file)) !== withoutComments(fileNow(file)),
);
if (substantive.length === 0) {
  console.log(
    `[version-guard] OK: ${kitChanged.length} kit file(s) changed in comments only`,
  );
  process.exit(0);
}

const subjects = git("log", `${base}..HEAD`, "--format=%s")
  .split("\n")
  .filter(Boolean);
if (subjects.some((subject) => subject.startsWith("release!:"))) {
  console.log("[version-guard] OK: kit epoch declared by a 'release!:' commit");
  process.exit(0);
}

// Every kit module, so the guard can see who imports whom.
const sources = {};
for (const entry of readdirSync(KIT_DIR)) {
  if (!/\.(tsx?|css)$/.test(entry) || entry.includes(".test.")) continue;
  sources[entry.replace(/\.(tsx?|css)$/, "")] = readFileSync(
    join(KIT_DIR, entry),
    "utf-8",
  );
}

// Every doc page with the tokens it declares — the page's own promise about
// what a token change reaches.
const pages = {};
for (const entry of readdirSync(PAGES_DIR)) {
  if (!entry.endsWith("Doc.tsx")) continue;
  const src = readFileSync(join(PAGES_DIR, entry), "utf-8");
  const name = src.match(/name:\s*"([^"]+)"/)?.[1] ?? entry.replace(/Doc\.tsx$/, "");
  const tokens = [...(src.match(/tokens:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)]
    .map((match) => match[1]);
  pages[name] = tokens;
}

const pageFiles = changed.filter((file) => file.startsWith("src/ingot-docs/pages/"));
const bumpedPages = [];
const addedPages = [];
for (const file of pageFiles) {
  const name = file.replace(/^.*\//, "").replace(/Doc\.tsx$/, "");
  if (!existsSync(join(ROOT, file))) continue;
  if (fileAt(base, file) === "") {
    addedPages.push(name);
    continue;
  }
  const diff = git("diff", `${base}...HEAD`, "--", file);
  if (/^[+-]\s*version:/m.test(diff)) bumpedPages.push(name);
}

const owed = pagesOwed({
  changedFiles: substantive,
  sources,
  pages,
  bumpedPages,
  addedPages,
  tokensBefore: fileAt(base, "src/ingot/tokens.css"),
  tokensAfter: fileNow("src/ingot/tokens.css"),
});

if (owed.length === 0) {
  console.log(
    `[version-guard] OK: ${substantive.length} kit file(s) changed, every page that owes a bump moved`,
  );
  process.exit(0);
}

console.error(
  "[version-guard] FAIL: kit source changed without a version bump on its page:\n" +
    owed
      .map(
        ({ file, reason, pages: missing }) =>
          `  ${file} → bump ${missing.join(", ")} (${reason})`,
      )
      .join("\n") +
    "\nMove version: on those pages in src/ingot-docs/pages/ in the same commit" +
    " (CLAUDE.md), or mark a kit epoch with a 'release!:' commit.",
);
process.exit(1);
