/**
 * Skořápka doc webu Ingotu (KAN-581) — třísloupcový layout podle vzoru
 * Tailwind Catalyst: vlevo menu, uprostřed popis + živá ukázka
 * + vlastnosti, vpravo „Co je na stránce“.
 *
 * Routuje se **hashem**, ne react-routerem. Doc web je vlastní entry
 * point (rozhodnutí 3 v KAN-581) a router by do něj přitáhl závislost,
 * kterou hrstka statických stránek nepotřebuje.
 *
 * 🚨 **Kreslí se JEN komponentami kitu** (KAN-628). Doc web kit vyučuje,
 * takže stránka, která si sama skládá třídy, ho svým vlastním příkladem
 * popírá. Menu je `IngotSideNav`, nadpis `IngotPageHeader`, sekce
 * `IngotSection`, výčty `IngotList`, kód `IngotCode`, plocha ukázky
 * `Card` a tabulka vlastností `IngotTable`. Zbývá jen rozvržení tří
 * sloupců, protože rozvržení komponenta není.
 *
 * 🪤 **Pravý sloupec se odvozuje z TÉHOŽ pole, které vykresluje obsah**
 * (KAN-624). Do KAN-624 byl ten výčet napsaný ručně a měl dvě položky —
 * s přibývajícími sekcemi by to byl přesně ten druh seznamu, který se
 * rozejde s obsahem a nikdo si toho nevšimne, protože obě strany vypadají
 * pravdivě. ``sectionsFor`` je proto jediný zdroj: sekce, která se
 * nevykreslí, se do kotev nedostane, a naopak.
 *
 * 🌍 **Jazyk, motiv i akcent drží skořápka** (KAN-627, KAN-648). Který
 * jazyk se nabídne, není v bundlu: čte se z platformy
 * (``platformLanguages.ts``) a protne se s tím, pro co doc web opravdu
 * má text. Motiv nasazuje ``.dark`` na ``<html>``, akcent
 * ``data-accent`` tamtéž — výchozí stav obojího už při načtení řeší
 * skript v ``ingot.html``, tady je jen přepínač a jeho uložená volba.
 *
 * ⚠️ Doc web nemá přihlášení, takže obě volby žijí jen v prohlížeči.
 * V aplikaci je zdrojem pravdy účet (``AuthMe.ui_theme`` /
 * ``AuthMe.ui_accent``) a localStorage je tam jen zrcadlo proti bliknutí.
 */
import { useEffect, useState, type ReactNode } from "react";

import {
  Button,
  IngotBadge,
  IngotCode,
  IngotIcon,
  IngotList,
  IngotPageHeader,
  IngotSection,
  IngotSideNav,
  IngotTable,
  IngotTabs,
  type IngotColumn,
  type IngotNavItem,
} from "@/ingot";
import { AccentSwatches } from "@/components/AccentSwatches";
import { CHROME } from "@/ingot-docs/chrome";
import {
  DICTIONARY_MODES,
  setDictionaryMode,
  useDictionaryMode,
  type DictionaryMode,
} from "@/ingot-docs/dictionary";
import {
  initialLang,
  writeStoredLang,
  type DocLang,
  type Localized,
} from "@/ingot-docs/lang";
import {
  fallbackLanguages,
  fetchDocLanguages,
  type DocLanguages,
} from "@/ingot-docs/platformLanguages";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import type {
  IngotDocPage,
  IngotExtraPropGroup,
  IngotGuidePage,
  IngotPropRow,
} from "@/ingot-docs/types";
import {
  applyAccent,
  readStoredAccent,
  writeStoredAccent,
  type AccentChoice,
} from "@/lib/accent";
import {
  readStoredTheme,
  resolveTheme,
  systemPrefersDark,
  writeStoredTheme,
  type ThemeChoice,
} from "@/lib/theme";

/** Zkratka pro „vyber jazyk“ — čte se líp než ``value[lang]`` všude. */
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
      // Typ jako badge, ne holý text — sloupec je orientační štítek,
      // ne náhrada za zdrojový soubor.
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

/** ``IngotColumn<Row>`` -> ``ingotcolumn-row``; jen aby byl testId čitelný. */
function slugify(name: string): string {
  return name.replace(/\W+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
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
 * Živá ukázka v rámečku s barem: taby Náhled/Kód + tlačítko Kopírovat
 * (KAN-626, vizuál KAN-663).
 *
 * Tabulka vlastností říká, CO která vlastnost dělá; kód říká, JAK se to
 * poskládá — a u `IngotTable` (sloupce jako data) nebo `IngotConfirm`
 * (veto ze slotu `impact`) je to půlka hodnoty. Bez něj musí čtenář do
 * repozitáře, což je přesně ta bariéra, kvůli které si příští člověk
 * komponentu radši napíše po svém.
 *
 * `page.demoSource` je ``?raw`` import TÉHOŽ modulu, ze kterého pochází
 * `page.Demo` — viz `IngotDocPage.demoSource`. Výpis proto není kopie,
 * kterou by šlo zapomenout přepsat.
 *
 * Stage náhledu sedí na ``--surface-2`` a centruje obsah — samotný
 * rámeček by na bílé ploše stránky splynul.
 */
function DemoWithSource({
  page,
  lang,
}: {
  page: IngotDocPage;
  lang: DocLang;
}): JSX.Element {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setView("preview");
    setCopied(false);
  }, [page.name]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(page.demoSource);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Schránka nemusí být (http, zakázaná oprávnění) — tlačítko pak
      // prostě nepotvrdí a čtenář si kód vybere z tabu Kód ručně.
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
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
        <div
          className="grid place-items-center bg-surface-2 p-8"
          data-testid="docs-demo-stage"
        >
          <div className="min-w-0 max-w-full">
            <page.Demo />
          </div>
        </div>
      ) : (
        <IngotCode block testId="docs-source">
          {page.demoSource}
        </IngotCode>
      )}
    </div>
  );
}

interface DocSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * Co je právě zobrazené. Doc web má od KAN-625 dva druhy stránek a
 * rozlišuje je typem, ne příznakem: průvodce nemá ``props`` ani ukázku
 * a komponenta nemá volné sekce, takže jeden společný tvar by byl z
 * poloviny vždycky prázdný.
 */
type ActivePage =
  | { kind: "guide"; guide: IngotGuidePage }
  | { kind: "component"; doc: IngotDocPage };

const DEFAULT_PAGE: ActivePage = {
  kind: "guide",
  guide: INGOT_GUIDE_PAGES[0],
};

/**
 * Sekce právě zobrazené stránky — jediný zdroj pro obsah i pro kotvy.
 *
 * Nepovinné sekce (``limits``) se do pole vůbec nedostanou, takže „Co je
 * na stránce“ na ně nemůže odkázat do prázdna.
 */
function sectionsFor(page: IngotDocPage, lang: DocLang): readonly DocSection[] {
  const sections: DocSection[] = [
    {
      id: "ukazka",
      title: pick(CHROME.demo, lang),
      body: <DemoWithSource page={page} lang={lang} />,
    },
    {
      id: "kdy",
      title: pick(CHROME.useWhen, lang),
      body: <IngotList items={pick(page.useWhen, lang)} />,
    },
    {
      id: "kdy-ne",
      title: pick(CHROME.avoidWhen, lang),
      body: <IngotList items={pick(page.avoidWhen, lang)} />,
    },
    {
      id: "vlastnosti",
      title: pick(CHROME.props, lang),
      body: (
        <div className="space-y-6">
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
      // Callout-warn: přístupnost je ta část, kterou opsané komponenty
      // ztrácejí nejdřív — proto varovná plocha, ne běžný výčet.
      body: (
        <div
          className="rounded-lg border border-warn-border bg-warn-bg p-4"
          data-testid="docs-a11y-callout"
        >
          <IngotList items={pick(page.a11y, lang)} />
        </div>
      ),
    },
    {
      id: "preklady",
      title: pick(CHROME.i18n, lang),
      body: <IngotList items={pick(page.i18n, lang)} />,
    },
  ];

  if (page.limits) {
    const limits = pick(page.limits, lang);
    if (limits.length > 0) {
      sections.push({
        id: "limity",
        title: pick(CHROME.limits, lang),
        body: <IngotList items={limits} />,
      });
    }
  }

  return sections;
}

/**
 * Stránka z hashe; neznámá padá na výchozí (úvod).
 *
 * 🪤 ``null`` znamená „tohle není routa“, ne „nenašel jsem stránku“.
 * Pravý sloupec kotví na ``#ukazka`` / ``#vlastnosti`` uvnitř TÉŽE
 * stránky — kdyby se i takový hash bral jako routa, proklik na kotvu by
 * shodil obsah zpátky na výchozí stránku.
 *
 * Průvodci se hledají PRVNÍ. Slug průvodce a jméno primitiva sdílejí
 * jeden prostor hashů, takže kolize by jedno z nich tiše zastínila —
 * proto ji guard ``ingot-doc-pages`` odmítne, a tenhle pořádek jen
 * určuje, kdo vyhraje, kdyby se přes něj přece jen protáhla.
 */
function pageFromHash(hash: string): ActivePage | null {
  if (!hash.startsWith("#/")) return null;
  const wanted = hash.slice(2);
  const guide = INGOT_GUIDE_PAGES.find((entry) => entry.slug === wanted);
  if (guide) return { kind: "guide", guide };
  const doc = INGOT_DOC_PAGES.find((entry) => entry.name === wanted);
  if (doc) return { kind: "component", doc };
  return DEFAULT_PAGE;
}

function titleOf(active: ActivePage, lang: DocLang): string {
  return active.kind === "guide"
    ? pick(active.guide.title, lang)
    : active.doc.name;
}

function summaryOf(active: ActivePage, lang: DocLang): string {
  return active.kind === "guide"
    ? pick(active.guide.summary, lang)
    : pick(active.doc.summary, lang);
}

function sectionsOf(active: ActivePage, lang: DocLang): readonly DocSection[] {
  if (active.kind === "component") return sectionsFor(active.doc, lang);
  return active.guide.sections.map((section) => ({
    id: section.id,
    title: pick(section.title, lang),
    body: pick(section.body, lang),
  }));
}

/** Hash, pod kterým stránka bydlí — jediné místo, kde se ta cesta skládá. */
function hrefOf(active: ActivePage): string {
  return `#/${active.kind === "guide" ? active.guide.slug : active.doc.name}`;
}

function navItems(
  entries: readonly ActivePage[],
  active: ActivePage,
  lang: DocLang,
): readonly IngotNavItem[] {
  const activeHref = hrefOf(active);
  return entries.map((entry) => {
    const href = hrefOf(entry);
    return {
      href,
      label: titleOf(entry, lang),
      current: href === activeHref,
      testId: `docs-nav-${href.slice(2)}`,
    };
  });
}

const GUIDE_ENTRIES: readonly ActivePage[] = INGOT_GUIDE_PAGES.map((guide) => ({
  kind: "guide" as const,
  guide,
}));

const COMPONENT_ENTRIES: readonly ActivePage[] = INGOT_DOC_PAGES.map((doc) => ({
  kind: "component" as const,
  doc,
}));

/**
 * Pořadí pro prev/next patičku: průvodci → komponenty, přesně jak jdou
 * v levém menu. Jedna posloupnost schválně — čtenář, který projde
 * posledního průvodce, má „Další“ pokračovat na první komponentu, ne
 * skončit ve slepé uličce.
 */
const ALL_ENTRIES: readonly ActivePage[] = [
  ...GUIDE_ENTRIES,
  ...COMPONENT_ENTRIES,
];

/** Patička prev/next — mezi průvodci, komponentami i přes hranici obou. */
function PagerFooter({
  page,
  lang,
}: {
  page: ActivePage;
  lang: DocLang;
}): JSX.Element | null {
  const href = hrefOf(page);
  const index = ALL_ENTRIES.findIndex((entry) => hrefOf(entry) === href);
  if (index < 0) return null;
  const prev = index > 0 ? ALL_ENTRIES[index - 1] : null;
  const next = index < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[index + 1] : null;

  return (
    <div className="flex justify-between gap-4 border-t border-border pt-6">
      {prev ? (
        <a
          className="min-w-0 text-left"
          href={hrefOf(prev)}
          data-testid="docs-prev"
        >
          <span className="block text-xs text-ink-3">
            {pick(CHROME.prevPage, lang)}
          </span>
          <span className="block truncate text-sm font-medium text-ink-2 hover:text-ink">
            {titleOf(prev, lang)}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          className="min-w-0 text-right"
          href={hrefOf(next)}
          data-testid="docs-next"
        >
          <span className="block text-xs text-ink-3">
            {pick(CHROME.nextPage, lang)}
          </span>
          <span className="block truncate text-sm font-medium text-ink-2 hover:text-ink">
            {titleOf(next, lang)}
          </span>
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}

const THEME_CHOICES: readonly ThemeChoice[] = ["system", "light", "dark"];

/**
 * Jména akcentových rodin pro odečítač obrazovky.
 *
 * ``Record<AccentChoice, …>`` schválně: přibude-li rodina do
 * ``ACCENT_CHOICES``, shodí to typecheck tady, ne až vizuální kontrola
 * puntíku bez popisku.
 */
const ACCENT_LABELS: Record<AccentChoice, keyof typeof CHROME> = {
  blue: "accentBlue",
  emerald: "accentEmerald",
  orange: "accentOrange",
  violet: "accentViolet",
  slate: "accentSlate",
};

/**
 * Nasadí (nebo sundá) ``.dark`` na ``<html>``.
 *
 * Doc web je vlastní entry, takže ``ThemeProvider`` z admin shellu tu
 * neběží. Výchozí stav při načtení řeší synchronní skript v
 * ``ingot.html`` — bez něj by studený load blikl světlá → tmavá. Tahle
 * funkce je jen ta druhá půlka: co se stane, když čtenář přepne.
 */
function applyTheme(choice: ThemeChoice): void {
  const dark = resolveTheme(choice, systemPrefersDark()) === "dark";
  document.documentElement.classList.toggle("dark", dark);
}

export function DocsApp(): JSX.Element {
  const [page, setPage] = useState<ActivePage>(
    () => pageFromHash(window.location.hash) ?? DEFAULT_PAGE,
  );
  const [lang, setLang] = useState<DocLang>(initialLang);
  const [theme, setTheme] = useState<ThemeChoice>(readStoredTheme);
  const [accent, setAccent] = useState<AccentChoice>(readStoredAccent);
  const [languages, setLanguages] = useState<DocLanguages>(fallbackLanguages);
  const dictionary = useDictionaryMode();

  useEffect(() => {
    const onHashChange = () => {
      const next = pageFromHash(window.location.hash);
      if (next) setPage(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Které jazyky se nabídnou, rozhoduje platforma — ne bundle. Než
  // odpoví (nebo když neodpoví), drží se to, pro co má doc web text.
  useEffect(() => {
    const controller = new AbortController();
    void fetchDocLanguages(controller.signal).then(setLanguages);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Akcent se po přepnutí motivu NEPŘEPOČÍTÁVÁ a nemá s ním žádnou
  // vazbu: každá rodina má vlastní světlý i tmavý blok a vybírá mezi
  // nimi kaskáda. Proto je tenhle efekt závislý jen na ``accent``.
  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  // `ingot.html` má v kódu `lang="cs"`, protože v tu chvíli ještě žádná
  // volba není. Po přepnutí by to ale byla lež, kterou nikdo neuvidí a
  // odečítač obrazovky na ni doplatí: anglický text čtený českou
  // výslovností je nesrozumitelný.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const sections = sectionsOf(page, lang);
  const options = languages.options;

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <div className="w-48 shrink-0 space-y-6">
        <p className="text-sm font-semibold text-ink">Ingot UI Kit</p>
        <IngotSideNav
          label={pick(CHROME.guides, lang)}
          items={navItems(GUIDE_ENTRIES, page, lang)}
        />
        <IngotSideNav
          label={pick(CHROME.components, lang)}
          items={navItems(COMPONENT_ENTRIES, page, lang)}
        />

        <div className="space-y-3 border-t border-border pt-4">
          {/* Jediný jazyk = přepínat není co. Ovládací prvek s jednou
              volbou jen zabírá místo a slibuje volbu, která neexistuje. */}
          {options.length > 1 && (
            <label className="block text-xs text-ink-3">
              <span className="mb-1 block">{pick(CHROME.language, lang)}</span>
              <select
                className="w-full rounded border border-border-strong bg-surface px-2 py-1 text-sm text-ink"
                value={lang}
                onChange={(event) => {
                  const next = event.target.value as DocLang;
                  setLang(next);
                  writeStoredLang(next);
                }}
                data-testid="docs-lang"
              >
                {options.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block text-xs text-ink-3">
            <span className="mb-1 block">{pick(CHROME.theme, lang)}</span>
            <select
              className="w-full rounded border border-border-strong bg-surface px-2 py-1 text-sm text-ink"
              value={theme}
              onChange={(event) => {
                const next = event.target.value as ThemeChoice;
                setTheme(next);
                writeStoredTheme(next);
              }}
              data-testid="docs-theme"
            >
              {THEME_CHOICES.map((choice) => (
                <option key={choice} value={choice}>
                  {choice === "light"
                    ? pick(CHROME.themeLight, lang)
                    : choice === "dark"
                      ? pick(CHROME.themeDark, lang)
                      : pick(CHROME.themeSystem, lang)}
                </option>
              ))}
            </select>
          </label>

          {/* Slovník Jednoduše/Expert. V aplikaci je zdrojem pravdy účet
              (ui_dictionary) — doc web přihlášení nemá, takže volba žije
              jen v prohlížeči, stejně jako motiv a akcent. */}
          <label className="block text-xs text-ink-3">
            <span className="mb-1 block">{pick(CHROME.dictionary, lang)}</span>
            <select
              className="w-full rounded border border-border-strong bg-surface px-2 py-1 text-sm text-ink"
              value={dictionary}
              onChange={(event) =>
                setDictionaryMode(event.target.value as DictionaryMode)
              }
              data-testid="docs-dictionary"
            >
              {DICTIONARY_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === "simple"
                    ? pick(CHROME.dictionarySimple, lang)
                    : mode === "expert"
                      ? pick(CHROME.dictionaryExpert, lang)
                      : pick(CHROME.dictionaryBoth, lang)}
                </option>
              ))}
            </select>
          </label>

          <div className="block text-xs text-ink-3">
            <span className="mb-1 block">{pick(CHROME.accent, lang)}</span>
            <AccentSwatches
              value={accent}
              onChange={(next) => {
                setAccent(next);
                writeStoredAccent(next);
              }}
              groupLabel={pick(CHROME.accent, lang)}
              optionLabel={(choice) =>
                `${pick(CHROME.accent, lang)} ${pick(
                  CHROME[ACCENT_LABELS[choice]],
                  lang,
                )}`
              }
            />
          </div>
        </div>
      </div>

      <main className="min-w-0 flex-1 space-y-8">
        <IngotPageHeader
          title={titleOf(page, lang)}
          description={summaryOf(page, lang)}
          titleAdornment={
            page.kind === "component" ? (
              <span className="flex items-center gap-2">
                <IngotBadge
                  tone={page.doc.status === "stable" ? "ok" : "warn"}
                  testId="docs-status"
                >
                  {page.doc.status === "stable"
                    ? pick(CHROME.statusStable, lang)
                    : pick(CHROME.statusBeta, lang)}
                </IngotBadge>
                <IngotBadge testId="docs-version">
                  {`v${page.doc.version}`}
                </IngotBadge>
              </span>
            ) : undefined
          }
        />

        {sections.map((section) => (
          <IngotSection key={section.id} id={section.id} title={section.title}>
            {section.body}
          </IngotSection>
        ))}

        <PagerFooter page={page} lang={lang} />
      </main>

      <aside aria-label={pick(CHROME.onThisPage, lang)} className="w-44 shrink-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-3">
          {pick(CHROME.onThisPage, lang)}
        </p>
        <IngotList
          variant="plain"
          items={sections.map((section) => (
            <a
              key={section.id}
              className="text-ink-2 hover:text-ink"
              href={`#${section.id}`}
            >
              {section.title}
            </a>
          ))}
        />
      </aside>
    </div>
  );
}
