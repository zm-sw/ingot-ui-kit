import { IngotBadge, IngotList } from "@/ingot";
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
          </span>
          <span className="text-[13px] leading-[1.55] text-ink-3">
            {page.summary[lang]}
          </span>
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
          ? "Každá komponenta má vlastní stránku: živou ukázku, kdy ji použít a kdy ne, vlastnosti pro vývojáře a přístupnost. Stav „stabilní“ znamená, že se rozhraní nemění bez ohlášení; „beta“ se ještě může měnit."
          : "Every component has its own page: a live demo, when to use it and when not to, properties for developers, and accessibility. The “stable” status means the interface does not change without notice; “beta” may still change."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
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
  ],
};
