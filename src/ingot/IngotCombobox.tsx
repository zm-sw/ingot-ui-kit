import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";
import { useIngotLabels } from "./IngotProvider";
import { filterOptions, foldOptions, foldQuery } from "./comboboxFilter";
import { inputChrome } from "./inputChrome";
import { menuRowClass } from "./menuRow";

/**
 * Picking one value out of MANY by typing — a country out of two hundred, a
 * storage place out of the several hundred a plant with zones has, a member
 * out of a whole team.
 *
 * This is the primitive ``IngotSelect`` points at: a native ``<select>``
 * covers a short set and says outright that search inside it belongs to a
 * component of its own. Scrolling a list of two hundred is worse than
 * typing three letters, and that is the whole reason this exists.
 *
 * What it holds beyond a text field:
 *
 * - **Diacritics are folded on both sides**, so an unaccented query finds
 *   an accented name and the accented spelling still finds itself.
 * - **Matches are ranked, then cut.** A word start in the label comes
 *   first, then one in the secondary line or a keyword, then anything
 *   mid-word; at most {@link INGOT_COMBOBOX_MAX_RENDERED} rows are drawn,
 *   and the cut happens AFTER the ranking (see ``comboboxFilter.ts``).
 * - **Keywords are searched and never drawn.** A country is found by its
 *   alpha-3, its dial code or its name in another language without any of
 *   that appearing in the row.
 * - **Leaving the field is not a silent loss.** A text that names exactly
 *   one option — by its value or its label — IS that choice when the user
 *   clicks away; anything else reverts to the chosen option's label, so a
 *   half-typed word never sits in the field claiming to be a value.
 *
 * **It is not a filter above a list.** That is ``IngotSearchInput``, which
 * narrows the list it stands on and does not own a value. Nor is it a
 * multi-select: a value is one string here, and a set of chosen values is
 * ``IngotChipGroup`` next to this one, or a primitive of its own the day a
 * screen asks for it.
 *
 * **The list is drawn in the field's own flow, not through
 * ``IngotPopover``.** The popover is the kit's one answer for a panel that
 * hangs off a button, and this is the one place the answer does not fit: a
 * listbox is as wide as the field it belongs to, and the popover — which
 * portals into ``document.body`` and takes only layout classes — cannot be
 * told that width. It also returns focus to its anchor on ESC, while here
 * focus never left the field in the first place. ESC and the click outside
 * are therefore handled here, with the same meaning they have there.
 *
 * The kit has no i18n namespace of its own: ``label`` and ``placeholder``
 * arrive translated, and the three words the component says itself (clear,
 * no matches, the note about the cut) come from the ``IngotProvider``
 * dictionary — English without a provider.
 *
 * ``ref`` reaches the ``<input>``, not the wrapper: a form that focuses its
 * first invalid control, or a screen that focuses the picker after opening
 * a panel, must not have to reach into the primitive with
 * ``querySelector``.
 */

export interface IngotComboboxOption {
  value: string;
  /** Translated label — what the row shows and what the field holds once chosen. */
  label: string;
  /**
   * Translated second line under the label (the key behind a human name,
   * the e-mail behind a person). Matched by the search as well, one tier
   * below the label.
   */
  secondary?: string;
  /**
   * Extra search terms that are matched but never drawn — what a person
   * types instead of the label (an alpha-3 code, a dial code, a name in
   * another language, an alias).
   */
  keywords?: readonly string[];
  /**
   * Decorative mark before the label — a flag, a glyph. Drawn in the row
   * and, for the chosen option, inside the field.
   */
  icon?: ReactNode;
}

/**
 * How many rows the list draws at most.
 *
 * A catalogue of every country or every place in a plant is longer than
 * any list a person reads, and rendering all of it is what makes typing in
 * the field feel slow. Beyond this count the list says so in its last row
 * rather than pretending it showed everything.
 */
export const INGOT_COMBOBOX_MAX_RENDERED = 200;

export const IngotCombobox = forwardRef<
  HTMLInputElement,
  {
    options: readonly IngotComboboxOption[];
    /** The chosen option's value, or "" for none. Controlled from outside. */
    value: string;
    /** The new value on every choice; "" when the field is cleared. */
    onChange: (next: string) => void;
    /**
     * Translated ``aria-label``. Required: a picker usually sits under a
     * visible caption that is not a ``<label htmlFor>``, and without this a
     * screen reader reads the current value without ever saying what it is
     * a value OF.
     */
    label: string;
    /** Translated placeholder. A hint about the empty state, not the field's name. */
    placeholder?: string;
    disabled?: boolean;
    /** Layout only — the screen sets the width, the primitive the look. */
    className?: string;
    /**
     * Anchor for tests, on the WRAPPER rather than on the input: the
     * control is a field plus a list plus a clear button, and a test
     * reaches for one of the three. The clear button carries
     * ``${testId}-clear``.
     */
    testId?: string;
  }
>(function IngotCombobox(
  { options, value, onChange, label, placeholder, disabled = false, className, testId },
  ref,
): JSX.Element {
  const labels = useIngotLabels();
  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(selected?.label ?? "");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const attach = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  };

  // The visible text follows the value when it changes from OUTSIDE (a
  // parent resetting the form), but never while the user is typing.
  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [selected, open]);

  const folded = useMemo(() => foldOptions(options), [options]);

  const filtered = useMemo(() => {
    const typed = foldQuery(query.trim());
    // The chosen option's own label is not a query: opening the field on a
    // chosen value shows the whole list, not that one row.
    const matchAll = typed.length === 0 || (selected !== null && typed === foldQuery(selected.label));
    return filterOptions({
      options,
      folded,
      query: matchAll ? "" : typed,
      max: INGOT_COMBOBOX_MAX_RENDERED,
    });
  }, [options, folded, query, selected]);

  const truncated = filtered.length >= INGOT_COMBOBOX_MAX_RENDERED;

  // The field is a text input, so the chosen option's icon is laid over it
  // — only while the text still IS that option's label.
  const fieldIcon = selected?.icon !== undefined && query === selected.label ? selected.icon : null;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current?.contains(event.target as Node) === true) return;
      const typed = foldQuery(query.trim());
      const exact = typed
        ? options.filter(
            (option) => foldQuery(option.value) === typed || foldQuery(option.label) === typed,
          )
        : [];
      if (exact.length === 1 && exact[0].value !== selected?.value) {
        onChange(exact[0].value);
        setQuery(exact[0].label);
      } else {
        setQuery(selected?.label ?? "");
      }
      close();
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close, selected, query, options, onChange]);

  function pick(option: IngotComboboxOption): void {
    onChange(option.value);
    setQuery(option.label);
    close();
  }

  function clear(): void {
    onChange("");
    setQuery("");
    inputRef.current?.focus();
    setOpen(true);
    setActiveIndex(-1);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
    setOpen(true);
    setActiveIndex(0);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(0);
          return;
        }
        setActiveIndex((index) => Math.min(filtered.length - 1, index + 1));
        return;
      case "ArrowUp":
        if (!open) return;
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
        return;
      case "Enter": {
        if (!open) return;
        event.preventDefault();
        const option = filtered[activeIndex];
        if (option !== undefined) pick(option);
        return;
      }
      case "Escape":
        event.preventDefault();
        setQuery(selected?.label ?? "");
        close();
        return;
      case "Home":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(filtered.length - 1);
        return;
      default:
    }
  }

  return (
    <div ref={containerRef} className={cx("relative", className)} data-testid={testId}>
      <div className="relative">
        {fieldIcon !== null && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-sm">
            {fieldIcon}
          </span>
        )}
        <input
          ref={attach}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          // `list` rather than `both`: the field never writes the reader's
          // highlight back into itself, so promising inline completion
          // would announce an edit that never happens.
          aria-autocomplete="list"
          aria-label={label}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
          }
          value={query}
          onChange={onInputChange}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(
              selected
                ? Math.max(
                    0,
                    filtered.findIndex((option) => option.value === selected.value),
                  )
                : -1,
            );
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          // The padding utilities come after the chrome so they override
          // its `px-3` on the side that has something in it; Tailwind
          // resolves the later utility.
          className={cx(
            "w-full",
            inputChrome(),
            fieldIcon !== null ? "pl-10" : "pl-3",
            value ? "pr-8" : "pr-3",
          )}
        />
        {value !== "" && !disabled && (
          <button
            type="button"
            // `mousedown`, so the outside-click handler above does not run
            // first and revert the query before this clears it.
            onMouseDown={(event) => {
              event.preventDefault();
              clear();
            }}
            aria-label={labels.comboboxClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-3 hover:bg-surface-2 hover:text-ink focus-ring"
            data-testid={testId === undefined ? undefined : `${testId}-clear`}
          >
            <IngotIcon name="close" size={12} />
          </button>
        )}
      </div>
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-opt-${index}`}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              // `mousedown` for the same reason as the clear button: the
              // outside-click handler closes on mousedown, and a `click`
              // would arrive after the list is gone.
              onMouseDown={(event) => {
                event.preventDefault();
                pick(option);
              }}
              className={cx(
                "cursor-pointer px-3 py-2 text-sm",
                menuRowClass({ current: index === activeIndex }),
                option.value === value && "font-medium text-ink",
              )}
            >
              <span className="flex items-center gap-2">
                {option.icon}
                <span className="block min-w-0 truncate">{option.label}</span>
              </span>
              {option.secondary !== undefined && (
                <span className="block truncate text-xs text-ink-3">{option.secondary}</span>
              )}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-ink-3">{labels.comboboxNoMatches}</li>
          )}
          {truncated && (
            <li className="border-t border-border px-3 py-2 text-xs text-ink-3">
              {labels.comboboxTruncated.replace(
                "{count}",
                String(INGOT_COMBOBOX_MAX_RENDERED),
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  );
});
