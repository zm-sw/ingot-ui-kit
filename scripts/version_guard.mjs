/**
 * PR check: změna komponenty bez zvednuté verze neprojde.
 *
 * CLAUDE.md to pravidlo má od začátku a dvakrát za jediný den se
 * porušilo i tak (verze doc stránky dojela až follow-up commitem).
 * Automatický release (release.mjs) na těch verzích STOJÍ — verze,
 * která nehne, znamená release, který nevyjde. Proto stroj:
 *
 *   změnil se soubor v ``src/ingot/`` (mimo testy)
 *   a nehnula žádná ``version:`` v ``src/ingot-docs/pages/``
 *   a v commitech PR není ``release!:``
 *   → FAIL.
 *
 * Základna diffu přichází argumentem (workflow předává base ref PR).
 */

import { execFileSync } from "node:child_process";

const base = process.argv[2];
if (!base) {
  console.error("usage: node scripts/version_guard.mjs <base-ref>");
  process.exit(2);
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf-8" }).trim();
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
    `[version-guard] OK: ${componentChanged.length} component file(s) changed, version moved`,
  );
  process.exit(0);
}

console.error(
  `[version-guard] FAIL: component source changed without a version bump:\n` +
    componentChanged.map((file) => `  ${file}`).join("\n") +
    `\nBump the component's version on its doc page in src/ingot-docs/pages/` +
    ` (same commit — CLAUDE.md), or mark a kit epoch with a 'release!:' commit.`,
);
process.exit(1);
