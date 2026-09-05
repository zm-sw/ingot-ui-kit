import { forwardRef, type JSX } from "react";

import { cx } from "./cx";
import { inputChrome } from "./inputChrome";

/**
 * Picking one value from a short set — a filter above a list, a variant
 * switch in settings.
 *
 * A native ``<select>`` on purpose: it gets keyboard, screen reader and
 * mobile behaviour for free, and filters use it by the dozen on one
 * screen. A custom dropdown would buy looks at the price of a whole bundle
 * of behaviour someone would then have to really write. Once a screen asks
 * for search inside or for groups, that is a new primitive, not a property
 * of this one.
 *
 * "All statuses" is the first ``option``, not a placeholder: a filter IS
 * always in some state and an empty value would claim it is not.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 *
 * ``ref`` reaches the ``<select>`` itself: a screen that focuses a filter
 * after clearing it, or scrolls it into view, must not have to reach into
 * the primitive's insides with ``querySelector``.
 */

export interface IngotSelectOption {
  value: string;
  /** Translated label of the option. */
  label: string;
}

export const IngotSelect = forwardRef<
  HTMLSelectElement,
  {
  value: string;
  onChange: (next: string) => void;
  options: readonly IngotSelectOption[];
  /**
   * Translated ``aria-label``. Required, because a filter bar rarely has a
   * visible label — without it a screen reader reads only the current
   * value and the user does not know WHAT it is a value of. A screen with
   * a visible ``<label htmlFor>`` passes the same id through ``id`` and the
   * label may be the same text.
   */
  label: string;
  disabled?: boolean;
  id?: string;
    /** Layout only — the screen sets the width, the primitive the look. */
    className?: string;
    testId?: string;
  }
>(function IngotSelect(
  { value, onChange, options, label, disabled = false, id, className, testId },
  ref,
): JSX.Element {
  return (
    <select
      ref={ref}
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
      disabled={disabled}
      className={cx(inputChrome(), className)}
      data-testid={testId}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});
