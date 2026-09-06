/**
 * What the page says about itself outside its own body (KAN-951).
 *
 * The prerendered file was right and the application said nothing, so the
 * first load of any address was correct and every click after it was
 * wrong: the tab, the history entry, the bookmark and the screen reader's
 * page announcement all kept the name of the page the reader had come
 * FROM. `canonical` pointed there too — which is the version a search
 * engine is told to index.
 *
 * Nobody sees that in a screenshot and no visual test catches it, so it is
 * measured here. Twice: the FIELDS, which the prerender formats into tags,
 * and the WRITE into a live document, which is the half that did not exist.
 */
import { beforeEach, describe, expect, it } from "vitest";

import { SITE_NAME, SITE_ORIGIN, applyHead, headFor } from "@/ingot-docs/head";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import { ALL_PAGES, pathOf, type DocsPage } from "@/ingot-docs/routes";

const table: DocsPage = {
  kind: "component",
  doc: INGOT_DOC_PAGES.find((entry) => entry.name === "IngotTable")!,
};
const intro: DocsPage = { kind: "guide", guide: INGOT_GUIDE_PAGES[0] };

describe("what a page says about itself", () => {
  it("names the component the way the page and the menu do", () => {
    // Not `IngotTable` — the prefix belongs to the export name and the code
    // listings, not to a tab title a person reads.
    expect(headFor(table, "cs").heading).toBe("Table");
    expect(headFor(table, "cs").title).toBe(`Table — ${SITE_NAME}`);
  });

  it("takes the description from the page's own summary, per language", () => {
    const cs = headFor(table, "cs").description;
    const en = headFor(table, "en").description;
    expect(cs).toBe(table.doc.summary.cs);
    expect(en).toBe(table.doc.summary.en);
    expect(cs).not.toBe(en);
  });

  it("makes the canonical absolute and equal to the address", () => {
    expect(headFor(intro, "en").canonical).toBe(`${SITE_ORIGIN}${pathOf(intro, "en")}`);
  });

  it("lists both languages, itself included", () => {
    const head = headFor(table, "cs");
    expect(head.alternates.map((alt) => alt.lang)).toEqual(["cs", "en"]);
    for (const alt of head.alternates) {
      expect(alt.href).toBe(`${SITE_ORIGIN}${pathOf(table, alt.lang)}`);
    }
  });

  it("gives every page a heading and a description worth indexing", () => {
    for (const page of ALL_PAGES) {
      for (const lang of ["cs", "en"] as const) {
        const head = headFor(page, lang);
        expect(head.heading.length, `${head.path} has no heading`).toBeGreaterThan(0);
        expect(
          head.description.length,
          `${head.path} has no usable description`,
        ).toBeGreaterThan(20);
      }
    }
  });
});

describe("writing it into a live document", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("sets the title, the language and the canonical", () => {
    applyHead(headFor(table, "en"));

    expect(document.title).toBe(`Table — ${SITE_NAME}`);
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${SITE_ORIGIN}${pathOf(table, "en")}`,
    );
  });

  it("replaces what the previous page left behind rather than adding to it", () => {
    // The bug was a head that kept growing, or worse, kept the first page's
    // answer forever. Both look identical in the DOM inspector until you
    // count the tags.
    applyHead(headFor(intro, "cs"));
    applyHead(headFor(table, "cs"));

    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(2);
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toBe(table.doc.summary.cs);
  });

  it("keeps the prerendered tags and edits them, instead of leaving two answers", () => {
    // A prerendered file arrives with these tags already in it. Appending a
    // second set would leave the stale one first, and first is the one a
    // crawler reads.
    document.head.innerHTML =
      '<link rel="canonical" href="https://example.test/stale" />';
    applyHead(headFor(intro, "cs"));

    const links = document.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe(`${SITE_ORIGIN}${pathOf(intro, "cs")}`);
  });

  it("moves the Open Graph tags with the page, not just the title", () => {
    applyHead(headFor(table, "en"));

    const content = (property: string) =>
      document.querySelector(`meta[property="${property}"]`)?.getAttribute("content");
    expect(content("og:title")).toBe(`Table — ${SITE_NAME}`);
    expect(content("og:description")).toBe(table.doc.summary.en);
    expect(content("og:url")).toBe(`${SITE_ORIGIN}${pathOf(table, "en")}`);
    expect(content("og:locale")).toBe("en_GB");
  });
});
