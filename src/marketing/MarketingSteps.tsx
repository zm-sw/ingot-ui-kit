import type { JSX } from "react";

import { IngotIcon } from "@/ingot";

/**
 * Kroky „jak to funguje" (KAN-664) — tři karty se ``.step-num``
 * „01/02/03" a šipkou k dalšímu kroku; poslední karta šipku nemá.
 *
 * Číslo se počítá z pořadí, aby nešlo napsat „01, 02, 04". Šipka je
 * dekorace (``aria-hidden`` uvnitř IngotIcon) — pořadí čte odečítač
 * z pořadí karet, ne z ikony.
 */
export interface MarketingStepItem {
  title: string;
  text: string;
}

export function MarketingSteps({
  items,
  testId,
}: {
  items: readonly MarketingStepItem[];
  testId?: string;
}): JSX.Element {
  return (
    <ol
      className="grid list-none gap-6 p-0 min-[1100px]:grid-cols-3"
      data-testid={testId}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="relative rounded-lg border border-border bg-surface p-6"
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-2xl font-medium text-ink-4">
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < items.length - 1 && (
              <span className="text-ink-4">
                <IngotIcon name="arrow-right" size={18} />
              </span>
            )}
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-ink">
            {item.title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            {item.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
