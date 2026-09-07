import { describe, expect, it } from "vitest";

import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import { isEmbedPath, readEmbedRequest } from "@/ingot-docs/EmbedApp";
import { ALL_ROUTES, componentSlug, pathOf } from "@/ingot-docs/routes";

/**
 * The embed address. What has to hold is that it reaches every primitive,
 * that a wrong parameter falls back rather than failing, and that it stays
 * OUT of the site: it is a component with no explanation, and a crawler
 * that found it would rank it against the page that has one.
 */
describe("the embed address", () => {
  it("is told apart from a page of the site", () => {
    expect(isEmbedPath("/embed/button")).toBe(true);
    expect(isEmbedPath("/embed/")).toBe(true);
    expect(isEmbedPath("/komponenty/button")).toBe(false);
    expect(isEmbedPath("/pruvodce/uvod")).toBe(false);
    expect(isEmbedPath("/")).toBe(false);
    // Not a prefix match: a guide whose slug started with "embed" is a
    // page, not a panel.
    expect(isEmbedPath("/embedded/thing")).toBe(false);
  });

  it("reads the component, the theme, the accent and the language", () => {
    expect(
      readEmbedRequest("/embed/button", "?theme=dark&accent=emerald&lang=en"),
    ).toEqual({ slug: "button", theme: "dark", accent: "emerald", lang: "en" });
  });

  it("falls back on anything it does not recognise", () => {
    // A panel showing the default is useful; one showing an error because
    // somebody typed `darkk` is not.
    expect(
      readEmbedRequest("/embed/button", "?theme=darkk&accent=puce&lang=xx"),
    ).toEqual({ slug: "button", theme: "light", accent: "blue", lang: "cs" });
    expect(readEmbedRequest("/embed/button", "")).toEqual({
      slug: "button",
      theme: "light",
      accent: "blue",
      lang: "cs",
    });
  });

  it("names every primitive by the slug its page already has", () => {
    // The panel and the page take the same word, so a link to one can be
    // turned into a link to the other by hand.
    for (const doc of INGOT_DOC_PAGES) {
      const slug = componentSlug(doc.name);
      expect(readEmbedRequest(`/embed/${slug}`, "").slug).toBe(slug);
    }
  });

  it("is not among the addresses the site writes a file for", () => {
    // The route list drives the menu, the sitemap and the prerender all
    // three. An embed address turning up in it would put a component with
    // no explanation into the index, against the page that has one.
    const paths = ALL_ROUTES.map((route) => pathOf(route.page, route.lang));
    expect(paths.filter(isEmbedPath)).toEqual([]);
    expect(paths.length).toBeGreaterThan(0);
  });
});
