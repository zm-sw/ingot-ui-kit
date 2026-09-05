import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotCheckboxControl } from "./IngotCheckbox";

/**
 * Table — columns as data.
 *
 * The largest return in the whole programme (dozens of admin pages wrote
 * their own `<table>`) and at the same time **the largest design surface
 * and blast radius**: a badly designed table with forty screens hanging
 * on it cannot be taken back cheaply.
 *
 * ## v1 → v2
 *
 * v1 was DELIBERATELY minimal: columns · empty state (`IngotEmptyState`) ·
 * row actions · loading · sticky header · row state. Sorting, bulk select
 * and pagination waited for a concrete requester — and the list screens
 * delivered one.
 *
 * v2 adds, **backwards compatibly** (no existing consumer has to change):
 *
 * - **Row selection + bulk bar** (`selectedKeys` + `onSelectedKeysChange`).
 *   Controlled from outside: the table does not hold the selection
 *   because the bulk action needs it in the caller anyway. The checkbox
 *   column comes first, a row carries `aria-selected`, and a non-empty
 *   selection shows the `bulkbar` above the table (the caller supplies
 *   its content — only the caller can say "3 selected" translated).
 * - **Sorting** (`sort` + `onSortChange`, column `sortable`). Also
 *   controlled: the table does NOT sort the data — sorting often happens
 *   on the server and a client-side fallback would lie about the whole.
 *   The active header carries `aria-sort`. The handoff CSS has no visual
 *   for the sort state; the arrow in the header (↑/↓, resting ↕) is an
 *   addition to the spec — recorded on the doc page too.
 * - **`density`** `default | compact` — compact pulls cell padding down
 *   to 8px for screens where rows per screen are counted.
 *
 * Pagination is **not in the table, not even in v2** — it is a separate
 * `IngotPagination` and the caller owns the page state, like selection and
 * sort. One owner of state = no tug of war.
 *
 * ## What the table fixes structurally, not by agreement
 *
 * - **`colSpan` is computed.** Hand-written empty states had `colSpan={8}`
 *   hard-coded; adding a column silently broke the count and nobody
 *   noticed. Here it is `columns.length + selection + actions`.
 * - **`<th scope="col">` always.** Of 42 files with a hand-written
 *   `<thead>` only 12 had `scope` — a screen reader in the rest did not
 *   know which column a cell belonged to.
 * - **Row actions do not hide behind hover.** The primitive never gives
 *   them `opacity-0 group-hover:…`; that pattern is a trap for the
 *   keyboard.
 *
 * The kit has no i18n namespace of its own — `loadingLabel`,
 * `actionsLabel`, `selectAllLabel`, `selectRowLabel` and the content of
 * the empty state and the bulk bar arrive translated.
 */

export interface IngotColumn<Row> {
  /** Stable column key (React key, not a label). */
  key: string;
  /** Header — already translated. */
  header: ReactNode;
  /**
   * Cell content. `index` is the position within the currently rendered
   * page of data — an "order" column (`#1`, `#2`, …) has nowhere else to
   * take it from and would have to `indexOf` across the whole array.
   */
  cell: (row: Row, index: number) => ReactNode;
  /** `"end"` = numeric column: right-aligned with `tabular-nums`. */
  align?: "start" | "end";
  /**
   * Extra classes on this column's `<td>`.
   *
   * Not a pass-through hole for arbitrary style, but a necessity:
   * `max-w-md`, `whitespace-nowrap` or `mono` must sit on the cell, not on
   * a wrapper inside it — otherwise they do not constrain the column's
   * width.
   */
  cellClassName?: string;
  /**
   * The column can be sorted — the header becomes a button. Requires
   * `sort` and `onSortChange` on the table; without them `sortable` is
   * ignored, because a button that does nothing is worse than none.
   */
  sortable?: boolean;
}

export interface IngotSort {
  /** `key` of the column the data is sorted by. */
  key: string;
  dir: "asc" | "desc";
}

export function IngotTable<Row>({
  columns,
  rows,
  rowKey,
  rowTestId,
  rowClassName,
  loading = false,
  loadingLabel,
  empty,
  actions,
  actionsLabel,
  caption,
  className,
  stickyHeader = false,
  density = "default",
  sort,
  onSortChange,
  selectedKeys,
  onSelectedKeysChange,
  selectAllLabel,
  selectRowLabel,
  bulkbar,
  testId,
}: {
  columns: readonly IngotColumn<Row>[];
  rows: readonly Row[];
  /** Stable identity of a row. */
  rowKey: (row: Row) => string;
  /** Optional `data-testid` of a row — some pages' e2e tests hang on it. */
  rowTestId?: (row: Row) => string;
  /**
   * Extra classes on the `<tr>` — for the row's STATE, not its style.
   *
   * Distinct from `cellClassName`: that is a column property (width,
   * alignment) and static, while this is a row property that changes with
   * the data (not selectable, highlighted). A dimmed row could not be done
   * through `cellClassName` — every cell would have to carry it and the
   * value would not depend on the column.
   */
  rowClassName?: (row: Row) => string | undefined;
  /** Waiting for data; the table gets `aria-busy` and one `role="status"` row. */
  loading?: boolean;
  /** Translated "Loading…". Required whenever `loading` can happen. */
  loadingLabel?: string;
  /** What to show instead of rows when there are none — typically `<IngotEmptyState>`. */
  empty?: ReactNode;
  /** Row actions; adds a last column. */
  actions?: (row: Row) => ReactNode;
  /** Translated header of the actions column — rendered for screen readers only. */
  actionsLabel?: string;
  /** Description of the table for screen readers; rendered as an off-screen `<caption>`. */
  caption?: string;
  /** Pass-through class of the table (typically `min-w-[40rem]`). */
  className?: string;
  /**
   * The header stays visible while scrolling — only when a scroll box
   * wraps the table (`max-h-*` + `overflow-y-auto`); outside one `sticky`
   * does nothing.
   */
  stickyHeader?: boolean;
  /**
   * `"compact"` pulls cell padding down to 8px (spec `density`). The
   * default density stays the v1 one so conversions need no rewrite.
   */
  density?: "default" | "compact";
  /**
   * Current sort. The table does NOT sort the data — it only draws the
   * state and reports clicks through `onSortChange`; the order is set by
   * the `rows` array (server or caller).
   */
  sort?: IngotSort;
  /** Click on a sortable header: inactive → asc, asc ↔ desc. */
  onSortChange?: (sort: IngotSort) => void;
  /**
   * Keys of the selected rows (`rowKey`). Together with
   * `onSelectedKeysChange` it turns on the checkbox column; the caller
   * owns the selection because the bulk action is the caller's.
   */
  selectedKeys?: ReadonlySet<string>;
  /** The new set after every change of selection (a row, or select / clear all). */
  onSelectedKeysChange?: (keys: ReadonlySet<string>) => void;
  /** Translated label of the "select all" checkbox in the header. */
  selectAllLabel?: string;
  /** Translated label of a row's checkbox ("Select {name}"). */
  selectRowLabel?: (row: Row) => string;
  /**
   * Content of the bulk-actions bar above the table; shown only with a
   * non-empty selection. The count ("3 selected") and the buttons are
   * composed by the caller — only the caller can translate them.
   */
  bulkbar?: ReactNode;
  testId?: string;
}): JSX.Element {
  const selectable = selectedKeys != null && onSelectedKeysChange != null;
  // The single source of truth for the width of the empty and loading rows.
  // A hand-written `colSpan={8}` is exactly what drifts when a column is added.
  const span = columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const cellPad = density === "compact" ? "p-2" : "px-3 py-2";
  // The checkbox column is deliberately narrow — `w-0` + padding, so it
  // does not steal room from the data columns.
  const checkPad = density === "compact" ? "w-0 p-2" : "w-0 px-3 py-2";

  const allKeys = selectable ? rows.map((row) => rowKey(row)) : [];
  const allSelected =
    selectable && allKeys.length > 0 && allKeys.every((key) => selectedKeys.has(key));
  const someSelected =
    selectable && !allSelected && allKeys.some((key) => selectedKeys.has(key));

  function toggleRow(key: string): void {
    if (!selectable) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectedKeysChange(next);
  }

  function toggleAll(): void {
    if (!selectable) return;
    // "Select all" = all CURRENTLY rendered rows, not the whole dataset —
    // the table knows no other rows, and silently selecting invisible
    // records is exactly the surprise bulk actions need a bulk bar for.
    onSelectedKeysChange(allSelected ? new Set() : new Set(allKeys));
  }

  function headerSort(col: IngotColumn<Row>): void {
    if (!onSortChange) return;
    onSortChange({
      key: col.key,
      dir: sort?.key === col.key && sort.dir === "asc" ? "desc" : "asc",
    });
  }

  const table = (
    <table
      className={className ? `w-full text-left text-sm ${className}` : "w-full text-left text-sm"}
      aria-busy={loading || undefined}
      data-testid={testId}
    >
      {caption != null && <caption className="sr-only">{caption}</caption>}
      <thead
        className={
          stickyHeader
            ? // `bg-surface-2` is not cosmetic: without an opaque background
              // the scrolling rows show through the sticky header.
              "sticky top-0 z-10 border-b border-border bg-surface-2 text-xs uppercase text-ink-3"
            : "border-b border-border text-xs uppercase text-ink-3"
        }
      >
        <tr>
          {selectable && (
            <th scope="col" className={checkPad}>
              <IngotCheckboxControl
                className="block"
                checked={allSelected}
                // `indeterminate` has no HTML attribute; it can only be set on
                // the element — hence a ref, not a prop.
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                aria-label={selectAllLabel}
              />
            </th>
          )}
          {columns.map((col) => {
            const sortable = col.sortable && onSortChange != null;
            const dir = sortable && sort?.key === col.key ? sort.dir : undefined;
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={
                  dir != null ? (dir === "asc" ? "ascending" : "descending") : undefined
                }
                className={cx(
                  cellPad,
                  "font-medium",
                  col.align === "end" && "text-right",
                )}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => headerSort(col)}
                    className={cx(
                      "inline-flex items-center gap-1 uppercase hover:text-ink",
                      col.align === "end" && "flex-row-reverse",
                    )}
                  >
                    {col.header}
                    {/* The handoff CSS draws no sort state — the arrow is an
                        addition to the spec. The resting ↕ says "sortable";
                        for a screen reader the state is in aria-sort, the
                        arrow is decoration. */}
                    <span aria-hidden="true" className={dir != null ? "" : "text-ink-4"}>
                      {dir != null ? (dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
          {actions && (
            <th scope="col" className={cx(cellPad, "text-right font-medium")}>
              {/* The actions column needs no visible label, a screen reader
                  does — otherwise it is a nameless column. */}
              <span className="sr-only">{actionsLabel}</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={span} className="px-3 py-8 text-center text-sm text-ink-3">
              {/* Not an empty body with a spinner: a screen reader must hear
                  that we are waiting, not a silence that sounds like
                  "nothing here". */}
              <span role="status">{loadingLabel}</span>
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={span} className="p-0">
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => {
            const key = rowKey(row);
            const selected = selectable && selectedKeys.has(key);
            // Called ONCE per row: it is the caller's function and a second
            // call might well answer differently.
            const extra = rowClassName?.(row);
            return (
              <tr
                key={key}
                className={cx("border-b border-border", selected && "bg-accent-bg", extra)}
                aria-selected={selectable ? selected : undefined}
                data-testid={rowTestId?.(row)}
              >
                {selectable && (
                  <td className={checkPad}>
                    <IngotCheckboxControl
                      className="block"
                      checked={selected}
                      onChange={() => toggleRow(key)}
                      aria-label={selectRowLabel?.(row)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      cellPad,
                      col.align === "end" && "text-right tabular-nums",
                      col.cellClassName,
                    )}
                  >
                    {col.cell(row, index)}
                  </td>
                ))}
                {actions && (
                  <td className={cx(cellPad, "text-right")}>{actions(row)}</td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  if (!selectable) return table;

  // A wrapper only with selection: without it the root stays `<table>` as
  // in v1, so consumers keep the DOM their styles and tests hang on.
  return (
    <div>
      {selectedKeys.size > 0 && bulkbar != null && (
        <div
          role="status"
          className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-accent-border bg-accent-bg px-3 py-2 text-sm text-ink"
        >
          {bulkbar}
        </div>
      )}
      {table}
    </div>
  );
}
