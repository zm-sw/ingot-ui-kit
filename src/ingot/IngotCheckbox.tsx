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
 * Zaškrtávátko s popiskem — filtr „jen vyžadující zásah“, souhlas ve
 * formuláři, přepínač chování v nastavení.
 *
 * Popisek je součást primitiva, ne doprovod: holé zaškrtávátko bez
 * ``<label>`` je pro odečítač bezejmenný čtvereček a pro myš cíl
 * 16 × 16 px. Tady je popisek vždycky ``<label>`` obalující input,
 * takže klik na text zaškrtává a jméno jede zadarmo.
 *
 * Není to přepínač (switch): zaškrtávátko je volba ve formuláři nebo
 * filtru a projeví se, až se stav použije; přepínač by sliboval okamžitý
 * účinek. Až si o něj obrazovka řekne, bude to vlastní primitivum.
 *
 * Ingot **nemá vlastní i18n namespace** — popisek dodává volající.
 */
export function IngotCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  testId,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Přeložený viditelný popisek. Nese jméno prvku — proto povinný. */
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <label
      className={cx(
        "flex items-center gap-2 text-sm",
        disabled ? "cursor-not-allowed text-ink-4" : "text-ink-2",
        className,
      )}
    >
      <IngotCheckboxControl
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        data-testid={testId}
      />
      {label}
    </label>
  );
}
