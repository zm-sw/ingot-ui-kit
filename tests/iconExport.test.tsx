import { describe, expect, it } from "vitest";

import { INGOT_ICON_NAMES } from "@/ingot";
import { INGOT_OP_ICON_KEYS } from "@/ingot/forgmatic";
import { iconFiles, iconSprite } from "@/ingot-docs/iconExport";

/**
 * The files a designer downloads. What has to hold is that they are the
 * SAME icons the product draws — one file per key, drawn by the component
 * itself — because the moment they are not, the design and the product
 * have two sets and nothing says which is right.
 */
const files = iconFiles();

describe("the icon export", () => {
  it("writes one file per key of both sets, and nothing else", () => {
    expect(files.filter((file) => file.set === "ui").map((file) => file.name)).toEqual([
      ...INGOT_ICON_NAMES,
    ]);
    expect(files.filter((file) => file.set === "op").map((file) => file.name)).toEqual([
      ...INGOT_OP_ICON_KEYS,
    ]);
  });

  it("gives every file a namespace and a size in units", () => {
    for (const file of files) {
      expect(file.svg, file.path).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(file.svg, file.path).toContain('viewBox="0 0 24 24"');
      // The operations set draws at 100% inside a wrapper that carries the
      // pixels. A file has no wrapper, and "100% of nothing" opens at
      // whatever the reader feels like.
      expect(file.svg, file.path).toContain('width="24"');
      expect(file.svg, file.path).not.toContain("100%");
    }
  });

  it("leaves out what belongs to a component in a page", () => {
    for (const file of files) {
      expect(file.svg, file.path).not.toContain("class=");
      expect(file.svg, file.path).not.toContain("aria-hidden");
    }
  });

  it("takes its colour from the caller, never its own palette", () => {
    for (const file of files) {
      expect(file.svg, file.path).toContain('stroke="currentColor"');
      expect(file.svg, file.path).not.toMatch(/stroke="#|fill="#/);
    }
  });

  it("keeps the stroke width each glyph was drawn at", () => {
    const width = (name: string) =>
      /stroke-width="([\d.]+)"/.exec(
        files.find((file) => file.path === `ui/${name}`)?.svg ?? "",
      )?.[1];
    // The check mark is heavier on purpose; most of the set is 1.6. A
    // sprite or an export that flattened them would redraw the set at one
    // weight and nobody would see it until small sizes.
    expect(width("check")).toBe("2.2");
    expect(width("upload")).toBe("1.6");
  });

  it("carries those widths into the sprite too", () => {
    const sprite = iconSprite(files);
    expect(sprite).toContain('<symbol id="ingot-ui-check"');
    expect(sprite).toContain('<symbol id="ingot-op-laser"');
    expect(/<symbol id="ingot-ui-check"[^>]*stroke-width="2\.2"/.test(sprite)).toBe(
      true,
    );
    // A symbol sizes itself from the place it is used, so the fixed width
    // and height of a file would fight that.
    expect(sprite).not.toContain('width="24"');
    expect(sprite.match(/<symbol /g)).toHaveLength(files.length);
  });
});
