import type { JSX, ReactNode } from "react";

import { cx } from "./cx";
import { isNumericKind, type IngotFieldSpec } from "./fields";
import { IngotCheckboxControl } from "./IngotCheckbox";
import { IngotSelect } from "./IngotSelect";
import { inputChrome } from "./inputChrome";

/**
 * The input of one field — the kit's smallest primitive.
 *
 * Deliberately **without a label**: some screens build the label
 * themselves (per-node operation configuration adds an "this node
 * overrides it" checkbox to it). The label and the hint are composed by
 * ``IngotForm`` above this.
 */
export function IngotFieldInput({
  field,
  value,
  onChange,
  disabled = false,
  testId,
  className,
  renderOptions,
  secretPlaceholder,
}: {
  field: IngotFieldSpec;
  value: unknown;
  onChange: (next: unknown) => void;
  disabled?: boolean;
  testId: string;
  className?: string;
  /**
   * Translated placeholder text of a secret field. The kit has no i18n
   * namespace; a consumer that has the translation supplies it, the others
   * get the default text.
   */
  secretPlaceholder?: (field: IngotFieldSpec) => string;
  /**
   * Picker over a named set (``optionsSource``). The kit knows no set
   * itself — data would tie it to one domain. A consumer that has
   * ``options`` fields supplies its picker here; without it the field
   * renders as a disabled select holding only the current value.
   */
  renderOptions?: (args: {
    field: IngotFieldSpec;
    value: unknown;
    onChange: (next: unknown) => void;
    disabled: boolean;
    testId: string;
    className?: string;
  }) => ReactNode;
}): JSX.Element {
  // The frame is the kit's one input chrome; `className` replaces it whole
  // because callers that pass it lay the input into their own grid.
  const inputClass = className ?? cx("w-full max-w-xs", inputChrome());

  if (field.kind === "boolean") {
    // Bare control on purpose: IngotForm supplies the label around it.
    return (
      <IngotCheckboxControl
        disabled={disabled}
        checked={Boolean(value)}
        onChange={(ev) => onChange(ev.target.checked)}
        className={className}
        data-testid={testId}
      />
    );
  }

  if (field.kind === "options") {
    if (renderOptions) {
      const rendered = renderOptions({
        field,
        value,
        onChange,
        disabled,
        testId,
        className,
      });
      if (rendered) return <>{rendered}</>;
    }
    // No picker supplied: a disabled select holding only the current value.
    // A text input here used to invite typing a free string into a field
    // whose value is an id from a named set.
    const current = value === undefined || value === null ? "" : String(value);
    return (
      <IngotSelect
        value={current}
        onChange={onChange}
        options={current === "" ? [] : [{ value: current, label: current }]}
        label={field.label}
        disabled
        className={className}
        testId={testId}
      />
    );
  }

  if (field.kind === "secret") {
    return (
      <input
        type="password"
        autoComplete="new-password"
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        // The only thing the form may say about a stored value is that it is there.
        placeholder={
          secretPlaceholder
            ? secretPlaceholder(field)
            : field.secretConfigured
              ? SECRET_PLACEHOLDER_SET
              : SECRET_PLACEHOLDER_UNSET
        }
        onChange={(ev) => onChange(ev.target.value)}
        className={inputClass}
        data-testid={testId}
      />
    );
  }

  const numeric = isNumericKind(field.kind);
  return (
    <input
      type={numeric ? "number" : "text"}
      disabled={disabled}
      min={numeric ? field.minimum : undefined}
      max={numeric ? field.maximum : undefined}
      step={field.kind === "integer" ? 1 : "any"}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={(ev) =>
        onChange(
          numeric
            ? ev.target.value === ""
              ? null
              : Number(ev.target.value)
            : ev.target.value,
        )
      }
      className={inputClass}
      data-testid={testId}
    />
  );
}

/**
 * Placeholders of a secret field. The kit has no i18n namespace and the
 * text is a one-word state, not a sentence — consumers that have the
 * translated string supply it through ``secretPlaceholder``; this is the
 * default for the others. (Czech defaults are a known gap tracked for the
 * IngotProvider work.)
 */
export const SECRET_PLACEHOLDER_SET = "nastaveno";
export const SECRET_PLACEHOLDER_UNSET = "nenastaveno";
