import type { JSX } from "react";

import { IngotIcon } from "./IngotIcon";

/**
 * "How it works" steps — cards with a ``.step-num`` "01/02/03" and an
 * arrow to the next step; the last card has no arrow.
 *
 * **The number is a small accent pill, not a big grey numeral.** The
 * handoff gives ``.step-num`` mono 11px, ``--accent-ink`` on
 * ``--accent-bg`` and a small radius: the step's title has the highest
 * weight in the card, not its order. A big numeral inverts that hierarchy
 * and is read before what is to be done.
 *
 * The number is computed from the order so "01, 02, 04" cannot be written.
 * The arrow is decoration (``aria-hidden`` inside IngotIcon) — a screen
 * reader reads the order from the order of cards, not from the icon.
 *
 * ``columns`` holds the handoff rule: a three-column grid is the default,
 * four columns only for process steps. Hence only this block offers it and
 * only as two allowed values — "as many as you like" would turn the rule
 * into a recommendation.
 */
export interface IngotMarketingStepItem {
  title: string;
  text: string;
}

const COLUMNS: Record<3 | 4, string> = {
  3: "min-[1100px]:grid-cols-3",
  4: "min-[1100px]:grid-cols-4",
};

export function IngotMarketingSteps({
  items,
  columns = 3,
  testId,
}: {
  items: readonly IngotMarketingStepItem[];
  /** 3 is the default; 4 only for process steps. */
  columns?: 3 | 4;
  testId?: string;
}): JSX.Element {
  return (
    <ol
      className={`grid list-none gap-6 p-0 ${COLUMNS[columns]}`}
      data-testid={testId}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="relative rounded-lg border border-border bg-surface p-6"
        >
          <div className="flex items-start justify-between">
            <span className="rounded-sm bg-accent-bg px-2 py-[3px] font-mono text-[11px] font-semibold text-accent-ink">
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < items.length - 1 && (
              <span className="text-ink-4">
                <IngotIcon name="arrow-right" size={16} />
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
