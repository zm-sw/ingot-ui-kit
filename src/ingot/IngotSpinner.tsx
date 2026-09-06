import { type JSX } from "react";

import { cx } from "./cx";

/**
 * Something is happening and there is no shape to hold.
 *
 * The kit had no progress indicator at all, so a screen either froze
 * silently or grew a spinner of its own — and the ones that grew were all
 * slightly different circles.
 *
 * **A spinner is the second choice, not the first.** Where the shape of
 * what is coming is known, `IngotSkeleton` says more and holds the room so
 * nothing jumps when the data lands. A spinner belongs where there is no
 * shape: a button that is submitting, a panel waiting on an answer whose
 * size nobody can predict.
 *
 * `label` is required. A spinning circle with no name is, to a screen
 * reader, a picture of nothing — the reader learns that something is
 * happening only if the page says so.
 */
export type IngotSpinnerSize = "sm" | "md";

/** Matched to `Button` so a spinner beside a button is the same height. */
const SIZE: Record<IngotSpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
};

export function IngotSpinner({
  size = "sm",
  label,
  block = false,
  className,
  testId,
}: {
  size?: IngotSpinnerSize;
  /** What is happening, already translated — "Saving". Required. */
  label: string;
  /**
   * Centred on its own line rather than sitting inline. For a panel
   * waiting on an answer; a button keeps the inline shape.
   */
  block?: boolean;
  /** Layout only — margins, alignment. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const circle = (
    <span
      aria-hidden="true"
      className={cx(
        // Three quarters of the ring are the accent and one quarter is
        // transparent — that gap is what makes the rotation visible at
        // all. `motion-reduce` stops it: a spinner nobody asked for that
        // never stops is exactly what that setting exists to switch off.
        "inline-block animate-spin rounded-full border-accent border-r-transparent motion-reduce:animate-none",
        SIZE[size],
      )}
    />
  );

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cx(block && "flex w-full justify-center py-6", className)}
      data-testid={testId}
    >
      {circle}
    </span>
  );
}
