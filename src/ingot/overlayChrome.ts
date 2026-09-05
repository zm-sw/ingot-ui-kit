import { useEffect, useRef, type RefObject } from "react";

/**
 * Shared overlay behaviour of the dialog primitives.
 *
 * Extracted from `IngotModal.tsx` when `IngotDrawer` arrived and the
 * accessibility bar (owner's decision, 2026-08-25) started to apply to
 * two overlays at once. The scroll lock is therefore a MODULE, not
 * component state: a drawer opened above a modal (or the other way round)
 * must not unlock the scroll the other overlay still stands on when it
 * closes.
 *
 * **Internal module, not public API.** Nothing here is re-exported from
 * `index.ts` — a consumer composes dialogs from `IngotModal` /
 * `IngotDrawer`, not from their insides.
 */

/** What may receive focus. `tabindex="-1"` is a programmatic target, not a Tab stop. */
export const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * How many overlays are open right now and what `overflow` was before the
 * first of them. The original value is stashed on the 0 → 1 transition so
 * a second overlay does not overwrite it with the already locked
 * `"hidden"`.
 */
let openDialogs = 0;
let bodyOverflowBeforeLock = "";

/** Locks background scroll for the overlay's lifetime; the counter is shared by all. */
export function useOverlayScrollLock(): void {
  useEffect(() => {
    if (openDialogs === 0) {
      bodyOverflowBeforeLock = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openDialogs += 1;
    return () => {
      openDialogs -= 1;
      if (openDialogs === 0) {
        document.body.style.overflow = bodyOverflowBeforeLock;
      }
    };
  }, []);
}

/**
 * Reads the opener on mount and returns focus to it on unmount. Without it
 * focus drops to <body> and both screen reader and keyboard start over
 * from the top of the page.
 */
export function useOverlayFocusReturn(): void {
  const openerRef = useRef<Element | null>(null);
  if (openerRef.current === null && typeof document !== "undefined") {
    openerRef.current = document.activeElement;
  }

  useEffect(() => {
    const opener = openerRef.current;
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
}

/**
 * Focus into the overlay right after opening. When nothing inside is
 * focusable, the panel itself takes it — it should have ``tabIndex={-1}``.
 */
export function useOverlayInitialFocus(
  panelRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
    // panelRef is a ref, not a value — the effect runs on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Focus trap for Tab and Shift+Tab inside the panel. Called from the
 * overlay's ``onKeyDown``; keys other than Tab are left alone (ESC is the
 * caller's, so one press does not close two overlays stacked on each
 * other).
 */
export function trapOverlayTab(
  event: React.KeyboardEvent<HTMLElement>,
  panel: HTMLElement | null,
): void {
  if (event.key !== "Tab" || !panel) return;
  const stops = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (stops.length === 0) {
    // Nowhere to cycle — Tab would carry focus out of the overlay.
    event.preventDefault();
    return;
  }
  const first = stops[0];
  const last = stops[stops.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
