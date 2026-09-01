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
 * V aplikaci je zdrojem pravdy účet (``AuthMe.ui_dictionary``) — tutéž
 * volbu čte i ``IngotPageHint.level``, proto sdílejí hodnoty
 * ``simple|expert|both``. Doc web přihlášení nemá, takže volba žije jen
 * v prohlížeči, stejně jako motiv a akcent (viz ``DocsApp``).
 *
 * 🪤 Kit sám nepřekládá nic (viz stránka Překlady) — proto tenhle modul
 * bydlí v ``ingot-docs``, ne v ``@/ingot``.
 */
import { useSyncExternalStore } from "react";

import type { DocLang, Localized } from "@/ingot-docs/lang";

export const DICTIONARY_MODES = ["simple", "expert", "both"] as const;

/** Táž množina hodnot jako ``AuthMe.ui_dictionary`` a ``IngotPageHint.level``. */
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

const DICTIONARY_STORAGE_KEY = "forgmatic.ingot-docs.dictionary";

/** Uložená volba, nebo výchozí ``both``, když žádná (platná) není. */
export function readStoredDictionaryMode(): DictionaryMode {
  try {
    const raw = window.localStorage.getItem(DICTIONARY_STORAGE_KEY);
    return isDictionaryMode(raw) ? raw : DEFAULT_DICTIONARY_MODE;
  } catch {
    // localStorage umí házet (privátní režim, zakázané cookies).
    return DEFAULT_DICTIONARY_MODE;
  }
}

/**
 * Miniaturní sdílený stav volby.
 *
 * Volbu čte přepínač ve skořápce doc webu I živá ukázka na stránce
 * Překlady. Kdyby si každý držel vlastní ``useState`` nad localStorage,
 * přepnutí na jednom místě by se na druhém neprojevilo do reloadu —
 * proto jeden modulový stav a ``useSyncExternalStore``.
 */
let currentMode: DictionaryMode | null = null;
const listeners = new Set<() => void>();

function getMode(): DictionaryMode {
  if (currentMode === null) currentMode = readStoredDictionaryMode();
  return currentMode;
}

export function setDictionaryMode(mode: DictionaryMode): void {
  currentMode = mode;
  try {
    window.localStorage.setItem(DICTIONARY_STORAGE_KEY, mode);
  } catch {
    // Nefatální — volba jen nepřežije reload.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Aktuální režim slovníku; překreslí se po každém ``setDictionaryMode``. */
export function useDictionaryMode(): DictionaryMode {
  return useSyncExternalStore(subscribe, getMode, getMode);
}
