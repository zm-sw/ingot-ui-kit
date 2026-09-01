import type { JSX, ReactNode } from "react";

import { cx } from "./cx";

/**
 * Stavový štítek (KAN-652) — stav entity jedním slovem.
 *
 * Mono a verzálky schválně: štítek pojmenovává STAV („ve výrobě“, „hotovo“),
 * ne akci. Akce je tlačítko, a jakmile štítek vypadá jako věta, začne se do
 * něj psát věta.
 *
 * 🎨 **Tón jde JEN přes `tone`, `className` komponenta nebere.** Dnešní
 * `components/ui/Pill` ho bere, a jeho `className="bg-…"` s tónem prohrává —
 * volající si tedy může myslet, že barvu přepsal, a ona zůstane. Dvojznačnost
 * se tady nedá vyrobit, protože druhý zápis neexistuje.
 *
 * Co to NENÍ:
 *
 * * **Počet.** Odznak s číslem je `CountBadge` (`components/ui/CountBadge`) —
 *   jiná specifikace: kulatý, práh `99+`, povinný popisek pro odečítač,
 *   nula se nekreslí. Číslo není stav.
 * * **Klikací filtr.** Štítek není interaktivní: nemá fokus, roli ani
 *   klávesovou obsluhu. Filtr, který jde zapnout, je chip a musí být tlačítko.
 *
 * A11y: barva význam nenese — nese ho text, a ten je povinný. `dot` je čistě
 * dekorace živého stavu a je proto `aria-hidden`.
 *
 * Ingot **nemá vlastní i18n namespace**: text dodává volající už přeložený.
 */
export type IngotBadgeTone =
  | "neutral"
  | "ok"
  | "warn"
  | "danger"
  | "accent"
  | "ink";

/**
 * Tón → dvojice pozadí/text z tokenů. Obojí musí unést 4,5:1 ve světlém
 * i tmavém motivu; měří to `tests/ingot/IngotBadge.test.tsx` nad skutečnými
 * hodnotami z `globals.css`, ne nad jménem třídy.
 *
 * `ink` je jediný plný — je to nejsilnější důraz a na tintu by nešel odlišit
 * od `neutral`.
 */
const TONE: Record<IngotBadgeTone, string> = {
  neutral: "border-border bg-surface-2 text-ink-2",
  ok: "border-ok-border bg-ok-bg text-ok",
  warn: "border-warn-border bg-warn-bg text-warn",
  danger: "border-danger-border bg-danger-bg text-danger",
  accent: "border-accent-border bg-accent-bg text-accent-ink",
  ink: "border-ink bg-ink text-surface",
};

export function IngotBadge({
  children,
  tone = "neutral",
  dot = false,
  testId,
}: {
  /** Stav jedním slovem, už přeložený. */
  children: ReactNode;
  tone?: IngotBadgeTone;
  /** Tečka pro živý stav („právě běží“). Dekorace, ne význam. */
  dot?: boolean;
  testId?: string;
}): JSX.Element {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5",
        "font-mono text-[11px] font-medium uppercase tracking-wide",
        TONE[tone],
      )}
      data-testid={testId}
    >
      {dot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
