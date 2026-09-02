import { useId, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Výběr jedné varianty, kde volba potřebuje vysvětlení.
 *
 * Rozdíl proti obyčejnému přepínači je v tom, co se vybírá: varianty
 * v nastavení nejsou „ano/ne", ale rozhodnutí s důsledkem („ceník podle
 * hmotnosti" vs. „podle času stroje"). Vysvětlující věta proto není
 * nápověda navíc — je to půlka volby, a v rozbalovacím seznamu by se
 * nevešla.
 *
 * 🪤 **Klikatelná je celá karta, ne jen kolečko.** Karta s textem, kde
 * reaguje jen puntík o průměru 16 px, je past — obzvlášť na dotyku.
 * Proto je popiskem ``<label>`` kolem celého obsahu.
 *
 * ⚠️ **Vybraná varianta je poznat obrysem, ne výplní.** Vyplněná karta
 * by soupeřila s obsahem, který popisuje; obrys v akcentu stačí a drží
 * kontrast i v tmavém motivu.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */

export function IngotOptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  disabled = false,
  testId,
}: {
  /** Jméno skupiny — všechny varianty jedné volby ho sdílejí. */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  /** Jedna věta: co ta volba znamená. Ne co dělá tlačítko. */
  description?: ReactNode;
  disabled?: boolean;
  testId?: string;
}): JSX.Element {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cx(
        "flex cursor-pointer gap-3 rounded-md border bg-surface px-4 py-3.5",
        checked
          ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
          : "border-border-strong hover:border-ink-4",
        disabled && "cursor-not-allowed opacity-60",
      )}
      data-testid={testId}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{title}</span>
        {description !== undefined && (
          <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-3">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
