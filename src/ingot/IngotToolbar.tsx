import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Filter bar above a list — shell pattern `.toolbar` + `.search`.
 *
 * A primitive of its own, not a slot of `IngotTable`: an inventory found
 * ~19 pages with a hand-written filter bar and three rival `*FilterBar`
 * components, and the table is not the only consumer — a card grid or a
 * list has a filter bar too. A table slot would make them reinvent it.
 *
 * Binding block order of a list screen: **toolbar → (bulk bar) → table →
 * pager** (the bulk bar is drawn by `IngotTable`, the pager is
 * `IngotPagination`).
 *
 * Layout only, on purpose: the search field, selects and buttons come from
 * the caller as `children` — the primitive holds the gaps, the wrapping
 * and the right end (`end`), not what is filtered by. No `role="toolbar"`:
 * that role promises arrow-key navigation someone would then have to
 * really write, and a filter bar is an ordinary group of form controls.
 */
export function IngotToolbar({
  children,
  end,
  className,
  testId,
}: {
  /** Filters from the left: search, selects, toggles — already translated. */
  children: ReactNode;
  /** The right end of the bar — typically the primary action ("Add"). */
  end?: ReactNode;
  /** Pass-through class of the wrapper (exceptionally — the primitive holds the gaps). */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className={cx("mb-3 flex flex-wrap items-center gap-2", className)}
      data-testid={testId}
    >
      {children}
      {/* `ml-auto` on the end wrapper, not on the last filter: if the last
          filter carried it, adding another filter would "steal" the right end. */}
      {end != null && <div className="ml-auto flex items-center gap-2">{end}</div>}
    </div>
  );
}
