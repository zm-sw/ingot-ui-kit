/**
 * Simple/Expert dictionary (KAN-662).
 *
 * The registry type enforces that a term has an expert variant in every
 * language — what the type cannot enforce:
 *
 * 1. **Variant selection in all three modes** — simple / expert / both,
 *    including the form of "Both" (expert + parentheses), which is a
 *    decision, not a type.
 * 2. **Fallback**: a term without a ``simple`` variant must never show as
 *    empty text or as the key — in every mode it falls to expert.
 * 3. **Non-emptiness**: ``Record<DocLang, string>`` enforces the key, not
 *    the content.
 * 4. **Stored choice**: an invalid value falls to the default ``both``.
 * 5. **Shared state**: the demo on the Translations page re-renders after
 *    ``setDictionaryMode`` from elsewhere — that is the whole point of the
 *    shared module.
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const STORAGE_KEY = "forgmatic.ingot.docs.dictionary";

describe("termLabel", () => {
  const nesting = DICTIONARY_TERMS.nesting;

  it("picks the simple variant in simple mode", () => {
    expect(termLabel(nesting, "simple", "cs")).toBe(
      "Rozmístění dílů na plech",
    );
  });

  it("picks the expert variant in expert mode", () => {
    expect(termLabel(nesting, "expert", "cs")).toBe("Nesting");
  });

  it("in both mode joins the expert term and the plain description in parentheses", () => {
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

  // Fallback: a missing simple variant NEVER ends up as empty text — in
  // every mode expert shows, in both without parentheses.
  it("falls back to expert in every mode without a simple variant", () => {
    const bare: DictionaryTerm = {
      expert: { cs: "Kerf", en: "Kerf" },
    };
    for (const mode of DICTIONARY_MODES) {
      expect(termLabel(bare, mode, "cs")).toBe("Kerf");
    }
  });
});

describe("term registry", () => {
  it("carries the three terms from the specification", () => {
    expect(Object.keys(DICTIONARY_TERMS).sort()).toEqual([
      "nesting",
      "setup_time",
      "tolerance_class",
    ]);
  });

  it("every variant is non-empty in every doc web language", () => {
    for (const term of Object.values(DICTIONARY_TERMS)) {
      for (const lang of DOC_LANGS) {
        expect(term.expert[lang].trim()).not.toBe("");
        if (term.simple) expect(term.simple[lang].trim()).not.toBe("");
      }
    }
  });
});

describe("stored choice", () => {
  beforeEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it("returns the default both without a stored choice", () => {
    expect(readStoredDictionaryMode()).toBe(DEFAULT_DICTIONARY_MODE);
  });

  it("an invalid value falls back to the default, not to an exception", () => {
    window.localStorage.setItem(STORAGE_KEY, "wizard");
    expect(readStoredDictionaryMode()).toBe(DEFAULT_DICTIONARY_MODE);
  });

  it("setDictionaryMode stores the choice and readStoredDictionaryMode reads it", () => {
    setDictionaryMode("expert");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("expert");
    expect(readStoredDictionaryMode()).toBe("expert");
  });
});

describe("DictionaryTermsDemo", () => {
  beforeEach(() => {
    act(() => setDictionaryMode(DEFAULT_DICTIONARY_MODE));
  });

  it("carries its own switch — the choice stands by the table it controls", async () => {
    const user = userEvent.setup();
    render(<DictionaryTermsDemo lang="cs" />);

    // Until the alignment the switch sat in the top bar next to theme and
    // language — among choices valid for the whole web — while controlling
    // a single table. Here it stands by it, so the promise matches the effect.
    await user.click(screen.getByTestId("docs-dictionary-simple"));
    expect(screen.getByTestId("docs-dictionary-terms")).toHaveTextContent(
      "Rozmístění dílů na plech",
    );
    expect(screen.getByTestId("docs-dictionary-expert")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("re-renders the terms after the mode is switched elsewhere", () => {
    render(<DictionaryTermsDemo lang="cs" />);
    const table = screen.getByTestId("docs-dictionary-terms");
    expect(table).toHaveTextContent("Nesting (Rozmístění dílů na plech)");

    // The switch simulates the one in the shell — the demo knows nothing
    // about it, it only shares the module state. If it kept its own copy,
    // this is where it would fail.
    act(() => setDictionaryMode("simple"));
    expect(table).toHaveTextContent("Rozmístění dílů na plech");
    expect(table).not.toHaveTextContent("Nesting (");

    act(() => setDictionaryMode("expert"));
    expect(table).toHaveTextContent("Nesting");
    expect(table).not.toHaveTextContent("(Rozmístění dílů na plech)");
  });
});
