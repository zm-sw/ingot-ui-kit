import { forwardRef, useId, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * A setting that takes effect the moment it is flipped.
 *
 * **The difference from ``IngotCheckbox`` is a promise, not a shape.** A
 * checkbox is a choice inside a form: it takes effect when the form is
 * applied, and until then nothing has happened. A switch says the opposite
 * — it is on now. Drawing one and meaning the other is how an operator
 * ends up believing a machine was switched off because the toggle moved,
 * while the change waits behind an unsaved form.
 *
 * So the rule that goes with it: **a switch belongs where the caller saves
 * immediately.** If saving needs an "Apply", the control is a checkbox.
 *
 * The label is part of the primitive and always a ``<label>`` wrapping the
 * control, so clicking the text flips it and the accessible name comes for
 * free. ``role="switch"`` makes a screen reader say "on" or "off" instead
 * of "checked", which is the same difference in words.
 *
 * The kit has no i18n namespace of its own — the label arrives translated.
 */
export const IngotSwitch = forwardRef<
  HTMLButtonElement,
  {
    checked: boolean;
    onChange: (next: boolean) => void;
    /** Translated visible label. It names the control — hence required. */
    label: ReactNode;
    /**
     * One sentence under the label: what happens when it is on. Bound with
     * ``aria-describedby``, so a screen reader hears it with the switch.
     */
    hint?: ReactNode;
    disabled?: boolean;
    /** Layout only — margins and alignment of the row. */
    className?: string;
    testId?: string;
  }
>(function IngotSwitch(
  { checked, onChange, label, hint, disabled = false, className, testId },
  ref,
) {
  const generated = useId();
  const hintId = hint != null ? `${testId ?? generated}-hint` : undefined;

  return (
    <div className={cx("text-sm", className)}>
      <label
        className={cx(
          "flex items-center gap-3",
          disabled ? "cursor-not-allowed text-ink-4" : "cursor-pointer text-ink-2",
        )}
      >
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={hintId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-bg",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-accent" : "bg-border-strong",
        )}
        data-testid={testId}
      >
        {/* The knob is drawn, not typed: a shape that moves says "on" to
            anyone who cannot tell the two colours apart. */}
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-all",
            checked ? "left-[1.125rem]" : "left-0.5",
          )}
        />
      </button>
        <span>{label}</span>
      </label>
      {/* Outside the label on purpose: inside it the hint would become part
          of the control's NAME, and a screen reader would read it twice —
          once as the name, once as the description. */}
      {hint != null && (
        <p id={hintId} className="ml-12 mt-0.5 text-xs text-ink-3">
          {hint}
        </p>
      )}
    </div>
  );
});
