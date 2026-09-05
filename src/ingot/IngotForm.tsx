import type { JSX, ReactNode } from "react";

import { IngotCheckbox } from "./IngotCheckbox";
import { IngotFieldInput } from "./IngotFieldInput";
import type { IngotFieldSpec } from "./fields";

/**
 * Deklarativní formulář — první primitivum admin Ingotu (KAN-382).
 *
 * Dostane popis polí (``IngotFieldSpec[]``) a hodnoty; vykreslí popisky, vstupy
 * a nápovědy. Tlačítka, nadpis ani ukládání sem nepatří: každý konzument má
 * jinou akci (uložit override, zapnout integraci) a formulář, který by je
 * znal, by byl zase komponentou jedné obrazovky.
 *
 * Konzumenti dnes: konfigurace operace per tenant
 * (``OperationConfigPanel``), per uzel (``NodeOperationConfigPanel`` —
 * skládá si popisky sám a bere jen ``IngotFieldInput``) a config integrace
 * (``IntegrationCard``).
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
  /** ``data-testid`` vstupu je ``${testIdPrefix}-${key}``. */
  testIdPrefix: string;
  renderOptions?: React.ComponentProps<typeof IngotFieldInput>["renderOptions"];
  secretPlaceholder?: (field: IngotFieldSpec) => string;
  className?: string;
  /** Třída vstupu — obrazovky se liší šířkou pole, ne tvarem formuláře. */
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
        // Zaškrtávátko čte svůj popisek vpravo od sebe; ostatní pole mají
        // popisek nad vstupem. Je to jediná odchylka a drží ji formulář,
        // aby ji konzumenti neopisovali.
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
