import { useEffect, useRef, useState } from "react";

import { IngotEyebrow, IngotList, IngotModal, IngotSearchInput } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import type { DocLang } from "@/ingot-docs/lang";
import { search, type SearchHit } from "@/ingot-docs/search";

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
  const hits: SearchHit[] = search(query, lang);

  // A new query means the old highlight points at a different page — or at
  // nothing. Landing on the first result is the only choice that is right
  // whatever the reader typed.
  useEffect(() => setActive(0), [query]);

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
          testId="docs-search-input"
        />
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto"
          data-testid="docs-search-results"
        >
          {hits.length === 0 ? (
            <p className="px-1 py-6 text-center text-sm text-ink-3">
              {CHROME.searchEmpty[lang]}
            </p>
          ) : (
            <IngotList
              variant="plain"
              items={hits.map((hit, index) => (
                <a
                  key={hit.path}
                  href={hit.path}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  className="block rounded-md px-2 py-1.5 hover:bg-surface-2 data-[active=true]:bg-surface-2"
                >
                  <span className="block text-sm font-medium text-ink">
                    {hit.title}
                  </span>
                  <span className="block truncate text-xs text-ink-3">
                    {hit.subtitle}
                  </span>
                </a>
              ))}
            />
          )}
        </div>
        <IngotEyebrow as="p" tone="muted">
          {CHROME.searchHint[lang]}
        </IngotEyebrow>
      </div>
    </IngotModal>
  );
}
