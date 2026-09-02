import { type JSX } from "react";

import { cx } from "./cx";

/**
 * Výběr jedné hodnoty z krátké množiny — filtr nad seznamem, přepínač
 * varianty v nastavení.
 *
 * Nativní ``<select>`` schválně: dostává klávesnici, odečítač i mobilní
 * chování zadarmo a filtry ho používají po tuctech na jedné obrazovce.
 * Vlastní rozbalovací seznam by tu kupoval vzhled za celý balík
 * chování, který by pak někdo musel doopravdy napsat. Až si obrazovka
 * řekne o hledání uvnitř nebo o skupiny, bude to nové primitivum, ne
 * vlastnost tohohle.
 *
 * „Všechny stavy“ je první ``option``, ne placeholder: filtr vždycky
 * v nějakém stavu JE a prázdná hodnota by tvrdila, že není.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající.
 */

export interface IngotSelectOption {
  value: string;
  /** Přeložený popisek volby. */
  label: string;
}

export function IngotSelect({
  value,
  onChange,
  options,
  label,
  disabled = false,
  id,
  className,
  testId,
}: {
  value: string;
  onChange: (next: string) => void;
  options: readonly IngotSelectOption[];
  /**
   * Přeložený ``aria-label``. Povinný, protože filtr bar viditelný
   * popisek nemívá — bez něj odečítač čte jen aktuální hodnotu a
   * uživatel neví, ČEHO je to hodnota. Obrazovka s viditelným
   * ``<label htmlFor>`` předá totéž id přes ``id`` a label může být
   * týž text.
   */
  label: string;
  disabled?: boolean;
  id?: string;
  /** Průchozí třída — šířku určuje obrazovka, vzhled primitivum. */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
      disabled={disabled}
      className={cx(
        "rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink shadow-sm",
        "focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:text-ink-4",
        className,
      )}
      data-testid={testId}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
