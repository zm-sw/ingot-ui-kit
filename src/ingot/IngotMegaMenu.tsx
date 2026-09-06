import { useId, useState, type JSX, type MouseEvent, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
import { LockedRow, menuRowClass } from "./menuRow";
import { MENU_LAYER } from "./modalLayer";

/**
 * The unfolded menu of a top-bar section — groups of links in one or two
 * columns and a preview column on the right.
 *
 * Shape 2.0 follows the deployed admin (owner's decision, 2026-09-02,
 * points 01–03), not the other way round:
 *
 * - **Columns grow from content.** Up to seven items one column, above
 *   seven two (CSS columns; a group does not break in the middle). The
 *   fixed three-column grid of 1.0 turned most real sections (1–8 items)
 *   into an empty table.
 * - **The preview follows the item under the cursor and under focus.** It
 *   describes the item the reader is on (``description``); until they are
 *   on one, it describes the first. Focus switches the preview like the
 *   mouse does — the keyboard is not a second class.
 * - **A screen reader hears the description from the link itself.** The
 *   preview text is a visual copy; every link carries ``aria-describedby``
 *   to an element with ITS description, so the description is read by
 *   those who cannot see the preview column. The column itself is
 *   ``aria-hidden`` — otherwise a screen reader would hear everything
 *   twice.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 */

export interface IngotMegaMenuItem {
  href: string;
  label: string;
  /** One sentence about the screen. Drawn in the preview and read by a screen reader. */
  description?: string;
  /** Icon before the label. Decorative — the label carries the meaning. */
  icon?: ReactNode;
  /** Record count on the right. Mono, because it is a number to compare. */
  count?: number;
  /** The currently open item. */
  current?: boolean;
  /**
   * Click on the link. An SPA caller calls its router here with
   * ``preventDefault``; ``href`` stays so the middle click and "open in a
   * new tab" keep working.
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Locked item (e.g. a module the tenant has not enabled yet). Drawn
   * VISIBLY, muted and with a lock, but it is not a link — the click calls
   * the menu's ``onLockedItemClick`` (typically a modal with an
   * explanation). The preview still works for it: the description is the
   * screen's marketing.
   */
  locked?: boolean;
  /**
   * Muted item — NAVIGATES normally, only softly de-emphasised (e.g. a
   * module whose storefront is a gate page; the menu does not lock it). A
   * hard lock without navigation is ``locked``.
   */
  muted?: boolean;
  /**
   * A mark after the label, on the right (where ``count`` otherwise sits)
   * — e.g. a spark saying "something to discover". Decorative.
   */
  marker?: ReactNode;
  /** Test anchor of the item — e2e clicks a concrete link, not the menu. */
  testId?: string;
}

export interface IngotMegaMenuGroup {
  /** Group title — mono uppercase. Without it the group is drawn without a header. */
  title?: string;
  items: readonly IngotMegaMenuItem[];
}

/** Above this many items the links break into two columns. */
const SINGLE_COLUMN_MAX = 7;

/** Geometry of an item row; colours come from menuRowClass. */
const ITEM_ROW = "flex items-center gap-2.5 rounded px-2 py-1.5 text-sm";

export function IngotMegaMenu({
  groups,
  art,
  label,
  onLockedItemClick,
  testId,
}: {
  /** Groups of links. The menu splits them into 1–2 columns by item count. */
  groups: readonly IngotMegaMenuGroup[];
  /** Drawing of the section above the preview text — schematic, decorative. */
  art?: ReactNode;
  /** Translated ``aria-label`` of the menu. */
  label: string;
  /**
   * Click on a locked item (``locked``) — typically opens a modal that
   * explains what the module does and how to enable it. Without the
   * callback a locked item is only drawn muted.
   */
  onLockedItemClick?: (item: IngotMegaMenuItem) => void;
  testId?: string;
}): JSX.Element {
  const descId = useId();
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  const flat = groups.flatMap((group) => group.items);
  const preview =
    flat.find((item) => item.href === previewHref) ?? flat[0] ?? null;
  const twoColumns = flat.length > SINGLE_COLUMN_MAX;

  return (
    // ``left-0`` relative to the wrapper of ITS section (IngotTopNav
    // renderMenu) — the panel stands under its button. Anchoring to the
    // bar's left edge would, with hover-open, force the cursor across other
    // sections' triggers, opening them on the way.
    <div
      // MENU_LAYER, not a fixed z-index: a menu belongs above every open
      // dialog (see modalLayer.ts); a hard-coded 60 ended up under the
      // second dialog opened.
      className="absolute left-0 top-[calc(100%+6px)] flex animate-ingot-fade-in gap-5 rounded-lg border border-border bg-surface p-3 shadow-lg motion-reduce:animate-none"
      style={{ zIndex: MENU_LAYER }}
      data-testid={testId}
    >
      <nav
        aria-label={label}
        className={cx("min-w-[13rem]", twoColumns && "w-[26rem]")}
        style={twoColumns ? { columnCount: 2, columnGap: "1rem" } : undefined}
      >
        {groups.map((group, index) => (
          <section
            key={group.title ?? index}
            className="mb-2 break-inside-avoid last:mb-0"
          >
            {group.title && (
              <IngotEyebrow className="px-2 pb-1 pt-1.5">{group.title}</IngotEyebrow>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const previewed = preview !== null && item.href === preview.href;
                const describedBy =
                  previewed && preview.description ? descId : undefined;
                if (item.locked) {
                  return (
                    <li key={item.href}>
                      <LockedRow
                        onClick={() => onLockedItemClick?.(item)}
                        onMouseEnter={() => setPreviewHref(item.href)}
                        onFocus={() => setPreviewHref(item.href)}
                        aria-describedby={describedBy}
                        data-testid={item.testId}
                        className={cx(ITEM_ROW, "w-full text-left")}
                      >
                        {item.icon}
                        {item.label}
                      </LockedRow>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      onMouseEnter={() => setPreviewHref(item.href)}
                      onFocus={() => setPreviewHref(item.href)}
                      aria-current={item.current ? "page" : undefined}
                      aria-describedby={describedBy}
                      data-testid={item.testId}
                      className={cx(
                        ITEM_ROW,
                        menuRowClass({ current: item.current, muted: item.muted }),
                      )}
                    >
                      {item.icon}
                      {item.label}
                      {item.count !== undefined && (
                        <span className="ml-auto font-mono text-[11px] text-ink-4">
                          {item.count}
                        </span>
                      )}
                      {item.marker !== undefined && (
                        <span className="ml-auto inline-flex" aria-hidden="true">
                          {item.marker}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      {preview !== null && (
        <div
          aria-hidden="true"
          className="w-56 shrink-0 border-l border-border py-1.5 pl-4"
          data-testid={testId ? `${testId}-preview` : undefined}
        >
          {art}
          <p className={cx("text-[13px] font-medium text-ink", art !== undefined && "mt-2")}>
            {preview.label}
          </p>
          {preview.description && (
            <p className="mt-1 text-xs leading-snug text-ink-3">
              {preview.description}
            </p>
          )}
        </div>
      )}
      {/* ``aria-describedby`` target outside the aria-hidden preview — a
          screen reader may read it, the eye does not need it (the preview
          draws the same text visually). */}
      {preview !== null && preview.description && (
        <span id={descId} className="sr-only">
          {preview.description}
        </span>
      )}
    </div>
  );
}
