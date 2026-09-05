/**
 * Live demo of the Simple/Expert dictionary on the Translations page.
 *
 * A table of three terms that re-render by the choice in the switch above
 * them. The state is shared through the ``dictionary.ts`` module
 * (``useSyncExternalStore``), so a switch shows immediately and without a
 * reload. That is the whole point of the demo: the reader sees that ONE
 * choice drives the terms, not every screen on its own.
 *
 * **The switch stands by the table, not in the top bar.** Until the
 * alignment it sat next to theme, language and accent — among choices that
 * apply to the whole web — yet this single table is all it controls. The
 * documentation writes about the interface, not about manufacturing, so
 * the technical terms the dictionary is built for appear nowhere else on
 * the web. A switch in the bar thus promised an effect it does not have:
 * the reader flipped it, nothing changed, and concluded it was broken. By
 * the table the promise matches reality.
 *
 * In the application it is, by contrast, an account choice in the account
 * menu, because the terms really are there — see the Shell and patterns
 * page.
 *
 * Lives outside ``demos/`` on purpose: it is not a demo of a kit primitive
 * (those are published verbatim under the code toggle) but a piece of page
 * content.
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
