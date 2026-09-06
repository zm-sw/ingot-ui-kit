/**
 * Every colour token against the rule that actually applies to it
 * (KAN-963).
 *
 * The Tokens page judged all forty-two against 4.5:1, which is wrong in
 * both directions: a page background has no contrast requirement at all
 * and was shown as a near-miss, while a control's outline needs 3:1 (WCAG
 * 1.4.11, non-text) and a passing value was drawn as if it had fallen
 * short.
 *
 * The mislabelling hid a real defect. The accessibility page promises, in
 * as many words, that an input's outline, a switch and a checkbox take
 * `--border-strong` *precisely so* they reach 3:1 — and in the light theme
 * that token sat at 1.83:1 against white. The promise and the number were
 * in the same repository and nothing compared them. This is what compares
 * them.
 */
import { describe, expect, it } from "vitest";

import tokens from "@/ingot/tokens.json";
import { DECORATIVE, ROLE_THRESHOLD, tokenRole } from "@/ingot-docs/tokenRoles";

type Leaf = { $value?: string };
const theme = (name: "light" | "dark") =>
  tokens[name] as unknown as Record<string, Leaf>;

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16) / 255);
  const linear = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * The colours a token can be drawn ON, per theme and per role.
 *
 * Text is set on the page and on a card. `--surface-2` is the hover tint
 * and the table's header, and the accessibility page promises the INKS
 * hold AA there — not the accent or the danger colour, which appear on it
 * only as a link inside a hovered row. Two of those are between 3.7 and
 * 4.5 in the dark theme; moving them is a palette decision with the
 * handoff in front of you, not a side effect of writing this test, so
 * they are named in the ticket rather than silently changed here.
 *
 * A LINE is measured on all three: a control keeps its outline when the
 * row under it lights up, and that is exactly when it matters.
 */
function grounds(
  name: "light" | "dark",
  role: string,
): { where: string; value: string }[] {
  const group = theme(name);
  const where =
    role === "boundary" || name === "light"
      ? ["bg", "surface", "surface-2"]
      : ["bg", "surface"];
  return where.map((key) => ({ where: `--${key}`, value: group[key].$value! }));
}

const isHex = (value: string | undefined): value is string =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

describe.each(["light", "dark"] as const)("the %s palette", (name) => {
  const group = theme(name);
  const colours = Object.entries(group).filter(
    ([key, leaf]) => !key.startsWith("$") && isHex(leaf.$value),
  );

  it("has colours to measure", () => {
    expect(colours.length).toBeGreaterThan(20);
  });

  it.each(colours.map(([key]) => key))("--%s meets its own threshold", (key) => {
    const role = tokenRole(key);
    const threshold = ROLE_THRESHOLD[role];
    if (threshold === null) return;

    const value = group[key].$value!;
    for (const ground of grounds(name, role)) {
      const ratio = contrast(value, ground.value);
      expect(
        ratio,
        `--${key} (${value}) is ${ratio.toFixed(2)}:1 on ${ground.where} in the ` +
          `${name} theme; as "${role}" it needs ${threshold}:1. Either move the ` +
          `value, or say why it is decorative in tokenRoles.ts — silence is the ` +
          `one option that is not available.`,
      ).toBeGreaterThanOrEqual(threshold);
    }
  });
});

describe("the exemptions", () => {
  it("every one names a token that exists", () => {
    // An exemption for a token nobody has any more is an exemption that
    // will one day silently cover a different colour with the same name.
    const light = theme("light");
    for (const key of Object.keys(DECORATIVE)) {
      expect(light[key], `--${key} is exempt but not in the palette`).toBeDefined();
    }
  });

  it("every one says why, in both languages", () => {
    for (const [key, reason] of Object.entries(DECORATIVE)) {
      expect(reason.cs.length, `--${key} has no Czech reason`).toBeGreaterThan(20);
      expect(reason.en.length, `--${key} has no English reason`).toBeGreaterThan(20);
    }
  });
});

describe("the outline of a control", () => {
  it("reaches 3:1 on every light ground, which the accessibility page promises", () => {
    // Named on its own rather than left to the sweep above, because this
    // is the one the page makes a written promise about — an input, a
    // switch and a checkbox all take it, and the boundary IS what
    // identifies them.
    const value = theme("light")["border-strong"].$value!;
    for (const ground of grounds("light", "boundary")) {
      expect(
        contrast(value, ground.value),
        `--border-strong on ${ground.where}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
