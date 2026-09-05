import { IngotCode, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * "Languages and formats" page — what a screen has to bear to survive
 * translation.
 *
 * **The formats table is the core of the page.** The Czech and English
 * forms of the same value placed side by side are the only thing that
 * convinces a screen author that "a date" is not one shape — a sentence
 * about it is read and forgotten.
 *
 * The doc web is a PUBLIC page. Internal prose does not belong here: no
 * issue keys, repository paths or guard names.
 */

function LengthAndPlurals({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Produkt běží česky a anglicky, s výhledem na němčinu a polštinu. Rozhraní se nepřekládá dodatečně — počítá se s tím už při rozvržení, protože překlad, který se nevejde, se opravuje v obrazovce, ne ve slovníku."
          : "The product runs in Czech and English, with German and Polish on the horizon. The interface is not translated as an afterthought — the layout allows for it from the start, because a translation that does not fit is fixed in the screen, not in the dictionary."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Německý překlad je až o 35 % delší než česká předloha. Rozvržení tu
                  délku musí unést beze změny počtu řádků, do kterých se vejde.
                </>,
                <>
                  Text se nezkracuje třemi tečkami. Uříznuté slovo vypadá jako chyba dat
                  a čtenář nemá jak zjistit, co v něm bylo.
                </>,
                <>
                  Tlačítka a hlavičky tabulek nemají pevnou šířku — šířka vzniká z
                  obsahu, jinak ji delší jazyk přeteče.
                </>,
                <>
                  Věta se nelepí z fragmentů. Celá věta je jeden klíč s proměnnou:{" "}
                  <IngotCode>{"{count} položek ve skladu"}</IngotCode>. Jiný jazyk
                  poskládá slova v jiném pořadí, a to lepení neumí.
                </>,
                <>
                  Čeština má tři tvary množného čísla: 1 / 2–4 / 5+. Každý počítaný
                  řetězec má všechny tři varianty; tvar „položek(y)“ se nepoužívá.
                </>,
              ]
            : [
                <>
                  A German translation runs up to 35 % longer than the Czech original.
                  The layout has to take that length without changing how many lines it
                  fits.
                </>,
                <>
                  Text is never truncated with an ellipsis. A cut-off word looks like a
                  data error, and the reader has no way to find out what was in it.
                </>,
                <>
                  Buttons and table headers carry no fixed width — the width comes from
                  the content, otherwise a longer language overflows it.
                </>,
                <>
                  A sentence is never glued from fragments. The whole sentence is one
                  key with a variable: <IngotCode>{"{count} items in stock"}</IngotCode>
                  . Another language assembles the words in another order, and gluing
                  cannot do that.
                </>,
                <>
                  Czech has three plural forms: 1 / 2–4 / 5+. Every counted string
                  carries all three; a shape like “item(s)” is not used.
                </>,
              ]
        }
      />
    </div>
  );
}

interface FormatRow {
  kind: Localized<string>;
  cs: string;
  en: string;
}

const FORMATS: readonly FormatRow[] = [
  {
    kind: { cs: "Datum", en: "Date" },
    cs: "26. 05. 2026",
    en: "May 26, 2026",
  },
  {
    kind: { cs: "Čas", en: "Time" },
    cs: "14:35",
    en: "2:35 PM",
  },
  {
    kind: { cs: "Číslo", en: "Number" },
    cs: "128 640,50",
    en: "128,640.50",
  },
  {
    kind: { cs: "Měna", en: "Currency" },
    cs: "128 640 Kč",
    en: "€5,120.00",
  },
  {
    kind: { cs: "Jednotka", en: "Unit" },
    cs: "3,0 mm · 1 250 Kč/h",
    en: "0.12 in · €50/h",
  },
];

function formatColumns(lang: DocLang): readonly IngotColumn<FormatRow>[] {
  return [
    {
      key: "kind",
      header: lang === "cs" ? "Typ" : "Type",
      cell: (row) => row.kind[lang],
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "cs",
      header: lang === "cs" ? "Česky" : "Czech",
      cell: (row) => <IngotCode>{row.cs}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "en",
      header: lang === "cs" ? "Anglicky" : "English",
      cell: (row) => <IngotCode>{row.en}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
  ];
}

function Formats({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Táž hodnota vypadá v každém jazyce jinak — liší se oddělovač, pořadí i pozice symbolu. Proto se hodnota nikdy nesestavuje řetězcem v obrazovce."
          : "The same value looks different in every language — the separator, the order and the position of the symbol all change. That is why a value is never assembled as a string in a screen."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={formatColumns(lang)}
          rows={FORMATS}
          rowKey={(row) => row.kind.en}
          caption={lang === "cs" ? "Formáty hodnot" : "Value formats"}
          className="min-w-[34rem]"
          testId="docs-formats"
        />
      </div>
    </div>
  );
}

function NumbersAndCodes({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Čísla, měny a data formátuje <IngotCode>Intl.NumberFormat</IngotCode>{" "}
                  a spol. podle jazyka uživatele — nikdy ruční záměna tečky za čárku,
                  která se rozejde s prvním dalším jazykem.
                </>,
                <>
                  Mezi číslem a jednotkou stojí nezlomitelná mezera (
                  <IngotCode>&amp;nbsp;</IngotCode>), aby se „12 kg“ nerozdělilo přes
                  konec řádku.
                </>,
                <>
                  Mono text používá tabulární číslice, takže číslice mají stejnou šířku
                  a čísla ve sloupci sedí pod sebou.
                </>,
                <>
                  Kódy se nepřekládají a zůstávají v monu beze změny: identifikátory
                  typu <IngotCode>materials</IngotCode>, čísla záznamů typu{" "}
                  <IngotCode>OBJ-2418</IngotCode> a kódy zemí typu{" "}
                  <IngotCode>CZ</IngotCode>. Přeložený identifikátor přestane odpovídat
                  tomu, co je v datech.
                </>,
              ]
            : [
                <>
                  Numbers, currencies and dates are formatted by{" "}
                  <IngotCode>Intl.NumberFormat</IngotCode> and friends according to the
                  user's language — never by swapping a point for a comma by hand, which
                  breaks with the next language added.
                </>,
                <>
                  A non-breaking space (<IngotCode>&amp;nbsp;</IngotCode>) stands
                  between a number and its unit, so “12 kg” does not split across a line
                  break.
                </>,
                <>
                  Mono text uses tabular figures, so every digit has the same width and
                  numbers line up down a column.
                </>,
                <>
                  Codes are not translated and stay in mono unchanged: identifiers such
                  as <IngotCode>materials</IngotCode>, record numbers such as{" "}
                  <IngotCode>OBJ-2418</IngotCode> and country codes such as{" "}
                  <IngotCode>CZ</IngotCode>. A translated identifier stops matching what
                  is in the data.
                </>,
              ]
        }
      />
    </div>
  );
}

interface TermRow {
  termKey: string;
  simple: Localized<string>;
  expert: Localized<string>;
}

const TERMS: readonly TermRow[] = [
  {
    termKey: "nesting",
    simple: { cs: "Rozmístění dílů na plech", en: "Laying parts out on a sheet" },
    expert: { cs: "Nesting", en: "Nesting" },
  },
  {
    termKey: "setup_time",
    simple: { cs: "Příprava stroje", en: "Machine preparation" },
    expert: { cs: "Seřizovací čas", en: "Setup time" },
  },
  {
    termKey: "tolerance_class",
    simple: { cs: "Přesnost výroby", en: "Manufacturing precision" },
    expert: { cs: "Třída tolerance", en: "Tolerance class" },
  },
];

function termColumns(lang: DocLang): readonly IngotColumn<TermRow>[] {
  return [
    {
      key: "termKey",
      header: lang === "cs" ? "Klíč" : "Key",
      cell: (row) => <IngotCode>{row.termKey}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "simple",
      header: lang === "cs" ? "Jednoduše" : "Simple",
      cell: (row) => row.simple[lang],
    },
    {
      key: "expert",
      header: "Expert",
      cell: (row) => row.expert[lang],
    },
  ];
}

function DictionaryBody({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Aplikace mluví dvěma slovníky: jednoduchým pro každodenní práci a expertním pro ty, kdo chtějí přesné odborné pojmy. Volba platí všude — proto se pojmy neberou z hlavy, ale ze společného slovníku pod jedním klíčem, aby táž věc nebyla na dvou obrazovkách pojmenovaná dvakrát jinak."
          : "The application speaks two vocabularies: a simple one for everyday work and an expert one for those who want precise domain terms. The choice applies everywhere — which is why terms come from a shared dictionary under one key, not from memory, so the same thing is not named two ways on two screens."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={termColumns(lang)}
          rows={TERMS}
          rowKey={(row) => row.termKey}
          caption={lang === "cs" ? "Slovník pojmů" : "Term dictionary"}
          className="min-w-[34rem]"
          testId="docs-dictionary"
        />
      </div>
      <p>
        {lang === "cs"
          ? "Přepínač jazyka i slovníku žije v menu účtu, ne v hlavičce stránky — je to nastavení člověka, ne obrazovky. Volba se proto pamatuje na účtu, ne v prohlížeči: na jiném počítači ji uživatel nastavovat znovu nemusí."
          : "The switcher for both the language and the vocabulary lives in the account menu, not in the page header — it is a setting of the person, not of the screen. The choice is therefore remembered by the account, not by the browser: on another machine the user does not have to set it again."}
      </p>
    </div>
  );
}

export const FormatsGuide: IngotGuidePage = {
  slug: "jazyky-a-formaty",
  group: "rules",
  title: { cs: "Jazyky a formáty", en: "Languages and formats" },
  summary: {
    cs: "Delší překlady, tři tvary množného čísla, česká a anglická podoba dat a čísel, kódy bez překladu a společný slovník pojmů.",
    en: "Longer translations, three plural forms, the Czech and English shape of dates and numbers, codes that are never translated, and the shared term dictionary.",
  },
  sections: [
    {
      id: "delka-a-plural",
      title: { cs: "Délka a množné číslo", en: "Length and plurals" },
      body: {
        cs: <LengthAndPlurals lang="cs" />,
        en: <LengthAndPlurals lang="en" />,
      },
    },
    {
      id: "formaty",
      title: { cs: "Formáty", en: "Formats" },
      body: {
        cs: <Formats lang="cs" />,
        en: <Formats lang="en" />,
      },
    },
    {
      id: "cisla-a-kody",
      title: { cs: "Čísla a kódy", en: "Numbers and codes" },
      body: {
        cs: <NumbersAndCodes lang="cs" />,
        en: <NumbersAndCodes lang="en" />,
      },
    },
    {
      id: "slovnik",
      title: { cs: "Slovník", en: "The dictionary" },
      body: {
        cs: <DictionaryBody lang="cs" />,
        en: <DictionaryBody lang="en" />,
      },
    },
  ],
};
