/**
 * Shell of the Ingot doc web — a three-column layout after the Tailwind
 * Catalyst pattern: menu on the left, description + live demo + props in
 * the middle, "On this page" on the right.
 *
 * Routing is by **path**, without react-router. Every address is a real
 * URL that the build writes a real HTML file for (``routes.ts`` is the one
 * list both halves read), so a crawler, a link preview and a chat client
 * all get the page they asked for. A router library would add a dependency
 * for what is a lookup in an array the site already has.
 *
 * **Drawn ONLY with kit components.** The doc web teaches the kit, so a
 * page that composes its own classes contradicts it by its own example.
 * The menu is `IngotSideNav`, the heading `IngotPageHeader`, sections
 * `IngotSection`, lists `IngotList`, code `IngotCode`, the demo surface
 * `Card` and the props table `IngotTable`. Only the three-column layout
 * remains, because a layout is not a component.
 *
 * **The right column is derived from the SAME array that renders the
 * content.** That list used to be hand-written with two items — with
 * sections being added it would be exactly the kind of list that drifts
 * from the content and nobody notices, because both sides look true.
 * ``sectionsFor`` is therefore the single source: a section that does not
 * render does not reach the anchors, and vice versa.
 *
 * 🌍 **Language, theme and accent are held by the shell** (KAN-627,
 * KAN-648). Which languages are offered is not in the bundle: it is read
 * from the platform (``platformLanguages.ts``) and intersected with what
 * the doc web really has text for. The theme sets ``.dark`` on ``<html>``,
 * the accent ``data-accent`` on the same element — the initial state of
 * both is applied before first paint by the kit's ``theme-init.js``; here
 * is only the switch and its stored choice.
 *
 * The doc web has no login, so both choices live only in the browser. In
 * the product the account is the source of truth and localStorage is a
 * mirror against a flash on load.
 */
import {
  Suspense,
  lazy,
  useEffect,
  useState,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  Button,
  IngotBadge,
  IngotCallout,
  IngotCode,
  IngotDrawer,
  IngotEyebrow,
  IngotIcon,
  IngotList,
  IngotPageHeader,
  IngotProvider,
  IngotSection,
  IngotAccentSwatches,
  IngotSegmented,
  IngotSideNav,
  IngotTable,
  IngotTabs,
  type IngotColumn,
  type IngotNavItem,
} from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import releases from "@/ingot-docs/releases.json";
import { SearchDialog } from "@/ingot-docs/SearchDialog";
import {
  initialLang,
  writeStoredLang,
  type DocLang,
  type Localized,
} from "@/ingot-docs/lang";
import {
  bundleLanguages,
  fetchDocLanguages,
  type DocLanguages,
} from "@/ingot-docs/platformLanguages";
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import {
  ALL_PAGES,
  DEFAULT_PAGE,
  locationFromPath,
  pageSlug,
  pathFromLegacyHash,
  pathOf,
  type DocsPage,
} from "@/ingot-docs/routes";
import pkg from "../../package.json";
import type {
  IngotDocPage,
  IngotExtraPropGroup,
  IngotGuideGroup,
  IngotPropRow,
} from "@/ingot-docs/types";
import {
  applyAccent,
  applyTheme,
  readStoredAccent,
  readStoredTheme,
  writeStoredAccent,
  writeStoredTheme,
  type AccentChoice,
  type ThemeChoice,
} from "@/ingot/theme";

/** Shorthand for "pick the language" — reads better than ``value[lang]`` everywhere. */
function pick<T>(value: Localized<T>, lang: DocLang): T {
  return value[lang];
}

function propColumns(lang: DocLang): readonly IngotColumn<IngotPropRow>[] {
  return [
    {
      key: "name",
      header: pick(CHROME.propName, lang),
      cell: (row) => <IngotCode>{row.name}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      // The type as a badge, not bare text — the column is an orientation
      // label, not a substitute for the source file.
      key: "type",
      header: pick(CHROME.propType, lang),
      cell: (row) => <IngotBadge>{row.type}</IngotBadge>,
      cellClassName: "max-w-xs",
    },
    {
      key: "required",
      header: pick(CHROME.propRequired, lang),
      cell: (row) =>
        row.required ? (
          <IngotBadge tone="ok">{pick(CHROME.yes, lang)}</IngotBadge>
        ) : (
          "—"
        ),
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "note",
      header: pick(CHROME.propNote, lang),
      cell: (row) => pick(row.note, lang),
    },
  ];
}

function PropsTable({
  rows,
  caption,
  testId,
  lang,
}: {
  rows: readonly IngotPropRow[];
  caption: string;
  testId: string;
  lang: DocLang;
}): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <IngotTable
        columns={propColumns(lang)}
        rows={rows}
        rowKey={(row) => row.name}
        caption={caption}
        className="min-w-[40rem]"
        testId={testId}
      />
    </div>
  );
}

/** ``IngotColumn<Row>`` -> ``ingotcolumn-row``; only so the testId is readable. */
function slugify(name: string): string {
  return name
    .replace(/\W+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function ExtraProps({
  groups,
  lang,
}: {
  groups: readonly IngotExtraPropGroup[];
  lang: DocLang;
}): JSX.Element {
  return (
    <>
      {groups.map((group) => (
        <IngotSection
          key={group.name}
          level={3}
          title={<IngotCode>{group.name}</IngotCode>}
        >
          <p className="text-sm text-ink-2">{pick(group.note, lang)}</p>
          <PropsTable
            rows={group.props}
            caption={`${pick(CHROME.props, lang)} — ${group.name}`}
            testId={`docs-props-${slugify(group.name)}`}
            lang={lang}
          />
        </IngotSection>
      ))}
    </>
  );
}

/**
 * Live demo in a frame with a bar: Preview/Code tabs + a Copy button.
 *
 * The props table says WHAT each prop does; the code says HOW it is put
 * together — and for `IngotTable` (columns as data) or `IngotConfirm` (a
 * veto from the `impact` slot) that is half of the value. Without it the
 * reader has to go to the repository, which is exactly the barrier that
 * makes the next person write the component their own way.
 *
 * `page.demoSource` is a ``?raw`` import of the SAME module that
 * `page.Demo` comes from — see `IngotDocPage.demoSource`. The listing is
 * therefore not a copy that could be forgotten.
 *
 * The preview stage sits on ``--surface-2`` and centres the content — the
 * frame alone would blend into the page's white surface.
 */
/**
 * One lazy component per page, built once when this module loads.
 *
 * ``React.lazy`` returns a NEW component type on every call, and a new type
 * means React throws the old tree away and mounts a fresh one — so building
 * it during a render would remount the demo on every keystroke elsewhere on
 * the page and lose whatever state the reader had set in it.
 *
 * Building all of them up front costs nothing: ``lazy`` imports nothing
 * until something renders it. What is eager here is a wrapper; what is lazy
 * is the demo.
 */
const DEMOS: ReadonlyMap<string, ComponentType<{ lang: DocLang }>> = new Map(
  INGOT_DOC_PAGES.map((page) => [page.name, lazy(page.demo)] as const),
);

function DemoWithSource({
  page,
  lang,
}: {
  page: IngotDocPage;
  lang: DocLang;
}): JSX.Element {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    setView("preview");
    setCopied(false);
    setSource(null);
  }, [page.name]);

  /**
   * The listing arrives when the reader asks for it.
   *
   * It is behind a toggle most readers never open, so its text has no
   * business in the first payload. ``cancelled`` is the usual guard for a
   * reader who turns two pages quickly: without it the slower request
   * lands last and the page shows another component's code.
   */
  useEffect(() => {
    if (view !== "code" || source !== null) return;
    let cancelled = false;
    void page.demoSource().then((module) => {
      if (!cancelled) setSource(module.default);
    });
    return () => {
      cancelled = true;
    };
  }, [view, source, page]);

  const copy = async () => {
    try {
      const text = source ?? (await page.demoSource()).default;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The clipboard may be missing (http, denied permission) — the button
      // then simply does not confirm and the reader selects the code from
      // the Code tab by hand.
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-end justify-between gap-3 bg-surface px-3">
        <IngotTabs
          items={[
            { key: "preview", label: pick(CHROME.previewTab, lang) },
            { key: "code", label: pick(CHROME.codeTab, lang) },
          ]}
          value={view}
          onChange={(key) => setView(key as "preview" | "code")}
          label={pick(CHROME.demo, lang)}
          testId="docs-demo-tabs"
        />
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<IngotIcon name="copy" />}
          onClick={copy}
          className="mb-1"
          data-testid="docs-copy"
        >
          {copied ? pick(CHROME.copiedCode, lang) : pick(CHROME.copyCode, lang)}
        </Button>
      </div>
      {view === "preview" ? (
        /* The surface SCROLLS, it does not clip. A demo with its own fixed
           width (``IngotMegaMenu`` has 26rem) does not fit a narrow
           viewport and under ``overflow-hidden`` it was simply cut off —
           the reader does not see that a piece is missing. That is worse
           than a scrollbar: it silently lies about how the component looks.

           ``mx-auto w-fit`` handles both at once: a demo that can shrink
           stays centred; one that cannot stretches the wrapper and starts
           a scrollbar from the left edge. */
        <div className="overflow-x-auto bg-surface-2" data-testid="docs-demo-stage">
          <div className="mx-auto w-fit p-4 md:p-8">
            <IngotProvider lang={lang}>
              {/* The fallback is the word, not a spinner: the demo is a
                  local module and arrives in a frame or two. A spinner for
                  something that fast is a flicker the reader reads as a
                  fault. */}
              <Suspense
                fallback={
                  <p className="text-sm text-ink-3">{pick(CHROME.demoLoading, lang)}</p>
                }
              >
                {(() => {
                  const Demo = DEMOS.get(page.name);
                  return Demo ? <Demo lang={lang} /> : null;
                })()}
              </Suspense>
            </IngotProvider>
          </div>
        </div>
      ) : (
        <IngotCode block lang="tsx" testId="docs-source">
          {source ?? pick(CHROME.demoLoading, lang)}
        </IngotCode>
      )}
    </div>
  );
}

interface DocSection {
  id: string;
  title: string;
  body: ReactNode;
  /**
   * Heading as the handoff's "cap": mono uppercase with a dotted line after
   * the text. Component page sections have it, guides do not — there the
   * heading is a sentence, not a block label.
   */
  cap?: boolean;
}

/** Section heading in the cap style — content for ``IngotSection.title``. */
function CapTitle({ children }: { children: ReactNode }): JSX.Element {
  return (
    <IngotEyebrow as="span" tone="muted" className="flex items-center gap-2">
      {children}
      <span
        aria-hidden="true"
        className="flex-1 border-t border-dashed border-border"
      />
    </IngotEyebrow>
  );
}

/**
 * The status badge, by status.
 *
 * ``deprecated`` is the danger tone rather than a warning: a reader who
 * lands on the page has to see, before anything else, that building on
 * this is building on something with a removal date.
 */
/**
 * The release a primitive first appeared in.
 *
 * Written at build time from the tags themselves — for each tag, which doc
 * pages it carried. A list maintained by hand would be a list that is one
 * release behind, and it would be behind in the direction that matters:
 * the newest primitive is the one a reader is least sure about.
 */
function sinceOf(name: string): string | null {
  return (releases.since as Record<string, string>)[name] ?? null;
}

const STATUS_TONE = {
  stable: "neutral",
  beta: "warn",
  deprecated: "danger",
} as const;

const STATUS_LABEL = {
  stable: CHROME.statusStable,
  beta: CHROME.statusBeta,
  deprecated: CHROME.statusDeprecated,
} as const;

/**
 * Sections of the page currently shown — the single source for the content
 * and for the anchors.
 *
 * Optional sections (``limits``) never enter the array, so "On this page"
 * cannot link to them into a void.
 */
function sectionsFor(page: IngotDocPage, lang: DocLang): readonly DocSection[] {
  const sections: DocSection[] = [
    // The deprecation notice comes FIRST, before the demo. A reader who
    // scrolls to the props and starts typing has already decided; the
    // removal date has to reach them before that.
    ...(page.deprecated === undefined
      ? []
      : [
          {
            id: "zastarale",
            title: pick(CHROME.deprecatedTitle, lang),
            cap: true,
            body: (
              <IngotCallout
                tone="danger"
                title={pick(CHROME.deprecatedTitle, lang)}
                testId="docs-deprecated"
              >
                <IngotList
                  items={[
                    `${pick(CHROME.deprecatedSince, lang)}: v${page.deprecated.since}`,
                    ...(page.deprecated.replacedBy === undefined
                      ? []
                      : [
                          `${pick(CHROME.deprecatedReplacedBy, lang)}: ${page.deprecated.replacedBy}`,
                        ]),
                    `${pick(CHROME.deprecatedRemoveIn, lang)}: v${page.deprecated.removeIn}`,
                  ]}
                />
              </IngotCallout>
            ),
          } satisfies DocSection,
        ]),
    {
      id: "ukazka",
      title: pick(CHROME.demo, lang),
      cap: true,
      body: <DemoWithSource page={page} lang={lang} />,
    },
    {
      id: "kdy",
      title: pick(CHROME.useWhen, lang),
      cap: true,
      body: <IngotList items={pick(page.useWhen, lang)} />,
    },
    {
      id: "kdy-ne",
      title: pick(CHROME.avoidWhen, lang),
      cap: true,
      body: <IngotList items={pick(page.avoidWhen, lang)} />,
    },
    {
      id: "vlastnosti",
      title: pick(CHROME.props, lang),
      cap: true,
      body: (
        <div className="space-y-6">
          {/* The className policy stands ABOVE the table: a primitive that
              does not take it has no row to say so, and "may I pass
              className?" is the first question a consumer asks. */}
          <p className="text-sm text-ink-2" data-testid="docs-classname-note">
            {pick(page.classNameNote, lang)}
          </p>
          <PropsTable
            rows={page.props}
            caption={`${pick(CHROME.props, lang)} — ${page.name}`}
            testId="docs-props"
            lang={lang}
          />
          {page.extraProps && page.extraProps.length > 0 && (
            <ExtraProps groups={page.extraProps} lang={lang} />
          )}
        </div>
      ),
    },
    {
      id: "pristupnost",
      title: pick(CHROME.a11y, lang),
      cap: true,
      // Callout-warn: accessibility is the part that copied components lose
      // first — hence a warning surface, not a plain list.
      body: (
        <div
          className="rounded-md border border-warn-border bg-warn-bg p-4"
          data-testid="docs-a11y-callout"
        >
          <IngotList items={pick(page.a11y, lang)} />
        </div>
      ),
    },
    {
      // Tokens come after accessibility and before translations, as the
      // design orders them: both are what a component review checks last.
      id: "tokeny",
      title: pick(CHROME.tokens, lang),
      cap: true,
      body: (
        <div className="space-y-3">
          {page.tokens.length === 0 ? (
            // An empty list is a statement, not an omission: the primitive
            // renders nothing, so review knows no token change reaches it.
            <p className="text-sm text-ink-2" data-testid="docs-tokens">
              {pick(CHROME.tokensNone, lang)}
            </p>
          ) : (
            <>
              <p className="text-sm text-ink-2">{pick(CHROME.tokensNote, lang)}</p>
              <div className="flex flex-wrap gap-1.5" data-testid="docs-tokens">
                {page.tokens.map((token) => (
                  <IngotCode key={token}>{token}</IngotCode>
                ))}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      id: "preklady",
      title: pick(CHROME.i18n, lang),
      cap: true,
      body: <IngotList items={pick(page.i18n, lang)} />,
    },
  ];

  if (page.limits) {
    const limits = pick(page.limits, lang);
    if (limits.length > 0) {
      sections.push({
        id: "limity",
        title: pick(CHROME.limits, lang),
        cap: true,
        body: <IngotList items={limits} />,
      });
    }
  }

  return sections;
}

function titleOf(active: DocsPage, lang: DocLang): string {
  return active.kind === "guide"
    ? pick(active.guide.title, lang)
    : // Without the prefix on the page; the address and the code listings
      // keep the full export name — see ``naming.ts``.
      displayName(active.doc.name);
}

function summaryOf(active: DocsPage, lang: DocLang): string {
  return active.kind === "guide"
    ? pick(active.guide.summary, lang)
    : pick(active.doc.summary, lang);
}

function sectionsOf(active: DocsPage, lang: DocLang): readonly DocSection[] {
  if (active.kind === "component") return sectionsFor(active.doc, lang);
  return active.guide.sections.map((section) => ({
    id: section.id,
    title: pick(section.title, lang),
    body: pick(section.body, lang),
  }));
}

/**
 * The address a page lives at. Built in ``routes.ts`` and nowhere else, so
 * the menu, the pager, the sitemap and the prerendered files cannot
 * disagree about where a page is.
 */
function hrefOf(active: DocsPage, lang: DocLang): string {
  return pathOf(active, lang);
}

function navItem(
  entry: DocsPage,
  activeHref: string,
  lang: DocLang,
  /** Tells the column (``docs-``) apart from the drawer (``docs-drawer-``). */
  idPrefix: string,
  extra?: Partial<IngotNavItem>,
): IngotNavItem {
  const href = hrefOf(entry, lang);
  return {
    href,
    label: titleOf(entry, lang),
    current: href === activeHref,
    // The slug, not the address: the testids were written before the pages
    // had a language prefix, and a query for `docs-nav-table` should not
    // start failing because the reader is reading in English.
    testId: `${idPrefix}nav-${pageSlug(entry)}`,
    ...extra,
  };
}

const GUIDE_ENTRIES: readonly DocsPage[] = INGOT_GUIDE_PAGES.map((guide) => ({
  kind: "guide" as const,
  guide,
}));

const COMPONENT_ENTRIES: readonly DocsPage[] = INGOT_DOC_PAGES.map((doc) => ({
  kind: "component" as const,
  doc,
}));

/** Slug of the overview page the components nest under in the menu. */
const CATALOGUE_SLUG = "komponenty";

const GROUP_LABELS: Record<IngotGuideGroup, keyof typeof CHROME> = {
  system: "groupSystem",
  app: "groupApp",
  rules: "groupRules",
  authors: "groupAuthors",
};

/**
 * Left menu as in the handoff: ONE numbered list split by group headings,
 * with the components nested under the overview page.
 *
 * **The number is the position in ``INGOT_GUIDE_PAGES``, not a written
 * value.** Hand-written numbers would all have to be renumbered when a
 * page is inserted in the middle — and that is work forgotten exactly
 * once, after which the menu counts 00, 01, 01, 03.
 *
 * Groups are derived by walking the registry in order: a heading is
 * inserted every time the group changes. Pages of one group must therefore
 * stand next to each other in the registry — see the comment at
 * ``INGOT_GUIDE_PAGES``.
 */
function guideGroups(
  active: DocsPage,
  lang: DocLang,
  /**
   * The menu is drawn twice — in the column (from ``md``) and in the drawer
   * (below ``md``). The hidden column is ``display:none``, so it drops out
   * of the accessibility tree and a screen reader hears the navigation only
   * once; it stays in the DOM though, and the same testid twice is a trap
   * for a query that expects one element. The prefix is therefore required,
   * not optional.
   */
  idPrefix: string,
): readonly { group: IngotGuideGroup; items: readonly IngotNavItem[] }[] {
  const activeHref = hrefOf(active, lang);
  // The component list nests ONLY while the reader is in the components
  // section (the overview or a component page) — owner's instruction of
  // 2026-09-02. Thirty-one items unfolded on every page turned the menu
  // into an index in which the other groups had to be found by scrolling.
  const inComponents =
    active.kind === "component" ||
    (active.kind === "guide" && active.guide.slug === CATALOGUE_SLUG);
  const componentItems = inComponents
    ? COMPONENT_ENTRIES.map((entry) => navItem(entry, activeHref, lang, idPrefix))
    : undefined;

  const groups: { group: IngotGuideGroup; items: IngotNavItem[] }[] = [];
  GUIDE_ENTRIES.forEach((entry, index) => {
    if (entry.kind !== "guide") return;
    const group = entry.guide.group;
    if (groups.at(-1)?.group !== group) groups.push({ group, items: [] });
    groups.at(-1)!.items.push(
      navItem(entry, activeHref, lang, idPrefix, {
        ordinal: String(index).padStart(2, "0"),
        children: entry.guide.slug === CATALOGUE_SLUG ? componentItems : undefined,
      }),
    );
  });
  return groups;
}

/**
 * Order for the prev/next footer: guides → components, exactly as they go
 * in the left menu. One sequence on purpose — a reader who finishes the
 * last guide should have "Next" continue to the first component, not end
 * in a dead end.
 */
const ALL_ENTRIES: readonly DocsPage[] = ALL_PAGES;

/** Prev/next footer — between guides, components, and across the boundary of both. */
function PagerFooter({
  page,
  lang,
}: {
  page: DocsPage;
  lang: DocLang;
}): JSX.Element | null {
  const href = hrefOf(page, lang);
  const index = ALL_ENTRIES.findIndex((entry) => hrefOf(entry, lang) === href);
  if (index < 0) return null;
  const prev = index > 0 ? ALL_ENTRIES[index - 1] : null;
  const next = index < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[index + 1] : null;

  // Cards from the handoff: a frame, a mono direction label, hover with a
  // shadow.
  //
  // ``min-w-0``, not ``min-w-[200px]``. Two 200 px cards with a gap force
  // 416 px, which on mobile was the last remaining source of horizontal
  // scrolling of the WHOLE document — wider than the viewport means the
  // page slides sideways even where everything else is fine.
  const cardClass =
    "flex min-w-0 flex-1 flex-col gap-1 rounded-md border border-border bg-surface px-[18px] py-[14px] text-ink hover:border-border-strong hover:shadow-sm sm:max-w-[48%] sm:flex-none";

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between sm:gap-4">
      {prev ? (
        <a className={cardClass} href={hrefOf(prev, lang)} data-testid="docs-prev">
          <IngotEyebrow as="span" tone="muted">
            {pick(CHROME.prevPage, lang)}
          </IngotEyebrow>
          <span className="truncate text-sm font-medium">{titleOf(prev, lang)}</span>
        </a>
      ) : (
        /* A spacer keeps "Next" at the right edge when there is no previous
           page. Stacked (mobile) it would only add a gap, though. */
        <span className="hidden sm:block" />
      )}
      {next ? (
        <a
          className={`${cardClass} sm:ml-auto sm:items-end sm:text-right`}
          href={hrefOf(next, lang)}
          data-testid="docs-next"
        >
          <IngotEyebrow as="span" tone="muted">
            {pick(CHROME.nextPage, lang)}
          </IngotEyebrow>
          <span className="truncate text-sm font-medium">{titleOf(next, lang)}</span>
        </a>
      ) : (
        <span className="hidden sm:block" />
      )}
    </div>
  );
}

const THEME_CHOICES: readonly ThemeChoice[] = ["system", "light", "dark"];

/**
 * Names of the accent families for a screen reader.
 *
 * ``Record<AccentChoice, …>`` on purpose: when a family is added to
 * ``ACCENT_CHOICES``, the typecheck fails here, not a visual check of a dot
 * without a label.
 */
const ACCENT_LABELS: Record<AccentChoice, keyof typeof CHROME> = {
  blue: "accentBlue",
  emerald: "accentEmerald",
  orange: "accentOrange",
  violet: "accentViolet",
  slate: "accentSlate",
};

/**
 * What the address bar says right now.
 *
 * The path decides the language too: ``/en/...`` is English, everything
 * else is Czech. That order matters — a reader who was sent an English
 * link must read English even if their own stored choice is Czech, because
 * the sender chose the language of the thing they shared. Only when the
 * address says nothing (the site root) does the stored choice, and then
 * the browser, get to decide.
 */
function locationNow(): { page: DocsPage; lang: DocLang } {
  const here = locationFromPath(window.location.pathname);
  if (here === null) return { page: DEFAULT_PAGE, lang: initialLang() };
  const atRoot = window.location.pathname.replace(/\/+$/, "") === "";
  return { page: here.page, lang: atRoot ? initialLang() : here.lang };
}

export function DocsApp(): JSX.Element {
  const [{ page, lang }, setLocation] = useState(locationNow);
  const setLang = (next: DocLang) => setLocation((prev) => ({ ...prev, lang: next }));
  const [theme, setTheme] = useState<ThemeChoice>(readStoredTheme);
  const [accent, setAccent] = useState<AccentChoice>(readStoredAccent);
  const [languages, setLanguages] = useState<DocLanguages>(bundleLanguages);
  /** Drawer with the menu and switches — only below ``md``, see the header. */
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /**
   * Ctrl/Cmd+K opens the search.
   *
   * On the window rather than on a field, because the point is that the
   * reader does not have to reach for anything first. The default is
   * prevented so the browser's own "search the page" does not open on top
   * of it, and the shortcut is ignored while the reader is typing in a
   * field — a search box that swallows a keystroke meant for a form is
   * worse than no shortcut.
   */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      const active = document.activeElement;
      const tag = active?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      setSearchOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Back and forward. The browser changes the address without asking; this
  // is the only place that reads it back.
  useEffect(() => {
    const onPopState = () => setLocation(locationNow());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /**
   * Every link shared before the addresses existed is a hash. They are
   * also the only links to this site that exist, so they are translated
   * once, on arrival, and the address bar is corrected in place —
   * ``replaceState``, not ``pushState``: the hash was never a page the
   * reader chose, and Back should leave the site rather than return to it.
   */
  useEffect(() => {
    const target = pathFromLegacyHash(window.location.hash, lang);
    if (target === null) return;
    window.history.replaceState(null, "", target);
    setLocation(locationNow());
    // Once, on arrival. A hash that appears later is an anchor inside the
    // page, and translating that would throw the reader to another page
    // mid-scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * One click handler for the whole document instead of a callback on
   * every link.
   *
   * The links stay real ``<a href>`` with real addresses — that is the
   * point of having them, and it is what a crawler, a middle-click and
   * "copy link address" all need. This only spares the reader a full
   * reload when the destination is a page we already have.
   */
  /** Go to one of our own paths without a reload. */
  function goTo(path: string): void {
    if (path === window.location.pathname) return;
    const here = locationFromPath(path);
    if (here === null) return;
    window.history.pushState(null, "", path);
    setLocation({ page: here.page, lang: here.lang });
    window.scrollTo({ top: 0 });
  }

  function onNavigate(event: MouseEvent<HTMLDivElement>): void {
    if (event.defaultPrevented || event.button !== 0) return;
    // A modified click means the reader asked for a new tab or a download.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement | null)?.closest?.("a");
    if (!anchor || anchor.target === "_blank") return;
    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("/")) return;
    const here = locationFromPath(href);
    if (here === null) return;
    event.preventDefault();
    goTo(href);
  }

  // The bundle decides which languages exist; the platform may relabel
  // them or hide one it switched off. The switch is therefore already
  // drawn and already correct before this runs, and nothing about the page
  // waits for the answer.
  useEffect(() => {
    const controller = new AbortController();
    void fetchDocLanguages(controller.signal).then(setLanguages);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // The accent is NOT recomputed after a theme switch and has no coupling
  // to it: every family has its own light and dark block and the cascade
  // picks between them. Hence this effect depends only on ``accent``.
  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  // `index.html` ships `lang="cs"` because no choice exists at that point.
  // After a switch it would be a lie nobody sees and a screen reader pays
  // for: English text read with Czech pronunciation is unintelligible.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const sections = sectionsOf(page, lang);
  const options = languages.options;

  // Picking a page closes the drawer. Staying open over the content the
  // reader just chose is the one thing they do not want after a menu click.
  useEffect(() => {
    setNavOpen(false);
  }, [page]);

  // Rotating a tablet to landscape reveals the menu in the column — a
  // drawer over it would then cover a layout that already has navigation.
  //
  // ``matchMedia`` may not exist (jsdom, a very old browser) and Safari
  // before 14 knows only ``addListener``. Both are handled here because the
  // kit is a model: it must not break even where the modern API cannot be
  // relied on — without them the drawer simply closes with ESC or the X.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (query.matches) setNavOpen(false);
    };
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }
    query.addListener(onChange);
    return () => query.removeListener(onChange);
  }, []);

  const separator = (
    <span aria-hidden="true" className="hidden h-5 w-px bg-border sm:block" />
  );

  /**
   * Theme, language and accent. They stand in the bar (from ``md``) and in
   * the drawer (below ``md``), where they stack — in one row they would
   * wrap to a second line at 375 px and the sticky bar would eat a sixth of
   * the screen.
   *
   * ``idPrefix`` separates the testids of both renderings: the same testid
   * twice in the DOM is a trap for a query that expects one element.
   */
  const chromeControls = (stacked: boolean, idPrefix: string) => (
    <div
      className={
        stacked
          ? "flex flex-col items-start gap-4"
          : "flex flex-wrap items-center gap-x-4 gap-y-2"
      }
    >
      <div className="flex items-center gap-2">
        <IngotEyebrow as="span" tone="muted">
          {pick(CHROME.accent, lang)}
        </IngotEyebrow>
        <IngotAccentSwatches
          value={accent}
          onChange={(next) => {
            setAccent(next);
            writeStoredAccent(next);
          }}
          groupLabel={pick(CHROME.accent, lang)}
          optionLabel={(choice) =>
            `${pick(CHROME.accent, lang)} ${pick(CHROME[ACCENT_LABELS[choice]], lang)}`
          }
        />
      </div>
      {stacked ? null : separator}
      <IngotSegmented
        options={THEME_CHOICES.map((choice) => ({
          value: choice,
          label:
            choice === "light"
              ? pick(CHROME.themeLight, lang)
              : choice === "dark"
                ? pick(CHROME.themeDark, lang)
                : pick(CHROME.themeSystem, lang),
        }))}
        value={theme}
        onChange={(next) => {
          setTheme(next as ThemeChoice);
          writeStoredTheme(next as ThemeChoice);
        }}
        label={pick(CHROME.theme, lang)}
        testId={`${idPrefix}theme`}
      />
      {/* A single language = nothing to switch. A control with one option
          only takes up room and promises a choice that does not exist. */}
      {options.length > 1 && (
        <>
          {stacked ? null : separator}
          <IngotSegmented
            options={options.map((option) => ({
              value: option.code,
              label: option.code.toUpperCase(),
            }))}
            value={lang}
            onChange={(next) => {
              const chosen = next as DocLang;
              writeStoredLang(chosen);
              // The same page, in the other language — so switching the
              // language keeps the reader where they were AND leaves an
              // address they can share in that language.
              window.history.pushState(null, "", pathOf(page, chosen));
              setLang(chosen);
            }}
            label={pick(CHROME.language, lang)}
            testId={`${idPrefix}lang`}
          />
        </>
      )}
      {/* The Simple/Expert dictionary is DELIBERATELY not here. It controls
          a single table on the Translations page, so next to theme,
          language and accent — choices valid for the whole web — it
          promised an effect it does not have. The switch therefore stands
          by that table. */}
    </div>
  );

  /** Groups of the left menu. Drawn into the column and into the drawer. */
  const navGroups = (idPrefix: string) =>
    guideGroups(page, lang, idPrefix).map(({ group, items }) => (
      <IngotSideNav
        key={group}
        label={pick(CHROME[GROUP_LABELS[group]], lang)}
        items={items}
        testId={`${idPrefix}nav-group-${group}`}
      />
    ));

  return (
    /* The handler adds nothing a keyboard user needs: the links underneath
       it are real links and work on Enter exactly as they always did. It
       only spares a mouse click a full page reload. */
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div className="min-h-screen" onClick={onNavigate}>
      {searchOpen ? (
        <SearchDialog
          lang={lang}
          onClose={() => setSearchOpen(false)}
          onNavigate={(path) => {
            setSearchOpen(false);
            goTo(path);
          }}
        />
      ) : null}
      {/* Top bar from the handoff: brand and version on the left, accent /
          theme / language on the right. Sticky so the switches do not run
          away with the scroll of a long page.

          ``docs-topbar`` (globals.css) holds the glass — a translucent
          surface with blur, white in the light theme and dark in the dark. */}
      <header className="docs-topbar sticky top-0 z-40 flex items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 md:px-6">
        {/* The logo carries the full name ("INGOT UI KIT"), so a text brand
            next to it would only repeat it — the version remained as the label.

            Two variants, not a filter: the wordmark is almost black and
            would vanish on the dark glass, but ``invert`` would flip the
            blue with it. The dark variant flips only the ink and the muted
            outline; the blue accent stays blue. Both have a label: a blind
            reader hears it once, because ``display:none`` drops the hidden
            one from the accessibility tree. */}
        <img
          src="/ingot-logo.png"
          alt="Ingot UI Kit"
          className="h-9 w-auto dark:hidden"
          width={311}
          height={128}
        />
        <img
          src="/ingot-logo-dark.png"
          alt="Ingot UI Kit"
          className="hidden h-9 w-auto dark:block"
          width={311}
          height={128}
        />
        {/* The version and brand moved to the mini footer at the bottom
            (owner instruction of 2026-09-02) — the header carries only controls. */}
        <span className="flex-1" aria-hidden="true" />

        {/* The shortcut is the point, and a shortcut nobody is told about
            is a shortcut nobody uses — so the button carries it as its
            label. Below ``sm`` only the icon is left: the bar there has
            room for controls, not for their names. */}
        <Button
          variant="secondary"
          size="md"
          leadingIcon={<IngotIcon name="search" />}
          onClick={() => setSearchOpen(true)}
          data-testid="docs-search-open"
        >
          <span className="hidden sm:inline">{pick(CHROME.searchOpen, lang)}</span>
          <IngotEyebrow as="span" tone="muted" className="hidden md:inline">
            ⌘K
          </IngotEyebrow>
        </Button>

        {/* From ``md`` in the bar, below ``md`` in the drawer. Five accents,
            three themes and two languages side by side need over 400 px; on
            a 375px display they wrapped to a second row and the sticky bar
            then ate 98–125 px, a sixth of the screen. */}
        <div className="hidden md:block">{chromeControls(false, "docs-")}</div>

        {/* Below ``md`` the button is the ONLY way between pages — the left
            menu is hidden there. Hiding the menu without it does not mean
            worse navigation, but none. */}
        <Button
          variant="secondary"
          size="md"
          iconOnly
          aria-label={pick(CHROME.openMenu, lang)}
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
          className="md:hidden"
          data-testid="docs-menu-open"
        >
          <IngotIcon name="menu" />
        </Button>
      </header>

      {/* Menu and switches below ``md``. The drawer is a kit primitive, so
          the focus trap, ESC, scroll lock and the portal above stacking
          contexts come with it — the doc web thereby teaches by its own
          example instead of hand-composing a side panel. */}
      {navOpen && (
        <IngotDrawer
          side="left"
          width={320}
          title={pick(CHROME.menuTitle, lang)}
          closeLabel={pick(CHROME.closeMenu, lang)}
          onClose={() => setNavOpen(false)}
          testId="docs-nav-drawer"
          footer={chromeControls(true, "docs-drawer-")}
        >
          <div className="space-y-5">{navGroups("docs-drawer-")}</div>
        </IngotDrawer>
      )}

      {/* Columns are ADDED, not shrunk. Three used to stand here hard-coded
          without a single breakpoint: menu 224 + index 176 + two gaps 64 +
          padding 32 = 496 px of fixed width that fell before the first
          character. The middle column is ``flex-1 min-w-0``, so instead of
          overflowing it obediently shrank to ZERO and set its text outside
          itself — on a 390px display one word per line over the index
          content.

          The thresholds are not by eye. The reading column keeps at least
          360 px so a line carries 45–75 characters:
          * ``md`` (768) — menu 224 + 64 chrome leaves the content 480 px.
          * ``lg`` (1024) — and index 176 + 32 still leaves 528 px.
          Below ``md`` the menu is in the drawer and the index is dropped: on
          a single-column page the content is right below it anyway. */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* The menu stands on the page surface, not on a card: the card is
            the active item, and two layers on top of each other would
            flatten it.

            ``sticky`` with its own scrolling: the component list is longer
            than the viewport, so without it the menu scrolls away and the
            reader reaches another page only back at the top.
            ``IngotPageLayout`` does it the same way — the doc web should
            not contradict a primitive it teaches a bit further on. */}
        {/* ``self-start`` is a precondition for ``sticky``, not cosmetics: a
            stretched flex item is as tall as the whole row, so it has
            nowhere to stick and ``sticky`` silently does nothing. */}
        <div className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 space-y-5 self-start overflow-y-auto md:block">
          {navGroups("docs-")}
        </div>

        <main className="min-w-0 flex-1 space-y-8">
          <IngotPageHeader
            title={titleOf(page, lang)}
            description={summaryOf(page, lang)}
            titleAdornment={
              page.kind === "component" ? (
                <span className="flex items-center gap-2">
                  {/* Tones per the handoff: status neutral (beta warning),
                    version accent. */}
                  <IngotBadge tone={STATUS_TONE[page.doc.status]} testId="docs-status">
                    {pick(STATUS_LABEL[page.doc.status], lang)}
                  </IngotBadge>
                  <IngotBadge tone="accent" testId="docs-version">
                    {`v${page.doc.version}`}
                  </IngotBadge>
                  {/* Which KIT release first carried this page — not the
                    component's own version, which says how many times it
                    has changed. The reader's question is whether the thing
                    exists in the version they pinned, and only this
                    answers it. Absent for a primitive that has not been in
                    a release yet: a badge saying nothing is worse than no
                    badge, because it looks like an answer. */}
                  {sinceOf(page.doc.name) ? (
                    <IngotBadge tone="neutral" testId="docs-since">
                      {`${pick(CHROME.sinceVersion, lang)} ${sinceOf(page.doc.name)}`}
                    </IngotBadge>
                  ) : null}
                  {/* The selector is the only name the element can be
                    discussed under with a designer — only code knows the
                    export name. */}
                  <IngotCode testId="docs-tag">{page.doc.tag}</IngotCode>
                </span>
              ) : undefined
            }
          />

          {sections.map((section) => (
            <IngotSection
              key={section.id}
              id={section.id}
              title={section.cap ? <CapTitle>{section.title}</CapTitle> : section.title}
            >
              {section.body}
            </IngotSection>
          ))}

          <PagerFooter page={page} lang={lang} />
        </main>

        {/* The index is only the third column (from ``lg``). Below that it
            would eat 208 px of the width the text needs — and on a
            single-column page it only repeats the headings right below it. */}
        <aside
          aria-label={pick(CHROME.onThisPage, lang)}
          className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-44 shrink-0 self-start overflow-y-auto border-l border-border pl-4 lg:block"
        >
          <IngotEyebrow tone="muted" className="mb-3">
            {pick(CHROME.onThisPage, lang)}
          </IngotEyebrow>
          <IngotList
            variant="plain"
            items={sections.map((section) => (
              <a
                key={section.id}
                className="text-[12.5px] text-ink-3 hover:text-ink"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            ))}
          />
        </aside>
      </div>

      {/* Mini footer (owner instruction of 2026-09-02): a line across the
          FULL width, low, edges apart — version at the left edge, a pill
          with the Forgmatic logo at the right edge. The release workflow
          writes the version into package.json; a hand-written number lied
          here. */}
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-4 py-2.5 md:px-6">
        <IngotEyebrow as="span" tone="muted">
          Ingot UI Kit · v{pkg.version}
        </IngotEyebrow>
        <a
          href="https://forgmatic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-ink-3 hover:border-border-strong hover:text-ink"
          data-testid="docs-footer-forgmatic"
        >
          {/* `inherit`: the link owns the colour so hover can change it. */}
          <IngotEyebrow as="span" tone="inherit">
            developed for
          </IngotEyebrow>
          <img
            src="/forgmatic-logo.png"
            alt=""
            aria-hidden="true"
            className="h-3.5 w-3.5 object-contain"
          />
          Forgmatic
        </a>
      </footer>
    </div>
  );
}
