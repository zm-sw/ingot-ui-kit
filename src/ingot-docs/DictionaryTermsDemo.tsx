/**
 * Živá ukázka slovníku Jednoduše/Expert na stránce Překlady (KAN-662).
 *
 * Tabulka tří termínů, které se překreslují podle volby ve skořápce
 * (přepínač „Slovník“ vlevo dole). Stav je sdílený modulem
 * ``dictionary.ts`` (``useSyncExternalStore``) — přepnutí ve skořápce se
 * tedy projeví tady okamžitě, bez reloadu. To je celý smysl ukázky:
 * čtenář vidí, že termíny řídí JEDNA volba, ne každá obrazovka po svém.
 *
 * Žije mimo ``demos/`` schválně: není to ukázka primitiva kitu (ty se
 * publikují doslovně pod „Ukaž kód“), ale kus obsahu stránky průvodce.
 */
import { IngotCode, IngotTable, type IngotColumn } from "@/ingot";
import {
  DICTIONARY_TERMS,
  termLabel,
  useDictionaryMode,
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
    <IngotTable
      columns={columns}
      rows={TERM_KEYS}
      rowKey={(key) => key}
      caption={CAPTION[lang]}
      testId="docs-dictionary-terms"
    />
  );
}
