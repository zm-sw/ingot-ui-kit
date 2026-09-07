/**
 * One live demo, with nothing around it — the address a design tool can
 * put in a panel.
 *
 * A picture of a component in a design file cannot be hovered, cannot be
 * reached with a tab key and has one theme. `Button` is the clearest
 * example the kit has: in the dark theme its `danger`, `accent` and `ok`
 * variants invert their label, because the dark palette lightens those
 * tokens so they read as text and white on them falls under WCAG AA. That
 * exception is a sentence on the doc page and does not exist in any static
 * frame — so whoever redraws the component redraws it without.
 *
 * This renders the same demo module the doc page renders, from the same
 * registry, under the theme, accent and language the address asks for.
 * There is therefore nothing to keep in step: what the site shows is what
 * the panel shows.
 *
 * `/embed/button?theme=dark&accent=emerald&lang=en`
 *
 * **Not a page of the site.** It is not in the route list, so it reaches
 * neither the menu, nor the sitemap, nor a prerendered file — a crawler
 * asking for it would find a component with no explanation, competing with
 * the page that has one.
 */
import { Suspense, lazy, useEffect, type ComponentType, type JSX } from "react";

import { IngotCode, IngotProvider, IngotSkeleton } from "@/ingot";
import {
  applyAccent,
  applyTheme,
  isAccentChoice,
  isThemeChoice,
  type AccentChoice,
  type ThemeChoice,
} from "@/ingot/theme";
import { CHROME } from "@/ingot-docs/chrome";
import { isDocLang, type DocLang } from "@/ingot-docs/lang";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import { componentSlug } from "@/ingot-docs/routes";

/** The part of the path after `/embed/`. */
export const EMBED_SEGMENT = "embed";

export function isEmbedPath(pathname: string): boolean {
  return pathname.split("/").filter(Boolean)[0] === EMBED_SEGMENT;
}

export interface EmbedRequest {
  slug: string;
  theme: ThemeChoice;
  accent: AccentChoice;
  lang: DocLang;
}

/**
 * What the address asks for.
 *
 * Every field falls back rather than failing: a panel that shows the
 * default is useful, a panel that shows an error because someone typed
 * `theme=darkk` is not.
 */
export function readEmbedRequest(pathname: string, search: string): EmbedRequest {
  const params = new URLSearchParams(search);
  const theme = params.get("theme");
  const accent = params.get("accent");
  const lang = params.get("lang");
  return {
    slug: pathname.split("/").filter(Boolean)[1] ?? "",
    theme: isThemeChoice(theme) ? theme : "light",
    accent: isAccentChoice(accent) ? accent : "blue",
    lang: isDocLang(lang) ? lang : "cs",
  };
}

const DEMOS = new Map<string, ComponentType<{ lang: DocLang }>>(
  INGOT_DOC_PAGES.map((page) => [componentSlug(page.name), lazy(page.demo)] as const),
);

export function EmbedApp(): JSX.Element {
  const request = readEmbedRequest(window.location.pathname, window.location.search);

  // The theme and the accent are attributes on <html>, which is outside
  // this tree — the same two functions the shell's switch calls, so the
  // panel and the site cannot end up applying them differently.
  useEffect(() => {
    applyTheme(request.theme);
    applyAccent(request.accent);
  }, [request.theme, request.accent]);

  return (
    <div className="min-h-screen bg-bg p-5 text-ink-2">
      {DEMOS.has(request.slug) ? (
        <IngotProvider lang={request.lang}>
          <Suspense
            fallback={
              <IngotSkeleton
                shape="card"
                rows={1}
                label={CHROME.demoLoading[request.lang]}
                className="w-80 max-w-full"
              />
            }
          >
            {/* Looked up inside a function, the way the shell does it: a
                component read out of a map into a local is what the hook
                lint calls a component defined during render. */}
            {(() => {
              const Demo = DEMOS.get(request.slug);
              return Demo ? <Demo lang={request.lang} /> : null;
            })()}
          </Suspense>
        </IngotProvider>
      ) : (
        // An empty panel is a fault the reader has to guess at. The slug
        // goes beside the sentence because it is what they mistyped, and
        // it is code rather than text, so it is not translated.
        <p className="text-body">
          {CHROME.embedUnknown[request.lang]} <IngotCode>{request.slug}</IngotCode>
        </p>
      )}
    </div>
  );
}
