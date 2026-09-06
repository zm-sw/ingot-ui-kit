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

import { renderAllRoutes } from "../dist-ssr/prerender.js";

const SITE = "https://ingot.forgmatic.com";
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

function head(route) {
  const url = `${SITE}${route.path}`;
  const title = `${escape(route.title)} — Ingot UI Kit`;
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${escape(route.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    // Both languages name each other AND themselves: a crawler that finds
    // only one of the two still learns the pair exists.
    `<link rel="alternate" hreflang="${route.lang}" href="${url}" />`,
    ...route.alternates.map(
      (alt) =>
        `<link rel="alternate" hreflang="${alt.lang}" href="${SITE}${alt.path}" />`,
    ),
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${escape(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${route.lang === "cs" ? "cs_CZ" : "en_GB"}" />`,
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

const routes = renderAllRoutes();

for (const route of routes) {
  const file = join(DIST, route.path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pageHtml(route));
}

// The site root is the first guide, in the language the reader's browser
// asks for. It cannot be prerendered per language — there is one file —
// so it keeps the shell's own head and gets the Czech content, which is
// what an unprefixed address means everywhere else on the site.
const root = routes.find((route) => route.path === "/pruvodce/uvod");
if (root) writeFileSync(join(DIST, "index.html"), pageHtml({ ...root, path: "/" }));

// Written by hand rather than with a library: it is nine lines of XML, and
// a dependency for nine lines is a dependency to keep up to date forever.
const urls = routes
  .map((route) =>
    [
      "  <url>",
      `    <loc>${SITE}${route.path}</loc>`,
      ...route.alternates.map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${SITE}${alt.path}"/>`,
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

console.log(`prerender: ${routes.length} page(s) + sitemap.xml`);
