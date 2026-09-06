/**
 * What a page says about itself outside its own body — title, description,
 * canonical, the other language.
 *
 * There are two places that have to say it and they used to be
 * independent: the build wrote the `<head>` of each prerendered file, and
 * the application wrote nothing at all. So the first load of any address
 * was right and every click after it was wrong — the tab, the history
 * entry, the bookmark and the screen reader's page announcement all kept
 * the name of the page the reader had come FROM. `canonical` and the
 * description kept pointing at it too.
 *
 * Nothing is duplicated now: the prerender formats these fields into tags,
 * the client writes the same fields into the live document, and both call
 * this. A `<head>` that disagrees with the `<h1>` under it is the kind of
 * wrong that no test catches by looking at one page.
 */
import type { DocLang } from "@/ingot-docs/lang";
import { displayName } from "@/ingot-docs/naming";
import { pathOf, type DocsPage } from "@/ingot-docs/routes";

/** Appended to every page title, so a tab says what site it belongs to. */
export const SITE_NAME = "Ingot UI Kit";

/** The origin canonical and Open Graph URLs are absolute against. */
export const SITE_ORIGIN = "https://ingot.forgmatic.com";

export interface PageHead {
  /** The `<h1>`, without the site name. */
  heading: string;
  /** The `<title>`: heading plus the site name. */
  title: string;
  description: string;
  path: string;
  canonical: string;
  lang: DocLang;
  /** Open Graph wants a locale, not a language code. */
  ogLocale: string;
  /** Every language this page exists in, itself included — see below. */
  alternates: { lang: DocLang; path: string; href: string }[];
}

const OG_LOCALE: Record<DocLang, string> = { cs: "cs_CZ", en: "en_GB" };

function headingOf(page: DocsPage, lang: DocLang): string {
  // A component page shows the name without the prefix, exactly as the menu
  // and the page header do; the address and the code listings keep the full
  // export name.
  return page.kind === "guide" ? page.guide.title[lang] : displayName(page.doc.name);
}

function descriptionOf(page: DocsPage, lang: DocLang): string {
  return page.kind === "guide" ? page.guide.summary[lang] : page.doc.summary[lang];
}

export function headFor(page: DocsPage, lang: DocLang): PageHead {
  const heading = headingOf(page, lang);
  const path = pathOf(page, lang);

  return {
    heading,
    title: `${heading} — ${SITE_NAME}`,
    description: descriptionOf(page, lang),
    path,
    canonical: `${SITE_ORIGIN}${path}`,
    lang,
    ogLocale: OG_LOCALE[lang],
    // Both languages, this one included: a crawler that finds only one of
    // the pair still learns the other exists, and the client can then
    // rewrite the whole set without knowing which it replaced.
    alternates: (["cs", "en"] as const).map((other) => ({
      lang: other,
      path: pathOf(page, other),
      href: `${SITE_ORIGIN}${pathOf(page, other)}`,
    })),
  };
}

/**
 * Writes a page's head into the live document.
 *
 * Browser-only — the prerender formats the same fields into static tags
 * instead. Tags are looked up by the attribute that identifies them and
 * created only when missing, so this leaves the prerendered head in place
 * on the first page and edits it from then on rather than accumulating
 * duplicates.
 */
export function applyHead(head: PageHead): void {
  document.title = head.title;
  document.documentElement.lang = head.lang;

  const meta = (selector: string, attrs: Record<string, string>) => {
    let el = document.head.querySelector<HTMLElement>(selector);
    if (!el) {
      el = document.createElement(selector.startsWith("link") ? "link" : "meta");
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      document.head.append(el);
      return el;
    }
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    return el;
  };

  meta('meta[name="description"]', { name: "description", content: head.description });
  meta('link[rel="canonical"]', { rel: "canonical", href: head.canonical });
  meta('meta[property="og:title"]', { property: "og:title", content: head.title });
  meta('meta[property="og:description"]', {
    property: "og:description",
    content: head.description,
  });
  meta('meta[property="og:url"]', { property: "og:url", content: head.canonical });
  meta('meta[property="og:locale"]', { property: "og:locale", content: head.ogLocale });

  for (const alternate of head.alternates) {
    meta(`link[rel="alternate"][hreflang="${alternate.lang}"]`, {
      rel: "alternate",
      hreflang: alternate.lang,
      href: alternate.href,
    });
  }
}
