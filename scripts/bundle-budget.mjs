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

/** The chunk the page actually loads first, named in index.html. */
const ENTRY_KB = 800;
/** Every JavaScript chunk together, including the ones loaded on demand. */
const TOTAL_JS_KB = 1000;
/** One stylesheet, loaded before the first paint. */
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
