import type { JSX, ReactNode } from "react";

import { IngotCheckbox } from "./IngotCheckbox";
import { IngotFieldInput } from "./IngotFieldInput";
import type { IngotFieldSpec } from "./fields";

/**
 * Declarative form — the kit's first admin primitive.
 *
 * It takes field descriptions (``IngotFieldSpec[]``) and values; it renders
 * labels, inputs and hints. Buttons, a heading and saving do not belong
 * here: every consumer has a different action (save an override, enable an
 * integration) and a form that knew them would again be one screen's
 * component.
 *
 * Consumers: per-tenant operation configuration, per-node operation
 * configuration (which composes its own labels and takes only
 * ``IngotFieldInput``) and integration configuration.
 */
export function IngotForm({
  fields,
  values,
  onChange,
  testIdPrefix,
  renderOptions,
  secretPlaceholder,
  className = "space-y-4",
  inputClassName,
  labelClassName = "block text-sm",
}: {
  fields: readonly IngotFieldSpec[];
  values: Record<string, unknown>;
  onChange: (key: string, next: unknown) => void;
  /** An input's ``data-testid`` is ``${testIdPrefix}-${key}``. */
  testIdPrefix: string;
  renderOptions?: React.ComponentProps<typeof IngotFieldInput>["renderOptions"];
  secretPlaceholder?: (field: IngotFieldSpec) => string;
  className?: string;
  /** Input class — screens differ in field width, not in the form's shape. */
  inputClassName?: string;
  labelClassName?: string;
}): JSX.Element {
  return (
    <div className={className}>
      {fields.map((field) => {
        const input: ReactNode = (
          <IngotFieldInput
            field={field}
            value={values[field.key]}
            onChange={(next) => onChange(field.key, next)}
            testId={`${testIdPrefix}-${field.key}`}
            className={inputClassName}
            renderOptions={renderOptions}
            secretPlaceholder={secretPlaceholder}
          />
        );
        // A checkbox reads its label to its right; every other field has
        // the label above the input. It is the one deviation and the form
        // holds it so consumers do not copy it.
        if (field.kind === "boolean") {
          // The labelled checkbox already exists as a primitive; the form
          // used to redraw its label wrapper by hand.
          return (
            <IngotCheckbox
              key={field.key}
              checked={Boolean(values[field.key])}
              onChange={(next) => onChange(field.key, next)}
              label={field.label}
              testId={`${testIdPrefix}-${field.key}`}
            />
          );
        }
        return (
          <label key={field.key} className={labelClassName}>
            <span className="mb-1 block text-ink-2">{field.label}</span>
            {input}
            {field.description && (
              <span className="mt-1 block text-[11px] text-ink-3">
                {field.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
