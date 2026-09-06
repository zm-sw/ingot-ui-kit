/**
 * Segmented switch for the doc-web top bar — the handoff's `.top .seg`
 * pattern (theme and language pickers in the sticky header).
 *
 * Lives next to ``IngotAccentSwatches`` on purpose: it is doc-web chrome, not
 * a kit primitive. The admin shell has its own controls for these
 * choices; promoting this to ``@/ingot`` would document a component the
 * app never uses.
 */

import type { JSX } from "react";

import { cx } from "./cx";

export interface IngotSegmentedOption {
  value: string;
  label: string;
}

export function IngotSegmented({
  options,
  value,
  onChange,
  label,
  testId,
}: {
  options: readonly IngotSegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Names the group for screen readers, e.g. "Motiv". */
  label: string;
  /** Group testid; each option gets `${testId}-${value}`. */
  testId?: string;
}): JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-[7px] border border-border bg-surface-2 p-0.5"
      data-testid={testId}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "grid h-6 min-w-7 place-items-center rounded-[5px] px-2 text-xs font-medium",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-3 hover:text-ink",
            )}
            data-testid={testId ? `${testId}-${option.value}` : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
