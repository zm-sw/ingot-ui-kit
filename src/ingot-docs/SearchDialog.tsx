import { useEffect, useRef, useState } from "react";

import { IngotEyebrow, IngotModal, IngotSearchInput } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import type { DocLang } from "@/ingot-docs/lang";
import { search } from "@/ingot-docs/search";

const LISTBOX_ID = "docs-search-listbox";
const optionId = (index: number) => `docs-search-option-${index}`;

/**
 * Find a page by anything the reader remembers about it.
 *
 * The menu is an index of sixty-six items, which works while the reader
 * knows what the thing is called. This is for every other question they
 * arrive with — a token, the tag the page shows, a sentence from "when to
 * use it".
 *
 * It opens on the whole list rather than an empty box: an empty result
 * area looks broken until the first keystroke, and a list the reader can
 * arrow straight through is a menu, which is what they wanted anyway.
 *
 * Keyboard first, because a search a mouse has to open is a search nobody
 * uses: Ctrl/Cmd+K opens it, arrows walk the results, Enter opens one and
 * Escape closes. That is also why the results are plain links — Enter is
 * then the browser's, not ours, and middle-click and "copy link" work.
 *
 * The arrows move a highlight, not the focus: the caret has to stay in the
 * field so the next letter goes where the reader expects. To a screen
 * reader that is invisible unless it is said out loud, which is what the
 * combobox wiring is for — the field names the list, the list names its
 * options, and ``aria-activedescendant`` follows the highlight. Without it
 * the reader arrows through silence.
 *
 * It also says how many matched and admits when it cut the list. Showing
 * twenty of thirty-one without a word is the worst answer available: the
 * reader believes they have seen everything, and the page they wanted is
 * one of the eleven that were dropped.
 */
export function SearchDialog({
  lang,
  onClose,
  onNavigate,
}: {
  lang: DocLang;
  onClose: () => void;
  /** Called with the chosen path, so the shell routes without a reload. */
  onNavigate: (path: string) => void;
}): JSX.Element {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { hits, total } = search(query, lang);

  const status =
    hits.length === 0
      ? CHROME.searchEmpty[lang]
      : total > hits.length
        ? CHROME.searchCut[lang]
            .replace("{n}", String(hits.length))
            .replace("{total}", String(total))
        : CHROME.searchCount[lang].replace("{n}", String(total));

  // A new query means the old highlight points at a different page — or at
  // nothing. Landing on the first result is the only choice that is right
  // whatever the reader typed.
  //
  // Adjusted while rendering rather than in an effect: an effect renders
  // the OLD highlight once against the NEW list first, which is a frame
  // with the wrong row lit — and, if the list got shorter, a frame with
  // `aria-activedescendant` pointing at an id that is no longer there.
  // React re-runs this component immediately and paints nothing in
  // between.
  const [queryShown, setQueryShown] = useState(query);
  if (query !== queryShown) {
    setQueryShown(query);
    setActive(0);
  }

  function onKeyDown(event: React.KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (hits.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + hits.length) % hits.length);
      return;
    }
    if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      onNavigate(hits[active].path);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    // Not every environment has it (jsdom does not), and keeping the
    // highlight visible is a convenience — it must not be able to take the
    // dialog down with it.
    el?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  // The dialog exists to be typed into. Landing the caret anywhere else
  // would mean a second keystroke before the first letter, which is the
  // difference between a search people use and one they forget about.
  useEffect(() => inputRef.current?.focus(), []);

  return (
    <IngotModal
      title={CHROME.searchTitle[lang]}
      onClose={onClose}
      closeLabel={CHROME.searchClose[lang]}
      testId="docs-search-dialog"
    >
      {/* The keys are caught on the wrapper rather than on the field so
          that arrowing through the results keeps working after the reader
          has moved focus to a result with Tab. It is not an interactive
          element itself: the field and the links underneath it are, and
          they are reachable and operable without this handler. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onKeyDown={onKeyDown} className="space-y-3">
        <IngotSearchInput
          value={query}
          onChange={setQuery}
          label={CHROME.searchLabel[lang]}
          placeholder={CHROME.searchPlaceholder[lang]}
          ref={inputRef}
          combobox={{
            controls: LISTBOX_ID,
            expanded: hits.length > 0,
            activeOption: hits.length > 0 ? optionId(active) : null,
          }}
          testId="docs-search-input"
        />
        {/* Said out loud on every change of the query, and shown, because a
            reader who can see the list still cannot count it. `polite`
            waits for a pause in typing rather than interrupting it. */}
        <p
          aria-live="polite"
          className="text-xs text-ink-3"
          data-testid="docs-search-status"
        >
          {status}
        </p>
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto"
          data-testid="docs-search-results"
        >
          {hits.length > 0 && (
            /* A listbox, not a list of links in a list: `role="option"` may
               only sit inside `role="listbox"`, with nothing between. The
               anchors keep their `href` all the same, so middle-click and
               "copy link" still work — the role changes what is announced,
               not what the element is. */
            <div id={LISTBOX_ID} role="listbox" aria-label={CHROME.searchTitle[lang]}>
              {hits.map((hit, index) => (
                <a
                  key={hit.path}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  href={hit.path}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  className="block rounded-md px-2 py-1.5 hover:bg-surface-2 data-[active=true]:bg-surface-2"
                >
                  {/* Which of the two kinds this is. A guide and a component
                      with related names are otherwise the same row, and the
                      reader finds out only after opening the wrong one. */}
                  <IngotEyebrow as="span" tone="muted" className="block">
                    {hit.page.kind === "guide"
                      ? CHROME.searchKindGuide[lang]
                      : CHROME.searchKindComponent[lang]}
                  </IngotEyebrow>
                  <span className="block text-sm font-medium text-ink">
                    {hit.title}
                  </span>
                  <span className="block truncate text-xs text-ink-3">
                    {hit.subtitle}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
        <IngotEyebrow as="p" tone="muted">
          {CHROME.searchHint[lang]}
        </IngotEyebrow>
      </div>
    </IngotModal>
  );
}
