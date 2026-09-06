/**
 * Finding a page by anything the reader might remember about it.
 *
 * The index has grown past sixty pages and the menu is the only way in.
 * That works while a reader knows the component's name; it fails at every
 * other question they actually arrive with — "which one draws the pill",
 * "what uses `--accent-bg`", "the thing with the eyebrow above it". So the
 * index carries the name, the display name, the tag the page shows, the
 * tokens it declares, its summary, and the text of when to use it.
 *
 * Built from the registry, with no dependency. A search library for a list
 * that is known at build time and fits in a few kilobytes would be a
 * dependency to keep up to date forever, in exchange for ranking a reader
 * cannot tell from this one.
 *
 * The matching is deliberately dumb: fold the diacritics, split the query
 * into words, and require every word to appear somewhere in the entry.
 * "tabulka radky" finds the table; so does "table rows". What it must
 * never do is return nothing for a query that is obviously right, and the
 * commonest cause of that is a clever ranking nobody can predict.
 */
import type { DocLang } from "@/ingot-docs/lang";
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import { ALL_PAGES, pathOf, type DocsPage } from "@/ingot-docs/routes";

export interface SearchHit {
  page: DocsPage;
  /** What the result row shows. */
  title: string;
  subtitle: string;
  /** Where clicking it goes. */
  path: string;
}

export interface SearchResults {
  hits: SearchHit[];
  /**
   * How many matched before the limit cut the list.
   *
   * The dialog says so out loud. Silently showing twelve of fifteen is the
   * worst of both: the reader believes they have seen everything, and the
   * three pages they were looking for are the ones missing.
   */
  total: number;
}

/**
 * How many results the dialog shows at once.
 *
 * Enough that the common queries are not cut at all — `--accent-bg` is
 * declared by fifteen pages — and few enough that arrowing to the bottom
 * is still shorter than typing another word.
 */
export const SEARCH_LIMIT = 20;

/** Text out of a React node, so a page's prose can be searched too. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  const props = (node as { props?: { children?: unknown } }).props;
  return props ? textOf(props.children) : "";
}

/** Lower-case and without diacritics, so "tabulka" matches "Tabulka". */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

interface Entry {
  page: DocsPage;
  title: string;
  subtitle: string;
  haystack: string;
  /** Folded title and code name — the first ranking tier after an exact hit. */
  named: string;
  /** Folded tag and tokens — the second tier: what a designer searches by. */
  facets: string;
}

function entriesFor(lang: DocLang): Entry[] {
  const guides = INGOT_GUIDE_PAGES.map((guide): Entry => {
    const page: DocsPage = { kind: "guide", guide };
    return {
      page,
      title: guide.title[lang],
      subtitle: guide.summary[lang],
      haystack: fold(
        [
          guide.title[lang],
          guide.summary[lang],
          guide.slug,
          ...guide.sections.map((section) => section.title[lang]),
        ].join(" "),
      ),
      named: fold(`${guide.title[lang]} ${guide.slug}`),
      // A guide has neither a tag nor tokens, so its middle tier is empty
      // and it falls through to the rest — which is right: a guide that
      // matched on its prose has not matched on a name.
      facets: "",
    };
  });

  const components = INGOT_DOC_PAGES.map((doc): Entry => {
    const page: DocsPage = { kind: "component", doc };
    return {
      page,
      title: displayName(doc.name),
      subtitle: doc.summary[lang],
      haystack: fold(
        [
          doc.name,
          displayName(doc.name),
          doc.tag,
          doc.tokens.join(" "),
          doc.summary[lang],
          textOf(doc.useWhen[lang]),
        ].join(" "),
      ),
      named: fold(`${doc.name} ${displayName(doc.name)}`),
      facets: fold(`${doc.tag} ${doc.tokens.join(" ")}`),
    };
  });

  return [...guides, ...components];
}

/** The name a page is known by in code — an export name or a guide slug. */
function nameOf(page: DocsPage): string {
  return page.kind === "guide" ? page.guide.slug : page.doc.name;
}

const CACHE = new Map<DocLang, Entry[]>();

function entries(lang: DocLang): Entry[] {
  const cached = CACHE.get(lang);
  if (cached) return cached;
  const built = entriesFor(lang);
  CACHE.set(lang, built);
  return built;
}

/**
 * Where an entry matched — four tiers, applied in order, no score.
 *
 * A scoring function that weighs a title hit against two body hits is
 * unpredictable by construction: nobody, including whoever wrote it, can
 * say why one page came above another, and every future change to the
 * weights silently reorders every result. Four named tiers can be read
 * off the code and checked against the screen.
 *
 * The tiers exist because the matching itself is deliberately generous —
 * every page that mentions the table in "when to use it" matches "table"
 * just as truly as the Table page does. The order is what makes that
 * generosity usable.
 */
function tier(entry: Entry, needle: string, words: string[]): number {
  if (fold(entry.title) === needle || fold(nameOf(entry.page)) === needle) return 0;
  if (words.every((word) => entry.named.includes(word))) return 1;
  if (words.every((word) => entry.facets.includes(word))) return 2;
  return 3;
}

/**
 * Pages matching every word of the query, best tier first.
 *
 * An empty query returns the whole index rather than nothing: the dialog
 * opens on a list the reader can arrow through, which is a menu, instead
 * of an empty box that looks broken until they type. `total` is what
 * matched before `limit` cut the list, so the dialog can admit it cut.
 */
export function search(
  query: string,
  lang: DocLang,
  limit = SEARCH_LIMIT,
): SearchResults {
  const needle = fold(query).trim();
  const words = needle.split(/\s+/).filter(Boolean);
  const all = entries(lang);
  const found =
    words.length === 0
      ? all
      : all.filter((entry) => words.every((word) => entry.haystack.includes(word)));

  // Sorting is stable, so within a tier the registry order survives — the
  // same query gives the same list on every render and in every browser.
  const ranked =
    words.length === 0
      ? found
      : [...found].sort((a, b) => tier(a, needle, words) - tier(b, needle, words));

  return {
    total: found.length,
    hits: ranked.slice(0, limit).map((entry) => ({
      page: entry.page,
      title: entry.title,
      subtitle: entry.subtitle,
      path: pathOf(entry.page, lang),
    })),
  };
}

/** Everything the index knows, for a test that would otherwise measure an empty one. */
export const SEARCHABLE_PAGES = ALL_PAGES.length;
