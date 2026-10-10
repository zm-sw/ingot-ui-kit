import {
  Fragment,
  useId,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cx } from "./cx";
import { IngotCheckboxControl } from "./IngotCheckbox";
import { eyebrowClass } from "./IngotEyebrow";
import {
  ColumnMenu,
  ColumnPicker,
  ResizeHandle,
  hiddenKeys,
  moveKey,
  orderedKeys,
  type IngotTableLayout,
  type MoveTarget,
} from "./tableLayout";

import { useIngotLabels } from "./IngotProvider";

export type { IngotTableLayout } from "./tableLayout";

/** A key cap in the footer's shortcut hint. Decoration — the words carry the meaning. */
function Key({ children }: { children: ReactNode }): JSX.Element {
  return (
    <kbd className="inline-grid h-5 min-w-5 place-items-center rounded border border-border bg-surface px-1 font-mono text-[11px] text-ink-3">
      {children}
    </kbd>
  );
}

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
 * - **Row detail** (`rowDetail`). A full-width row directly under a row,
 *   for a record whose detail belongs next to it in the list rather than
 *   on a screen of its own. Controlled like selection: the caller decides
 *   which rows are open, the table only draws the row and computes its
 *   `colSpan`.
 *
 * Pagination is **not in the table, not even in v2** — it is a separate
 * `IngotPagination` and the caller owns the page state, like selection and
 * sort. One owner of state = no tug of war.
 *
 * ## v3 — the look of a list screen
 *
 * - **The header is an eyebrow**: mono, uppercase, letter-spaced, on
 *   `--surface-2`, so the column names read as labels and not as data.
 * - **The frame** (`toolbar` + `footer` / `footerEnd`). A list screen is
 *   filters above, rows, and a count with a pager below — written by hand
 *   on every screen until now, each with its own margins. With any of the
 *   slots the table draws one bordered card around all of them; without
 *   them it stays the bare table it always was, so a table already inside
 *   a card does not get a second border.
 * - **Groups** (`groupBy` + `groupHeader`). Consecutive rows with the same
 *   group key get a section row above them ("Drafts 1"). The table does not
 *   reorder rows — grouping, like sorting, is the order of `rows` — it only
 *   notices where the key changes. Each group is its own `<tbody>`, so a
 *   screen reader hears the section as a row group, not as one more record.
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
  /**
   * The column's name as plain text, for the column picker and the column
   * menu. Needed only when `header` is not a string — a picker cannot list
   * a JSX header, and a screen reader cannot name a button after one.
   */
  label?: string;
  /**
   * `false` keeps the column on screen whatever the user's layout says —
   * the one column that names the record. Default `true`.
   */
  hideable?: boolean;
  /**
   * Content of the column's filter, opened from the column menu — the
   * caller's own control (a select, a search field), already wired to the
   * caller's filter state. The table does not filter: like sorting, the
   * rows it gets are the rows it draws.
   */
  filter?: ReactNode;
  /** The filter currently narrows the rows — the menu button carries a dot. */
  filterActive?: boolean;
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
  rowDetail,
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
  toolbar,
  footer,
  footerEnd,
  groupBy,
  groupHeader,
  layout,
  onLayoutChange,
  onLayoutReset,
  keyboard = false,
  onRowOpen,
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
  /**
   * Detail of a row, drawn in a full-width row directly under it.
   *
   * Return `null` or `undefined` for a row that is closed — the table
   * holds no "expanded" state of its own, for the same reason it holds no
   * selection: the caller owns the toggle (a button in a cell, carrying
   * `aria-expanded`) and whatever else opens with it. The detail cell's
   * `colSpan` is computed like the empty row's, so a column added later
   * cannot leave the detail narrower than the row above it.
   */
  rowDetail?: (row: Row) => ReactNode;
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
  /**
   * Description of the table for screen readers; rendered as an off-screen
   * `<caption>`.
   *
   * It also names the scroll box the table sits in. A table wider than the
   * screen scrolls sideways, and a scroll box a keyboard can reach has to
   * be named — otherwise the reader lands on "region" and has no idea what
   * they are inside. Without a caption the box is still reachable, just
   * unnamed, which is the lesser of the two failures.
   */
  caption?: string;
  /** Pass-through class of the table (typically `min-w-[40rem]`). */
  className?: string;
  /**
   * The header stays visible while scrolling — only when a scroll box
   * wraps the table (`max-h-*` + `overflow-y-auto`); outside one `sticky`
   * does nothing.
   *
   * With `stickyHeader` the table draws NO sideways scroll box of its
   * own: any box between the scrollport and a sticky header stops it
   * sticking. It is not needed either — the caller's box scrolls
   * horizontally as well, because CSS turns the `visible` axis into
   * `auto`.
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
  /**
   * Filters above the table, inside its frame — typically the children of
   * an `IngotToolbar` (search, selects, a segmented switch). Turns the
   * frame on.
   */
  toolbar?: ReactNode;
  /**
   * Start of the footer, inside the frame — typically the count
   * ("36 of 36 articles"), composed and translated by the caller. Turns
   * the frame on.
   */
  footer?: ReactNode;
  /** End of the footer — typically an `IngotPagination`. Turns the frame on. */
  footerEnd?: ReactNode;
  /**
   * Group key of a row. Consecutive rows with the same key form one group
   * under one section row; the order of `rows` decides, the table does
   * not regroup. Requires `groupHeader`.
   */
  groupBy?: (row: Row) => string;
  /**
   * Content of a group's section row — the caller composes the translated
   * label and count ("Drafts 1"). Gets the group's key and its rows.
   */
  groupHeader?: (key: string, rows: readonly Row[]) => ReactNode;
  /**
   * How the user arranged the columns: order, hidden columns, widths.
   * Applied whenever it is given; read defensively, so a layout stored
   * for an older set of columns cannot break the table.
   */
  layout?: IngotTableLayout;
  /**
   * Turns on the arranging UI — the column picker at the end of the
   * header, the menu on every column, resizing and dragging headers. The
   * table reports the new layout; storing it is the caller's.
   */
  onLayoutChange?: (layout: IngotTableLayout) => void;
  /** Shows "Reset to default" in the picker — the caller drops the stored layout. */
  onLayoutReset?: () => void;
  /**
   * Keyboard walking of the rows while the table's scroll box has focus:
   * J / arrow down and K / arrow up move the active row, X toggles its
   * selection, Enter opens it (`onRowOpen`). With a footer the table also
   * prints the shortcuts there. Needs the scroll box, so it does nothing
   * together with `stickyHeader`.
   */
  keyboard?: boolean;
  /** Enter on the active row. */
  onRowOpen?: (row: Row) => void;
  testId?: string;
}): JSX.Element {
  const labels = useIngotLabels();
  const selectable = selectedKeys != null && onSelectedKeysChange != null;
  const arrangeable = onLayoutChange != null;

  // The columns on screen: the layout's order, minus what the user hid.
  // A column that may not be hidden is shown whatever the layout says.
  const locked = new Set(
    columns.filter((col) => col.hideable === false).map((col) => col.key),
  );
  const order = orderedKeys(
    columns.map((col) => col.key),
    layout,
  );
  const hidden = hiddenKeys(layout, locked);
  const byKey = new Map(columns.map((col) => [col.key, col]));
  const shown = order
    .filter((key) => !hidden.has(key))
    .map((key) => byKey.get(key))
    .filter((col): col is IngotColumn<Row> => col != null);

  // A drag in progress: the width is drawn from here until the drag ends,
  // so the caller hears about it once.
  const [dragging, setDragging] = useState<{ key: string; width: number } | null>(null);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [dropKey, setDropKey] = useState<string | null>(null);
  const headerCells = useRef(new Map<string, HTMLTableCellElement>());

  function widthOf(key: string): number | undefined {
    if (dragging?.key === key) return dragging.width;
    return layout?.widths?.[key];
  }

  function change(next: IngotTableLayout): void {
    onLayoutChange?.({ ...layout, ...next });
  }

  function move(key: string, to: MoveTarget | number): void {
    change({ order: moveKey(order, hidden, key, to) });
  }

  function toggleHidden(key: string): void {
    const next = new Set(hidden);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    change({ order, hidden: order.filter((item) => next.has(item)) });
  }

  function labelOf(col: IngotColumn<Row>): string {
    return col.label ?? (typeof col.header === "string" ? col.header : col.key);
  }

  // The picker sits in the actions column's header when there is one;
  // otherwise it needs a column of its own.
  const pickerColumn = arrangeable && !actions;

  // The row the keyboard stands on. Clamped on read: rows can change under
  // it (a filter, the next page) and an index past the end means "none".
  const [active, setActive] = useState<number | null>(null);
  const activeIndex = active != null && active < rows.length ? active : null;
  const walkable = keyboard && !stickyHeader;

  // The single source of truth for the width of the empty and loading rows.
  // A hand-written `colSpan={8}` is exactly what drifts when a column is added.
  const span =
    shown.length + (selectable ? 1 : 0) + (actions ? 1 : 0) + (pickerColumn ? 1 : 0);

  const cellPad = density === "compact" ? "p-2" : "px-4 py-3";
  // The checkbox column is deliberately narrow — `w-0` + padding, so it
  // does not steal room from the data columns.
  const checkPad = density === "compact" ? "w-0 p-2" : "w-0 px-4 py-3";

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

  // Consecutive runs of one group key, each row with its position in
  // `rows` — `cell(row, index)` keeps counting across groups.
  const groups =
    groupBy != null && groupHeader != null
      ? rows.reduce<{ key: string; rows: { row: Row; index: number }[] }[]>(
          (acc, row, index) => {
            const key = groupBy(row);
            const last = acc[acc.length - 1];
            if (last != null && last.key === key) last.rows.push({ row, index });
            else acc.push({ key, rows: [{ row, index }] });
            return acc;
          },
          [],
        )
      : null;

  function renderRow(row: Row, index: number): JSX.Element {
    const key = rowKey(row);
    const selected = selectable && selectedKeys.has(key);
    // Called ONCE per row: it is the caller's function and a second
    // call might well answer differently.
    const extra = rowClassName?.(row);
    // Same rule as rowClassName: one call per row.
    const detail = rowDetail?.(row);
    return (
      <Fragment key={key}>
        <tr
          id={walkable ? `${captionId}-row-${index}` : undefined}
          className={cx(
            "border-b border-border",
            selected && "bg-accent-bg",
            index === activeIndex &&
              "outline outline-2 -outline-offset-2 outline-accent",
            extra,
          )}
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
          {shown.map((col) => {
            const width = widthOf(col.key);
            return (
              <td
                key={col.key}
                className={cx(
                  cellPad,
                  col.align === "end" && "text-right tabular-nums",
                  // A width the user chose also caps the cell: under the
                  // automatic table layout a long value would otherwise
                  // keep the column wider than the user dragged it.
                  width != null && "overflow-hidden break-words",
                  col.cellClassName,
                )}
                style={width != null ? { maxWidth: width } : undefined}
              >
                {col.cell(row, index)}
              </td>
            );
          })}
          {actions && <td className={cx(cellPad, "text-right")}>{actions(row)}</td>}
          {pickerColumn && <td className="w-0" />}
        </tr>
        {detail != null && (
          <tr
            className="border-b border-border"
            data-testid={rowTestId ? `${rowTestId(row)}-detail` : undefined}
          >
            <td colSpan={span} className="p-0">
              {detail}
            </td>
          </tr>
        )}
      </Fragment>
    );
  }

  const captionId = useId();

  const picker = arrangeable ? (
    <ColumnPicker
      columns={order
        .map((key) => byKey.get(key))
        .filter((col): col is IngotColumn<Row> => col != null)
        .map((col) => ({
          key: col.key,
          label: labelOf(col),
          locked: col.hideable === false,
        }))}
      hidden={hidden}
      onToggle={toggleHidden}
      onReset={onLayoutReset}
      testId={testId ? `${testId}-columns` : undefined}
    />
  ) : null;

  const table = (
    <table
      className={className ? `w-full text-left text-sm ${className}` : "w-full text-left text-sm"}
      aria-busy={loading || undefined}
      data-testid={testId}
    >
      {caption != null && (
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
      )}
      <thead
        className={cx(
          // `bg-surface-2` is not only the look: under a sticky header an
          // opaque background is what stops the scrolling rows showing
          // through.
          "border-b border-border bg-surface-2",
          eyebrowClass(),
          stickyHeader && "sticky top-0 z-10",
        )}
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
          {shown.map((col, position) => {
            const sortable = col.sortable && onSortChange != null;
            const dir = sortable && sort?.key === col.key ? sort.dir : undefined;
            const width = widthOf(col.key);
            const label = labelOf(col);
            const content = sortable ? (
              <button
                type="button"
                onClick={() => headerSort(col)}
                className={cx(
                  "inline-flex items-center gap-1 rounded-sm uppercase hover:text-ink focus-ring",
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
            );
            return (
              <th
                key={col.key}
                ref={(el) => {
                  if (el) headerCells.current.set(col.key, el);
                  else headerCells.current.delete(col.key);
                }}
                scope="col"
                aria-sort={
                  dir != null ? (dir === "asc" ? "ascending" : "descending") : undefined
                }
                className={cx(
                  cellPad,
                  "font-medium",
                  col.align === "end" && "text-right",
                  arrangeable && "group relative",
                  dropKey === col.key && "bg-accent-bg",
                )}
                style={
                  width != null
                    ? { width, minWidth: width, maxWidth: width }
                    : undefined
                }
                // Dragging a header is the pointer's way to reorder; the
                // column menu's "Move left / right" is the keyboard's.
                onDragOver={
                  arrangeable && draggedKey != null
                    ? (event) => {
                        event.preventDefault();
                        if (dropKey !== col.key) setDropKey(col.key);
                      }
                    : undefined
                }
                onDrop={
                  arrangeable
                    ? (event) => {
                        event.preventDefault();
                        if (draggedKey != null && draggedKey !== col.key) {
                          move(draggedKey, position);
                        }
                        setDraggedKey(null);
                        setDropKey(null);
                      }
                    : undefined
                }
                data-testid={testId ? `${testId}-head-${col.key}` : undefined}
              >
                {arrangeable ? (
                  <div
                    className={cx(
                      "flex items-center gap-1",
                      col.align === "end" && "flex-row-reverse",
                    )}
                  >
                    <span
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", col.key);
                        setDraggedKey(col.key);
                      }}
                      onDragEnd={() => {
                        setDraggedKey(null);
                        setDropKey(null);
                      }}
                      className="min-w-0 cursor-grab truncate"
                    >
                      {content}
                    </span>
                    <ColumnMenu
                      columnLabel={label}
                      sortable={sortable === true}
                      onSort={(next) => onSortChange?.({ key: col.key, dir: next })}
                      canMove={{
                        left: position > 0,
                        right: position < shown.length - 1,
                      }}
                      onMove={(to) => move(col.key, to)}
                      canHide={col.hideable !== false && shown.length > 1}
                      onHide={() => toggleHidden(col.key)}
                      filter={col.filter}
                      filterActive={col.filterActive === true}
                      testId={testId ? `${testId}-col-${col.key}` : undefined}
                    />
                    <ResizeHandle
                      columnLabel={label}
                      width={width}
                      measure={() =>
                        Math.round(
                          headerCells.current.get(col.key)?.getBoundingClientRect()
                            .width ?? 0,
                        )
                      }
                      onDrag={(next) => setDragging({ key: col.key, width: next })}
                      onCommit={(next) => {
                        setDragging(null);
                        change({ widths: { ...layout?.widths, [col.key]: next } });
                      }}
                      testId={testId ? `${testId}-resize-${col.key}` : undefined}
                    />
                  </div>
                ) : (
                  content
                )}
              </th>
            );
          })}
          {actions && (
            <th scope="col" className={cx(cellPad, "text-right font-medium")}>
              {/* The actions column needs no visible label, a screen reader
                  does — otherwise it is a nameless column. */}
              <span className="sr-only">{actionsLabel}</span>
              {picker != null && <div className="flex justify-end">{picker}</div>}
            </th>
          )}
          {pickerColumn && (
            <th scope="col" className="w-0 px-2 py-1">
              <div className="flex justify-end">{picker}</div>
            </th>
          )}
        </tr>
      </thead>
      {loading ? (
        <tbody>
          <tr>
            <td colSpan={span} className="px-3 py-8 text-center text-sm text-ink-3">
              {/* Not an empty body with a spinner: a screen reader must hear
                  that we are waiting, not a silence that sounds like
                  "nothing here". */}
              <span role="status">{loadingLabel}</span>
            </td>
          </tr>
        </tbody>
      ) : rows.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan={span} className="p-0">
              {empty}
            </td>
          </tr>
        </tbody>
      ) : groups == null ? (
        <tbody>{rows.map((row, index) => renderRow(row, index))}</tbody>
      ) : (
        groups.map((group) => (
          <tbody
            key={group.key}
            data-testid={testId ? `${testId}-group-${group.key}` : undefined}
          >
            <tr className="border-b border-border bg-surface-2">
              <th
                scope="rowgroup"
                colSpan={span}
                className={cx("px-4 py-2 text-left", eyebrowClass())}
              >
                {groupHeader?.(
                  group.key,
                  group.rows.map((item) => item.row),
                )}
              </th>
            </tr>
            {group.rows.map((item) => renderRow(item.row, item.index))}
          </tbody>
        ))
      )}
    </table>
  );

  /**
   * The sideways scroll box.
   *
   * The table's root used to be a bare `<table>`, and a wrapper appeared
   * only when rows could be selected — and even that one had no
   * `overflow`. So a table wider than its column pushed the whole document
   * sideways: on the doc web it broke out of the demo stage, in an
   * application every page scrolled horizontally because of one screen's
   * table. A table is, by its own documentation, the largest design
   * surface of an admin; it is the one thing guaranteed to be wider than a
   * phone.
   *
   * `tabIndex` is what makes the box reachable without a mouse: a region
   * that can only be scrolled by dragging is content a keyboard user
   * cannot read.
   *
   * **Not with `stickyHeader`, and that is not an oversight.** Any box
   * between the scrollport and a `sticky` header stops it sticking —
   * measured in a browser, with `overflow-y: clip` as well as with `auto`,
   * so there is no combination of overflow values that gives both. It
   * costs nothing, because a sticky header only works when the CALLER has
   * already wrapped the table in `max-h-* overflow-y-auto` — and a box
   * that scrolls vertically scrolls horizontally too (CSS turns the
   * `visible` axis into `auto`). A sticky-header table is therefore
   * already contained; a second box would only take its header away.
   */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!walkable || rows.length === 0) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    // Typing into a field inside a row, or pressing a button there, is
    // not walking the table.
    const target = event.target as HTMLElement;
    if (
      target !== event.currentTarget &&
      target.closest("input, textarea, select, button, a, [contenteditable]")
    ) {
      return;
    }
    const key = event.key.toLowerCase();
    let step: number;
    if (key === "j" || key === "arrowdown") {
      step = 1;
    } else if (key === "k" || key === "arrowup") {
      step = -1;
    } else if (key === "x" && activeIndex != null && selectable) {
      event.preventDefault();
      toggleRow(rowKey(rows[activeIndex]));
      return;
    } else if (key === "enter" && activeIndex != null && onRowOpen != null) {
      event.preventDefault();
      onRowOpen(rows[activeIndex]);
      return;
    } else {
      return;
    }
    event.preventDefault();
    // From the latest state, not this render's: a held key fires faster
    // than the table re-renders, and each press must still move one row.
    let next = 0;
    setActive((current) => {
      const from = current != null && current < rows.length ? current : null;
      next = from == null ? 0 : Math.max(0, Math.min(rows.length - 1, from + step));
      return next;
    });
    requestAnimationFrame(() =>
      document
        .getElementById(`${captionId}-row-${next}`)
        ?.scrollIntoView?.({ block: "nearest" }),
    );
  }

  const scroller = stickyHeader ? (
    table
  ) : (
    <div
      className="overflow-x-auto"
      tabIndex={0}
      role={caption != null ? "region" : undefined}
      aria-labelledby={caption != null ? captionId : undefined}
      aria-activedescendant={
        walkable && activeIndex != null ? `${captionId}-row-${activeIndex}` : undefined
      }
      onKeyDown={walkable ? onKeyDown : undefined}
      onBlur={walkable ? () => setActive(null) : undefined}
      data-testid={testId ? `${testId}-scroll` : undefined}
    >
      {table}
    </div>
  );

  const bulk =
    selectable && selectedKeys.size > 0 && bulkbar != null ? (
      <div
        role="status"
        className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-accent-border bg-accent-bg px-3 py-2 text-sm text-ink"
      >
        {bulkbar}
      </div>
    ) : null;

  const framed = toolbar != null || footer != null || footerEnd != null;

  if (!framed) {
    if (!selectable) return scroller;
    return (
      <div>
        {bulk}
        {scroller}
      </div>
    );
  }

  // The frame: one card around filters, rows and footer. `overflow-hidden`
  // clips the header's background to the card's rounded corners.
  return (
    <div data-testid={testId ? `${testId}-frame` : undefined}>
      {bulk}
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {toolbar != null && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            {toolbar}
          </div>
        )}
        {scroller}
        {(footer != null || footerEnd != null) && (
          // `-mt-px` lets the footer's top border sit on the last row's
          // bottom border instead of doubling it.
          <div className="-mt-px flex flex-wrap items-center gap-3 border-t border-border px-4 py-3 text-sm text-ink-3">
            {footer}
            {walkable && (
              <span
                className="ml-auto flex items-center gap-3 text-xs"
                data-testid={testId ? `${testId}-keys` : undefined}
              >
                <span className="flex items-center gap-1">
                  <Key>J</Key>
                  <Key>K</Key>
                  {labels.tableKeysMove}
                </span>
                {selectable && (
                  <span className="flex items-center gap-1">
                    <Key>X</Key>
                    {labels.tableKeysSelect}
                  </span>
                )}
                {onRowOpen != null && (
                  <span className="flex items-center gap-1">
                    <Key>{"\u21b5"}</Key>
                    {labels.tableKeysOpen}
                  </span>
                )}
              </span>
            )}
            {footerEnd != null && (
              // `IngotPagination` keeps its own top margin for the place it
              // was made for (under a bare table); inside the footer the
              // footer's padding is the spacing, so the margin goes.
              <div
                className={cx(
                  "flex items-center gap-3 [&>nav]:mt-0",
                  !walkable && "ml-auto",
                )}
              >
                {footerEnd}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
