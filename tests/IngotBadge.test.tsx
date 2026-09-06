/**
 * `IngotBadge` (KAN-652).
 *
 * **Contrast is MEASURED here, not asserted.** A test for
 * `toHaveClass("text-ok")` would pass over a tone that is invisible on
 * its background — a class name says nothing about contrast. Hence the
 * classes the component really emitted are taken from the rendered badge,
 * translated to tokens, and the ratio is computed over the values from
 * the generated stylesheet, in BOTH themes: a token has two values and
 * measuring one
 * means measuring half.
 *
 * The rest is what can go wrong quietly on a badge:
 *
 * 1. **Every tone emits a different background and text.** If two tones
 *    fell onto the same pair, the badge would draw two different messages
 *    alike.
 * 2. **The tone cannot be overridden from outside.** `Pill` takes
 *    `className`, and its `bg-…` loses to the tone — the caller thinks
 *    they overrode the colour and it stays. Here that prop does not exist,
 *    which has to hold after a refactor too.
 * 3. **`dot` is decoration.** A screen reader must not read it.
 */

import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { IngotBadge, type IngotBadgeTone } from "@/ingot";

const TONES: readonly IngotBadgeTone[] = [
  "neutral",
  "ok",
  "warn",
  "danger",
  "accent",
  "ink",
];

const GLOBALS = readFileSync(
  path.resolve(__dirname, "../src/ingot/tokens.generated.css"),
  "utf-8",
);

/**
 * Token values from one `:root` block of the generated stylesheet.
 *
 * A token need not carry a hex directly. The default accent family holds
 * its values in `--blue-*` and `--accent-*` only references them, so the
 * `[data-accent="blue"]` block does not have to copy them — otherwise
 * there would be two definitions of the same blue. The alias is therefore
 * resolved; what is measured is still the real colour.
 */
function tokens(selector: string): Record<string, string> {
  const start = GLOBALS.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`the stylesheet has no ${selector} block`);
  const body = GLOBALS.slice(start, GLOBALS.indexOf("\n}", start));
  const found: Record<string, string> = {};
  const aliases: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(
    /(--[\w-]+):\s*(#[0-9a-fA-F]{3,8}|var\(\s*--[\w-]+\s*\))\s*;/g,
  )) {
    const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (alias) aliases[name] = alias[1];
    else found[name] = value;
  }
  for (const [name, target] of Object.entries(aliases)) {
    const resolved = found[target];
    if (resolved === undefined) {
      throw new Error(
        `${selector}: ${name} references ${target}, which the block does not have`,
      );
    }
    found[name] = resolved;
  }
  return found;
}

const THEMES = {
  light: tokens(":root"),
  dark: tokens(":root.dark"),
};

function relativeLuminance(hex: string): number {
  const full =
    hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const channels = [1, 3, 5].map((at) => {
    const srgb = parseInt(full.slice(at, at + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * `bg-ok-bg` → `--ok-bg`, `text-ink-2` → `--ink-2`.
 *
 * `text-` carries size too (`text-[11px]`). Bracketed values therefore go
 * out — without that the helper returned `--[11px]` and measured size
 * instead of colour.
 */
function tokenOf(className: string, prefix: string): string {
  const hits = className
    .split(" ")
    .filter((name) => name.startsWith(`${prefix}-`))
    .map((name) => name.slice(prefix.length + 1))
    .filter((rest) => /^[a-z]+(-[a-z0-9]+)*$/.test(rest));
  if (hits.length !== 1) {
    throw new Error(
      `the badge should emit exactly one '${prefix}-*' token class, it emitted ` +
        `${hits.length}: ${className}`,
    );
  }
  return `--${hits[0]}`;
}

/** The background/text pair the component really emitted for the given tone. */
function painted(tone: IngotBadgeTone): { bg: string; text: string } {
  const { unmount } = render(
    <IngotBadge tone={tone} testId="badge">
      Ve výrobě
    </IngotBadge>,
  );
  const className = screen.getByTestId("badge").className;
  unmount();
  return { bg: tokenOf(className, "bg"), text: tokenOf(className, "text") };
}

describe("IngotBadge", () => {
  it.each(TONES)("tone %s holds 4.5:1 in the light and the dark theme", (tone) => {
    const { bg, text } = painted(tone);

    for (const [theme, values] of Object.entries(THEMES)) {
      const background = values[bg];
      const foreground = values[text];
      expect(
        background,
        `${theme}: the stylesheet does not declare ${bg}`,
      ).toBeDefined();
      expect(foreground, `${theme}: globals.css nedeklaruje ${text}`).toBeDefined();
      expect(
        contrast(background, foreground),
        `tón ${tone} v motivu ${theme} (${text} na ${bg})`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("does not draw two tones alike", () => {
    const pairs = TONES.map((tone) => {
      const { bg, text } = painted(tone);
      return `${bg}/${text}`;
    });
    expect(new Set(pairs).size).toBe(TONES.length);
  });

  it("is neutral without a tone", () => {
    render(
      <>
        <IngotBadge testId="implicit">Koncept</IngotBadge>
        <IngotBadge tone="neutral" testId="explicit">
          Koncept
        </IngotBadge>
      </>,
    );
    expect(screen.getByTestId("implicit").className).toBe(
      screen.getByTestId("explicit").className,
    );
  });

  it("carries meaning by text, not by colour", () => {
    render(
      <IngotBadge tone="danger" testId="badge">
        Zamítnuto
      </IngotBadge>,
    );
    expect(screen.getByTestId("badge")).toHaveTextContent("Zamítnuto");
  });

  it("uppercase is done by CSS, not by a rewritten string", () => {
    render(<IngotBadge testId="badge">Ve výrobě</IngotBadge>);
    const badge = screen.getByTestId("badge");
    // If `toUpperCase()` did it, translation would lose it, and so would
    // every place the string is reused.
    expect(badge.textContent).toBe("Ve výrobě");
    expect(badge.className).toContain("uppercase");
  });

  it("a screen reader does not read the live-state dot and without dot it is absent", () => {
    const { unmount } = render(
      <IngotBadge dot testId="badge">
        Ve výrobě
      </IngotBadge>,
    );
    const dots = screen.getByTestId("badge").querySelectorAll("[aria-hidden]");
    expect(dots).toHaveLength(1);
    unmount();

    render(<IngotBadge testId="plain">Ve výrobě</IngotBadge>);
    expect(screen.getByTestId("plain").querySelectorAll("[aria-hidden]")).toHaveLength(
      0,
    );
  });

  it("takes no className, so the tone cannot be overridden from outside", () => {
    // If someone added it, this expression would start to type-check — and
    // that is the regression: on the current Pill `className="bg-…"` quietly
    // loses to the tone.
    render(
      // @ts-expect-error IngotBadge deliberately does not accept className.
      <IngotBadge className="bg-danger-bg" testId="badge">
        Ve výrobě
      </IngotBadge>,
    );
    expect(screen.getByTestId("badge").className).not.toContain("danger");
  });
});
