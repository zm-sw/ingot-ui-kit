import { useId, useState, type JSX, type ReactNode } from "react";

import { IngotIcon } from "./IngotIcon";

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
 *
 * Odpověď má VLASTNÍ horní odsazení. Spodní ``py-4`` otázky patří
 * tlačítku — na hoveru je podbarvené — takže odpověď bez ``pt`` začínala
 * přesně na hraně podbarveného řádku a četla se jako jeho pokračování,
 * ne jako odstavec. S ``s-2`` nahoře je nad odpovědí i pod ní stejných
 * 24 px a obě čísla stojí na krokové škále; původních 20 px na ní nebylo.
 */
export interface IngotMarketingFaqItem {
  /** Stabilní klíč položky (obsah přijde z dat, index není klíč). */
  id: string;
  question: string;
  /** Odpověď je povinná — FAQ s prázdnou odpovědí je díra, ne obsah. */
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
