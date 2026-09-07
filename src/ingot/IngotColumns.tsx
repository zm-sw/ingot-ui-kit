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
 *
 * Three and four columns take one step on the way: two from `sm`, the full
 * count from `collapseBelow`. Four columns going straight to one wastes
 * half a tablet, and going straight to four makes each of them 160 px. Two
 * columns have no such step — they are already the step.
 *
 * ## Tiles are a different shape, and `minItemWidth` is the whole of it
 *
 * A count answers "how many across"; a tile grid answers "how narrow may
 * one get" and lets the row hold as many as fit. Written as an inline
 * `grid-template-columns` because the width is a number the caller
 * chooses: a utility class for it would have to exist for every possible
 * number, and the one the caller wants would be the one nobody generated.
 *
 * ## Every gap is a step of the space scale
 *
 * `gap` takes `3`, `4` or `5` — `--s-3`, `--s-4`, `--s-5` — and nothing
 * else. Measured in an application built on this kit: 471 grids used a gap
 * that is not on the scale at all (6 px, 10 px, 2 px, 14 px). A scale that
 * can be missed by two pixels is not a scale.
 */

/** How many columns, once there is room for them. */
export type IngotColumnsCount = 2 | 3 | 4;

/** Steps of the space scale a grid may put between its cells. */
export type IngotColumnsGap = 3 | 4 | 5;

// Written out rather than composed, because Tailwind reads the SOURCE for
// class names: `md:grid-cols-${columns}` produces a class that is never
// generated and therefore silently does nothing.
const FULL = {
  md: { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" },
  lg: { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" },
} as const;

const GAP = { 3: "gap-3", 4: "gap-4", 5: "gap-5" } as const;

export function IngotColumns({
  columns = 2,
  collapseBelow = "md",
  gap = 4,
  minItemWidth,
  children,
  className,
  testId,
}: {
  columns?: IngotColumnsCount;
  /** Below this width the columns become one. */
  collapseBelow?: "md" | "lg";
  /** Step of the space scale between cells: 3, 4 (default) or 5. */
  gap?: IngotColumnsGap;
  /**
   * Tiles instead of a count: the narrowest one cell may be, in pixels,
   * and the row holds as many as fit. Wins over `columns` when both are
   * given — a caller that asked for tiles asked for tiles.
   */
  minItemWidth?: number;
  children: ReactNode;
  /** Layout only — where the block sits, not how wide its columns are. */
  className?: string;
  testId?: string;
}): JSX.Element {
  // Two columns are already the narrow step, so they have no intermediate
  // one; three and four pass through two on the way down.
  const shape =
    minItemWidth === undefined
      ? [columns > 2 ? "sm:grid-cols-2" : null, FULL[collapseBelow][columns]]
      : [];

  return (
    // The default `gap-4` is `--s-4`, the same step the vertical rhythm of
    // blocks uses, so a two-column block does not introduce a spacing of
    // its own.
    <div
      className={cx("grid grid-cols-1", GAP[gap], ...shape, className)}
      style={
        minItemWidth === undefined
          ? undefined
          : { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))` }
      }
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
