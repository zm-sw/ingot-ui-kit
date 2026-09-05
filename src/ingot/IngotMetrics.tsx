import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";

/**
 * The numbers a screen is read by at first glance.
 *
 * Two densities, one component:
 *
 * * ``strip`` — a strip under the header, cells in a grid. For four to
 *   six numbers that describe the whole screen.
 * * ``inline`` — a compact cluster in the right part of the header. For
 *   two or three numbers that fit next to the actions.
 *
 * They are two densities of the same thing, not two components: as two,
 * they would drift the moment someone fine-tuned one of them.
 *
 * **The value is mono, the label is not.** Numbers in the strip are read
 * down a column and proportional digits scatter them; ``tabular-nums`` is
 * therefore part of the spec, not a detail. The label is ordinary text —
 * a sentence, not a figure.
 *
 * **Tone is information, not emphasis.** ``danger`` on a cell means that
 * number is a problem — not that it is the most important. A half-coloured
 * strip says nothing.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotMetric {
  /** Label — mono uppercase above the value (``strip``), or after it. */
  label: string;
  /** The value. A number, but "12 / 40" is fine too. */
  value: ReactNode;
  /** A sentence under the value. Only in the ``strip`` variant. */
  note?: ReactNode;
  /** A critical value gets a colour. Default is neutral. */
  tone?: "neutral" | "warn" | "danger";
  /**
   * Trend line — raw values over time, left to right. Only in the
   * ``strip`` variant. Drawn normalised (the shape speaks, not the scale)
   * and decorative: the number is the figure, the line is context. What
   * period it shows is said by the caller next to the strip — e.g. "last
   * 12 weeks". (Owner's decision, 2026-09-02, point 07 — exactly this one
   * shape, no general chart.)
   */
  trend?: readonly number[];
  /** Test anchor on the cell — tests aim at a concrete number, not the strip. */
  testId?: string;
}

/**
 * A normalised 72 × 24 line with an emphasised endpoint.
 *
 * A window without movement (all values equal) is drawn as a DASHED line
 * without an endpoint: a solid horizontal line would claim a stable
 * non-zero value, a dashed one says "nothing happened here". Taken from
 * the platform overview, where a test protected it.
 */
function Sparkline({ trend }: { trend: readonly number[] }): JSX.Element {
  const width = 72;
  const height = 24;
  const pad = 2;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min;
  if (span === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className="shrink-0 text-ink-4"
      >
        <line
          x1={pad}
          y1={height / 2}
          x2={width - pad}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  const points = trend.map((value, index) => {
    const x = pad + (index * (width - 2 * pad)) / Math.max(trend.length - 1, 1);
    const y = height - pad - ((value - min) * (height - 2 * pad)) / span;
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
  /** ``strip`` under the header · ``inline`` cluster in the header. */
  variant?: "strip" | "inline";
  /** Translated ``aria-label`` of the group. */
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
            <IngotEyebrow tone="muted">{item.label}</IngotEyebrow>
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
