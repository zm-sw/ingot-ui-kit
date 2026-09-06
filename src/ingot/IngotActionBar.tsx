import { useEffect, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * The bar under a long form: what the reader came to do, still in reach
 * after the ninth field.
 *
 * Nothing in the kit did this. In a screen it was either a `fixed` block
 * covering the last field — which is worse than no bar, because the field
 * it hides is the one being filled in — or nothing at all, and Save lived
 * at the bottom of a page nobody scrolled to.
 *
 * **Sticky, not fixed, and that is the whole design.** A `sticky` element
 * stays in the document's flow: it takes up its own height at the end of
 * the content and rides along the bottom edge while there is more to
 * scroll. So it cannot cover anything, and none of the usual apparatus is
 * needed — no measuring the bar, no padding variable on the container, no
 * `ResizeObserver` for the day the bar wraps to two lines. A `fixed` bar
 * needs all three and gets one of them wrong on the screen nobody tested.
 *
 * The primary action sits on the right, where the reader's hand ends up
 * after the last field; what undoes or postpones sits on the left, far
 * from it. `status` is for what the screen has to say next to them —
 * "Unsaved changes", "Saved a moment ago" — translated by the caller.
 */
export function IngotActionBar({
  primary,
  secondary,
  status,
  dirty = false,
  onSave,
  className,
  testId,
}: {
  /** The action the screen exists for. On the right. */
  primary: ReactNode;
  /** Cancel, back, "save as draft". On the left, away from the primary. */
  secondary?: ReactNode;
  /**
   * One short line beside the actions — "Unsaved changes", "Saved". Comes
   * from the caller already translated; the kit does not know whether
   * anything changed.
   */
  status?: ReactNode;
  /**
   * There are unsaved changes. Draws a dot before `status`, so the state
   * is not carried by wording alone — a reader skimming sees the mark
   * before they read the sentence.
   */
  dirty?: boolean;
  /**
   * Ctrl/Cmd+S saves.
   *
   * Off unless asked for: the shortcut belongs to a screen that IS a
   * form. Binding it under a list would steal the browser's Save from a
   * reader who wanted the page.
   */
  onSave?: () => void;
  /** Layout only — the bar's own look is not negotiable. */
  className?: string;
  testId?: string;
}): JSX.Element {
  useEffect(() => {
    if (onSave === undefined) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "s" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      onSave();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onSave]);

  return (
    <div
      // `-mx-4 md:-mx-6` cancels the frame's margins so the bar's line runs
      // the full width of the frame, the way a bar reads; the padding puts
      // its contents back on the content's own left and right edges.
      className={cx(
        "sticky bottom-0 z-20 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3",
        "border-t border-border bg-surface/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6",
        className,
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-3">{secondary}</div>
      <div className="flex items-center gap-3">
        {status != null && (
          <span className="flex items-center gap-1.5 text-xs text-ink-3">
            {dirty && (
              // Decoration: the sentence beside it already says the state,
              // and a screen reader announcing "dot" would add nothing.
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn"
                data-testid={testId ? `${testId}-dirty` : undefined}
              />
            )}
            {status}
          </span>
        )}
        {primary}
      </div>
    </div>
  );
}
