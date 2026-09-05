import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * The rhythm of one page's content — the gap between blocks, the reading
 * width and an optional side index.
 *
 * The outer frame (1440 px, page margins) is held by the shell under the
 * top bar; this primitive holds what every screen used to compose itself:
 * the **vertical rhythm of blocks** (header → metrics → toolbar → table)
 * and the **shape of the content**. (Owner's decision, 2026-09-02,
 * point 05.)
 *
 * Three shapes, by what the screen is:
 *
 * * ``full`` — the frame's full width. Lists and tables; a column bitten
 *   off a table is a column missing from it.
 * * ``reading`` — a limited width for screens that are read: long
 *   settings, legal texts, a detail without tables. A line across the
 *   whole monitor is not read but skimmed.
 * * ``aside`` with a column on the left — a screen with its own index
 *   (``IngotSideNav``): the index stands, the content scrolls.
 *
 * A card grid and a two-column detail deliberately have no shape here:
 * that is the inside of a block (grid utilities in place), not the page
 * frame.
 */
export function IngotPageLayout({
  width = "full",
  aside,
  children,
  testId,
}: {
  /** ``full`` for tables and lists · ``reading`` for screens that are read. */
  width?: "full" | "reading";
  /**
   * Side index on the left — typically ``IngotSideNav``. The column is
   * ``sticky``, so it stays at hand while the content scrolls.
   */
  aside?: ReactNode;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const body = (
    <div
      className={cx(
        "min-w-0 flex-1 space-y-6",
        width === "reading" && "max-w-3xl",
      )}
    >
      {children}
    </div>
  );

  if (aside === undefined) {
    return (
      <div className="w-full" data-testid={testId}>
        {body}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-8" data-testid={testId}>
      <div className="sticky top-6 w-56 shrink-0">{aside}</div>
      {body}
    </div>
  );
}
