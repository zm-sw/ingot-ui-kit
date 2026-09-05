/**
 * Every address the doc web has, in one place.
 *
 * It used to route by hash (``#/IngotTable``). To a browser that is one
 * page: the fragment never reaches the server, so a crawler asking for the
 * site got a single empty shell with one static title, whatever it asked
 * for. Fifty-five component pages and eleven guides existed and none of
 * them could be found, linked to with a preview, or shared into a chat
 * that renders one.
 *
 * So the address is a path now, and the build writes a real HTML file for
 * each one. This module is what both halves read: the client to decide
 * what to show, the build to know what to write. A second list would be
 * the sitemap promising pages the app cannot open.
 *
 * **The segments are not translated.** ``/komponenty/table`` is the
 * address in both languages, with ``/en`` in front for English. A slug
 * that changed with the language would break every shared link the moment
 * the reader's language differed from the sender's — the same reason the
 * guide slugs have never been translated.
 */
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import type { DocLang } from "@/ingot-docs/lang";
import { displayName } from "@/ingot-docs/naming";
import type { IngotDocPage, IngotGuidePage } from "@/ingot-docs/types";

/**
 * What is currently shown. The doc web has two kinds of pages and tells
 * them apart by type, not by a flag: a guide has no ``props`` and no demo,
 * and a component has no free sections, so one shared shape would always
 * be half empty.
 */
export type DocsPage =
  { kind: "guide"; guide: IngotGuidePage } | { kind: "component"; doc: IngotDocPage };

export const GUIDE_SEGMENT = "pruvodce";
export const COMPONENT_SEGMENT = "komponenty";

/** The language a path with no prefix is in. */
export const DEFAULT_ROUTE_LANG: DocLang = "cs";

export const DEFAULT_PAGE: DocsPage = { kind: "guide", guide: INGOT_GUIDE_PAGES[0] };

/**
 * ``IngotMarketingCta`` → ``marketing-cta``.
 *
 * From the display name, not the export name: the address is read by
 * people, and ``ingotmarketingcta`` is a word nobody can scan. The prefix
 * is already the thing the page drops everywhere else it is shown.
 *
 * Uniqueness is not assumed — a test checks it across the whole registry,
 * because two primitives collapsing onto one slug would make one of them
 * unreachable and the sitemap would still promise both.
 */
export function componentSlug(name: string): string {
  return displayName(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function pageSlug(page: DocsPage): string {
  return page.kind === "guide" ? page.guide.slug : componentSlug(page.doc.name);
}

/** The path a page lives at — the only place where one is built. */
export function pathOf(page: DocsPage, lang: DocLang): string {
  const prefix = lang === DEFAULT_ROUTE_LANG ? "" : `/${lang}`;
  const segment = page.kind === "guide" ? GUIDE_SEGMENT : COMPONENT_SEGMENT;
  return `${prefix}/${segment}/${pageSlug(page)}`;
}

export interface DocsLocation {
  page: DocsPage;
  lang: DocLang;
}

/**
 * A path back into a page and a language.
 *
 * ``null`` means "not one of ours", which is not the same as "not found":
 * an unknown slug under a known segment still resolves, to the default
 * page, because a stale link should land on the site rather than nowhere.
 *
 * Guides are looked up first. A guide slug and a component slug live in
 * different segments, so they cannot collide any more — the order is kept
 * only because the two lists are searched in the order the menu shows
 * them.
 */
export function locationFromPath(pathname: string): DocsLocation | null {
  const parts = pathname.split("/").filter(Boolean);
  const lang: DocLang = parts[0] === "en" ? "en" : DEFAULT_ROUTE_LANG;
  const rest = parts[0] === "en" ? parts.slice(1) : parts;

  if (rest.length === 0) return { page: DEFAULT_PAGE, lang };
  const [segment, slug] = rest;

  if (segment === GUIDE_SEGMENT) {
    const guide = INGOT_GUIDE_PAGES.find((entry) => entry.slug === slug);
    return { page: guide ? { kind: "guide", guide } : DEFAULT_PAGE, lang };
  }
  if (segment === COMPONENT_SEGMENT) {
    const doc = INGOT_DOC_PAGES.find((entry) => componentSlug(entry.name) === slug);
    return { page: doc ? { kind: "component", doc } : DEFAULT_PAGE, lang };
  }
  return null;
}

/**
 * The path an old hash link meant.
 *
 * Every link shared before this change is a hash, and they are the only
 * links to this site that exist. Dropping them would turn the whole point
 * of having addresses — that they can be shared — into a lesson learned at
 * the reader's expense.
 */
export function pathFromLegacyHash(hash: string, lang: DocLang): string | null {
  if (!hash.startsWith("#/")) return null;
  const wanted = hash.slice(2);
  const guide = INGOT_GUIDE_PAGES.find((entry) => entry.slug === wanted);
  if (guide) return pathOf({ kind: "guide", guide }, lang);
  const doc = INGOT_DOC_PAGES.find((entry) => entry.name === wanted);
  if (doc) return pathOf({ kind: "component", doc }, lang);
  return null;
}

export const ALL_PAGES: readonly DocsPage[] = [
  ...INGOT_GUIDE_PAGES.map((guide): DocsPage => ({ kind: "guide", guide })),
  ...INGOT_DOC_PAGES.map((doc): DocsPage => ({ kind: "component", doc })),
];

/** Every address the build writes a file for, both languages. */
export const ALL_ROUTES: readonly DocsLocation[] = ["cs", "en"].flatMap(
  (lang): DocsLocation[] => ALL_PAGES.map((page) => ({ page, lang: lang as DocLang })),
);
