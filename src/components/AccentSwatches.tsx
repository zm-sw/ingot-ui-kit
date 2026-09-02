/**
 * The accent-family picker (KAN-648) — five 18×18 dots, one per family.
 *
 * Purely presentational and label-agnostic **on purpose**: it is rendered
 * both by the app shell (labels from i18next, value from ``useAccent``)
 * and by the Ingot doc web, which is its own entry point with its own
 * ``Localized`` chrome strings and no query client. A component that
 * reached for either source could only live in one of the two.
 *
 * 🪤 The dots do not know their colours. Each carries ``data-accent`` and
 * paints itself with ``var(--accent)``, so the swatch is drawn by the very
 * block it advertises — see the accent-family section in
 * ``styles/globals.css``. A hex list here would be a second truth about
 * what "emerald" looks like, and the two would drift.
 */

import type { JSX } from "react";

import { ACCENT_CHOICES, type AccentChoice } from "@/lib/accent";
import { cx } from "../ingot/cx";

interface AccentSwatchesProps {
  value: AccentChoice;
  onChange: (choice: AccentChoice) => void;
  /** Names the group for screen readers, e.g. "Akcent". */
  groupLabel: string;
  /** Per-family accessible name, e.g. ``(c) => \`Akcent ${names[c]}\``. */
  optionLabel: (choice: AccentChoice) => string;
  disabled?: boolean;
  className?: string;
}

export function AccentSwatches({
  value,
  onChange,
  groupLabel,
  optionLabel,
  disabled,
  className,
}: AccentSwatchesProps): JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className={cx("inline-flex items-center gap-1.5", className)}
    >
      {ACCENT_CHOICES.map((choice) => {
        const active = choice === value;
        const label = optionLabel(choice);
        return (
          <button
            key={choice}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            disabled={disabled}
            data-accent={choice}
            onClick={() => onChange(choice)}
            className={cx(
              // 🪤 Terč je 28×28, tečka zůstává 18×18. Sáhnout se musí dát
              // prstem (WCAG 2.2 AA, 2.5.8 chce aspoň 24×24), ale zvětšit
              // kolečko by rozbilo lištu z handoffu — proto roste plocha
              // kolem něj, ne ono samo. Tlačítko nic nekreslí; kreslí
              // vnitřní ``span``.
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-0 disabled:opacity-60",
            )}
            data-testid={`accent-swatch-${choice}`}
          >
            {/* ``data-accent`` sedí na tlačítku výš, takže ``var(--accent)``
                se sem dědí — tečku pořád barví ten blok, který inzeruje. */}
            <span
              aria-hidden="true"
              className="h-[18px] w-[18px] rounded-full border-2 transition-colors"
              style={{
                background: "var(--accent)",
                // The active ring is the ink colour by design — a ring in the
                // family's own colour is invisible against the dot it circles.
                borderColor: active ? "var(--ink)" : "var(--border-strong)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
