/**
 * What a crawler gets: one real HTML file per address.
 *
 * The doc web is a single-page application, and to anything that does not
 * run JavaScript that means one empty shell with one static title,
 * whatever URL it asked for. Fifty-five component pages and eleven guides
 * existed and none of them could be found, previewed in a link card, or
 * shared into a chat that renders one.
 *
 * This module runs at BUILD time (node, no browser) and renders each
 * route's content as static markup. The application still boots on top of
 * it and replaces it — this is not hydration and does not try to be.
 * Matching the app's DOM exactly would mean rendering the live demos in
 * node, where they have no window, for a benefit no reader has: a crawler
 * does not click a demo, and a person sees the real one a moment later.
 *
 * So what is rendered is the part that is CONTENT: the heading, the
 * summary, when to use the thing and when not to, the props, and a guide's
 * prose. All of it read from the same registry the application renders,
 * never a copy of it — a second telling of the content is exactly the
 * drift this repository deleted its hand-written spec documents over.
 */
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { IngotCode, IngotList, IngotPageHeader, IngotSection } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import { headFor, type PageHead } from "@/ingot-docs/head";
import type { DocLang } from "@/ingot-docs/lang";
import { componentManifest, type ComponentManifest } from "@/ingot-docs/manifest";
import { ALL_ROUTES, type DocsLocation, type DocsPage } from "@/ingot-docs/routes";

export interface PrerenderedRoute {
  /** ``/komponenty/table`` — where the file goes and what the sitemap lists. */
  path: string;
  lang: DocLang;
  /**
   * Everything the ``<head>`` says, from the same function the client uses
   * when it navigates. Two independent tellings were how the first load
   * came out right and every click after it wrong.
   */
  head: PageHead;
  html: string;
}

/**
 * Built from kit primitives, like every other page of this site.
 *
 * It would be tempting to emit bare tags here — the markup is replaced the
 * moment the application boots, so who is it for? For the reader whose
 * JavaScript did not arrive: a slow network, a corporate proxy, a
 * text-mode browser. With the primitives they get the page as it is meant
 * to look; with bare tags they would get unstyled text on a white ground.
 * The same rule the rest of the doc web follows, for the same reason.
 */
function Body({ page, lang }: { page: DocsPage; lang: DocLang }): JSX.Element {
  if (page.kind === "guide") {
    return (
      <>
        {page.guide.sections.map((section) => (
          <IngotSection key={section.id} id={section.id} title={section.title[lang]}>
            {section.body[lang]}
          </IngotSection>
        ))}
      </>
    );
  }

  const doc = page.doc;
  return (
    <>
      <IngotSection title={CHROME.useWhen[lang]}>
        <IngotList items={doc.useWhen[lang]} />
      </IngotSection>
      <IngotSection title={CHROME.avoidWhen[lang]}>
        <IngotList items={doc.avoidWhen[lang]} />
      </IngotSection>
      <IngotSection title={CHROME.props[lang]}>
        <IngotList
          variant="plain"
          items={doc.props.map((prop) => (
            <>
              <IngotCode>{prop.name}</IngotCode>: <IngotCode>{prop.type}</IngotCode> —{" "}
              {prop.note[lang]}
            </>
          ))}
        />
      </IngotSection>
    </>
  );
}

/**
 * One route's content.
 *
 * A page that throws is not allowed to take the build down: the worst
 * outcome would be shipping nothing at all because one guide's prose
 * reaches for something node does not have. It degrades to the heading and
 * the summary, which are still more than the site had before, and says so
 * on stderr so the gap is visible rather than silent.
 */
export function renderRoute({ page, lang }: DocsLocation): PrerenderedRoute {
  const head = headFor(page, lang);

  let body = "";
  try {
    body = renderToStaticMarkup(<Body page={page} lang={lang} />);
  } catch (error) {
    console.error(`[prerender] ${head.path}: body skipped — ${String(error)}`);
  }

  const heading = renderToStaticMarkup(
    <IngotPageHeader title={head.heading} description={head.description} />,
  );

  return { path: head.path, lang, head, html: heading + body };
}

export function renderAllRoutes(): PrerenderedRoute[] {
  return ALL_ROUTES.map(renderRoute);
}

/**
 * A `ReactNode` as the sentence a reader sees.
 *
 * The registry's prose is JSX — a sentence with an `IngotCode` or a link
 * inside it — and a file meant for another tool wants the sentence, not
 * the markup. Rendering and then stripping is the only way that stays
 * honest: walking the node tree by hand would need a case for every
 * element the prose is allowed to use, and would silently drop the next
 * one somebody reaches for.
 */
function toText(node: ReactNode): string {
  return renderToStaticMarkup(<>{node}</>)
    .replace(/<[^>]+>/g, "")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** The doc-page registry as data — see `manifest.ts`. */
export function buildComponentManifest(meta: {
  kit: string;
  generated: string;
}): ComponentManifest {
  return componentManifest(toText, meta);
}
