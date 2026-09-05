/**
 * Živá ukázka slovníku Jednoduše/Expert na stránce Překlady (KAN-662).
 *
 * Tabulka tří termínů, které se překreslují podle volby přepínačem nad
 * nimi. Stav je sdílený modulem ``dictionary.ts``
 * (``useSyncExternalStore``), takže přepnutí se projeví okamžitě a bez
 * reloadu. To je celý smysl ukázky: čtenář vidí, že termíny řídí JEDNA
 * volba, ne každá obrazovka po svém.
 *
 * 🪤 **Přepínač stojí u tabulky, ne v horní liště.** Do dorovnání seděl
 * vedle motivu, jazyka a akcentu — tedy mezi volbami, které platí pro
 * celý web — jenže tahle jediná tabulka je všechno, co ovládá.
 * Dokumentace píše o rozhraní, ne o výrobě, takže odborné termíny, na
 * které je slovník stavěný, jinde na webu nejsou. Přepínač v liště tím
 * sliboval dopad, který nemá: čtenář ho přepnul, nic se nezměnilo a
 * usoudil, že je rozbitý. U tabulky slib odpovídá skutečnosti.
 *
 * V aplikaci je to naopak volba účtu v menu účtu, protože tam ty termíny
 * doopravdy jsou — viz stránka Shell a patterny.
 *
 * Žije mimo ``demos/`` schválně: není to ukázka primitiva kitu (ty se
 * publikují doslovně pod přepínačem kódu), ale kus obsahu stránky.
 */
import {
  IngotCode,
  IngotEyebrow,
  IngotSegmented,
  IngotTable,
  type IngotColumn,
} from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import {
  DICTIONARY_MODES,
  DICTIONARY_TERMS,
  setDictionaryMode,
  termLabel,
  useDictionaryMode,
  type DictionaryMode,
  type DictionaryTermKey,
} from "@/ingot-docs/dictionary";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const CAPTION: Localized<string> = {
  cs: "Termíny slovníku v aktuálním režimu",
  en: "Dictionary terms in the current mode",
};

const KEY_HEADER: Localized<string> = { cs: "Klíč", en: "Key" };

const LABEL_HEADER: Localized<string> = {
  cs: "Co uživatel vidí",
  en: "What the user sees",
};

const TERM_KEYS = Object.keys(DICTIONARY_TERMS) as readonly DictionaryTermKey[];

export function DictionaryTermsDemo({ lang }: { lang: DocLang }): JSX.Element {
  const mode = useDictionaryMode();

  const columns: readonly IngotColumn<DictionaryTermKey>[] = [
    {
      key: "key",
      header: KEY_HEADER[lang],
      cell: (key) => <IngotCode>{key}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "label",
      header: LABEL_HEADER[lang],
      cell: (key) => termLabel(DICTIONARY_TERMS[key], mode, lang),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <IngotEyebrow as="span" tone="muted">
          {CHROME.dictionary[lang]}
        </IngotEyebrow>
        <IngotSegmented
          options={DICTIONARY_MODES.map((option) => ({
            value: option,
            label:
              option === "simple"
                ? CHROME.dictionarySimple[lang]
                : option === "expert"
                  ? CHROME.dictionaryExpert[lang]
                  : CHROME.dictionaryBoth[lang],
          }))}
          value={mode}
          onChange={(next) => setDictionaryMode(next as DictionaryMode)}
          label={CHROME.dictionary[lang]}
          testId="docs-dictionary"
        />
      </div>
      <IngotTable
        columns={columns}
        rows={TERM_KEYS}
        rowKey={(key) => key}
        caption={CAPTION[lang]}
        testId="docs-dictionary-terms"
      />
    </div>
  );
}
