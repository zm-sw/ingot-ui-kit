import type { JSX, ReactNode } from "react";

import { cx } from "./cx";
import { isNumericKind, type IngotFieldSpec } from "./fields";
import { IngotCheckboxControl } from "./IngotCheckbox";
import { IngotSelect } from "./IngotSelect";
import { inputChrome } from "./inputChrome";

/**
 * Vstup jednoho pole — nejmenší primitivum Ingotu (KAN-382).
 *
 * Je záměrně **bez popisku**: existují obrazovky, které popisek staví samy
 * (per-uzlová konfigurace operace k němu přidává zaškrtávátko „tento uzel to
 * přenastavuje"). Popisek a nápovědu skládá ``IngotForm`` nad tímhle.
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
   * Přeložený text placeholderu tajného pole. Ingot nemá vlastní i18n
   * namespace; konzument, který překlad má (integrace ho mají od KAN-379),
   * ho podstrčí, ostatní dostanou český výchozí text.
   */
  secretPlaceholder?: (field: IngotFieldSpec) => string;
  /**
   * Výběr z pojmenované množiny (``x_options``). Ingot sám žádnou množinu
   * nezná — data by ho svázala s jednou doménou. Konzument, který pole
   * typu ``options`` má, sem podstrčí svůj výběr; bez něj Ingot spadne
   * zpátky na textové pole, přesně jak to dělal formulář před sloučením.
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
        // Jediné, co formulář o uložené hodnotě smí říct, je že tam je.
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
 * Placeholdery tajného pole. Ingot nemá vlastní i18n namespace, a text je
 * jednoslovný stav, ne věta — konzumenti, kteří mají přeložený řetězec
 * (integrace ho mají od KAN-379), si ho podstrčí přes ``field.label``
 * nezávisle; tohle je výchozí hodnota pro ty ostatní.
 */
export const SECRET_PLACEHOLDER_SET = "nastaveno";
export const SECRET_PLACEHOLDER_UNSET = "nenastaveno";
