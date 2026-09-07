/**
 * Both icon sets as standalone SVG files.
 *
 * The glyphs live as JSX inside the kit's two icon modules, which means a
 * designer could look at them on the doc web and had no way to get hold of
 * them. Redrawing 92 glyphs by hand is a day of work and, from the moment
 * it is done, a second set: the product's icons and the design's icons,
 * drifting apart one glyph at a time.
 *
 * So the build renders them. The envelope — viewBox 24×24, `fill="none"`,
 * `stroke="currentColor"`, the stroke width with its named exceptions,
 * round caps and joins — is composed by the components themselves, exactly
 * as it is in the running product. Reimplementing that envelope here would
 * make the files a second opinion about what an Ingot icon looks like, and
 * the whole point is that there is only one.
 *
 * Runs at BUILD time (node, no browser), like the prerender beside it.
 */
import { renderToStaticMarkup } from "react-dom/server";

import { INGOT_ICON_NAMES, IngotIcon } from "@/ingot";
import { INGOT_OP_ICON_KEYS, IngotOpIcon } from "@/ingot/forgmatic";

export interface IconFile {
  /** `ui/upload` — the set and the glyph, without an extension. */
  path: string;
  /** The set the glyph belongs to. */
  set: "ui" | "op";
  /** The key the kit knows the glyph by. */
  name: string;
  svg: string;
}

/**
 * The size a file is written at.
 *
 * The components take a size in px and both sets draw on a 24 unit grid,
 * so 24 is the one size at which the file's units and its geometry agree.
 * A design tool scales it from there.
 */
const FILE_SIZE = 24;

/**
 * The rendered component as a file.
 *
 * Three things come off: the layout class, which belongs to a component in
 * a page and not to a file; `aria-hidden`, which says "a screen reader is
 * already reading my label" and is a lie about a file standing on its own;
 * and — for the operations set — the wrapper the component sizes and
 * colours itself with.
 *
 * Two go on. The namespace, without which the file is markup rather than
 * an image. And a size in units: the operations set draws at `100%`
 * because its wrapper is what carries the pixels, and a file that is
 * "100% of nothing" opens at whatever the reader feels like.
 */
function asFile(markup: string): string {
  const svg = /<svg[\s\S]*<\/svg>/.exec(markup)?.[0];
  if (!svg) throw new Error("icon export: rendered markup carries no <svg>");
  return svg
    .replace(/\sclass="[^"]*"/, "")
    .replace(/\saria-hidden="[^"]*"/, "")
    .replace(/\s(?:width|height)="[^"]*"/g, "")
    .replace(
      "<svg",
      `<svg xmlns="http://www.w3.org/2000/svg" width="${FILE_SIZE}" height="${FILE_SIZE}"`,
    );
}

/** Every glyph of both sets, ready to be written out. */
export function iconFiles(): IconFile[] {
  const ui = INGOT_ICON_NAMES.map((name): IconFile => ({
    path: `ui/${name}`,
    set: "ui",
    name,
    svg: asFile(renderToStaticMarkup(<IngotIcon name={name} size={FILE_SIZE} />)),
  }));
  const op = INGOT_OP_ICON_KEYS.map((name): IconFile => ({
    path: `op/${name}`,
    set: "op",
    name,
    svg: asFile(renderToStaticMarkup(<IngotOpIcon token={name} size={FILE_SIZE} />)),
  }));
  return [...ui, ...op];
}

/**
 * One sprite holding both sets.
 *
 * For a consumer that would rather reference `#ingot-ui-upload` than ship
 * 92 requests. The ids carry the set, because `kit` is a glyph in one and
 * a word in the other.
 */
export function iconSprite(files: readonly IconFile[]): string {
  const symbols = files.map((file) =>
    file.svg
      // Every attribute but these three carries geometry — the stroke
      // width above all, which is 1.6 for most of the set and 1.8 or 2.2
      // for the glyphs that would otherwise fill in at small sizes.
      // Rewriting the opening tag from scratch is how a sprite ends up
      // drawing the set at one weight.
      .replace(/^<svg /, `<symbol id="ingot-${file.set}-${file.name}" `)
      .replace(/\s(?:xmlns|width|height)="[^"]*"/g, "")
      .replace(/<\/svg>$/, "</symbol>"),
  );
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">',
    ...symbols,
    "</svg>",
    "",
  ].join("\n");
}
