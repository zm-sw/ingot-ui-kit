/**
 * Slovník Jednoduše / Expert (KAN-662).
 *
 * Uživatelská volba, která přepíná ODBORNÉ TERMÍNY: „Rozmístění dílů na
 * plech“ vs. „Nesting“. Tři režimy — ``simple`` (jednoduché opisy),
 * ``expert`` (odborné termíny), ``both`` (výchozí: expert termín a
 * jednoduchý opis v závorce za ním).
 *
 * ## Proč závorka, ne tooltip
 *
 * Režim „Obojí“ potřebuje formu a KAN-662 chce to rozhodnutí zapsané:
 * je to **závorka**, ne tooltip. Tooltip nefunguje na dotykové obrazovce,
 * odečítač obrazovky ho čte jen s extra ARIA drátováním a v tabulce se
 * nevejde do vyhledávání (Ctrl+F nenajde text, který není v DOM). Závorka
 * je delší, ale vidí ji každý — a „Obojí“ je režim právě pro čtenáře,
 * který si termíny teprve spojuje.
 *
 * ## Dva „překladové klíče“ na termín
 *
 * V aplikaci jsou to klíče ``term.<klíč>.simple`` / ``term.<klíč>.expert``
 * v jazykových souborech. Doc web žádné jazykové soubory nemá (text nese
 * bundle, viz ``lang.ts``), takže tady je táž struktura zapsaná typem:
 * termín má pole ``expert`` a ``simple``, obě ``Localized``. ``simple``
 * je nepovinné schválně — ne každý termín jednoduchý opis má, a chybějící
 * opis se za běhu propadá na expert variantu (testováno), nikdy na klíč.
 *
 * ## Kde volba bydlí
 *
 * In the product the account is the source of truth and the same choice
 * drives ``IngotPageHint.level``, which is why they share the values
 * ``simple|expert|both``. The doc web has no login, so the choice lives
 * only in the browser, like theme and accent (see ``DocsApp``).
 *
 * 🪤 Kit sám nepřekládá nic (viz stránka Překlady) — proto tenhle modul
 * bydlí v ``ingot-docs``, ne v ``@/ingot``.
 */
import { createStore } from "@/ingot/store";
import { readStorage, writeStorage } from "@/lib/storage";

import type { DocLang, Localized } from "@/ingot-docs/lang";

export const DICTIONARY_MODES = ["simple", "expert", "both"] as const;

/** The same set of values as ``IngotPageHint.level``. */
export type DictionaryMode = (typeof DICTIONARY_MODES)[number];

/** Výchozí režim podle specu: obojí. */
export const DEFAULT_DICTIONARY_MODE: DictionaryMode = "both";

export function isDictionaryMode(value: unknown): value is DictionaryMode {
  return (
    typeof value === "string" &&
    (DICTIONARY_MODES as readonly string[]).includes(value)
  );
}

/**
 * Jeden termín slovníku — dvojice variant, obě už přeložené.
 *
 * ``simple`` je nepovinné: termín bez jednoduchého opisu se ve všech
 * režimech ukazuje expertně. Opačný směr neexistuje schválně — expert
 * varianta je ta kanonická a povinná.
 */
export interface DictionaryTerm {
  expert: Localized<string>;
  simple?: Localized<string>;
}

/**
 * Registr termínů. Tři termíny ze specu jako důkaz konceptu.
 *
 * ## Jak přidat termín (strážný vzor)
 *
 * 1. Přidej klíč sem — ``expert`` povinně, ``simple`` jen pokud má termín
 *    opravdový jednoduchý opis (ne jen synonymum).
 * 2. ``as const satisfies`` níže vynutí, že každá varianta má všechny
 *    jazyky z ``DOC_LANGS`` — jazyk se nedá slíbit, aniž by se napsal.
 * 3. V textu pak volej ``termLabel(klíč, mode, lang)`` — nikdy nevpisuj
 *    variantu natvrdo, tím by se termín odpojil od volby uživatele.
 */
export const DICTIONARY_TERMS = {
  nesting: {
    expert: { cs: "Nesting", en: "Nesting" },
    simple: {
      cs: "Rozmístění dílů na plech",
      en: "Part layout on the sheet",
    },
  },
  setup_time: {
    expert: { cs: "Seřizovací čas", en: "Setup time" },
    simple: { cs: "Příprava stroje", en: "Machine preparation" },
  },
  tolerance_class: {
    expert: { cs: "Třída tolerance", en: "Tolerance class" },
    simple: { cs: "Přesnost výroby", en: "Manufacturing precision" },
  },
} as const satisfies Record<string, DictionaryTerm>;

export type DictionaryTermKey = keyof typeof DICTIONARY_TERMS;

/**
 * Vybere zobrazenou podobu termínu podle režimu.
 *
 * Fallback: termín bez ``simple`` varianty se v režimu ``simple`` ukáže
 * expertně a v režimu ``both`` bez závorky — nikdy prázdný řetězec,
 * nikdy klíč.
 */
export function termLabel(
  term: DictionaryTerm,
  mode: DictionaryMode,
  lang: DocLang,
): string {
  const expert = term.expert[lang];
  const simple = term.simple?.[lang];
  if (!simple) return expert;
  switch (mode) {
    case "simple":
      return simple;
    case "expert":
      return expert;
    case "both":
      return `${expert} (${simple})`;
  }
}

/** Stored choice, or the default ``both`` when there is no (valid) one. */
export function readStoredDictionaryMode(): DictionaryMode {
  const raw = readStorage("docsDictionary");
  return isDictionaryMode(raw) ? raw : DEFAULT_DICTIONARY_MODE;
}

/**
 * Miniaturní sdílený stav volby.
 *
 * Volbu čte přepínač ve skořápce doc webu I živá ukázka na stránce
 * Překlady. Kdyby si každý držel vlastní ``useState`` nad localStorage,
 * přepnutí na jednom místě by se na druhém neprojevilo do reloadu —
 * proto jeden modulový stav a ``useSyncExternalStore``.
 */
// Lazy initial value: localStorage is read on first use, not at module load.
const modeStore = createStore<DictionaryMode>(() => readStoredDictionaryMode());

export function setDictionaryMode(mode: DictionaryMode): void {
  modeStore.set(mode);
  writeStorage("docsDictionary", mode);
}

/** Current dictionary mode; re-renders after every ``setDictionaryMode``. */
export function useDictionaryMode(): DictionaryMode {
  return modeStore.use();
}
