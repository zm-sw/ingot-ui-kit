import { forwardRef, type JSX, type Ref } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";
import { inputChrome } from "./inputChrome";

/**
 * Search field above a list — the first element of the filter bar
 * (``IngotToolbar``).
 *
 * It filters, it does not search: it narrows the list it stands on, and
 * therefore has no "Search" button and no results screen of its own. The
 * change is reported on every keystroke; whoever needs a debounce keeps
 * it at the data, not in the field — the field cannot know whether a
 * network request stands behind the query.
 *
 * The magnifier is decoration (``aria-hidden``): the field's name is
 * carried by ``label``. ``type="search"`` gives the browser's clear cross
 * for free.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 *
 * ``ref`` points at the ``<input>``, not at the wrapper: a screen with a
 * "jump to search" shortcut could not reach the field otherwise and would
 * reach into the primitive's insides (``wrap.querySelector("input")``).
 * Renaming an element inside the kit would silently break such a reach and
 * no kit test would catch it — hence the way out is part of the API, not an
 * accident.
 */
export const IngotSearchInput = forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (next: string) => void;
    /** Translated ``aria-label`` — a placeholder is no substitute for a name; it vanishes once filled. */
    label: string;
    /** Translated placeholder. A format hint, not the field's name. */
    placeholder?: string;
    disabled?: boolean;
    /**
     * @deprecated Use ``ref``. Kept as an alias so the shortcut that jumps
     * into search does not have to be rewritten in the same release; it
     * goes away in the next major.
     */
    inputRef?: Ref<HTMLInputElement>;
    /** Layout only — the screen sets the width, the primitive the look. */
    className?: string;
    testId?: string;
  }
>(function IngotSearchInput(
  { value, onChange, label, placeholder, disabled = false, inputRef, className, testId },
  ref,
): JSX.Element {
  // Both are attached: a caller mid-migration may pass ``inputRef`` while a
  // wrapper above it already passes ``ref``, and dropping either would
  // break a shortcut nobody tests from here.
  const attach = (node: HTMLInputElement | null) => {
    for (const target of [ref, inputRef]) {
      if (typeof target === "function") target(node);
      else if (target) (target as { current: HTMLInputElement | null }).current = node;
    }
  };
  return (
    <span className={cx("relative inline-flex items-center", className)}>
      <IngotIcon
        name="search"
        size={15}
        className="pointer-events-none absolute left-2.5 text-ink-4"
        aria-hidden
      />
      <input
        ref={attach}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        placeholder={placeholder}
        disabled={disabled}
        // `pl-8` after the chrome overrides its `px-3` on the left so the
        // magnifier has room; Tailwind resolves the later utility.
        className={cx("w-full", inputChrome(), "pl-8")}
        data-testid={testId}
      />
    </span>
  );
});
