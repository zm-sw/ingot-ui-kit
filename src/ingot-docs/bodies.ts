/**
 * The half of a page that is loaded when the page is opened, and the
 * memory of which ones already are.
 *
 * A page arrives in two pieces: the metadata the menu and the search read
 * on every page, and the body — props, accessibility, prose — that only
 * this page's reader needs. The body is a dynamic import, so it lands a
 * moment after the metadata.
 *
 * That moment is the whole reason this module exists rather than a `useState`
 * inside the application. Every address is prerendered: the file a reader
 * receives already shows the page in full. If the application booted and
 * rendered before the body arrived, it would replace that finished text
 * with a skeleton and put it back a heartbeat later — a flash on a page
 * that was already complete, and the worst kind, because it looks like the
 * site losing what it had. So the entry point loads THIS page's body first
 * and only then hands over to React, which finds it here and renders the
 * same thing the file already showed.
 *
 * The cache is module-level and never evicted: it holds source text of a
 * few kilobytes per page, and a reader who pages back and forth between
 * two components should not fetch either of them twice.
 */
import type { DocsPage } from "@/ingot-docs/routes";
import type { IngotDocBody, IngotGuideBody } from "@/ingot-docs/types";

export type PageBody = IngotDocBody | IngotGuideBody;

const BODIES = new Map<string, PageBody>();

/** What a page is called here — a component's name or a guide's slug. */
export function keyOf(page: DocsPage): string {
  return page.kind === "component" ? page.doc.name : `guide:${page.guide.slug}`;
}

/** The body if it is already here, `undefined` if it still has to be fetched. */
export function bodyOf(page: DocsPage): PageBody | undefined {
  return BODIES.get(keyOf(page));
}

export async function loadBody(page: DocsPage): Promise<PageBody> {
  const key = keyOf(page);
  const cached = BODIES.get(key);
  if (cached) return cached;
  const load = page.kind === "component" ? page.doc.body : page.guide.body;
  const module = await load();
  BODIES.set(key, module.default);
  return module.default;
}
