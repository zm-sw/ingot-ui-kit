import type { JSX } from "react";

import { IngotIcon, type IngotIconName } from "@/ingot";

/**
 * Trojice featur pod hlavičkou sekce (KAN-664) — ``.tri`` z handoffu
 * Veřejné stránky: ikona 18 px v akcentovém rámečku + h3 + malý text.
 *
 * 🪤 **Jeden zaoblený rám, panely oddělené vlasovou linkou.** Handoff to
 * dělá ``gap:1px`` na podkladu ``--border`` — mezera JE ta linka, takže
 * je vždycky přesně 1 px a nemá kde se rozejít s rámem. Volné sloupce
 * s mezerou by byly tři kartičky, ne jedna trojice.
 *
 * Trojsloupcová mřížka je výchozí tvar veřejných stránek; pod 1100 px
 * jeden sloupec (handoff, ne Tailwind ``lg``).
 */
export interface MarketingTriItem {
  icon: IngotIconName;
  /** Titulek featury (h3). Obsah — dodává volající přeložený. */
  title: string;
  text: string;
}

export function MarketingTri({
  items,
  testId,
}: {
  /** Tři featury. Víc jich mřížka unese, ale handoff počítá se třemi. */
  items: readonly MarketingTriItem[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid gap-px overflow-hidden rounded-lg border border-border bg-border min-[1100px]:grid-cols-3"
      data-testid={testId}
    >
      {items.map((item) => (
        <div key={item.title} className="bg-surface p-[26px]">
          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-accent-border bg-accent-bg text-accent">
            <IngotIcon name={item.icon} size={18} />
          </span>
          <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}
