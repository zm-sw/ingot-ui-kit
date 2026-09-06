import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Two or three columns inside a block, and the one rule for when they
 * stop being columns.
 *
 * The kit had no grid at all. A settings form with the label on the left
 * and the field on the right, a record's detail with metadata beside the
 * content, three cards in a row — every screen composed those from
 * utilities, each with a different gap and a different point at which it
 * folded. `IngotPageLayout` says outright that this is not its job ("that
 * is the inside of a block"), and nothing else took it: the gap between
 * two columns was decided by whoever wrote the screen that morning.
 *
 * Which is how a design system stops being one. The columns themselves are
 * trivial; that everybody's columns are the SAME columns is the point.
 *
 * ## Folding is a decision, not a default
 *
 * `collapseBelow` says at which width the columns become one. It has no
 * "never": two columns on a phone is two columns of about 150 px, and
 * whatever was worth putting side by side is not readable at that width.
 * The choice is only WHERE — `md` for a form, whose fields survive being
 * narrow, `lg` for a detail beside prose, which does not.
 */

/** How many columns, once there is room for them. */
export type IngotColumnsCount = 2 | 3;

export function IngotColumns({
  columns = 2,
  collapseBelow = "md",
  children,
  className,
  testId,
}: {
  columns?: IngotColumnsCount;
  /** Below this width the columns become one. */
  collapseBelow?: "md" | "lg";
  children: ReactNode;
  /** Layout only — where the block sits, not how wide its columns are. */
  className?: string;
  testId?: string;
}): JSX.Element {
  // Written out rather than composed, because Tailwind reads the source
  // for class names: `md:grid-cols-${columns}` produces a class that is
  // never generated and therefore silently does nothing.
  const shape =
    collapseBelow === "lg"
      ? columns === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2"
      : columns === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";

  return (
    // `gap-4` is `--s-4`, the same step the vertical rhythm of blocks uses,
    // so a two-column block does not introduce a spacing of its own.
    <div
      className={cx("grid grid-cols-1 gap-4", shape, className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

/**
 * A child that takes the whole row instead of one column — a note above a
 * pair of fields, a textarea under them.
 *
 * It exists so a screen never writes `col-span-2` itself. That looks like
 * a small thing to allow, and it is exactly how the grid's own rules leak
 * back out into the screens: the day the block goes from two columns to
 * three, every hand-written span is wrong and nothing says so.
 */
export function IngotColumnsFull({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div className="col-span-full" data-testid={testId}>
      {children}
    </div>
  );
}
