import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { INGOT_TYPE_SCALE } from "@/ingot/tokens.generated";

const ROOT = join(__dirname, "..");

/**
 * The type scale moved out of the Tailwind preset and into the token
 * source, so a consumer with neither React nor Tailwind can read it and so
 * it is versioned like every other token. Nothing rendered may change
 * because of that move, which is why this test writes the eight steps out:
 * repeating the values is exactly right when the point is that they did
 * not move.
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

describe("the published token source", () => {
  it("is the DTCG file itself, so a reader needs no converter", () => {
    const source = JSON.parse(
      readFileSync(join(ROOT, "src/ingot/tokens.json"), "utf-8"),
    );
    expect(source.type.h1.$type).toBe("typography");
    expect(source.light.bg.$type).toBe("color");
  });
});
