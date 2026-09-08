import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * The frame of a whole screen: the bar at the top, the width the content
 * is allowed to reach, and the margins beside it.
 *
 * `IngotPageLayout` said this was "held by the shell under the top bar",
 * and no such shell existed. So every application built one: the doc web
 * wrote `mx-auto flex max-w-7xl gap-8 px-4 py-8` by hand — 1280 px, while
 * the handoff and `IngotTopNav`'s own documentation both say 1440 — and
 * the reference consumer wrote nothing at all, so its screens ran from
 * edge to edge. That is the first place two products built out of the same
 * buttons stop looking like the same product, and it is invisible in any
 * single screenshot.
 *
 * The width is `--frame`, a token, so the number is decided once and moves
 * once. It follows the handoff at 1440; the doc web's 1280 was nobody's
 * decision, it was `max-w-7xl` being the Tailwind class nearest to hand.
 *
 * **The bar spans the viewport; its row does not.** A top bar's border and
 * background have to reach both edges of the window or the page looks cut
 * out, but the things inside it must line up with the content underneath.
 * That is what {@link INGOT_FRAME_ROW} is for — give it to `IngotTopNav`'s
 * `contentClassName` and the bar's row and the content share one frame.
 */

/**
 * The frame's width and margins, for a row that has to line up with the
 * content while its own element spans the viewport — the inside of a top
 * bar, a sticky action bar at the bottom.
 */
export const INGOT_FRAME_ROW = "mx-auto w-full max-w-frame px-4 md:px-6";

export function IngotAppFrame({
  width = "app",
  bar,
  children,
  className,
  testId,
}: {
  /**
   * `app` stops at `--frame` — the shape nearly every screen wants.
   * `full` lets the content reach both edges, for a screen that IS the
   * data: a wide table, a board, a plan. A limit there does not protect
   * the reader, it hides columns.
   */
  width?: "app" | "full";
  /**
   * The top bar — typically `IngotTopNav`. It sticks to the top of the
   * window and spans it; pass {@link INGOT_FRAME_ROW} to the bar's own
   * `contentClassName` so its row lines up with the content below.
   */
  bar?: ReactNode;
  children: ReactNode;
  /** Layout only — the screen may add vertical rhythm, not a width. */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    // The height and the page colour belong here rather than to a global
    // stylesheet: a consumer mounts the kit inside its own document and
    // must not have to discover which of our rules it needs to copy.
    //
    // `100dvh`, not `100vh`: on iOS Safari `vh` is the height the window
    // has with the browser chrome RETRACTED, so with the bar out the frame
    // measures more than the reader can see and the page ends below the
    // screen. `dvh` follows the chrome as it comes and goes.
    <div className="min-h-[100dvh] bg-bg" data-testid={testId}>
      {bar !== undefined && (
        // z-30 sits under the overlays (modal, drawer, toast) and above
        // everything a page draws — a bar that a popover disappears behind
        // is worse than one that does not stick at all.
        <div className="sticky top-0 z-30">{bar}</div>
      )}
      <div
        className={cx(
          "mx-auto w-full px-4 md:px-6",
          width === "app" && "max-w-frame",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
