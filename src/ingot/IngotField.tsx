import { useId, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { INPUT_PAD, inputFrameChrome } from "./inputChrome";

/**
 * Labelled text field — the hand-written building block of ordinary forms.
 *
 * **Not `IngotFieldInput`.** That one is schema-driven: it takes a field
 * description (`IngotFieldSpec`) and renders only the input, deliberately
 * without a label, because `IngotForm` composes the label above it. This
 * component is the opposite branch — a form written by hand whose fields
 * have no schema because there are three of them and they are fixed
 * (token name, quantity, e-mail). Before it existed such forms composed
 * `<label>` + `<input>` with Tailwind themselves, and rebuilt the
 * accessibility wiring each time — which means each time differently.
 *
 * What the component holds for the caller:
 *
 * * `label for` ↔ `input id` through `useId`, so the binding cannot go
 *   wrong even with two fields on one page. A placeholder is NOT a label.
 * * An error is announced by text and `aria-invalid`, not by red alone,
 *   and is bound through `aria-describedby` — like the hint and the affix.
 * * Focus shows on the whole frame (`focus-within`), not only on the
 *   `<input>`, because the affix sits inside the same frame.
 *
 * The kit has no i18n namespace of its own: `label`, `hint`, `error`,
 * `affix` and `optionalLabel` arrive translated.
 *
 * `IngotFieldInput` is deliberately not used inside. Only the bare
 * `<input type="text">` would be shared; in exchange a fake
 * `IngotFieldSpec` would have to be built just to have something to pass,
 * and both components would be tied by a type one of them does not need.
 */
export function IngotField({
  label,
  value,
  onChange,
  hint,
  error,
  affix,
  mono = false,
  optionalLabel,
  placeholder,
  required = false,
  disabled = false,
  testId,
}: {
  /** A noun without a colon ("Quantity"), already translated. */
  label: ReactNode;
  value: string;
  onChange: (next: string) => void;
  /** A full sentence with a full stop, under the field. */
  hint?: ReactNode;
  /** Error text. Its presence turns on the error state and `aria-invalid`. */
  error?: ReactNode;
  /**
   * Affix with a unit or currency ("pcs", "%"). A unit NEVER belongs in
   * the placeholder — it vanishes the moment the user starts typing.
   */
  affix?: ReactNode;
  /** Mono + `tabular-nums` for codes and numbers read down a column. */
  mono?: boolean;
  /**
   * Translated "— optional" next to the label.
   *
   * One prop instead of an `optional` + text pair on purpose: `optional`
   * without text would be a state that cannot be rendered, and the kit has
   * nowhere to take the text from.
   */
  optionalLabel?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** `data-testid` of the input — tests reach for what is operated. */
  testId?: string;
}): JSX.Element {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const affixId = `${id}-affix`;

  // The order is reading order: hint, unit, only then the error.
  const describedBy = cx(
    hint != null && hintId,
    affix != null && affixId,
    error != null && errorId,
  );

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-ink-2">
        {label}
        {optionalLabel != null && (
          <span className="ml-1 font-normal text-ink-3">{optionalLabel}</span>
        )}
      </label>
      {/* The frame (radius, border, focus ring) comes from inputChrome, the
          same source as IngotSelect and IngotSearchInput, so a field next
          to a filter select has the same box. The frame is focus-within
          because the affix sits inside it. */}
      <div className={cx("flex items-center", inputFrameChrome({ error: error != null }))}>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={describedBy || undefined}
          className={cx(
            "w-full bg-transparent outline-none placeholder:text-ink-4 disabled:cursor-not-allowed disabled:text-ink-4",
            INPUT_PAD,
            mono && "font-mono tabular-nums",
          )}
          data-testid={testId}
        />
        {affix != null && (
          <span id={affixId} className="shrink-0 pr-3 text-xs text-ink-3">
            {affix}
          </span>
        )}
      </div>
      {hint != null && (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      )}
      {error != null && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
