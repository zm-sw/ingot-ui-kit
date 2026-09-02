import { IngotCode, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Jazyky a formáty“ — co musí obrazovka unést, aby přežila
 * překlad (KAN-663).
 */

function LengthAndPlurals({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Překlad bývá o třetinu delší než originál — rozvržení musí
                  unést text delší o 35 %, aniž by se rozbilo nebo uřízlo
                  slovo v půlce.
                </>,
                <>
                  Čeština má tři tvary množného čísla: 1 položka, 2 položky,
                  5 položek. Text s počtem se proto nikdy neskládá lepením
                  čísla a slova — tvar vybírá knihovna překladů.
                </>,
                <>
                  Popisky tlačítek a nadpisy se překládají celé věty — ne po
                  slovech, která by se v jiném jazyce poskládala v jiném
                  pořadí.
                </>,
              ]
            : [
                <>
                  A translation tends to run a third longer than the
                  original — the layout must take text 35 % longer without
                  breaking or cutting a word in half.
                </>,
                <>
                  Czech has three plural forms: 1 item, 2 items, 5 items in
                  three different shapes. Text with a count is therefore
                  never glued from a number and a word — the translation
                  library picks the form.
                </>,
                <>
                  Button labels and headings are translated as whole
                  sentences — not word by word, which another language would
                  assemble in another order.
                </>,
              ]
        }
      />
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
                  Čísla, měny a data formátuje{" "}
                  <IngotCode>Intl.NumberFormat</IngotCode> a spol. podle
                  jazyka uživatele — desetinná čárka versus tečka není věc
                  názoru, ale národního prostředí.
                </>,
                <>
                  Mezi číslem a jednotkou stojí nezlomitelná mezera
                  (<IngotCode>&amp;nbsp;</IngotCode>), aby se „12 kg“
                  nerozdělilo přes konec řádku.
                </>,
                <>
                  Kódy se nepřekládají: identifikátory, klíče záznamů a
                  technické hodnoty vypadají ve všech jazycích stejně a sází
                  se monem.
                </>,
              ]
            : [
                <>
                  Numbers, currencies and dates are formatted by{" "}
                  <IngotCode>Intl.NumberFormat</IngotCode> and friends
                  according to the user's language — decimal comma versus
                  point is not an opinion but a locale.
                </>,
                <>
                  A non-breaking space (<IngotCode>&amp;nbsp;</IngotCode>)
                  stands between a number and its unit, so “12 kg” does not
                  split across a line break.
                </>,
                <>
                  Codes are not translated: identifiers, record keys and
                  technical values look the same in every language and are
                  set in mono.
                </>,
              ]
        }
      />
    </div>
  );
}

function DictionaryBody({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Aplikace mluví dvěma slovníky: jednoduchým pro každodenní práci a expertním pro ty, kdo chtějí přesné odborné pojmy. Volba je na uživateli a platí všude — proto se pojmy neberou z hlavy, ale ze společného slovníku, aby „šarže“ nebyla na jedné obrazovce „dávka“."
          : "The application speaks two vocabularies: a simple one for everyday work and an expert one for those who want precise domain terms. The choice belongs to the user and applies everywhere — which is why terms come from the shared dictionary, not from memory, so the same thing is not named two ways on two screens."}
      </p>
    </div>
  );
}

export const FormatsGuide: IngotGuidePage = {
  slug: "jazyky-a-formaty",
  group: "rules",
  title: { cs: "Jazyky a formáty", en: "Languages and formats" },
  summary: {
    cs: "Delší překlady, tři tvary množného čísla, formátování čísel podle prostředí a kódy, které se nepřekládají.",
    en: "Longer translations, three plural forms, locale-aware number formatting, and codes that are never translated.",
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
