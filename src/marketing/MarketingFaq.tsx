import { useId, useState, type JSX, type ReactNode } from "react";

import { IngotIcon } from "@/ingot";

/**
 * FAQ (KAN-664) — ``.faq-item`` z handoffu Veřejné stránky, otázka jako
 * button.
 *
 * 🚨 Prototyp má a11y díru: otázka je button bez ``aria-expanded`` a
 * ``aria-controls`` a 2 ze 3 odpovědí jsou prázdné. Tady je obojí
 * dotažené kontraktem: button nese oba atributy (drží je tahle
 * komponenta, ne volající) a ``answer`` je POVINNÉ pole — položka bez
 * odpovědi neprojde typecheckem, takže prázdné FAQ nejde ani napsat.
 *
 * Klávesnice zadarmo přes nativní ``<button>`` (Enter/mezerník);
 * rozbalený panel je ``role="region"`` pojmenovaný otázkou, aby se
 * v odečítači dal přeskočit jako celek.
 */
export interface MarketingFaqItem {
  /** Stabilní klíč položky (obsah přijde z dat, index není klíč). */
  id: string;
  question: string;
  /** Odpověď je povinná — FAQ s prázdnou odpovědí je díra, ne obsah. */
  answer: ReactNode;
}

export function MarketingFaq({
  items,
  testId,
}: {
  items: readonly MarketingFaqItem[];
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
                className="px-6 pb-5 text-[13px] leading-relaxed text-ink-2"
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
