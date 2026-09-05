/**
 * PR check: a component change without a version bump does not pass.
 *
 * CLAUDE.md has had the rule from the start and it was still broken twice
 * in one day (the doc-page version arrived in a follow-up commit). The
 * automatic release (release.mjs) STANDS on those versions — a version
 * that does not move is a release that never ships. Hence a machine:
 *
 *   a file under ``src/ingot/`` (tests excluded) changed
 *   and the change is not comments-only
 *   and no ``version:`` moved in ``src/ingot-docs/pages/``
 *   and no commit in the PR is a ``release!:``
 *   → FAIL.
 *
 * Comments-only changes are exempt: a translated or corrected comment does
 * not change what a consumer gets, so it must not force a version bump —
 * otherwise the version would stop meaning "behaviour changed".
 *
 * The diff base arrives as an argument (the workflow passes the PR's base
 * ref).
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.argv[2];
if (!base) {
  console.error("usage: node scripts/version_guard.mjs <base-ref>");
  process.exit(2);
}

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
    return readFileSync(file, "utf-8");
  } catch {
    return "";
  }
}

const changed = git("diff", "--name-only", `${base}...HEAD`)
  .split("\n")
  .filter(Boolean);

const componentChanged = changed.filter(
  (file) =>
    file.startsWith("src/ingot/") &&
    file.endsWith(".tsx") &&
    !file.includes(".test."),
);
if (componentChanged.length === 0) {
  console.log("[version-guard] OK: no component source changed");
  process.exit(0);
}

const substantive = componentChanged.filter(
  (file) => withoutComments(fileAt(base, file)) !== withoutComments(fileNow(file)),
);
if (substantive.length === 0) {
  console.log(
    `[version-guard] OK: ${componentChanged.length} component file(s) changed in comments only`,
  );
  process.exit(0);
}

const versionMoved = changed
  .filter((file) => file.startsWith("src/ingot-docs/pages/"))
  .some((file) => {
    const diff = git("diff", `${base}...HEAD`, "--", file);
    return /^[+-]\s*version:/m.test(diff);
  });

const subjects = git("log", `${base}..HEAD`, "--format=%s")
  .split("\n")
  .filter(Boolean);
const epoch = subjects.some((subject) => subject.startsWith("release!:"));

if (versionMoved || epoch) {
  console.log(
    `[version-guard] OK: ${substantive.length} component file(s) changed, version moved`,
  );
  process.exit(0);
}

console.error(
  `[version-guard] FAIL: component source changed without a version bump:\n` +
    substantive.map((file) => `  ${file}`).join("\n") +
    `\nBump the component's version on its doc page in src/ingot-docs/pages/` +
    ` (same commit — CLAUDE.md), or mark a kit epoch with a 'release!:' commit.`,
);
process.exit(1);
