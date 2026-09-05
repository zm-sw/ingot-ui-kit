/**
 * What the package actually ships (KAN-852).
 *
 * The kit is source-distributed: `files` decides what leaves the repository
 * and `exports` decides what a consumer may import. The two are easy to
 * disagree — an entry pointing at a file outside `files` installs as a
 * module that resolves in this repository and is missing in every other
 * one, and nothing here would notice, because everything in this repository
 * resolves through the `@/` alias instead.
 *
 * So the manifest is checked as a manifest: every entry exists, every entry
 * ships, and the two entries a consumer cannot get anywhere else — the
 * marketing blocks and the theme plumbing — are named explicitly. A test
 * that only walked the map would pass over an empty one.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
type ExportTarget = string | { types: string; default: string };

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8")) as {
  exports: Record<string, ExportTarget>;
  typesVersions: Record<string, Record<string, string[]>>;
  files: string[];
  peerDependencies: Record<string, string>;
};

/**
 * Every file an entry can resolve to.
 *
 * A TypeScript entry names its target twice — once for the type resolver
 * and once for everything else — and the two disagreeing is a package that
 * builds and has no types, or has types for code that is not what runs.
 * Both spellings are therefore checked, not just the one that happens to
 * be first.
 */
function targets(entry: ExportTarget): string[] {
  return typeof entry === "string" ? [entry] : [entry.types, entry.default];
}

const entries = Object.entries(pkg.exports).flatMap(([name, entry]) =>
  targets(entry).map((target) => [name, target] as const),
);

describe("the package manifest", () => {
  it.each(entries)("%s points at a file that exists", (_entry, target) => {
    expect(existsSync(join(ROOT, target))).toBe(true);
  });

  it.each(entries)("%s points inside what files ships", (_entry, target) => {
    expect(pkg.files.some((dir) => target.startsWith(`./${dir}/`))).toBe(true);
  });

  it("offers the marketing blocks, the theme plumbing and the domain layer", () => {
    expect(Object.keys(pkg.exports)).toEqual(
      expect.arrayContaining([
        ".",
        "./forgmatic",
        "./marketing",
        "./theme",
        "./theme-init.js",
        "./tailwind-preset",
        "./tokens.css",
        "./tokens.json",
      ]),
    );
  });

  it("a TypeScript entry names the same file for types and for code", () => {
    for (const [name, entry] of Object.entries(pkg.exports)) {
      if (typeof entry === "string") continue;
      expect(entry.types, `${name} resolves to two different files`).toBe(
        entry.default,
      );
    }
  });

  it("the old resolver, which ignores exports, is given the same map", () => {
    // A consumer on moduleResolution "node" sees none of the subpaths
    // above. Without this map their editor reports every subpath import as
    // a missing module while the build works — the worst kind of failure,
    // because it looks like their tooling.
    for (const [subpath, entry] of Object.entries(pkg.exports)) {
      if (subpath === "." || typeof entry !== "object") continue;
      const key = subpath.replace(/^\.\//, "");
      expect(
        pkg.typesVersions["*"][key],
        `${subpath} is missing from typesVersions`,
      ).toEqual([entry.types]);
    }
  });

  it("names Tailwind a peer, because the preset is useless without it", () => {
    // The utilities are named after the tokens. Installing the kit without
    // Tailwind gives a consumer components whose classes mean nothing, and
    // the failure looks like a broken component rather than a missing peer.
    expect(pkg.peerDependencies.tailwindcss).toBeTruthy();
    expect(pkg.peerDependencies.react).toBeTruthy();
    expect(pkg.peerDependencies["react-dom"]).toBeTruthy();
  });

  it("the marketing entry offers every block the doc web documents", async () => {
    const marketing = (await import("@/ingot/marketing")) as Record<string, unknown>;
    const blocks = Object.keys(marketing).filter((name) =>
      name.startsWith("IngotMarketing"),
    );
    expect(blocks.length).toBe(8);
    for (const block of blocks) {
      expect(typeof marketing[block]).toBe("function");
    }
  });

  it("the doc web imports the kit the way a consumer would", () => {
    // It used to keep its own copies of the theme and accent plumbing under
    // src/lib, and a hand-kept copy of the anti-flash script under public/.
    // A doc web that documents a package it does not itself consume
    // documents something nobody has installed.
    expect(existsSync(join(ROOT, "src", "lib"))).toBe(false);
    expect(existsSync(join(ROOT, "public", "theme-init.js"))).toBe(false);
  });
});
