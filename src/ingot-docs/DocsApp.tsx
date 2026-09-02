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
  IngotDrawer,
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
import { DocSegmented } from "@/components/DocSegmented";
import { CHROME } from "@/ingot-docs/chrome";
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
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import pkg from "../../package.json";
import type {
  IngotDocPage,
  IngotExtraPropGroup,
  IngotGuideGroup,
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
        /* 🪤 Plocha ROLUJE, neořezává. Ukázka s vlastní pevnou šířkou
           (``IngotMegaMenu`` má 26rem) se na úzký výřez nevejde a pod
           ``overflow-hidden`` se prostě usekla — čtenář nevidí, že mu
           kus chybí. To je horší než posuvník: mlčky lže o tom, jak
           komponenta vypadá.

           ``mx-auto w-fit`` zvládne obojí naráz: ukázka, která se
           smrsknout umí, zůstane vystředěná; ta, která ne, roztáhne
           obal a rozjede posuvník od levého kraje. */
        <div
          className="overflow-x-auto bg-surface-2"
          data-testid="docs-demo-stage"
        >
          <div className="mx-auto w-fit p-4 md:p-8">
            <page.Demo />
          </div>
        </div>
      ) : (
        <IngotCode block lang="tsx" testId="docs-source">
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
  /**
   * Nadpis jako „cap“ z handoffu: mono verzálky s tečkovanou linkou za
   * textem. Sekce stránky komponenty ho mají, průvodci ne — u nich je
   * nadpis věta, ne štítek bloku.
   */
  cap?: boolean;
}

/** Nadpis sekce ve stylu cap — obsah pro ``IngotSection.title``. */
function CapTitle({ children }: { children: ReactNode }): JSX.Element {
  return (
    <span className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.07em] text-ink-4">
      {children}
      <span
        aria-hidden="true"
        className="flex-1 border-t border-dashed border-border"
      />
    </span>
  );
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
      // Callout-warn: přístupnost je ta část, kterou opsané komponenty
      // ztrácejí nejdřív — proto varovná plocha, ne běžný výčet.
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
      // Tokeny stojí za přístupností a před překlady, jak je řadí návrh:
      // obojí je to, co se při review komponenty kontroluje naposled.
      id: "tokeny",
      title: pick(CHROME.tokens, lang),
      cap: true,
      body: (
        <div className="space-y-3">
          <p className="text-sm text-ink-2">{pick(CHROME.tokensNote, lang)}</p>
          <div className="flex flex-wrap gap-1.5" data-testid="docs-tokens">
            {page.tokens.map((token) => (
              <IngotCode key={token}>{token}</IngotCode>
            ))}
          </div>
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
    : // Na stránce bez prefixu; v adrese i ve výpisech kódu zůstává
      // plné jméno exportu — viz ``naming.ts``.
      displayName(active.doc.name);
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

function navItem(
  entry: ActivePage,
  activeHref: string,
  lang: DocLang,
  /** Odlišuje sloupec (``docs-``) od draweru (``docs-drawer-``). */
  idPrefix: string,
  extra?: Partial<IngotNavItem>,
): IngotNavItem {
  const href = hrefOf(entry);
  return {
    href,
    label: titleOf(entry, lang),
    current: href === activeHref,
    testId: `${idPrefix}nav-${href.slice(2)}`,
    ...extra,
  };
}

const GUIDE_ENTRIES: readonly ActivePage[] = INGOT_GUIDE_PAGES.map((guide) => ({
  kind: "guide" as const,
  guide,
}));

const COMPONENT_ENTRIES: readonly ActivePage[] = INGOT_DOC_PAGES.map((doc) => ({
  kind: "component" as const,
  doc,
}));

/** Slug rozcestníku, pod který se v menu vnořují komponenty. */
const CATALOGUE_SLUG = "komponenty";

const GROUP_LABELS: Record<IngotGuideGroup, keyof typeof CHROME> = {
  system: "groupSystem",
  app: "groupApp",
  rules: "groupRules",
};

/**
 * Levé menu jako v handoffu: JEDEN číslovaný seznam rozdělený nadpisy
 * skupin, s komponentami vnořenými pod rozcestníkem.
 *
 * 🪤 **Číslo je pozice v ``INGOT_GUIDE_PAGES``, ne zapsaná hodnota.**
 * Ručně psaná čísla by se při vložení stránky doprostřed musela
 * přečíslovat celá — a to je práce, na kterou se zapomene přesně
 * jednou, načež menu čísluje 00, 01, 01, 03.
 *
 * Skupiny se odvozují průchodem v pořadí registru: nadpis se vloží
 * pokaždé, když se skupina změní. Stránky jedné skupiny proto musí
 * v registru stát vedle sebe — viz komentář u ``INGOT_GUIDE_PAGES``.
 */
function guideGroups(
  active: ActivePage,
  lang: DocLang,
  /**
   * Menu se kreslí dvakrát — ve sloupci (od ``md``) a v draweru (pod
   * ``md``). Skrytý sloupec je ``display:none``, takže z přístupnostního
   * stromu vypadne a odečítač slyší navigaci jen jednou; v DOM ale
   * zůstane, a stejný testid dvakrát je past na dotaz, který čeká jeden
   * prvek. Prefix je proto povinný, ne volitelný.
   */
  idPrefix: string,
): readonly { group: IngotGuideGroup; items: readonly IngotNavItem[] }[] {
  const activeHref = hrefOf(active);
  // Seznam komponent se vnořuje JEN když čtenář v sekci komponent stojí
  // (rozcestník nebo stránka komponenty) — pokyn vlastníka 2026-09-02.
  // Jednatřicet položek rozbalených na každé stránce dělalo z menu
  // rejstřík, ve kterém se ostatní skupiny musely hledat rolováním.
  const inComponents =
    active.kind === "component" ||
    (active.kind === "guide" && active.guide.slug === CATALOGUE_SLUG);
  const componentItems = inComponents
    ? COMPONENT_ENTRIES.map((entry) =>
        navItem(entry, activeHref, lang, idPrefix),
      )
    : undefined;

  const groups: { group: IngotGuideGroup; items: IngotNavItem[] }[] = [];
  GUIDE_ENTRIES.forEach((entry, index) => {
    if (entry.kind !== "guide") return;
    const group = entry.guide.group;
    if (groups.at(-1)?.group !== group) groups.push({ group, items: [] });
    groups.at(-1)!.items.push(
      navItem(entry, activeHref, lang, idPrefix, {
        ordinal: String(index).padStart(2, "0"),
        children:
          entry.guide.slug === CATALOGUE_SLUG ? componentItems : undefined,
      }),
    );
  });
  return groups;
}

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

  // Karty z handoffu: rámeček, mono štítek směru, hover se stínem.
  //
  // 🪤 ``min-w-0``, ne ``min-w-[200px]``. Dvě karty po 200 px s mezerou
  // si vynutí 416 px, což byl na mobilu jediný zbylý zdroj vodorovného
  // rolování CELÉHO dokumentu — širší než výřez znamená, že stránka
  // ujíždí do stran i tam, kde je jinak všechno v pořádku.
  const cardClass =
    "flex min-w-0 flex-1 flex-col gap-1 rounded-md border border-border bg-surface px-[18px] py-[14px] text-ink hover:border-border-strong hover:shadow-sm sm:max-w-[48%] sm:flex-none";

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between sm:gap-4">
      {prev ? (
        <a className={cardClass} href={hrefOf(prev)} data-testid="docs-prev">
          <span className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink-4">
            {pick(CHROME.prevPage, lang)}
          </span>
          <span className="truncate text-sm font-medium">
            {titleOf(prev, lang)}
          </span>
        </a>
      ) : (
        /* Vyrovnávací prvek drží „Další" u pravého kraje, když předchozí
           stránka není. Pod sebou (mobil) by ale jen přidal mezeru. */
        <span className="hidden sm:block" />
      )}
      {next ? (
        <a
          className={`${cardClass} sm:ml-auto sm:items-end sm:text-right`}
          href={hrefOf(next)}
          data-testid="docs-next"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink-4">
            {pick(CHROME.nextPage, lang)}
          </span>
          <span className="truncate text-sm font-medium">
            {titleOf(next, lang)}
          </span>
        </a>
      ) : (
        <span className="hidden sm:block" />
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
  /** Drawer s menu a přepínači — jen pod ``md``, viz hlavička. */
  const [navOpen, setNavOpen] = useState(false);

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

  // Výběr stránky drawer zavírá. Zůstat otevřený nad obsahem, který si
  // čtenář právě vybral, je to jediné, co po kliknutí v menu nechce.
  useEffect(() => {
    setNavOpen(false);
  }, [page]);

  // Otočení tabletu do šířky odkryje menu ve sloupci — drawer nad ním by
  // pak zakrýval rozvržení, které navigaci už má.
  //
  // ``matchMedia`` nemusí existovat (jsdom, hodně starý prohlížeč) a
  // Safari před 14 zná jen ``addListener``. Obojí se tu ošetřuje, protože
  // kit je vzor: rozbít se nesmí ani tam, kde se na moderní API nedá
  // spolehnout — bez nich se drawer prostě zavře ESC nebo křížkem.
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
   * Motiv, jazyk a akcent. Stojí v liště (od ``md``) i v draweru (pod
   * ``md``), kde se skládají pod sebe — v jedné řadě by se na 375 px
   * zalomily do druhého řádku a přilepená lišta by ukusovala šestinu
   * obrazovky.
   *
   * ``idPrefix`` odděluje testid obou vykreslení: stejný testid dvakrát
   * v DOM je past na dotaz, který čeká jeden prvek.
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
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
          {pick(CHROME.accent, lang)}
        </span>
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
      {stacked ? null : separator}
      <DocSegmented
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
      {/* Jediný jazyk = přepínat není co. Ovládací prvek s jednou
          volbou jen zabírá místo a slibuje volbu, která neexistuje. */}
      {options.length > 1 && (
        <>
          {stacked ? null : separator}
          <DocSegmented
            options={options.map((option) => ({
              value: option.code,
              label: option.code.toUpperCase(),
            }))}
            value={lang}
            onChange={(next) => {
              setLang(next as DocLang);
              writeStoredLang(next as DocLang);
            }}
            label={pick(CHROME.language, lang)}
            testId={`${idPrefix}lang`}
          />
        </>
      )}
      {/* 🪤 Slovník Jednoduše/Expert tu SCHVÁLNĚ není. Ovládá jedinou
          tabulku na stránce Překlady, takže vedle motivu, jazyka a
          akcentu — voleb platných pro celý web — sliboval dopad, který
          nemá. Přepínač proto stojí u té tabulky. */}
    </div>
  );

  /** Skupiny levého menu. Kreslí se do sloupce i do draweru. */
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
    <div className="min-h-screen">
      {/* Horní lišta z handoffu: značka a verze vlevo, akcent / motiv /
          jazyk vpravo. Sticky, aby přepínače neutekly se scrollem dlouhé
          stránky.

          ``docs-topbar`` (globals.css) drží sklo — průsvitná plocha
          s blurem, bílá ve světlém motivu a tmavá v tmavém. */}
      <header className="docs-topbar sticky top-0 z-40 flex items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 md:px-6">
        {/* Logo nese celý název („INGOT UI KIT"), takže textový brand
            vedle něj by ho jen zopakoval — zbyla verze jako popisek.

            Dvě varianty, ne filtr: wordmark je skoro černý a na tmavém
            skle by zmizel, ale ``invert`` by s ním obrátil i modrou.
            Tmavá varianta překlápí jen inkoust a ztlumený obrys, modrý
            akcent zůstává modrý. Popisek mají obě: nevidomý ho uslyší
            jednou, protože tu skrytou vyřadí ``display:none`` z
            přístupnostního stromu. */}
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
        {/* Verze a značka se přestěhovaly do mini patičky dole
            (pokyn vlastníka 2026-09-02) — hlavička nese jen ovládání. */}
        <span className="flex-1" aria-hidden="true" />

        {/* Od ``md`` v liště, pod ``md`` v draweru. Pět akcentů, tři
            motivy a dva jazyky vedle sebe potřebují přes 400 px; na
            375px displeji se zalomily do druhé řady a přilepená lišta
            pak ukusovala 98–125 px, tedy šestinu obrazovky. */}
        <div className="hidden md:block">
          {chromeControls(false, "docs-")}
        </div>

        {/* 🪤 Tlačítko je pod ``md`` JEDINÁ cesta mezi stránkami — levé
            menu je tam skryté. Skrýt menu bez něj neznamená horší
            navigaci, ale žádnou. */}
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

      {/* Menu i přepínače pod ``md``. Drawer je primitivum kitu, takže
          past focusu, ESC, zámek rolování i portál nad stacking kontexty
          přicházejí s ním — doc web tím sám sebe učí, místo aby si
          postranní panel ručně skládal. */}
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

      {/* 🪤 Sloupce se PŘIDÁVAJÍ, nezmenšují. Do KAN-XXX tu stály tři
          natvrdo bez jediného breakpointu: menu 224 + rejstřík 176 +
          dvě mezery 64 + odsazení 32 = 496 px pevné šířky, které padly
          dřív než první znak. Prostřední sloupec je ``flex-1
          min-w-0``, takže se místo přetečení poslušně smrskl na NULU
          a vysázel text mimo sebe — na 390px displeji jedno slovo na
          řádek přes obsah rejstříku.

          Prahy nejsou od oka. Čtecí sloupec drží aspoň 360 px, aby řádek
          nesl 45–75 znaků:
          * ``md`` (768) — menu 224 + 64 chrome nechá obsahu 480 px.
          * ``lg`` (1024) — a rejstřík 176 + 32 nechá pořád 528 px.
          Pod ``md`` je menu v draweru a rejstřík se vypouští: na
          jednosloupcové stránce je obsah stejně hned pod ním. */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* Menu stojí na ploše stránky, ne na kartě: kartou je až
            aktivní položka, a dvě vrstvy nad sebou by ji zploštily.

            ``sticky`` s vlastním rolováním: seznam komponent je delší
            než výřez, takže bez něj se menu odroluje pryč a čtenář se
            k jiné stránce dostane až zpátky nahoru. ``IngotPageLayout``
            to tak dělá taky — doc web nemá popírat primitivum, které
            o kus dál vyučuje. */}
        {/* 🪤 ``self-start`` je pro ``sticky`` podmínka, ne kosmetika:
            roztažená položka flexu je vysoká jako celý řádek, takže
            nemá kam přilnout a ``sticky`` tiše nedělá nic. */}
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
                {/* Tóny podle handoffu: stav neutrální (beta varovný),
                    verze akcentová. */}
                <IngotBadge
                  tone={page.doc.status === "stable" ? "neutral" : "warn"}
                  testId="docs-status"
                >
                  {page.doc.status === "stable"
                    ? pick(CHROME.statusStable, lang)
                    : pick(CHROME.statusBeta, lang)}
                </IngotBadge>
                <IngotBadge tone="accent" testId="docs-version">
                  {`v${page.doc.version}`}
                </IngotBadge>
                {/* Selektor je jediné jméno, kterým se o prvku dá bavit
                    s designérem — jméno exportu zná jen kód. */}
                <IngotCode testId="docs-tag">{page.doc.tag}</IngotCode>
              </span>
            ) : undefined
          }
        />

          {sections.map((section) => (
            <IngotSection
              key={section.id}
              id={section.id}
              title={
                section.cap ? (
                  <CapTitle>{section.title}</CapTitle>
                ) : (
                  section.title
                )
              }
            >
              {section.body}
            </IngotSection>
          ))}

          <PagerFooter page={page} lang={lang} />
        </main>

        {/* Rejstřík je až třetí sloupec (od ``lg``). Pod ním by ukusoval
            208 px z šířky, kterou potřebuje text — a na jednosloupcové
            stránce stejně jen opakuje nadpisy, které jsou hned pod ním. */}
        <aside
          aria-label={pick(CHROME.onThisPage, lang)}
          className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-44 shrink-0 self-start overflow-y-auto border-l border-border pl-4 lg:block"
        >
          <p className="mb-3 font-mono text-[9.5px] font-medium uppercase tracking-[0.11em] text-ink-4">
            {pick(CHROME.onThisPage, lang)}
          </p>
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

      {/* Mini patička (pokyn vlastníka 2026-09-02): čára přes CELOU
          šířku, nízká, kraje od sebe — verze vlevo u okraje, pill
          s logem Forgmaticu vpravo u okraje. Verzi píše release
          workflow do package.json; ručně psané číslo tu lhalo. */}
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-4 py-2.5 md:px-6">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
          Ingot UI Kit · v{pkg.version}
        </span>
        <a
          href="https://forgmatic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3 hover:border-border-strong hover:text-ink"
          data-testid="docs-footer-forgmatic"
        >
          developed for
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
