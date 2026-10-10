import { useRef, useState, type JSX, type ReactNode } from "react";

import { Button } from "./Button";
import { cx } from "./cx";
import { IconButton } from "./IconButton";
import { IngotCheckboxControl } from "./IngotCheckbox";
import { IngotIcon } from "./IngotIcon";
import { IngotMenu, type IngotMenuItem } from "./IngotMenu";
import { IngotPopover } from "./IngotPopover";
import { useIngotLabels } from "./IngotProvider";
import { IngotSearchInput } from "./IngotSearchInput";

/**
 * The pieces of `IngotTable` that let a user arrange the columns: the
 * picker, the column menu and the resize handle, plus the pure functions
 * that turn a stored layout into the columns on screen.
 *
 * Internal — not exported from the barrel. The public surface is the
 * `layout` / `onLayoutChange` pair on the table and the `IngotTableLayout`
 * type.
 */

/**
 * How one user arranged one table. Controlled from outside: the table
 * never stores it, so where it lives (a user's settings on a server, or
 * nowhere) is the caller's decision.
 *
 * A stored layout outlives the code that wrote it, so the table reads it
 * defensively: a key no column has is ignored, a column the layout does
 * not name keeps its default place at the end, and a column that may not
 * be hidden is shown whatever the layout says.
 */
export interface IngotTableLayout {
  /** Column keys in display order — hidden columns keep their slot too. */
  order?: readonly string[];
  /** Keys of the columns the user hid. */
  hidden?: readonly string[];
  /** Widths in pixels the user dragged columns to. */
  widths?: Readonly<Record<string, number>>;
}

export type MoveTarget = "first" | "left" | "right" | "last";

/** Every column key in display order, the stored order first. */
export function orderedKeys(
  keys: readonly string[],
  layout: IngotTableLayout | undefined,
): string[] {
  const known = new Set(keys);
  const stored = (layout?.order ?? []).filter((key, index, all) =>
    known.has(key) && all.indexOf(key) === index,
  );
  const placed = new Set(stored);
  return [...stored, ...keys.filter((key) => !placed.has(key))];
}

/** Keys hidden by the layout, minus the columns that may not be hidden. */
export function hiddenKeys(
  layout: IngotTableLayout | undefined,
  locked: ReadonlySet<string>,
): Set<string> {
  return new Set((layout?.hidden ?? []).filter((key) => !locked.has(key)));
}

/**
 * The full order after moving `key` among the VISIBLE columns. Hidden
 * columns keep their slots, so a column shown again comes back where it
 * was rather than at the end.
 */
export function moveKey(
  order: readonly string[],
  hidden: ReadonlySet<string>,
  key: string,
  to: MoveTarget | number,
): string[] {
  const visible = order.filter((item) => !hidden.has(item));
  const from = visible.indexOf(key);
  if (from === -1) return [...order];
  const target =
    to === "first"
      ? 0
      : to === "last"
        ? visible.length - 1
        : to === "left"
          ? from - 1
          : to === "right"
            ? from + 1
            : to;
  const clamped = Math.max(0, Math.min(visible.length - 1, target));
  const next = [...visible];
  next.splice(from, 1);
  next.splice(clamped, 0, key);
  let slot = 0;
  return order.map((item) => (hidden.has(item) ? item : next[slot++]));
}

/** The smallest width a drag or the keyboard may shrink a column to. */
export const MIN_COLUMN_WIDTH = 64;
const KEYBOARD_STEP = 16;

/** One entry of the picker — the column's name as plain text. */
export interface PickerColumn {
  key: string;
  label: string;
  locked: boolean;
}

/**
 * The column picker: a button at the end of the header that opens a panel
 * with a search field and one checkbox per column.
 */
export function ColumnPicker({
  columns,
  hidden,
  onToggle,
  onReset,
  testId,
}: {
  /** In display order. */
  columns: readonly PickerColumn[];
  hidden: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onReset?: () => void;
  testId?: string;
}): JSX.Element {
  const labels = useIngotLabels();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const anchorRef = useRef<HTMLButtonElement>(null);

  const needle = query.trim().toLocaleLowerCase();
  const shown = columns.filter((col) => !hidden.has(col.key));
  const listed = needle
    ? columns.filter((col) => col.label.toLocaleLowerCase().includes(needle))
    : columns;

  return (
    <>
      <IconButton
        ref={anchorRef}
        label={labels.tableColumns}
        size="sm"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        data-testid={testId}
      >
        <IngotIcon name="grid" />
      </IconButton>
      <IngotPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label={labels.tableColumns}
        placement="bottom-end"
        className="w-72 p-0"
        testId={testId ? `${testId}-panel` : undefined}
      >
        <div className="border-b border-border p-3">
          <IngotSearchInput
            value={query}
            onChange={setQuery}
            label={labels.tableColumnsSearch}
            placeholder={labels.tableColumnsSearch}
          />
        </div>
        <ul className="max-h-72 overflow-y-auto py-1">
          {listed.map((col) => {
            const visible = !hidden.has(col.key);
            // The last visible column cannot go: a table without columns
            // is a blank box with no way back to the picker's reason.
            const disabled = col.locked || (visible && shown.length === 1);
            return (
              <li key={col.key}>
                <label
                  className={cx(
                    "flex items-center gap-3 px-3 py-1.5 text-sm text-ink",
                    disabled ? "cursor-not-allowed text-ink-3" : "cursor-pointer hover:bg-surface-2",
                  )}
                >
                  <IngotCheckboxControl
                    checked={visible}
                    disabled={disabled}
                    onChange={() => onToggle(col.key)}
                    data-testid={testId ? `${testId}-toggle-${col.key}` : undefined}
                  />
                  {col.label}
                </label>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2 border-t border-border px-3 py-2">
          {onReset != null && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              data-testid={testId ? `${testId}-reset` : undefined}
            >
              {labels.tableReset}
            </Button>
          )}
          <span className="ml-auto font-mono text-xs tabular-nums text-ink-3">
            {shown.length} / {columns.length}
          </span>
        </div>
      </IngotPopover>
    </>
  );
}

/**
 * The `⋯` button in a header cell and the menu it opens: sort, move, hide,
 * and — when the column has one — its filter in a popover of its own.
 */
export function ColumnMenu({
  columnLabel,
  sortable,
  onSort,
  canMove,
  onMove,
  canHide,
  onHide,
  filter,
  filterActive,
  testId,
}: {
  columnLabel: string;
  sortable: boolean;
  onSort: (dir: "asc" | "desc") => void;
  canMove: { left: boolean; right: boolean };
  onMove: (to: MoveTarget) => void;
  canHide: boolean;
  onHide: () => void;
  filter?: ReactNode;
  filterActive: boolean;
  testId?: string;
}): JSX.Element {
  const labels = useIngotLabels();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const items: IngotMenuItem[] = [];
  if (sortable) {
    items.push(
      { key: "asc", label: labels.tableSortAsc, onSelect: () => onSort("asc") },
      { key: "desc", label: labels.tableSortDesc, onSelect: () => onSort("desc") },
    );
  }
  if (filter != null) {
    items.push({
      key: "filter",
      label: labels.tableFilter,
      icon: "search",
      separatorBefore: items.length > 0,
      onSelect: () => setFilterOpen(true),
    });
  }
  items.push(
    {
      key: "first",
      label: labels.tableMoveFirst,
      disabled: !canMove.left,
      separatorBefore: items.length > 0,
      onSelect: () => onMove("first"),
    },
    { key: "left", label: labels.tableMoveLeft, disabled: !canMove.left, onSelect: () => onMove("left") },
    { key: "right", label: labels.tableMoveRight, disabled: !canMove.right, onSelect: () => onMove("right") },
    { key: "last", label: labels.tableMoveLast, disabled: !canMove.right, onSelect: () => onMove("last") },
  );
  if (canHide) {
    items.push({ key: "hide", label: labels.tableHideColumn, separatorBefore: true, onSelect: onHide });
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        label={`${labels.tableColumnMenu}: ${columnLabel}`}
        size="sm"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
        // Quiet until the header is hovered or the button focused; on a
        // device without hover it is always shown, so touch can reach it.
        className={cx(
          "relative opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100",
          (menuOpen || filterOpen || filterActive) && "opacity-100",
        )}
        data-testid={testId}
      >
        <IngotIcon name="more" />
        {filterActive && (
          <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
        )}
      </IconButton>
      <IngotMenu
        open={menuOpen}
        anchorRef={anchorRef}
        onClose={() => setMenuOpen(false)}
        items={items}
        label={`${labels.tableColumnMenu}: ${columnLabel}`}
        testId={testId ? `${testId}-menu` : undefined}
      />
      {filter != null && (
        <IngotPopover
          open={filterOpen}
          anchorRef={anchorRef}
          onClose={() => setFilterOpen(false)}
          label={`${labels.tableFilter}: ${columnLabel}`}
          placement="bottom-end"
          className="w-64"
          testId={testId ? `${testId}-filter` : undefined}
        >
          {filter}
        </IngotPopover>
      )}
    </>
  );
}

/**
 * The drag handle on a header cell's right edge. A pointer drags it; the
 * keyboard moves it in 16px steps with the arrow keys — a width that only
 * a mouse can change is a column a keyboard user cannot read.
 *
 * While dragging, the width lives here and is reported through `onDrag`
 * on every move (the table draws it), and `onCommit` fires once at the
 * end — a caller saving the layout to a server is called once, not sixty
 * times a second.
 */
export function ResizeHandle({
  columnLabel,
  width,
  measure,
  onDrag,
  onCommit,
  testId,
}: {
  columnLabel: string;
  /** Current width, or undefined while the column is sized by its content. */
  width: number | undefined;
  /** Reads the column's rendered width when a drag starts from auto. */
  measure: () => number;
  onDrag: (width: number) => void;
  onCommit: (width: number) => void;
  testId?: string;
}): JSX.Element {
  const labels = useIngotLabels();
  const drag = useRef<{ startX: number; startWidth: number; last: number } | null>(null);

  return (
    // A focusable separator is the ARIA "window splitter" pattern — an
    // interactive widget the a11y lint reads as a static element.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`${labels.tableResize}: ${columnLabel}`}
      aria-valuenow={width ?? measure()}
      aria-valuemin={MIN_COLUMN_WIDTH}
      // Same widget: the splitter must be reachable from the keyboard.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none select-none focus-ring after:absolute after:inset-y-2 after:right-0 after:w-px after:bg-border hover:after:bg-accent"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const startWidth = width ?? measure();
        drag.current = { startX: event.clientX, startWidth, last: startWidth };
      }}
      onPointerMove={(event) => {
        if (drag.current == null) return;
        const next = Math.max(
          MIN_COLUMN_WIDTH,
          Math.round(drag.current.startWidth + event.clientX - drag.current.startX),
        );
        drag.current.last = next;
        onDrag(next);
      }}
      onPointerUp={() => {
        if (drag.current == null) return;
        const { last, startWidth } = drag.current;
        drag.current = null;
        if (last !== startWidth) onCommit(last);
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const current = width ?? measure();
        const step = event.key === "ArrowLeft" ? -KEYBOARD_STEP : KEYBOARD_STEP;
        onCommit(Math.max(MIN_COLUMN_WIDTH, current + step));
      }}
      data-testid={testId}
    />
  );
}
