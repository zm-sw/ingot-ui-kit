import {
  forwardRef,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from "react";

import { cx } from "./cx";

/**
 * The one `<input type="checkbox">` in the kit.
 *
 * Internal, not exported from the barrel: `IngotCheckbox` wraps it in a
 * label, `IngotTable` uses it bare in the selection column (with `ref` for
 * `indeterminate`), `IngotFieldInput` uses it bare because `IngotForm`
 * supplies the label. Before this existed the box was drawn three times
 * and only one of them had the accent colour.
 */
export const IngotCheckboxControl = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function IngotCheckboxControl({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cx("h-4 w-4 shrink-0 accent-accent disabled:cursor-not-allowed", className)}
      {...rest}
    />
  );
});

/**
 * A checkbox with a label — an "only needs attention" filter, a consent in
 * a form, a behaviour toggle in settings.
 *
 * The label is part of the primitive, not an accompaniment: a bare
 * checkbox without a ``<label>`` is a nameless square to a screen reader
 * and a 16 × 16 px target to the mouse. Here the label is always a
 * ``<label>`` wrapping the input, so clicking the text toggles and the
 * name comes for free.
 *
 * Not a switch: a checkbox is a choice in a form or filter that takes
 * effect when the state is applied; a switch would promise an immediate
 * effect. Once a screen asks for one, it will be a primitive of its own.
 *
 * The kit has no i18n namespace of its own — the label comes from the caller.
 *
 * ``ref`` reaches the ``<input>``, not the ``<label>`` around it: a caller
 * that focuses the first invalid control of a form needs the control, and
 * ``indeterminate`` cannot be set any other way.
 */
export const IngotCheckbox = forwardRef<
  HTMLInputElement,
  {
    checked: boolean;
    onChange: (next: boolean) => void;
    /** Translated visible label. It carries the control's name — hence required. */
    label: ReactNode;
    disabled?: boolean;
    /** Layout only — margins and alignment of the row; the look is the primitive's. */
    className?: string;
    testId?: string;
  }
>(function IngotCheckbox(
  { checked, onChange, label, disabled = false, className, testId },
  ref,
): JSX.Element {
  return (
    <label
      className={cx(
        "flex items-center gap-2 text-sm",
        disabled ? "cursor-not-allowed text-ink-4" : "text-ink-2",
        className,
      )}
    >
      <IngotCheckboxControl
        ref={ref}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        data-testid={testId}
      />
      {label}
    </label>
  );
});
