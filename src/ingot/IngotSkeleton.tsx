import { type JSX } from "react";

import { cx } from "./cx";

/**
 * The shape of what is coming, while it is still coming.
 *
 * The kit had nothing for this, so loading was a blank area followed by
 * the content arriving all at once and pushing everything down. Both
 * halves are bad: an empty screen is indistinguishable from a broken one,
 * and the jump costs the reader the line they were looking at. The doc web
 * wrote "Loading the demo…" as a sentence instead, which says the same
 * thing without holding any of the space.
 *
 * A skeleton is not decoration. It says *what* is loading — a paragraph,
 * a card, a table — and it holds the room, so nothing moves when the data
 * lands.
 *
 * ## It is one element to a screen reader, not thirty grey boxes
 *
 * The bars are `aria-hidden` and the block carries `aria-busy` with the
 * caller's label. Left as they are, a screen reader would walk through
 * every bar and announce nothing thirty times.
 */

/** What is loading. The shape has to look like what replaces it. */
export type IngotSkeletonShape = "text" | "card" | "table" | "metrics";

/** One bar. `animate-pulse` is Tailwind's own, and it stops under reduced motion. */
function Bar({ className }: { className: string }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block animate-pulse rounded bg-surface-3 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function IngotSkeleton({
  shape = "text",
  rows = 3,
  label,
  className,
  testId,
}: {
  shape?: IngotSkeletonShape;
  /**
   * How many lines, rows or cards. Ignored by `metrics`, which is a row of
   * four tiles by definition.
   */
  rows?: number;
  /**
   * What is loading, already translated — "Loading the orders". A screen
   * reader announces this and nothing else; the bars are hidden from it.
   */
  label: string;
  /** Layout only — where the block sits. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const lines = Math.max(1, rows);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cx("w-full", className)}
      data-testid={testId}
    >
      {shape === "text" && (
        <span className="block space-y-2">
          {Array.from({ length: lines }, (_unused, index) => (
            // The last line is short, the way a paragraph's last line is.
            // A block of equal bars reads as a table, not as prose.
            <Bar
              key={index}
              className={cx("h-3", index === lines - 1 ? "w-2/3" : "w-full")}
            />
          ))}
        </span>
      )}

      {shape === "card" && (
        <span className="block space-y-3">
          {Array.from({ length: lines }, (_unused, index) => (
            <span
              key={index}
              className="block space-y-2 rounded-md border border-border bg-surface p-4"
            >
              <Bar className="h-3 w-1/3" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-4/5" />
            </span>
          ))}
        </span>
      )}

      {shape === "table" && (
        <span className="block divide-y divide-border rounded-md border border-border">
          <span className="flex gap-4 bg-surface-2 px-3 py-2.5">
            <Bar className="h-2.5 w-24" />
            <Bar className="h-2.5 w-32" />
            <Bar className="h-2.5 w-20" />
            <Bar className="h-2.5 w-16" />
          </span>
          {Array.from({ length: lines }, (_unused, index) => (
            <span key={index} className="flex gap-4 px-3 py-3">
              <Bar className="h-3 w-24" />
              <Bar className="h-3 w-32" />
              <Bar className="h-3 w-20" />
              <Bar className="h-3 w-16" />
            </span>
          ))}
        </span>
      )}

      {shape === "metrics" && (
        <span className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }, (_unused, index) => (
            <span
              key={index}
              className="block space-y-2 rounded-md border border-border bg-surface p-4"
            >
              <Bar className="h-2.5 w-2/3" />
              <Bar className="h-6 w-1/2" />
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
