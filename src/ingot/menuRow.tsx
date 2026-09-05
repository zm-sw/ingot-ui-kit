import { type ButtonHTMLAttributes, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * State colours of a navigation row — a top-bar section, a mega menu item,
 * a side nav entry. Internal, not exported from the barrel.
 *
 * Three components used to spell the same states three ways (current on
 * `surface-2` here, `surface-3` there; hover to `ink` here, to
 * `accent-ink` there). This is the one spelling. Layout (padding, gap,
 * flex) stays with the caller: a tab in a bar and a row in a panel have
 * different geometry but the same colours.
 *
 * Priority when several are true: locked, open, current, muted, dim.
 */
export interface MenuRowState {
  /** The row is the page the user is on. */
  current?: boolean;
  /** The row's panel is open (top-bar section with a mega menu). */
  open?: boolean;
  /** Reachable but de-emphasised (a tier the tenant has not enabled yet). */
  muted?: boolean;
  /** Behind a lock: a button that explains, not a link that navigates. */
  locked?: boolean;
  /** Secondary row — a child in a side nav — at rest one step lighter. */
  dim?: boolean;
  /**
   * What the row sits on. On `panel` (a surface) the current row lifts to
   * `surface-2`; on `page` (the page background) it becomes a small card
   * on `surface` with a border and a shadow, because `surface-2` would
   * barely differ from the ground.
   */
  surface?: "panel" | "page";
}

export function menuRowClass({
  current = false,
  open = false,
  muted = false,
  locked = false,
  dim = false,
  surface = "panel",
}: MenuRowState = {}): string {
  const page = surface === "page";
  if (locked) return cx(page && "border-transparent", "text-ink-4 hover:bg-surface-2 hover:text-ink-3");
  if (open) return cx(page && "border-transparent", "bg-surface-3 font-medium text-ink");
  if (current) {
    return page
      ? "border-border bg-surface font-medium text-ink shadow-sm"
      : "bg-surface-2 font-medium text-ink";
  }
  if (muted) return cx(page && "border-transparent", "text-ink-4 hover:bg-surface-2 hover:text-ink-3");
  if (dim) return cx(page && "border-transparent", "text-ink-3 hover:bg-surface-2 hover:text-ink");
  return cx(page && "border-transparent", "text-ink-2 hover:bg-surface-2 hover:text-ink");
}

/**
 * A locked navigation row: a button (it explains, it does not navigate)
 * with the lock glyph after its label. TopNav and MegaMenu used to draw
 * this branch identically and separately.
 *
 * `className` carries the caller's layout; colours come from
 * {@link menuRowClass}.
 */
export function LockedRow({
  className,
  children,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "className"> & {
  className: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <button type="button" className={cx(className, menuRowClass({ locked: true }))} {...rest}>
      {children}
      <IngotIcon name="lock" size={13} className="ml-auto shrink-0" aria-hidden />
    </button>
  );
}
