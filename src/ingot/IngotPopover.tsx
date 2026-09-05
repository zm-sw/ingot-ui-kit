import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { cx } from "./cx";
import { MENU_LAYER } from "./modalLayer";
import { placePanel, type IngotPlacement } from "./placement";

/**
 * A panel anchored to the thing that opened it — a menu, a filter, a
 * picker, a bit of detail that would be a dialog if it were bigger.
 *
 * This is the piece the kit was missing, and its absence showed: every
 * panel in the kit did its own version of the same four problems.
 * ``IngotTopNav`` owns a close delay, a click-outside listener and a
 * roving focus; ``IngotMegaMenu`` and ``IngotUserMenu`` are panels that
 * cannot position themselves and lean on whoever renders them. Four
 * answers to one question is three too many.
 *
 * **It is controlled**, like every other overlay in the kit: the caller
 * owns ``open`` and gets ``onClose``. A popover that owns its own state
 * cannot be driven from a keyboard shortcut, restored after a route
 * change, or tested without clicking.
 *
 * What it holds for the caller:
 *
 * - **Position**, recomputed on scroll and resize, flipping above the
 *   anchor when there is no room below and sliding along the window edge
 *   rather than hanging outside it (see ``placement.ts``).
 * - **A click outside closes it**, but a click on the anchor does not: the
 *   anchor is a toggle, and closing here would make its own handler
 *   reopen the panel on the same click.
 * - **ESC closes it** and focus goes back to the anchor. Without the
 *   return the reader wakes up at the top of the page.
 * - **The layer**: ``MENU_LAYER``, so a popover opened from inside a
 *   dialog is above that dialog rather than under it.
 *
 * What it deliberately does NOT hold: a focus trap. A popover is not a
 * dialog — Tab is meant to leave it and carry on through the page, and
 * trapping focus in a filter panel is how a keyboard user gets stuck.
 * ``IngotModal`` is the primitive for the case where trapping is right.
 */
export function IngotPopover({
  open,
  anchorRef,
  onClose,
  placement = "bottom-start",
  label,
  className,
  children,
  testId,
}: {
  open: boolean;
  /** The element the panel hangs from — usually the button that opened it. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Called by ESC and by a click outside. The caller owns the state. */
  onClose: () => void;
  /** Preferred side and alignment; it flips when there is no room. */
  placement?: IngotPlacement;
  /**
   * Translated name of the panel. Required: a panel a screen reader meets
   * without a name is "group", which says nothing about what opened.
   */
  label: string;
  /** Layout only — width and padding of the panel. */
  className?: string;
  children: ReactNode;
  testId?: string;
}): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const rect = anchor.getBoundingClientRect();
    const placed = placePanel({
      anchor: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      panel: { width: panel.offsetWidth, height: panel.offsetHeight },
      placement,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scroll: { x: window.scrollX, y: window.scrollY },
    });
    setPosition({ top: placed.top, left: placed.left });
  }, [anchorRef, placement]);

  // Before paint, so the panel never shows up in the top-left corner first
  // and jumps into place after.
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    // Capture, so a panel anchored inside a scrolling container follows it
    // too, not only the window.
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      // The anchor closes through its own handler. Closing here as well
      // would make the anchor's click reopen what this just closed.
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
      anchorRef.current?.focus();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="group"
      aria-label={label}
      style={{
        position: "absolute",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        zIndex: MENU_LAYER,
        // Until the first measurement the panel is laid out but not shown:
        // it has to exist to be measured, and must not be seen in the
        // corner while it is.
        visibility: position === null ? "hidden" : undefined,
      }}
      className={cx(
        "rounded-lg border border-border bg-surface p-2 shadow-lg",
        className,
      )}
      data-testid={testId}
      data-ingot-popover=""
    >
      {children}
    </div>,
    document.body,
  );
}
