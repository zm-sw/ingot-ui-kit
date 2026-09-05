import type { JSX } from "react";

/**
 * "Who it is for" segments — cards with tags from the "Public pages"
 * handoff. The tags are neutral (surface-2), none carries the accent — the
 * "accent on one element per section" rule belongs to the section header,
 * not the cards.
 *
 * **A tag is square mono in lowercase, not a round pill in small caps.**
 * The handoff keeps ``.seg-tag`` close to ``codetag``: it is a technical
 * fact about the workshop, not an entity state. A round uppercase pill is a
 * status badge (``IngotBadge``) and would confuse roles with it.
 */
export interface IngotMarketingSegmentItem {
  title: string;
  text: string;
  /** Tag texts — short labels, supplied translated. */
  tags: readonly string[];
}

export function IngotMarketingSegments({
  items,
  testId,
}: {
  items: readonly IngotMarketingSegmentItem[];
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
                className="rounded-sm border border-border bg-surface-2 px-[7px] py-[3px] font-mono text-[10.5px] lowercase text-ink-3"
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
