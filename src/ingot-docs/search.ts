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
 * Pages matching every word of the query.
 *
 * An empty query returns the whole index rather than nothing: the dialog
 * opens on a list the reader can arrow through, which is a menu, instead
 * of an empty box that looks broken until they type.
 */
export function search(query: string, lang: DocLang, limit = 12): SearchHit[] {
  const needle = fold(query).trim();
  const words = needle.split(/\s+/).filter(Boolean);
  const all = entries(lang);
  const found =
    words.length === 0
      ? all
      : all.filter((entry) => words.every((word) => entry.haystack.includes(word)));

  /**
   * One ranking rule, not a scoring function: a page whose own name is
   * what was typed comes first.
   *
   * Without it, typing a component's exact name can put another page
   * above it — every page that mentions the table in "when to use it"
   * matches "table" just as truly. One predictable rule fixes the case
   * readers actually hit; a score nobody can predict fixes nothing and
   * makes every future result a mystery.
   */
  const exact = (entry: Entry) =>
    fold(entry.title) === needle || fold(nameOf(entry.page)) === needle ? 0 : 1;
  const ranked =
    words.length === 0 ? found : [...found].sort((a, b) => exact(a) - exact(b));

  return ranked.slice(0, limit).map((entry) => ({
    page: entry.page,
    title: entry.title,
    subtitle: entry.subtitle,
    path: pathOf(entry.page, lang),
  }));
}

/** Everything the index knows, for a test that would otherwise measure an empty one. */
export const SEARCHABLE_PAGES = ALL_PAGES.length;
