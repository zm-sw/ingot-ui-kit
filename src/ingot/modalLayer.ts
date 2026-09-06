import { useState } from "react";

/**
 * Dialog layer — whoever opened later is on top.
 *
 * **A fixed ``z-50`` on every dialog is not enough.** With equal
 * ``z-index`` the DOM order decides, and it does not follow the opening
 * order:
 *
 * * ``IngotModal`` portals into ``document.body``, i.e. after the whole
 *   page tree;
 * * dialogs that still draw their own overlay stay where the page renders
 *   them — i.e. BEFORE the portals.
 *
 * A dialog opened by a button INSIDE a portalled modal but rendered from
 * the page therefore ended up under it. The owner described it exactly:
 * "it opens under the currently open modal, so I cannot see it; the only
 * way to reach it is to close the others."
 *
 * The layer is assigned **on mount** and is monotonic, so the last opened
 * dialog lies above everything opened before — regardless of where in the
 * tree it lives and whether it portals.
 *
 * ## Why the counter does not reset
 *
 * Zeroing it when the last dialog closes would mean keeping two counters
 * in step (this one and the scroll lock in ``overlayChrome``) and trusting
 * they never drift. ``z-index`` has no practical ceiling;
 * {@link MAX_MODAL_LAYER} is a safety stop against runaway, not a budget.
 */

/** The lowest dialog layer — above sticky headers and menus. */
export const BASE_MODAL_LAYER = 50;

/**
 * The ceiling the layer never climbs past.
 *
 * A session that opens and closes a dialog two hundred thousand times is a
 * loop in code rather than a person's work; the ceiling is there for it,
 * so ``z-index`` does not reach magnitudes browsers ignore.
 */
export const MAX_MODAL_LAYER = 200_000;

/**
 * The layer of dropdown menus — above ALL dialogs.
 *
 * A menu is not a dialog and must not be ordered with them. It hangs on the
 * button the operator is working with right now, so it belongs above
 * anything open — otherwise it unfolds UNDER the modal it was opened from
 * and its items are not visible. That is exactly what happened when
 * dialogs got layers by opening order and the menu stayed on a fixed
 * ``z-50``.
 *
 * Not a race for the highest number: a menu is short-lived, it closes on
 * scroll, resize and click outside, so it has no way to outlive the
 * opening of another dialog.
 */
export const MENU_LAYER = MAX_MODAL_LAYER + 1;

let nextLayer = BASE_MODAL_LAYER;

/**
 * The layer for the dialog that is opening right now.
 *
 * Held in state so it does not change on re-render — a dialog that took a
 * new layer on every render would jump above its own children.
 */
export function useModalLayer(): number {
  const [layer] = useState(() => {
    nextLayer = Math.min(nextLayer + 1, MAX_MODAL_LAYER);
    return nextLayer;
  });
  return layer;
}
