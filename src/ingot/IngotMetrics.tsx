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
  /**
   * Křivka vývoje — syrové hodnoty v čase, zleva doprava. Jen ve
   * variantě ``strip``. Kreslí se normalizovaná (vypovídá tvar, ne
   * měřítko) a je dekorativní: číslo je údaj, křivka kontext. Co období
   * ukazuje, říká volající vedle pruhu — třeba „posledních 12 týdnů".
   * (Rozhodnutí vlastníka 2026-09-02, bod 07 — právě tenhle jeden tvar,
   * žádný obecný graf.)
   */
  trend?: readonly number[];
  /** Kotva testu na buňce — testy míří na konkrétní číslo, ne na pruh. */
  testId?: string;
}

/**
 * Normalizovaná čára 72 × 24 se zvýrazněným koncem. Dvě stejné hodnoty
 * (nebo jediná) by daly dělení nulou — čára se pak kreslí vodorovně.
 */
function Sparkline({ trend }: { trend: readonly number[] }): JSX.Element {
  const width = 72;
  const height = 24;
  const pad = 2;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min;
  const points = trend.map((value, index) => {
    const x = pad + (index * (width - 2 * pad)) / Math.max(trend.length - 1, 1);
    const y =
      span === 0
        ? height / 2
        : height - pad - ((value - min) * (height - 2 * pad)) / span;
    return [x, y] as const;
  });
  const last = points[points.length - 1]!;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0 text-ink-4"
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2" className="fill-accent" />
    </svg>
  );
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
            data-testid={item.testId}
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
          className="flex items-start justify-between gap-3 border-r border-border px-[18px] py-3.5 last:border-r-0"
          data-testid={item.testId}
        >
          <div className="min-w-0">
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
          {item.trend !== undefined && item.trend.length > 1 && (
            <span className="mt-4">
              <Sparkline trend={item.trend} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
