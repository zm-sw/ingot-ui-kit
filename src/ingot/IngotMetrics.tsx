import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Čísla, podle kterých se obrazovka čte na první pohled.
 *
 * Dvě hustoty, jedna komponenta:
 *
 * * ``strip`` — pruh pod hlavičkou, buňky ve mřížce. Pro čtyři až šest
 *   čísel, která popisují celou obrazovku.
 * * ``inline`` — kompaktní shluk do pravé části hlavičky. Pro dvě až tři
 *   čísla, která se vejdou vedle akcí.
 *
 * Jsou to dvě hustoty téhož, ne dvě komponenty: kdyby to byly dvě,
 * rozejdou se v okamžiku, kdy někdo jednu z nich doladí.
 *
 * 🪤 **Hodnota je mono, popisek ne.** Čísla se v pruhu čtou pod sebou
 * a proporcionální číslice je rozhodí; ``tabular-nums`` je proto součást
 * specifikace, ne detail. Popisek je běžný text — je to věta, ne údaj.
 *
 * ⚠️ **Tón je informace, ne důraz.** ``danger`` na buňce znamená, že to
 * číslo je problém — ne že je nejdůležitější. Obarvená polovina pruhu
 * nesděluje nic.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající.
 */

export interface IngotMetric {
  /** Popisek — mono verzálky nad hodnotou (``strip``), nebo za ní. */
  label: string;
  /** Hodnota. Číslo, ale klidně i „12 / 40". */
  value: ReactNode;
  /** Věta pod hodnotou. Jen ve variantě ``strip``. */
  note?: ReactNode;
  /** Kritická hodnota se obarví. Výchozí je neutrální. */
  tone?: "neutral" | "warn" | "danger";
}

const TONE: Record<NonNullable<IngotMetric["tone"]>, string> = {
  neutral: "text-ink",
  warn: "text-warn",
  danger: "text-danger",
};

export function IngotMetrics({
  items,
  variant = "strip",
  label,
  testId,
}: {
  items: readonly IngotMetric[];
  /** ``strip`` pruh pod hlavičkou · ``inline`` shluk v hlavičce. */
  variant?: "strip" | "inline";
  /** Přeložený ``aria-label`` skupiny. */
  label: string;
  testId?: string;
}): JSX.Element {
  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={label}
        className="flex items-center overflow-hidden rounded-md border border-border bg-surface"
        data-testid={testId}
      >
        {items.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-1.5 border-r border-border px-3.5 py-2 text-[13px] text-ink-3 last:border-r-0"
          >
            <b
              className={cx(
                "font-mono font-semibold tabular-nums",
                TONE[item.tone ?? "neutral"],
              )}
            >
              {item.value}
            </b>
            {item.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border border-border bg-surface"
      data-testid={testId}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="border-r border-border px-[18px] py-3.5 last:border-r-0"
        >
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-4">
            {item.label}
          </p>
          <p
            className={cx(
              "mt-1 font-mono text-[22px] font-semibold tabular-nums leading-none",
              TONE[item.tone ?? "neutral"],
            )}
          >
            {item.value}
          </p>
          {item.note !== undefined && (
            <p className="mt-1.5 text-[13px] text-ink-3">{item.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
