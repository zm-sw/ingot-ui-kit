import { useId, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * One choice out of a few, all of them visible at once.
 *
 * The kit already had three ways to choose: ``IngotSelect`` (a short set,
 * folded away), ``IngotSegmented`` (two or three options in a bar) and
 * ``IngotOptionCard`` (options that need a sentence of explanation each).
 * What was missing is the plain case in the middle — three to six options
 * that need to be READ and compared, each a line long, inside a form.
 *
 * **It is one native radio group**, not a row of buttons wearing the role.
 * That buys the browser's own behaviour: arrows move between the options
 * and select as they go, the group is one tab stop, and a form submits the
 * chosen value without help. Rebuilding that on ``<div role="radio">`` is
 * how a keyboard user ends up tabbing through six options one by one.
 *
 * A group of one option is a group that decides nothing — if the set can
 * shrink to one, the screen should say so in words instead.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotRadioOption {
  value: string;
  /** Translated label. Required — an unnamed option cannot be chosen deliberately. */
  label: ReactNode;
  /** One sentence under the label, for a choice that needs a reason. */
  hint?: ReactNode;
  disabled?: boolean;
  testId?: string;
}

export function IngotRadioGroup({
  value,
  onChange,
  options,
  label,
  hint,
  error,
  disabled = false,
  className,
  testId,
}: {
  value: string;
  onChange: (next: string) => void;
  options: readonly IngotRadioOption[];
  /**
   * Translated name of the whole choice. Required: without it a screen
   * reader announces the options but never what they are options OF.
   */
  label: ReactNode;
  /** One sentence under the group's name. */
  hint?: ReactNode;
  /** Error text; its presence marks the group invalid. */
  error?: ReactNode;
  disabled?: boolean;
  /** Layout only — margins and the width of the group. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const id = useId();
  const name = `${id}-radio`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = cx(hint != null && hintId, error != null && errorId);

  return (
    // A fieldset with a legend, so the group's name belongs to the group in
    // the accessibility tree and not merely above it on screen.
    <fieldset
      className={cx("space-y-2", className)}
      aria-describedby={describedBy || undefined}
      aria-invalid={error != null || undefined}
      data-testid={testId}
    >
      <legend className="text-xs font-medium text-ink-2">{label}</legend>
      {hint != null && (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      )}
      <div className="space-y-1.5">
        {options.map((option) => {
          const optionDisabled = disabled || option.disabled === true;
          const optionHintId =
            option.hint != null ? `${id}-${option.value}-hint` : undefined;
          return (
            <div key={option.value}>
              <label
                className={cx(
                  "flex items-center gap-2.5 text-sm",
                  optionDisabled
                    ? "cursor-not-allowed text-ink-4"
                    : "cursor-pointer text-ink-2",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={optionDisabled}
                  aria-describedby={optionHintId}
                  onChange={() => onChange(option.value)}
                  className="h-4 w-4 shrink-0 accent-accent disabled:cursor-not-allowed"
                  data-testid={option.testId}
                />
                <span>{option.label}</span>
              </label>
              {/* Outside the label: inside it the hint would become part of
                  the option's NAME, so the reader would hear it twice. */}
              {option.hint != null && (
                <p id={optionHintId} className="ml-[1.625rem] mt-0.5 text-xs text-ink-3">
                  {option.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {error != null && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
