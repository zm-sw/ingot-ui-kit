import type { JSX } from "react";

import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * Three features under a section header — ``.tri`` from the "Public
 * pages" handoff: an 18 px icon in an accent frame + h3 + small text.
 *
 * **One rounded frame, panels separated by a hairline.** The handoff does
 * it with ``gap:1px`` on a ``--border`` background — the gap IS the line,
 * so it is always exactly 1 px and has nowhere to diverge from the frame.
 * Loose columns with a gap would be three little cards, not one trio.
 *
 * A three-column grid is the default shape of the public pages; below
 * 1100 px one column (the handoff, not Tailwind's ``lg``).
 */
export interface IngotMarketingTriItem {
  icon: IngotIconName;
  /** Feature title (h3). Content — supplied translated by the caller. */
  title: string;
  text: string;
}

export function IngotMarketingTri({
  items,
  testId,
}: {
  /** Three features. The grid can hold more, but the handoff counts on three. */
  items: readonly IngotMarketingTriItem[];
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
