import type { JSX } from "react";

import { cx } from "./cx";
import { eyebrowClass } from "./IngotEyebrow";
import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * Comparison — the ROW-based table from the "Public pages" handoff: a
 * header Task / Today / With the platform on ``--surface-2``, then one row
 * per task.
 *
 * **Pairing is a property of the ROW, not the column.** Three separate
 * cards side by side look almost the same, but the reader has to pair the
 * n-th bullet with the n-th bullet next to it — and once one column
 * shifts by an item, the comparison lies silently. Hence the component
 * takes rows (``rows``), not columns: the "today / with the platform" pair
 * for one task cannot be written disconnected.
 *
 * The third column is highlighted (``--accent-bg`` / ``--accent-ink``) and
 * is the section's only accent element. On a narrow viewport the table
 * scrolls horizontally — the grid must not collapse, because collapsed it
 * stops comparing.
 */
export interface IngotMarketingComparisonCell {
  icon?: IngotIconName;
  text: string;
}

export interface IngotMarketingComparisonRow {
  /** Stable row key from the data (not an index — rows get reordered). */
  id: string;
  /** The task being compared — the first column. */
  task: string;
  /** What it looks like today. */
  before: IngotMarketingComparisonCell;
  /** What it looks like with the platform — the highlighted column. */
  after: IngotMarketingComparisonCell;
}

export interface IngotMarketingComparisonHeaders {
  task: string;
  before: string;
  after: string;
}

function Cell({
  cell,
  highlighted,
}: {
  cell: IngotMarketingComparisonCell;
  highlighted?: boolean;
}): JSX.Element {
  return (
    <div
      className={
        highlighted
          ? "flex items-center gap-2 border-l border-border bg-accent-bg px-[18px] py-[15px] text-[13.5px] text-ink-2"
          : "flex items-center gap-2 border-l border-border px-[18px] py-[15px] text-[13.5px] text-ink-3"
      }
    >
      {cell.icon !== undefined && (
        <span className="shrink-0">
          <IngotIcon name={cell.icon} size={14} />
        </span>
      )}
      {cell.text}
    </div>
  );
}

export function IngotMarketingComparison({
  headers,
  rows,
  testId,
}: {
  /** Headers of the three columns — content, supplied translated. */
  headers: IngotMarketingComparisonHeaders;
  rows: readonly IngotMarketingComparisonRow[];
  testId?: string;
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {/* Horizontal scroll, not a break into a column: a row that falls
          apart stops being a comparison. */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]" data-testid={testId}>
          {/* The header row is one eyebrow-sized line over three cells. */}
          <div
            className={cx(
              "grid grid-cols-[1.1fr_1fr_1fr] border-b border-border bg-surface-2",
              eyebrowClass({ size: "md" }),
            )}
          >
            <div className="px-[18px] py-[11px]">{headers.task}</div>
            <div className="border-l border-border px-[18px] py-[11px]">
              {headers.before}
            </div>
            <div className="border-l border-border bg-accent-bg px-[18px] py-[11px] font-semibold text-accent-ink">
              {headers.after}
            </div>
          </div>
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={
                index < rows.length - 1
                  ? "grid grid-cols-[1.1fr_1fr_1fr] border-b border-border"
                  : "grid grid-cols-[1.1fr_1fr_1fr]"
              }
              data-testid={testId ? `${testId}-row-${row.id}` : undefined}
            >
              <div className="px-[18px] py-[15px] text-sm font-medium text-ink">
                {row.task}
              </div>
              <Cell cell={row.before} />
              <Cell cell={row.after} highlighted />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
