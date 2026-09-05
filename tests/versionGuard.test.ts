/**
 * Which page owes a version bump (KAN-843).
 *
 * The guard itself talks to git, so what is measured here is the decision
 * it makes: given the changed kit files and the pages whose version moved,
 * which pages still owe a bump. The two holes this closes are exactly the
 * ones a red PR would otherwise have to teach us:
 *
 * 1. **A bump on any page used to pay for any change.** Moving IngotBadge's
 *    version must not pay for a change to IngotTable.
 * 2. **Only `.tsx` used to count**, so a shared module or a token value
 *    shipped unversioned. A shared module owes every primitive that imports
 *    it, directly or through another module; `tokens.css` owes every page
 *    that DECLARES the token whose value moved — the page's own promise.
 */
import { describe, expect, it } from "vitest";

import {
  changedTokens,
  importers,
  localImports,
  pagesOwed,
  type PagesOwedInput,
} from "../scripts/versionGuardCore.mjs";

const SOURCES = {
  cx: "export function cx() {}",
  inputChrome: 'import { cx } from "./cx";',
  overlayChrome: 'import { cx } from "./cx";',
  IngotSelect: 'import { inputChrome } from "./inputChrome";',
  IngotFieldInput: 'import { inputChrome } from "./inputChrome";',
  IngotModal: 'import { overlayChrome } from "./overlayChrome";',
  IngotTable: 'import { cx } from "./cx";',
  IngotBadge: "export function IngotBadge() {}",
};

const PAGES = {
  IngotSelect: ["--surface", "--border-strong"],
  IngotFieldInput: ["--surface"],
  IngotModal: ["--surface", "--shadow-lg"],
  IngotTable: ["--border"],
  IngotBadge: ["--ok", "--ok-bg"],
};

type Scenario = Partial<PagesOwedInput> & Pick<PagesOwedInput, "changedFiles">;

function owed(input: Scenario) {
  return pagesOwed({
    sources: SOURCES,
    pages: PAGES,
    bumpedPages: [],
    addedPages: [],
    ...input,
  });
}

describe("reading the kit's imports", () => {
  it("finds the local modules a file imports", () => {
    expect(localImports('import { cx } from "./cx";\nimport "./tokens.css";').sort())
      .toEqual(["cx", "tokens"]);
  });

  it("does not mistake a package import for a local one", () => {
    expect(localImports('import { useState } from "react";')).toEqual([]);
  });

  it("reaches importers through another module", () => {
    const reach = importers(SOURCES);
    expect([...reach.get("inputChrome")!].sort()).toEqual([
      "IngotFieldInput",
      "IngotSelect",
    ]);
    // cx reaches the primitives through inputChrome and overlayChrome too.
    expect([...reach.get("cx")!].sort()).toEqual([
      "IngotFieldInput",
      "IngotModal",
      "IngotSelect",
      "IngotTable",
      "inputChrome",
      "overlayChrome",
    ]);
  });
});

describe("a primitive owes a bump on its own page", () => {
  it("names the page when nothing moved", () => {
    expect(owed({ changedFiles: ["src/ingot/IngotTable.tsx"] })).toEqual([
      { file: "src/ingot/IngotTable.tsx", reason: "its own page", pages: ["IngotTable"] },
    ]);
  });

  it("is paid by its own bump", () => {
    expect(
      owed({
        changedFiles: ["src/ingot/IngotTable.tsx"],
        bumpedPages: ["IngotTable"],
      }),
    ).toEqual([]);
  });

  it("is NOT paid by a bump on another page", () => {
    const result = owed({
      changedFiles: ["src/ingot/IngotTable.tsx"],
      bumpedPages: ["IngotBadge"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].pages).toEqual(["IngotTable"]);
  });

  it("a page added with a new primitive counts as paid", () => {
    expect(
      owed({
        changedFiles: ["src/ingot/IngotTable.tsx"],
        addedPages: ["IngotTable"],
      }),
    ).toEqual([]);
  });
});

describe("a shared module owes every primitive that imports it", () => {
  it("lists the importers, not the module", () => {
    const result = owed({ changedFiles: ["src/ingot/inputChrome.ts"] });
    expect(result[0].pages).toEqual(["IngotFieldInput", "IngotSelect"]);
  });

  it("is satisfied only once every importer moved", () => {
    expect(
      owed({
        changedFiles: ["src/ingot/inputChrome.ts"],
        bumpedPages: ["IngotSelect"],
      })[0].pages,
    ).toEqual(["IngotFieldInput"]);
    expect(
      owed({
        changedFiles: ["src/ingot/inputChrome.ts"],
        bumpedPages: ["IngotSelect", "IngotFieldInput"],
      }),
    ).toEqual([]);
  });
});

describe("tokens.css owes the pages that declare the changed token", () => {
  const before = ":root { --surface: #fff; --ok: #0a0; }";

  it("sees a value move", () => {
    expect(changedTokens(before, ":root { --surface: #eee; --ok: #0a0; }")).toEqual([
      "--surface",
    ]);
  });

  it("sees a token disappear", () => {
    expect(changedTokens(before, ":root { --surface: #fff; }")).toEqual(["--ok"]);
  });

  it("counts a token declared in several blocks as one contract", () => {
    const dark = ":root { --surface: #fff; } :root.dark { --surface: #111; }";
    expect(changedTokens(dark, dark)).toEqual([]);
    expect(
      changedTokens(dark, ":root { --surface: #fff; } :root.dark { --surface: #000; }"),
    ).toEqual(["--surface"]);
  });

  it("asks only the pages that stand on that token", () => {
    const result = owed({
      changedFiles: ["src/ingot/tokens.css"],
      tokensBefore: before,
      tokensAfter: ":root { --surface: #eee; --ok: #0a0; }",
    });
    expect(result[0].pages.sort()).toEqual([
      "IngotFieldInput",
      "IngotModal",
      "IngotSelect",
    ]);
  });

  it("asks nobody when only a comment or an unused token moved", () => {
    expect(
      owed({
        changedFiles: ["src/ingot/tokens.css"],
        tokensBefore: before,
        tokensAfter: ":root { --surface: #fff; --ok: #0a0; --unused: 1px; }",
      }),
    ).toEqual([]);
  });
});
