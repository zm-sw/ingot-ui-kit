import type { JSX } from "react";

import { IngotIcon } from "@/ingot";

/**
 * Kroky „jak to funguje" (KAN-664) — karty se ``.step-num`` „01/02/03"
 * a šipkou k dalšímu kroku; poslední karta šipku nemá.
 *
 * 🪤 **Číslo je malá akcentová pilulka, ne velké šedé číslo.** Handoff
 * dává ``.step-num`` mono 11px, ``--accent-ink`` na ``--accent-bg``
 * a malý rádius: v kartě má nejvyšší váhu titulek kroku, ne jeho pořadí.
 * Velké číslo tu hierarchii obrací a čte se dřív než to, co se má udělat.
 *
 * Číslo se počítá z pořadí, aby nešlo napsat „01, 02, 04". Šipka je
 * dekorace (``aria-hidden`` uvnitř IngotIcon) — pořadí čte odečítač
 * z pořadí karet, ne z ikony.
 *
 * ``columns`` drží pravidlo handoffu: trojsloupcová mřížka je výchozí,
 * čtyři sloupce jen pro kroky procesu. Proto to nabízí jen tenhle blok
 * a jen jako dvě povolené hodnoty — „kolik chceš" by z pravidla udělalo
 * doporučení.
 */
export interface MarketingStepItem {
  title: string;
  text: string;
}

const COLUMNS: Record<3 | 4, string> = {
  3: "min-[1100px]:grid-cols-3",
  4: "min-[1100px]:grid-cols-4",
};

export function MarketingSteps({
  items,
  columns = 3,
  testId,
}: {
  items: readonly MarketingStepItem[];
  /** 3 je výchozí; 4 jen pro kroky procesu. */
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
