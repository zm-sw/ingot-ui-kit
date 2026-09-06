import { useEffect, useRef, type JSX, type RefObject } from "react";

import { cx } from "./cx";
import { IngotIcon, type IngotIconName } from "./IngotIcon";
import { IngotPopover } from "./IngotPopover";
import { menuRowClass } from "./menuRow";
import type { IngotPlacement } from "./placement";

/**
 * A list of actions in a popover — the "…" of a row, the account menu, the
 * three commands that do not fit in a toolbar.
 *
 * It stands on ``IngotPopover`` and adds what a MENU has to have on top of
 * a panel: the ARIA roles, the arrow keys, and the two behaviours the
 * roles then promise.
 *
 * **Arrows walk, Tab leaves.** A menu is one tab stop: focus enters the
 * open menu, arrows move within it, Home and End jump to the ends, and Tab
 * closes the menu and carries on through the page. That is the ARIA
 * practice, and it is also the only version a keyboard user can escape
 * without learning a trick.
 *
 * **Type-ahead**, because a menu of a dozen entries is faster to type at
 * than to walk. Letters typed within a second are one prefix; a pause
 * starts a new one.
 *
 * **A disabled item stays visible and stays announced.** Hiding it would
 * move everything below it and leave the operator wondering whether they
 * misremembered the menu; ``aria-disabled`` says it is there and not
 * available, which is the truth.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotMenuItem {
  key: string;
  /** Translated label. Required — a nameless menu item is a nameless action. */
  label: string;
  onSelect: () => void;
  icon?: IngotIconName;
  disabled?: boolean;
  /** Irreversible action — red, and always last in its group. */
  tone?: "default" | "danger";
  /** Draws a divider above this item; a group boundary, not decoration. */
  separatorBefore?: boolean;
  testId?: string;
}

const TYPE_AHEAD_RESET_MS = 1000;

export function IngotMenu({
  open,
  anchorRef,
  onClose,
  items,
  label,
  placement = "bottom-end",
  className,
  testId,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  items: readonly IngotMenuItem[];
  /** Translated name of the menu — what a screen reader announces on open. */
  label: string;
  placement?: IngotPlacement;
  /** Layout only — typically a width. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ prefix: "", at: 0 });

  const enabled = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ??
        [],
    );

  // Focus enters the menu on open — otherwise the panel is visible, focus
  // is still on the button, and an arrow key only scrolls the page.
  useEffect(() => {
    if (!open) return;
    const first = enabled()[0];
    first?.focus();
  }, [open]);

  const move = (step: number) => {
    const list = enabled();
    if (list.length === 0) return;
    const index = list.indexOf(document.activeElement as HTMLElement);
    const from = index === -1 ? (step === 1 ? -1 : 0) : index;
    list[(from + step + list.length) % list.length]?.focus();
  };

  const jump = (to: "first" | "last") => {
    const list = enabled();
    (to === "first" ? list[0] : list[list.length - 1])?.focus();
  };

  const typeAhead = (key: string) => {
    const now = Date.now();
    const prefix =
      now - typed.current.at > TYPE_AHEAD_RESET_MS
        ? key.toLowerCase()
        : typed.current.prefix + key.toLowerCase();
    typed.current = { prefix, at: now };
    const match = enabled().find((item) =>
      (item.textContent ?? "").trim().toLowerCase().startsWith(prefix),
    );
    match?.focus();
  };

  return (
    <IngotPopover
      open={open}
      anchorRef={anchorRef}
      onClose={onClose}
      placement={placement}
      label={label}
      className={cx("min-w-[12rem] p-1", className)}
      testId={testId}
    >
      {/* The container holds the key handler because the arrows move
          between its items; focus itself lives on the items, which is what
          the ARIA practice asks for and what the tests measure. */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        ref={listRef}
        role="menu"
        aria-label={label}
        onKeyDown={(event) => {
          switch (event.key) {
            case "ArrowDown":
              event.preventDefault();
              move(1);
              return;
            case "ArrowUp":
              event.preventDefault();
              move(-1);
              return;
            case "Home":
              event.preventDefault();
              jump("first");
              return;
            case "End":
              event.preventDefault();
              jump("last");
              return;
            case "Tab":
              // Tab leaves the menu; it does not cycle inside it. A menu is
              // one stop on the way through the page.
              onClose();
              return;
            default:
              if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
                typeAhead(event.key);
              }
          }
        }}
        className="flex flex-col"
      >
        {items.map((item) => (
          <div key={item.key} className="contents">
            {item.separatorBefore === true && (
              <hr className="my-1 border-t border-border" />
            )}
            <button
              type="button"
              role="menuitem"
              aria-disabled={item.disabled === true ? true : undefined}
              // A disabled item keeps its place in the tab order of the menu
              // it belongs to, so arrows skip it but a screen reader can
              // still find it and say it is unavailable.
              tabIndex={-1}
              onClick={() => {
                if (item.disabled === true) return;
                item.onSelect();
                onClose();
                anchorRef.current?.focus();
              }}
              className={cx(
                "flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm",
                menuRowClass({ surface: "panel" }),
                item.tone === "danger" && "text-danger hover:bg-danger-bg",
                item.disabled === true && "cursor-not-allowed text-ink-4 hover:bg-transparent",
              )}
              data-testid={item.testId}
            >
              {item.icon !== undefined && (
                <span className="shrink-0 text-ink-4">
                  <IngotIcon name={item.icon} size={15} />
                </span>
              )}
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </IngotPopover>
  );
}
