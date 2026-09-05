/**
 * Simple / Expert dictionary.
 *
 * A user choice that switches TECHNICAL TERMS: "laying parts out on a
 * sheet" vs. "nesting". Three modes — ``simple`` (plain descriptions),
 * ``expert`` (technical terms), ``both`` (default: the expert term with
 * the plain description in parentheses after it).
 *
 * ## Why parentheses, not a tooltip
 *
 * The "Both" mode needs a form and the decision is recorded here: it is
 * **parentheses**, not a tooltip. A tooltip does not work on a touch
 * screen, a screen reader reads it only with extra ARIA wiring, and in a
 * table it escapes search (Ctrl+F does not find text that is not in the
 * DOM). Parentheses are longer, but everyone sees them — and "Both" is the
 * mode for exactly the reader who is still connecting the terms.
 *
 * ## Two "translation keys" per term
 *
 * In the application these are the keys ``term.<key>.simple`` /
 * ``term.<key>.expert`` in the language files. The doc web has no language
 * files (the bundle carries the text, see ``lang.ts``), so here the same
 * structure is written as a type: a term has ``expert`` and ``simple``
 * fields, both ``Localized``. ``simple`` is optional on purpose — not
 * every term has a plain description, and a missing one falls back to the
 * expert variant at runtime (tested), never to the key.
 *
 * ## Where the choice lives
 *
 * In the product the account is the source of truth and the same choice
 * drives ``IngotPageHint.level``, which is why they share the values
 * ``simple|expert|both``. The doc web has no login, so the choice lives
 * only in the browser, like theme and accent (see ``DocsApp``).
 *
 * The kit itself translates nothing (see the Translations page) — which is
 * why this module lives in ``ingot-docs``, not in ``@/ingot``.
 */
import { createStore } from "@/ingot/store";
import { readStorage, writeStorage } from "@/lib/storage";

import type { DocLang, Localized } from "@/ingot-docs/lang";

export const DICTIONARY_MODES = ["simple", "expert", "both"] as const;

/** The same set of values as ``IngotPageHint.level``. */
export type DictionaryMode = (typeof DICTIONARY_MODES)[number];

/** Default mode per the spec: both. */
export const DEFAULT_DICTIONARY_MODE: DictionaryMode = "both";

export function isDictionaryMode(value: unknown): value is DictionaryMode {
  return (
    typeof value === "string" &&
    (DICTIONARY_MODES as readonly string[]).includes(value)
  );
}

/**
 * One dictionary term — a pair of variants, both already translated.
 *
 * ``simple`` is optional: a term without a plain description shows the
 * expert form in every mode. The opposite direction does not exist on
 * purpose — the expert variant is the canonical, required one.
 */
export interface DictionaryTerm {
  expert: Localized<string>;
  simple?: Localized<string>;
}

/**
 * Term registry. Three terms from the spec as a proof of concept.
 *
 * ## How to add a term (the guarded pattern)
 *
 * 1. Add the key here — ``expert`` is required, ``simple`` only if the term
 *    has a genuine plain description (not just a synonym).
 * 2. ``as const satisfies`` below enforces that every variant has all the
 *    languages from ``DOC_LANGS`` — a language cannot be promised without
 *    being written.
 * 3. In text, call ``termLabel(key, mode, lang)`` — never hard-code a
 *    variant, that would disconnect the term from the user's choice.
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
 * Picks the displayed form of a term by mode.
 *
 * Fallback: a term without a ``simple`` variant shows the expert form in
 * ``simple`` mode and no parentheses in ``both`` mode — never an empty
 * string, never the key.
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
 * Tiny shared state of the choice.
 *
 * The choice is read by the switch in the doc web shell AND by the live
 * demo on the Translations page. If each held its own ``useState`` over
 * localStorage, a switch in one place would not show in the other until a
 * reload — hence one module-level state and ``useSyncExternalStore``.
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
