/**
 * Writes one HTML file per address, plus the sitemap.
 *
 * Runs after ``vite build``. It takes the built ``index.html`` as the
 * template — so the script and stylesheet names, which carry a content
 * hash, are never spelled here — and for every route puts that route's
 * head tags in and its rendered content inside ``#root``.
 *
 * The application still boots on top of the markup and replaces it. That
 * is deliberate: matching the app's DOM exactly would mean rendering the
 * live demos in node, where they have no window, to save a repaint no
 * reader notices. What the file has to carry is the CONTENT — a heading, a
 * summary, the prose — because that is all a crawler, a link preview and a
 * reader with JavaScript off ever see.
 *
 * The route list comes from the same module the application routes with,
 * so the sitemap cannot promise a page the site does not have.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { buildComponentManifest, renderAllRoutes } from "../dist-ssr/prerender.js";

const DIST = "dist";

const template = readFileSync(join(DIST, "index.html"), "utf-8");

/** Text that is about to sit inside an HTML attribute or element. */
function escape(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// The fields themselves come from `headFor` in the application, which the
// running site calls too — otherwise the first load of an address would be
// right and every click after it wrong. This function only formats them.
function head(route) {
  const { title, description, canonical, ogLocale, alternates } = route.head;
  const escaped = escape(title);
  return [
    `<title>${escaped}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    // Both languages name each other AND themselves: a crawler that finds
    // only one of the two still learns the pair exists.
    ...alternates.map(
      (alt) => `<link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`,
    ),
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escaped}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:locale" content="${ogLocale}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join("\n    ");
}

function pageHtml(route) {
  return (
    template
      // The shell ships `lang="cs"` because at that point no page is known.
      // Here one is, and its language is part of the address.
      .replace('<html lang="cs">', `<html lang="${route.lang}">`)
      .replace("<title>Ingot UI Kit</title>", head(route))
      .replace('<div id="root"></div>', `<div id="root">${route.html}</div>`)
  );
}

const routes = await renderAllRoutes();

for (const route of routes) {
  const file = join(DIST, route.path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pageHtml(route));
}

// The site root is the first guide, in the language the reader's browser
// asks for. It cannot be prerendered per language — there is one file —
// so it gets the Czech one, which is what an unprefixed address means
// everywhere else on the site. Its canonical therefore names
// `/pruvodce/uvod` rather than `/`, which is exactly right: the two
// addresses are the same page and only one of them should be indexed.
const root = routes.find((route) => route.path === "/pruvodce/uvod");
if (root) writeFileSync(join(DIST, "index.html"), pageHtml(root));

// Written by hand rather than with a library: it is nine lines of XML, and
// a dependency for nine lines is a dependency to keep up to date forever.
const urls = routes
  .map((route) =>
    [
      "  <url>",
      `    <loc>${route.head.canonical}</loc>`,
      ...route.head.alternates.map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>`,
      ),
      "  </url>",
    ].join("\n"),
  )
  .join("\n");

writeFileSync(
  join(DIST, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n"),
);

// The registry as data, next to the site. A design library, a linter for a
// design file and a Code Connect definition all need the same facts the
// doc pages render — and typing them out beside the registry is how they
// stop agreeing with it. Written from the SAME module the pages render
// from, so it cannot describe a kit the site does not have.
const { version } = JSON.parse(readFileSync("package.json", "utf-8"));
const manifest = await buildComponentManifest({
  kit: version,
  generated: new Date().toISOString().slice(0, 10),
});
writeFileSync(join(DIST, "components.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `prerender: ${routes.length} page(s) + sitemap.xml + components.json (${manifest.count})`,
);
