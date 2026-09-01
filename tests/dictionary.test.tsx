/**
 * Slovník Jednoduše/Expert (KAN-662).
 *
 * Typ registru vynutí, že termín má expert variantu ve všech jazycích —
 * co typ vynutit neumí:
 *
 * 1. **Výběr varianty ve všech třech režimech** — simple / expert / both,
 *    včetně formy „Obojí“ (expert + závorka), která je rozhodnutí, ne typ.
 * 2. 🪤 **Fallback**: termín bez ``simple`` varianty se nikdy nesmí ukázat
 *    jako prázdný text nebo klíč — v každém režimu padá na expert.
 * 3. **Neprázdnost**: ``Record<DocLang, string>`` vynutí klíč, ne obsah.
 * 4. **Uložená volba**: neplatná hodnota padá na výchozí ``both``.
 * 5. **Sdílený stav**: ukázka na stránce Překlady se překreslí po
 *    ``setDictionaryMode`` odjinud — to je celý smysl společného modulu.
 */
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_DICTIONARY_MODE,
  DICTIONARY_MODES,
  DICTIONARY_TERMS,
  readStoredDictionaryMode,
  setDictionaryMode,
  termLabel,
  type DictionaryTerm,
} from "@/ingot-docs/dictionary";
import { DictionaryTermsDemo } from "@/ingot-docs/DictionaryTermsDemo";
import { DOC_LANGS } from "@/ingot-docs/lang";

const STORAGE_KEY = "forgmatic.ingot-docs.dictionary";

describe("termLabel", () => {
  const nesting = DICTIONARY_TERMS.nesting;

  it("vybere jednoduchou variantu v režimu simple", () => {
    expect(termLabel(nesting, "simple", "cs")).toBe(
      "Rozmístění dílů na plech",
    );
  });

  it("vybere expertní variantu v režimu expert", () => {
    expect(termLabel(nesting, "expert", "cs")).toBe("Nesting");
  });

  it("v režimu both spojí expert termín a jednoduchý opis v závorce", () => {
    expect(termLabel(nesting, "both", "cs")).toBe(
      "Nesting (Rozmístění dílů na plech)",
    );
  });

  it("respektuje jazyk", () => {
    expect(termLabel(DICTIONARY_TERMS.setup_time, "simple", "en")).toBe(
      "Machine preparation",
    );
    expect(termLabel(DICTIONARY_TERMS.setup_time, "expert", "en")).toBe(
      "Setup time",
    );
  });

  // 🪤 Fallback: chybějící simple varianta NIKDY neskončí jako prázdný
  // text — v každém režimu se ukáže expert, v both bez závorky.
  it("bez simple varianty padá na expert ve všech režimech", () => {
    const bare: DictionaryTerm = {
      expert: { cs: "Kerf", en: "Kerf" },
    };
    for (const mode of DICTIONARY_MODES) {
      expect(termLabel(bare, mode, "cs")).toBe("Kerf");
    }
  });
});

describe("registr termínů", () => {
  it("nese tři termíny ze specifikace", () => {
    expect(Object.keys(DICTIONARY_TERMS).sort()).toEqual([
      "nesting",
      "setup_time",
      "tolerance_class",
    ]);
  });

  it("každá varianta je neprázdná ve všech jazycích doc webu", () => {
    for (const term of Object.values(DICTIONARY_TERMS)) {
      for (const lang of DOC_LANGS) {
        expect(term.expert[lang].trim()).not.toBe("");
        if (term.simple) expect(term.simple[lang].trim()).not.toBe("");
      }
    }
  });
});

describe("uložená volba", () => {
  beforeEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it("bez uložené volby vrací výchozí both", () => {
    expect(readStoredDictionaryMode()).toBe(DEFAULT_DICTIONARY_MODE);
  });

  it("neplatná hodnota padá na výchozí, ne na výjimku", () => {
    window.localStorage.setItem(STORAGE_KEY, "wizard");
    expect(readStoredDictionaryMode()).toBe(DEFAULT_DICTIONARY_MODE);
  });

  it("setDictionaryMode volbu uloží a readStoredDictionaryMode ji přečte", () => {
    setDictionaryMode("expert");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("expert");
    expect(readStoredDictionaryMode()).toBe("expert");
  });
});

describe("DictionaryTermsDemo", () => {
  beforeEach(() => {
    act(() => setDictionaryMode(DEFAULT_DICTIONARY_MODE));
  });

  it("překreslí termíny po přepnutí režimu odjinud", () => {
    render(<DictionaryTermsDemo lang="cs" />);
    const table = screen.getByTestId("docs-dictionary-terms");
    expect(table).toHaveTextContent("Nesting (Rozmístění dílů na plech)");

    // Přepnutí simuluje přepínač ve skořápce — ukázka o něm neví, sdílí
    // jen modulový stav. Kdyby si držela vlastní kopii, tady to spadne.
    act(() => setDictionaryMode("simple"));
    expect(table).toHaveTextContent("Rozmístění dílů na plech");
    expect(table).not.toHaveTextContent("Nesting (");

    act(() => setDictionaryMode("expert"));
    expect(table).toHaveTextContent("Nesting");
    expect(table).not.toHaveTextContent("(Rozmístění dílů na plech)");
  });
});
