/**
 * Every page has exactly one address, and every address one page.
 *
 * The doc web used to route by fragment, which to anything that does not
 * run JavaScript is one page: a crawler asking for any URL got one empty
 * shell with one static title. Sixty-six pages existed and none of them
 * could be found, linked to with a preview, or shared into a chat that
 * renders one.
 *
 * Addresses are cheap to break and expensive to notice: a slug collision
 * makes one page unreachable while the menu still lists it and the sitemap
 * still promises it, and everything keeps looking correct. So the mapping
 * is measured in both directions.
 *
 * The prerendered content is measured too, because "there is an HTML file"
 * and "the file says what the page is about" are different claims, and
 * only the second one is worth anything to the reader who finds it.
 */
import { describe, expect, it } from "vitest";

import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import { renderRoute } from "@/ingot-docs/prerender";
import {
  ALL_PAGES,
  ALL_ROUTES,
  COMPONENT_SEGMENT,
  GUIDE_SEGMENT,
  componentSlug,
  locationFromPath,
  pathFromLegacyHash,
  pathOf,
} from "@/ingot-docs/routes";

describe("addresses", () => {
  it("gives every page a different one, in both languages", () => {
    const paths = ALL_ROUTES.map((route) => pathOf(route.page, route.lang));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("turns a component name into something a person can read", () => {
    expect(componentSlug("IngotTable")).toBe("table");
    expect(componentSlug("IngotOpIcon")).toBe("op-icon");
    expect(componentSlug("IngotMarketingCta")).toBe("marketing-cta");
    // Never had the prefix, so nothing is cut off it.
    expect(componentSlug("Button")).toBe("button");
  });

  it("reads every address back to the page it was built from", () => {
    for (const { page, lang } of ALL_ROUTES) {
      const back = locationFromPath(pathOf(page, lang));
      expect(back).not.toBeNull();
      expect(back?.lang).toBe(lang);
      expect(back?.page.kind).toBe(page.kind);
      const name =
        page.kind === "guide" ? page.guide.slug : componentSlug(page.doc.name);
      const gotName =
        back?.page.kind === "guide"
          ? back.page.guide.slug
          : componentSlug(back!.page.doc.name);
      expect(gotName).toBe(name);
    }
  });

  it("keeps the segments out of the translation, so a shared link survives", () => {
    const page = ALL_PAGES[0];
    expect(pathOf(page, "cs")).toBe(`/${GUIDE_SEGMENT}/${INGOT_GUIDE_PAGES[0].slug}`);
    expect(pathOf(page, "en")).toBe(
      `/en/${GUIDE_SEGMENT}/${INGOT_GUIDE_PAGES[0].slug}`,
    );
  });

  it("lands a stale slug on the site rather than nowhere", () => {
    const here = locationFromPath(`/${COMPONENT_SEGMENT}/neexistuje`);
    expect(here?.page.kind).toBe("guide");
  });

  it("says nothing about an address that is not ours", () => {
    expect(locationFromPath("/api/languages")).toBeNull();
  });

  it("translates the links shared before the addresses existed", () => {
    expect(pathFromLegacyHash("#/IngotTable", "cs")).toBe(
      `/${COMPONENT_SEGMENT}/table`,
    );
    expect(pathFromLegacyHash("#/uvod", "en")).toBe(
      `/en/${GUIDE_SEGMENT}/${INGOT_GUIDE_PAGES[0].slug}`,
    );
    // An anchor inside a page is not a route and must not be taken for one.
    expect(pathFromLegacyHash("#ukazka", "cs")).toBeNull();
  });
});

describe("what a crawler is given", () => {
  it.each(
    ALL_ROUTES.slice(0, 8).map((route) => [pathOf(route.page, route.lang), route]),
  )("%s carries its own title and a description", (_path, route) => {
    const rendered = renderRoute(route);
    expect(rendered.title.length).toBeGreaterThan(0);
    expect(rendered.description.length).toBeGreaterThan(20);
    // The heading is drawn by the kit's page header, like everywhere else
    // on this site, so it is an <h1> with the kit's classes on it.
    expect(rendered.html).toMatch(new RegExp(`<h1[^>]*>${rendered.title}</h1>`));
  });

  it("renders a component page's own content, not a shell", () => {
    const doc = INGOT_DOC_PAGES.find((entry) => entry.name === "IngotTable")!;
    const rendered = renderRoute({ page: { kind: "component", doc }, lang: "cs" });
    expect(rendered.html).toMatch(/<h1[^>]*>Table<\/h1>/);
    // When to use it, when not to, and the props: the three things a reader
    // arriving from a search result actually came for.
    expect(rendered.html.match(/<h2[^>]*>/g)?.length).toBe(3);
    // A prop is named with its type, so a search result can answer "does
    // this take a className" without the reader opening the page.
    expect(rendered.html).toContain("columns");
  });

  it("renders a guide's prose", () => {
    const guide = INGOT_GUIDE_PAGES.find((entry) => entry.slug === "preklady")!;
    const rendered = renderRoute({ page: { kind: "guide", guide }, lang: "en" });
    expect(rendered.html.length).toBeGreaterThan(500);
    for (const section of guide.sections) {
      expect(rendered.html).toContain(section.title.en);
    }
  });

  it("points each language at the other one", () => {
    const rendered = renderRoute(ALL_ROUTES[0]);
    expect(rendered.alternates).toHaveLength(1);
    expect(rendered.alternates[0].lang).not.toBe(rendered.lang);
  });
});
