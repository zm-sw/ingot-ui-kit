import type { JSX } from "react";

/**
 * Segmenty „Pro koho" (KAN-664) — karty s tag pilulkami z handoffu
 * Veřejné stránky. Pilulky jsou neutrální (surface-2), žádná z nich
 * nenese akcent — pravidlo „akcent jen na jednom prvku sekce" patří
 * hlavičce sekce, ne kartám.
 */
export interface MarketingSegmentItem {
  title: string;
  text: string;
  /** Tag pilulky — krátké štítky, dodané přeložené. */
  tags: readonly string[];
}

export function MarketingSegments({
  items,
  testId,
}: {
  items: readonly MarketingSegmentItem[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid gap-6 min-[1100px]:grid-cols-3"
      data-testid={testId}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-lg border border-border bg-surface p-6"
        >
          <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            {item.text}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-ink-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
