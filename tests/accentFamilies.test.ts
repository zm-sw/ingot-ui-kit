/**
 * Accent families in ``tokens.css``.
 *
 * **A family dot holds no colour of its own — it takes it from the family
 * table.** Every dot in the switch carries ``data-accent`` and is drawn
 * with ``var(--accent)``, so it reads the colour it promises from the same
 * blocks that apply the family to the whole page.
 *
 * But "the default family has no block of its own" holds only for
 * ``<html>``: there the missing attribute falls through to the quartet in
 * ``:root``. An element INSIDE the page falls through nowhere — it inherits
 * what ``<html>`` holds. The blue dot therefore turned orange after a
 * switch to orange and there were two orange dots in the switch.
 *
 * The test reads the real stylesheet, not a class name: what is measured is
 * what really ships to the browser.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { ACCENT_CHOICES, DEFAULT_ACCENT } from "@/lib/accent";

const CSS = readFileSync(join(process.cwd(), "src/ingot/tokens.css"), "utf-8");

/** Family blocks for the given surface — light (``:not(.dark)``) and dark. */
function descendantBlocks(choice: string): readonly string[] {
  return [
    `:root:not(.dark) [data-accent="${choice}"]`,
    `:root.dark [data-accent="${choice}"]`,
  ];
}

describe("accent families", () => {
  it.each(ACCENT_CHOICES.map((choice) => [choice] as const))(
    "family %s has a block for an element inside the page too, not only for <html>",
    (choice) => {
      // Without the descendant selector the dot would inherit the family
      // from <html> — the one currently selected, not the one it names.
      for (const selector of descendantBlocks(choice)) {
        expect(CSS).toContain(selector);
      }
    },
  );

  it("the default family has a block too — otherwise the dot takes the colour of the selected one", () => {
    // Regression: this block was once missing on purpose ("the default
    // falls through to :root"), which does not hold inside the page.
    for (const selector of descendantBlocks(DEFAULT_ACCENT)) {
      expect(CSS).toContain(selector);
    }
  });

  it("the default family does not copy its values, it only references them", () => {
    // Two definitions of the same blue would drift sooner or later, so the
    // family block may contain only references to ``--blue-*``.
    const block = CSS.split(`:root:not(.dark) [data-accent="blue"]`)[1]?.split("}")[0];
    expect(block).toBeTruthy();
    expect(block).toContain("var(--blue-accent)");
    // No hex inside the block — the value has one place, and that is :root.
    expect(block).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});
