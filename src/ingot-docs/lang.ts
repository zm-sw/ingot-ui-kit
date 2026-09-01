/**
 * Jazyky doc webu (KAN-627).
 *
 * ## Proč tu je seznam, když „natvrdo napsaný seznam je chyba“
 *
 * Jsou to dvě různé otázky a pletou se snadno:
 *
 * 1. **Které jazyky platforma nabízí?** To je *politika* a rozhoduje o ní
 *    vlastník za běhu (registr jazyků v administraci). Natvrdo napsaný
 *    seznam by tady byl chyba, a taky tu žádný není — čte se z API, viz
 *    ``platformLanguages.ts``.
 * 2. **Pro které jazyky má doc web obsah?** To je *inventura*. Doc web je
 *    statická stránka: text buď v bundlu je, nebo není, a žádné API na tom
 *    nic nezmění. Tenhle soubor odpovídá na druhou otázku.
 *
 * Nabídnou se jedině jazyky, které projdou **oběma** — platforma je má
 * zapnuté A doc web pro ně má text. Přepínač, který přepne na jazyk bez
 * obsahu, je horší než přepínač, který ten jazyk nenabídne.
 *
 * ## Typ to vynucuje, ne domluva
 *
 * ``Localized<T>`` je ``Record<DocLang, T>``, takže přidat kód do
 * ``DOC_LANGS`` znamená, že ``tsc`` odmítne **každý** text, který v tom
 * jazyce chybí. Jazyk se tedy nedá slíbit, aniž by se napsal — a to je
 * přesně ta půlka, kterou próza uhlídat neumí.
 */

/** Jazyky, pro které tenhle bundle NESE text. Inventura, ne politika. */
export const DOC_LANGS = ["cs", "en"] as const;

export type DocLang = (typeof DOC_LANGS)[number];

/**
 * Hodnota, která existuje v každém jazyce doc webu.
 *
 * ``Record``, ne ``Partial<Record>``: chybějící překlad má shodit
 * typecheck, ne se za běhu tiše propadnout na jinou řeč.
 */
export type Localized<T> = Readonly<Record<DocLang, T>>;

export function isDocLang(value: unknown): value is DocLang {
  return (
    typeof value === "string" && (DOC_LANGS as readonly string[]).includes(value)
  );
}

/**
 * Popisky pro případ, že platformu nejde zeptat.
 *
 * Nejsou to „ty správné“ popisky — ty vlastní platforma a přicházejí
 * z API i s vlastním pojmenováním. Tohle je jen to, co se ukáže, když
 * API neodpoví, aby přepínač nezmizel úplně.
 */
export const DOC_LANG_FALLBACK_LABELS: Localized<string> = {
  cs: "Čeština",
  en: "English",
};

const LANG_STORAGE_KEY = "forgmatic.ingot-docs.lang";

/** Uložená volba, nebo ``null``, když žádná (platná) není. */
export function readStoredLang(): DocLang | null {
  try {
    const raw = window.localStorage.getItem(LANG_STORAGE_KEY);
    return isDocLang(raw) ? raw : null;
  } catch {
    // localStorage umí házet (privátní režim, zakázané cookies).
    return null;
  }
}

export function writeStoredLang(lang: DocLang): void {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Nefatální — volba jen nepřežije reload.
  }
}

/**
 * Výchozí jazyk: uložená volba → jazyk prohlížeče → čeština.
 *
 * ``navigator.language`` může být ``cs-CZ``; bere se jen ta část před
 * pomlčkou, jinak by se ``cs-CZ`` nikdy netrefilo do ``cs``.
 */
export function initialLang(): DocLang {
  const stored = readStoredLang();
  if (stored) return stored;
  try {
    const preferred = navigator.language?.split("-")[0];
    if (isDocLang(preferred)) return preferred;
  } catch {
    // navigator nemusí být (SSR, exotický runtime).
  }
  return "cs";
}
