/**
 * The core knows nothing about Forgmatic (KAN-853).
 *
 * The kit carried this platform's vocabulary in its core: icon keys the
 * backend stores, the shape of an operation configuration schema, a rule
 * about how deep a quick-create may go. A third-party product installed a
 * translation for an API it never calls and forty-three glyphs it will
 * never draw.
 *
 * The split is easy to undo by accident — the next person needing the
 * operation icons finds them re-exported from the core and never learns
 * there was a line. So the line is measured rather than remembered: the
 * platform's own words may appear in the core only inside the deprecated
 * pass-through block, which exists so nobody's build breaks the day this
 * lands and goes away in the next major.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import * as core from "@/ingot";
import * as forgmatic from "@/ingot/forgmatic";

const KIT_DIR = join(process.cwd(), "src", "ingot");

/** Words that only mean something inside this platform. */
const DOMAIN_WORDS = ["x_options", "title_en", "icon_key", "QUICK_CREATE"];

function coreFiles(): string[] {
  return readdirSync(KIT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => entry.name);
}

/**
 * `index.ts` up to the point where the deprecated pass-through begins.
 *
 * The banner is the marker on purpose: it is the same line a reader sees,
 * so a re-export smuggled in above it fails here rather than being
 * excused by a clever regex.
 */
function coreBarrelBeforeCompat(): string {
  const src = readFileSync(join(KIT_DIR, "index.ts"), "utf-8");
  const at = src.indexOf("// --- Forgmatic's own layer");
  expect(at, "the barrel lost its deprecation banner").toBeGreaterThan(-1);
  return src.slice(0, at);
}

describe("the core carries no domain vocabulary", () => {
  it.each(coreFiles().filter((file) => file !== "index.ts"))(
    "%s says nothing only this platform would say",
    (file) => {
      const src = readFileSync(join(KIT_DIR, file), "utf-8");
      for (const word of DOMAIN_WORDS) {
        expect(src, `${file} names ${word}`).not.toContain(word);
      }
    },
  );

  it("the barrel names them only in the deprecated pass-through", () => {
    const before = coreBarrelBeforeCompat();
    for (const word of DOMAIN_WORDS) {
      expect(before, `the barrel names ${word} above the deprecation`).not.toContain(
        word,
      );
    }
  });

  it("every pass-through export is marked deprecated and points at the layer", () => {
    const src = readFileSync(join(KIT_DIR, "index.ts"), "utf-8");
    const compat = src.slice(src.indexOf("// --- Forgmatic's own layer"));
    const reexports = [...compat.matchAll(/from "\.\/forgmatic\/[^"]+";/g)];
    expect(reexports.length).toBeGreaterThan(0);
    expect([...compat.matchAll(/@deprecated/g)].length).toBe(reexports.length);
  });
});

describe("the two entries", () => {
  it("the layer offers what moved out of the core", () => {
    for (const name of [
      "IngotOpIcon",
      "INGOT_OP_ICON_KEYS",
      "resolveProcessIcon",
      "parseProcessIconKey",
      "PROCESS_ICON_CATEGORIES",
      "fieldsFromConfigSchema",
      "fieldsFromIntegrationManifest",
      "MAX_QUICK_CREATE_DEPTH",
      "useCanQuickCreate",
    ]) {
      expect(forgmatic, `the layer lost ${name}`).toHaveProperty(name);
    }
  });

  it("the core still hands the same things through, so nothing breaks today", () => {
    // Same binding, not a copy: two copies of the icon library would drift,
    // and the drift would be a shape nobody notices.
    expect(core.IngotOpIcon).toBe(forgmatic.IngotOpIcon);
    expect(core.resolveProcessIcon).toBe(forgmatic.resolveProcessIcon);
    expect(core.fieldsFromConfigSchema).toBe(forgmatic.fieldsFromConfigSchema);
    expect(core.MAX_QUICK_CREATE_DEPTH).toBe(forgmatic.MAX_QUICK_CREATE_DEPTH);
  });

  it("the field spec itself stays in the core, only its adapters left", () => {
    // A description of a form field would make sense in any product; a
    // translation from this platform's JSON schema would not. That is the
    // whole rule, and this is the one case where it is easiest to get wrong.
    expect(core).toHaveProperty("isNumericKind");
    expect(forgmatic).not.toHaveProperty("isNumericKind");
  });

  it("the depth stays in the core, the rule about it does not", () => {
    expect(core).toHaveProperty("useModalDepth");
    expect(core).toHaveProperty("ModalDepthProvider");
    expect(forgmatic).not.toHaveProperty("useModalDepth");
  });
});
