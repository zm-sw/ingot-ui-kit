/**
 * How deep a quick-create "+ Add…" may still be offered — Forgmatic's rule.
 *
 * The depth itself is the kit's (``useModalDepth``), because only the kit
 * knows how many modals are open. What that depth is allowed to MEAN is a
 * product decision, and it is this product's: another application building
 * on Ingot may stack three levels or none, and the constant below would be
 * wrong for both.
 */
import { useModalDepth } from "../ModalDepthContext";

/**
 * The deepest modal from which a quick-create "+ Add…" may still be
 * offered.
 *
 * ``1`` = from the page (0) and from the first modal (1) yes, from a modal
 * above a modal (2) no. The owner's decision of 2026-08-10 read "stacking
 * max 1 level", i.e. ONE extra layer above what is currently open.
 *
 * That sentence can be read more strictly too — "quick-create only from
 * the page". The looser reading is deliberate here: the strict one would
 * turn off "+ Add category…" inside the item-creation modal, a shipped and
 * deployed feature. Turning it off as a side effect of introducing a
 * constant would be a regression hidden in a refactor; if the owner meant
 * it strictly, that is its own decision and its own change.
 */
export const MAX_QUICK_CREATE_DEPTH = 1;

/**
 * May a quick-create "+ Add…" be offered at this depth?
 *
 * Called from the components that render the affordance — not from those
 * that merely consume it.
 */
export function useCanQuickCreate(): boolean {
  return useModalDepth() <= MAX_QUICK_CREATE_DEPTH;
}
