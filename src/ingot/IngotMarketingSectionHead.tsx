import type { JSX } from "react";

import { IngotEyebrow } from "./IngotEyebrow";

/**
 * Hlavička marketingové sekce (KAN-664) — handoff Veřejné stránky,
 * ingot.css sekce 13.
 *
 * Dvousloupec: eyebrow + h2 vlevo, lede vpravo. Teze handoffu: žádné
 * gradienty a ilustrace — sekci nese typografie a linka. Akcent smí být
 * v sekci jen na JEDNOM prvku; tady ho nese eyebrow, takže nadpis ani
 * lede už akcentové nejsou.
 *
 * Responzivita dle handoffu: pod 1100 px se mřížka skládá na jeden
 * sloupec — proto arbitrary varianta ``min-[1100px]:``, ne ``lg:``
 * (Tailwind ``lg`` je 1024 px a s handoffem by se rozešel).
 *
 * Texty jsou obsah (CMS/branding data), ne hardcode — komponenta je
 * proto bere výhradně přes props.
 */
export function IngotMarketingSectionHead({
  eyebrow,
  title,
  lede,
  testId,
}: {
  /** Krátký štítek nad nadpisem — jediný akcentový prvek sekce. */
  eyebrow?: string;
  /** Nadpis sekce (h2). Dodaný přeložený — obsah, ne konstanta. */
  title: string;
  /** Uvozující odstavec v pravém sloupci. */
  lede?: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid gap-4 min-[1100px]:grid-cols-2 min-[1100px]:items-end min-[1100px]:gap-12"
      data-testid={testId}
    >
      <div>
        {eyebrow !== undefined && (
          <IngotEyebrow size="md" tone="accent" className="mb-3">
            {eyebrow}
          </IngotEyebrow>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {lede !== undefined && (
        <p className="text-[15px] leading-relaxed text-ink-3">{lede}</p>
      )}
    </div>
  );
}
