import { IngotBadge, IngotCode, IngotList } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import type { DocLang } from "@/ingot-docs/lang";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Rozcestník komponent — stránka, pod kterou se v levém menu vnořují
 * jednotlivá primitiva.
 *
 * 🪤 **Dlaždice se generují z registru, ne z ručního výčtu.** Katalog
 * opsaný sem by byl druhá pravda o tom, co kit obsahuje, a rozešel by se
 * s první při prvním přidaném primitivu — přesně ta třída chyby, kvůli
 * které stránky renderují živé komponenty místo obrázků.
 *
 * ⚠️ ``INGOT_DOC_PAGES`` se čte AŽ PŘI VYKRESLENÍ, ne při načtení
 * modulu. Registr tenhle soubor importuje (je v jeho seznamu), takže
 * čtení na úrovni modulu by sáhlo na vazbu, kterou registr v tu chvíli
 * ještě nemá naplněnou.
 */

function ComponentCatalogue({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INGOT_DOC_PAGES.map((page) => (
        <a
          key={page.name}
          href={`#/${page.name}`}
          className="flex flex-col gap-2 rounded-md border border-border bg-surface px-[18px] py-4 text-ink hover:border-border-strong hover:shadow-md"
          data-testid={`docs-catalogue-${page.name}`}
        >
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-medium tracking-tight">
              {page.name}
            </span>
            <IngotBadge tone={page.status === "stable" ? "neutral" : "warn"}>
              {page.status === "stable"
                ? CHROME.statusStable[lang]
                : CHROME.statusBeta[lang]}
            </IngotBadge>
            {/* Verze vpravo, jak ji řadí návrh — dlaždice nese čtyři
                údaje, ne dva. */}
            <span className="ml-auto font-mono text-[11px] text-ink-4">
              {`v${page.version}`}
            </span>
          </span>
          <span className="text-[13px] leading-[1.55] text-ink-3">
            {page.summary[lang]}
          </span>
          <IngotCode>{page.tag}</IngotCode>
        </a>
      ))}
    </div>
  );
}

function CatalogueIntro({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Každá komponenta má vlastní stránku: živou ukázku, kdy ji použít a kdy ne, vlastnosti pro vývojáře, přístupnost a tokeny, na kterých stojí. Vedle názvu stojí dva štítky — stav a verze — a oba jsou slib, ne dekorace."
          : "Every component has its own page: a live demo, when to use it and when not to, properties for developers, accessibility, and the tokens it stands on. Two badges sit next to the name — status and version — and both are a promise, not decoration."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  <IngotBadge>stabilní</IngotBadge> — rozhraní se nemění bez
                  ohlášení. Změna, která by rozbila volající kód, je tu
                  vzácná a záměrná: přijde s vyšší verzí a s upravenými
                  místy použití.
                </>,
                <>
                  <IngotBadge tone="warn">beta</IngotBadge> — tvar se ještě
                  hledá. Změny, které rozbijí volající kód, se tady čekají —
                  a přesně proto ten štítek je: říká, jestli už se na
                  komponentu dá stavět.
                </>,
                <>
                  Verze se zvedá pokaždé, když se komponenta změní. Změněné
                  chování pod nezměněnou verzí je tichá lež vůči každému,
                  kdo si komponentu už zabudoval.
                </>,
                <>
                  Pořadí v menu jde od nejmenšího stavebního kamene ke
                  složeným celkům, ne abecedně.
                </>,
                <>
                  Chybí-li ti primitivum, přidá se do kitu — nevzniká uvnitř
                  obrazovky.
                </>,
              ]
            : [
                <>
                  <IngotBadge>stable</IngotBadge> — the interface does not
                  change without notice. A change that would break callers is
                  rare and deliberate: it arrives with a higher version and
                  with the call sites already updated.
                </>,
                <>
                  <IngotBadge tone="warn">beta</IngotBadge> — the shape is
                  still being found. Breaking changes are expected here, and
                  that is exactly what the badge is for: it says whether you
                  can build on it yet.
                </>,
                <>
                  The version moves every time the component changes. Changed
                  behaviour under an unchanged version is a silent lie to
                  everyone who already built on it.
                </>,
                <>
                  The order in the menu runs from the smallest building block
                  to composed wholes, not alphabetically.
                </>,
                <>
                  If a primitive is missing, it is added to the kit — it is
                  not born inside a screen.
                </>,
              ]
        }
      />
    </div>
  );
}

/**
 * Skladba stránky komponenty — pevné pořadí bloků a tři pohledy, které
 * z něj čtou (handoff „Komponenty“, sekce „Skladba stránky komponenty“).
 *
 * Pořadí není estetika: drží se, aby se stránka dala číst napřeskáčku —
 * každý ví, kde jeho blok začíná, a nemusí ji projít celou.
 */
function PageLayout({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const order = cs
    ? [
        "název se stavem a verzí",
        "jedna věta",
        "živá ukázka a kód",
        "kdy použít / kdy ne",
        "vlastnosti",
        "přístupnost",
        "tokeny",
        "překlady",
      ]
    : [
        "the name with its status and version",
        "one sentence",
        "the live demo and its code",
        "when to use it and when not to",
        "properties",
        "accessibility",
        "tokens",
        "translations",
      ];
  const views = cs
    ? [
        {
          key: "design",
          eyebrow: "Pro designéra",
          text: "Ukázka a sekce kdy použít / kdy ne. Rozhodnutí, ne katalog variant.",
        },
        {
          key: "dev",
          eyebrow: "Pro vývojáře",
          text: "Vlastnosti a živý kód ukázky — přesně ten, který se na stránce vykresluje.",
        },
        {
          key: "review",
          eyebrow: "Pro review",
          text: "Přístupnost a seznam tokenů — podle nich se pozná, co změna tokenu rozbije.",
        },
      ]
    : [
        {
          key: "design",
          eyebrow: "For the designer",
          text: "The demo and the when-to-use section. A decision, not a catalogue of variants.",
        },
        {
          key: "dev",
          eyebrow: "For the developer",
          text: "The properties and the demo's live code — exactly the code the page renders.",
        },
        {
          key: "review",
          eyebrow: "For review",
          text: "Accessibility and the token list — they say what a token change would break.",
        },
      ];
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {cs
          ? "Pořadí bloků na stránce komponenty je pevné, aby se dala číst napřeskáčku — každý čtenář ví, kde jeho blok začíná."
          : "The order of blocks on a component page is fixed so that it can be read out of order — every reader knows where their block starts."}
      </p>
      <IngotList variant="ordered" items={order} />
      <p>
        {cs
          ? "Z toho pořadí čtou tři různí lidé tři různé části:"
          : "Three different readers take three different parts out of that order:"}
      </p>
      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {views.map((view) => (
          <div key={view.key} className="bg-surface p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
              {view.eyebrow}
            </span>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              {view.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ComponentsGuide: IngotGuidePage = {
  slug: "komponenty",
  group: "system",
  title: { cs: "Komponenty", en: "Components" },
  summary: {
    cs: "Rozcestník kitu — každé primitivum s jednou větou a stavem, na vlastní stránku se prokliká odsud i z menu.",
    en: "The kit's index — every primitive with one sentence and its status; each page is one click away from here or from the menu.",
  },
  sections: [
    {
      id: "prehled",
      title: { cs: "Přehled", en: "Overview" },
      body: {
        cs: <CatalogueIntro lang="cs" />,
        en: <CatalogueIntro lang="en" />,
      },
    },
    {
      id: "seznam",
      title: { cs: "Seznam", en: "The list" },
      body: {
        cs: <ComponentCatalogue lang="cs" />,
        en: <ComponentCatalogue lang="en" />,
      },
    },
    {
      id: "skladba",
      title: {
        cs: "Skladba stránky komponenty",
        en: "How a component page is built",
      },
      body: {
        cs: <PageLayout lang="cs" />,
        en: <PageLayout lang="en" />,
      },
    },
  ],
};
