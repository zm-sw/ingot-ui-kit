import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// @ts-expect-error - a build script, deliberately untyped JavaScript.
import { buildFigma, FIGMA_GROUPS, readTokens } from "../scripts/build-tokens.mjs";
import { INGOT_TYPE_SCALE } from "@/ingot/tokens.generated";

const ROOT = join(__dirname, "..");
const tokens = readTokens(join(ROOT, "src/ingot/tokens.json"));
const figma = JSON.parse(buildFigma(tokens, { kit: "0.0.0", generated: "2026-01-01" }));

/**
 * The type scale moved out of the Tailwind preset and into the token
 * source. Nothing rendered may change because of that, so the eight steps
 * are written out here: a test that repeats the values is exactly right
 * when the point is that they did not move.
 */
describe("the type scale", () => {
  it("keeps the eight steps of the handoff, value for value", () => {
    expect(INGOT_TYPE_SCALE).toEqual({
      display: {
        fontSize: "clamp(40px, 5.4vw, 64px)",
        lineHeight: "1.02",
        letterSpacing: "-0.03em",
        fontWeight: "600",
      },
      h1: {
        fontSize: "40px",
        lineHeight: "1.06",
        letterSpacing: "-0.025em",
        fontWeight: "600",
      },
      h2: {
        fontSize: "26px",
        lineHeight: "1.18",
        letterSpacing: "-0.02em",
        fontWeight: "600",
      },
      h3: {
        fontSize: "18px",
        lineHeight: "1.3",
        letterSpacing: "-0.01em",
        fontWeight: "600",
      },
      lede: { fontSize: "17px", lineHeight: "1.55", letterSpacing: "-0.005em" },
      body: { fontSize: "14.5px", lineHeight: "1.6" },
      small: { fontSize: "13px", lineHeight: "1.55" },
      eyebrow: {
        fontSize: "11px",
        lineHeight: "1.4",
        letterSpacing: "0.08em",
        fontWeight: "500",
      },
    });
  });

  it("leaves out what a step does not decide", () => {
    // `body` has no weight of its own. Were it carried as `undefined`,
    // Tailwind would emit `font-weight: undefined` and the class would be
    // broken in a way nothing else notices.
    expect(INGOT_TYPE_SCALE.body).not.toHaveProperty("fontWeight");
    expect(INGOT_TYPE_SCALE.body).not.toHaveProperty("letterSpacing");
  });
});

describe("the Figma export", () => {
  it("carries no CSS variable where a value belongs", () => {
    expect(JSON.stringify(figma)).not.toContain("var(");
  });

  it("covers every group of the token source", () => {
    const groups = Object.keys(tokens).filter(
      (name: string) => name !== "$description",
    );
    expect([...FIGMA_GROUPS].sort()).toEqual(groups.sort());
  });

  it("gives the accent one collection with ten modes", () => {
    const accent = figma.collections.accent;
    expect(accent.modes).toHaveLength(10);
    expect(accent.modes).toContain("blue/light");
    expect(accent.modes).toContain("slate/dark");
    // Every role has a value in every mode; a hole here is a family that
    // looks switchable and is not.
    for (const variable of Object.values(accent.variables) as {
      values: Record<string, string>;
    }[]) {
      for (const mode of accent.modes) {
        expect(variable.values[mode]).toMatch(/^#[0-9a-f]{3,8}$/i);
      }
    }
  });

  it("resolves the default family to the blue it points at", () => {
    expect(
      figma.collections.accent.variables["color/accent"].values["blue/light"],
    ).toBe(tokens.light["blue-accent"].$value);
  });

  it("keeps the accent roles out of the theme collection", () => {
    // They belong to the family axis. A frozen copy under the theme would
    // promise to follow the accent picker and would not.
    for (const role of ["accent", "accent-ink", "accent-bg", "accent-border"]) {
      expect(figma.collections.theme.variables).not.toHaveProperty(`color/${role}`);
    }
  });

  it("reads a px measurement as a number and a curve as text", () => {
    expect(figma.collections.scale.variables["space/4"]).toEqual({
      type: "FLOAT",
      values: { value: 16 },
    });
    expect(figma.collections.motion.variables["motion/ease"].type).toBe("STRING");
  });

  it("names the kit version it was written from", () => {
    expect(figma.kit).toBe("0.0.0");
    expect(figma.generated).toBe("2026-01-01");
  });
});

describe("the published token source", () => {
  it("is the DTCG file itself, so a reader needs no converter", () => {
    const source = JSON.parse(
      readFileSync(join(ROOT, "src/ingot/tokens.json"), "utf-8"),
    );
    expect(source.type.h1.$type).toBe("typography");
    expect(source.light.bg.$type).toBe("color");
  });
});
