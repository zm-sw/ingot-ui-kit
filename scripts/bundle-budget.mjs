/**
 * A ceiling on what the doc web ships, checked after every build.
 *
 * A bundle does not get big in one commit; it gets big in forty commits
 * that each added six kilobytes and were each obviously fine. A number in
 * CI is the only thing that notices, because nobody reads a build log for
 * a figure that grew by half a percent.
 *
 * **The budgets are the current size plus a little room, not a wish.** A
 * budget nobody can meet gets raised on the first red build and then means
 * nothing; a budget just above where the code actually is fails on the
 * commit that made it worse, which is the only moment the information is
 * worth anything. Lowering them is a separate change, made when the code
 * has actually shrunk.
 *
 * Uncompressed, deliberately. Compression flatters a bundle by roughly
 * three and hides exactly the kind of growth this is watching for —
 * repeated markup compresses to almost nothing and still costs the reader
 * parse time on a slow phone.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist", "assets");

/**
 * The chunk the page actually loads first, named in index.html.
 *
 * It used to grow with every doc page, because the registry imported all
 * of them whole. Now it carries only what every page needs — the menu, the
 * search index, the badges — and the prose of a page arrives when that
 * page is opened: 865 kB became 337.5.
 *
 * What is left in it is React, the primitives the site's own chrome is
 * built from, and the metadata of 64 pages and 16 guides. Of that
 * metadata, the biggest single piece is "when to use it", which stays here
 * on purpose: the search reads it, and being able to find a component by
 * the situation it is for is half of what the search is good at. Buying
 * those last kilobytes back means a generated search index with its own
 * freshness guard — machinery that costs more than it saves.
 *
 * The number went the other way once while this change was in flight: the
 * guide that hands the system over to a design tool needed 15 kB more,
 * because one guide loading on demand while the other fourteen did not
 * would have been an inconsistency rather than a fix. Now they all do.
 */
const ENTRY_KB = 360;
/**
 * Every JavaScript chunk together, including the ones loaded on demand.
 *
 * This one went UP when the pages were split, by about 25 kB: eighty small
 * chunks carry eighty preambles that one big chunk carried once. That is
 * the trade being made — nobody downloads all of them, and the reader who
 * opens one page now downloads a third of what they did.
 *
 * Raised again by 20 for the page-layouts guide, which is four whole
 * screens' worth of live demo. It lands in its own chunk and only a reader
 * who opens that guide pays for it — which is exactly the shape this
 * budget was raised to allow.
 */
const TOTAL_JS_KB = 1180;
const CSS_KB = 90;

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

const files = readdirSync(DIST);
const js = files.filter((file) => file.endsWith(".js"));
const css = files.filter((file) => file.endsWith(".css"));

// The entry is the module index.html EXECUTES, not merely one it mentions:
// the page also preloads the chunks that entry depends on, and matching
// any mention picked whichever of those sorted first. Finding it by name
// instead would break the day a chunk is renamed, and break silently.
const html = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
const entryName = html.match(
  /<script[^>]+type="module"[^>]+src="\/assets\/([^"]+\.js)"/,
)?.[1];
if (!entryName || !js.includes(entryName)) {
  console.error("[bundle-budget] FAIL: index.html loads no module chunk from assets/");
  process.exit(1);
}

const size = (file) => statSync(join(DIST, file)).size;
const entry = size(entryName);
const totalJs = js.reduce((sum, file) => sum + size(file), 0);
const totalCss = css.reduce((sum, file) => sum + size(file), 0);

const checks = [
  ["entry chunk", entry, ENTRY_KB],
  ["all JavaScript", totalJs, TOTAL_JS_KB],
  ["stylesheet", totalCss, CSS_KB],
];

const over = checks.filter(([, bytes, budget]) => kb(bytes) > budget);
for (const [what, bytes, budget] of checks) {
  const mark = kb(bytes) > budget ? "OVER" : "ok";
  console.log(`[bundle-budget] ${mark}: ${what} ${kb(bytes)} kB (budget ${budget} kB)`);
}

if (over.length > 0) {
  console.error(
    "\n[bundle-budget] FAIL: the build grew past its budget.\n" +
      "  Either the growth is worth it — raise the number here and say why in\n" +
      "  the commit — or it is not, and something needs to load on demand\n" +
      "  instead of on the first page.",
  );
  process.exit(1);
}
