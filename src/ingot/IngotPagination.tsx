import { type JSX, type ReactNode } from "react";

import { Button } from "./Button";
import { cx } from "./cx";

/**
 * Pagination under a table.
 *
 * Ten pages wrote their pager by hand (the audit log among them) and the
 * primitive did not exist — the table's v1 deliberately deferred it until
 * it was clear who holds the state. The answer: **the caller**. The pager
 * is therefore controlled (`page` + `onPageChange`) and does not fight the
 * table over state — like `sort` and `selectedKeys` on `IngotTable`.
 *
 * The shape is deliberately prev/next + status, not numbered pages: the
 * hand-written pagers were all prev/next and a numbered bar would be a
 * capability without a consumer. It arrives when a concrete screen asks.
 *
 * The kit has no i18n namespace of its own — `prevLabel`, `nextLabel`,
 * `label` and the composed `status` ("Page 2 of 8") arrive translated.
 */
export function IngotPagination({
  page,
  pageCount,
  onPageChange,
  prevLabel,
  nextLabel,
  status,
  label,
  className,
  testId,
}: {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the new page number; never called out of range. */
  onPageChange: (page: number) => void;
  /** Translated "Previous". */
  prevLabel: string;
  /** Translated "Next". */
  nextLabel: string;
  /** Already composed status ("Page 2 of 8") — only the caller can interpolate. */
  status?: ReactNode;
  /** Translated label of the `<nav>` for a screen reader ("Pagination"). */
  label?: string;
  className?: string;
  testId?: string;
}): JSX.Element {
  // `<nav>`, not `<div>`: a screen reader gets a landmark and, with
  // `label`, tells two pagers on one screen apart.
  return (
    <nav
      aria-label={label}
      className={cx("mt-3 flex items-center gap-3", className)}
      data-testid={testId}
    >
      <Button
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {prevLabel}
      </Button>
      {status != null && (
        // No `aria-live` on purpose: the status changes only after the
        // user's click and focus stays on the button — an extra announcement
        // would be noise.
        <span className="text-sm tabular-nums text-ink-3">{status}</span>
      )}
      <Button
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
