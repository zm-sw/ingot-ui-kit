/**
 * Where a floating panel lands next to the thing it belongs to.
 *
 * Kept as a pure function, apart from the component that uses it, for one
 * reason: jsdom has no layout, so a test can never watch the browser place
 * a real panel. Here the arithmetic is the whole behaviour — the flip when
 * a panel would fall off the bottom, the shift when it would fall off the
 * side — and it can be measured with numbers instead of pixels.
 *
 * No positioning library. The kit ships source to consumers who compile it
 * themselves, so every dependency is one they inherit; a few dozen lines of
 * rectangle arithmetic are cheaper to own than a package with its own
 * release cycle. What the libraries buy is the long tail — arrows, virtual
 * elements, scrolling containers — and none of it has a consumer here yet.
 */

export type IngotPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface Placed {
  /** Page coordinates, ready for `position: absolute` on the document. */
  top: number;
  left: number;
  /** Where it ended up — the caller draws the panel's corner from it. */
  placement: IngotPlacement;
}

/** Space between the anchor and the panel, in px. */
export const PLACEMENT_GAP = 6;

/** Space kept between the panel and the edge of the window, in px. */
const EDGE = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Places ``panel`` next to ``anchor``.
 *
 * ``anchor`` is in viewport coordinates (what ``getBoundingClientRect``
 * returns); ``scroll`` turns the result into page coordinates, so the panel
 * stays put when the page scrolls under it.
 *
 * Two adjustments, and only two, because they are the two that make a panel
 * unusable rather than merely imperfect:
 *
 * - **Flip.** A panel that does not fit below the anchor but fits above it
 *   goes above. A panel that fits neither stays where it was asked to go —
 *   flipping into an even smaller space would only move the problem.
 * - **Shift.** A panel wider than the room to its side slides along the
 *   edge instead of hanging outside the window, where the part that matters
 *   is unreachable.
 */
export function placePanel({
  anchor,
  panel,
  placement = "bottom-start",
  viewport,
  scroll = { x: 0, y: 0 },
}: {
  anchor: Rect;
  panel: { width: number; height: number };
  placement?: IngotPlacement;
  viewport: Viewport;
  scroll?: { x: number; y: number };
}): Placed {
  const [side, align] = placement.split("-") as ["bottom" | "top", "start" | "end"];

  const roomBelow = viewport.height - (anchor.top + anchor.height);
  const roomAbove = anchor.top;
  const needed = panel.height + PLACEMENT_GAP + EDGE;

  let finalSide = side;
  if (side === "bottom" && roomBelow < needed && roomAbove >= needed) finalSide = "top";
  if (side === "top" && roomAbove < needed && roomBelow >= needed) finalSide = "bottom";

  const top =
    finalSide === "bottom"
      ? anchor.top + anchor.height + PLACEMENT_GAP
      : anchor.top - panel.height - PLACEMENT_GAP;

  const wanted =
    align === "start" ? anchor.left : anchor.left + anchor.width - panel.width;
  // A panel wider than the window has no good left edge; the edge margin
  // then wins over the alignment, which is the lesser of two evils.
  const left = clamp(wanted, EDGE, Math.max(EDGE, viewport.width - panel.width - EDGE));

  return {
    top: top + scroll.y,
    left: left + scroll.x,
    placement: `${finalSide}-${align}` as IngotPlacement,
  };
}
