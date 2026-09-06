import { useId, useState, type JSX, type ReactNode } from "react";

import { IngotIcon } from "./IngotIcon";

/**
 * FAQ — ``.faq-item`` from the "Public pages" handoff, the question as a
 * button.
 *
 * The prototype has an accessibility hole: the question is a button
 * without ``aria-expanded`` and ``aria-controls`` and 2 of 3 answers are
 * empty. Here both are closed by contract: the button carries both
 * attributes (this component holds them, not the caller) and ``answer`` is
 * a REQUIRED field — an item without an answer fails the typecheck, so an
 * empty FAQ cannot even be written.
 *
 * Keyboard for free through the native ``<button>`` (Enter / Space); the
 * unfolded panel is a ``role="region"`` named by the question so a screen
 * reader can skip it as a whole.
 *
 * The answer has its OWN top padding. The question's bottom ``py-4``
 * belongs to the button — it is tinted on hover — so an answer without
 * ``pt`` started exactly at the edge of the tinted row and read as its
 * continuation, not as a paragraph. With ``s-2`` on top there is the same
 * 24 px above and below the answer and both numbers sit on the spacing
 * scale; the original 20 px did not.
 */
export interface IngotMarketingFaqItem {
  /** Stable item key (content comes from data; an index is not a key). */
  id: string;
  question: string;
  /** The answer is required — an FAQ with an empty answer is a hole, not content. */
  answer: ReactNode;
}

export function IngotMarketingFaq({
  items,
  testId,
}: {
  items: readonly IngotMarketingFaqItem[];
  testId?: string;
}): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div
      className="divide-y divide-border rounded-lg border border-border bg-surface"
      data-testid={testId}
    >
      {items.map((item) => {
        const open = item.id === openId;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-question`;
        return (
          <div key={item.id}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-ink hover:bg-surface-2"
              data-testid={testId ? `${testId}-question-${item.id}` : undefined}
            >
              {item.question}
              <span
                className={
                  open
                    ? "rotate-180 text-ink-3 transition-transform"
                    : "text-ink-3 transition-transform"
                }
              >
                <IngotIcon name="chevron-down" size={16} />
              </span>
            </button>
            {open && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-6 pt-2 pb-6 text-[13px] leading-relaxed text-ink-2"
                data-testid={testId ? `${testId}-answer-${item.id}` : undefined}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
