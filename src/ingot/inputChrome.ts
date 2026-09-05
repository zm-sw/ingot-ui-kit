import { cx } from "./cx";

/**
 * The one visual language of a form control's frame.
 *
 * Internal module, not public API: nothing here is re-exported from
 * `index.ts`. Every control that draws a bordered box the user types or
 * picks in (`IngotField`, `IngotFieldInput`, `IngotSelect`,
 * `IngotSearchInput`) composes its frame from these strings, so the
 * radius, border, height, focus ring, error and disabled states are decided
 * exactly once. Before this module existed the kit drew the same box three
 * different ways (three radii, three heights, two focus styles).
 *
 * Height matches `Button size="md"` (34px: 20px line + 2 × 6px padding +
 * 2 × 1px border), so a filter bar of selects, search and buttons sits on
 * one baseline.
 */

/** Frame: surface, radius, border width, type, shadow. No colour state. */
export const INPUT_FRAME =
  "rounded-md border bg-surface text-sm text-ink shadow-sm";

/** Horizontal and vertical padding of the control itself. */
export const INPUT_PAD = "px-3 py-1.5";

/** Border colour at rest. */
export const INPUT_BORDER = "border-border-strong";

/** Border colour when the control carries an error. */
export const INPUT_BORDER_ERROR = "border-danger";

/** Focus ring on the focused element itself (`<select>`, bare `<input>`). */
export const INPUT_FOCUS =
  "focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-bg";

/**
 * Focus ring on a wrapper that contains the input (a field with an affix
 * inside the same frame). Same look as {@link INPUT_FOCUS}, different
 * pseudo-class.
 */
export const INPUT_FOCUS_WITHIN =
  "focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent-bg";

/** Disabled state of the focused element itself. */
export const INPUT_DISABLED =
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-4";

/** Placeholder colour, for controls that have one. */
export const INPUT_PLACEHOLDER = "placeholder:text-ink-4";

/**
 * Full class list for a control that IS the focusable element.
 *
 * @param error - draws the error border instead of the resting one.
 */
export function inputChrome({ error = false }: { error?: boolean } = {}): string {
  return cx(
    INPUT_FRAME,
    INPUT_PAD,
    error ? INPUT_BORDER_ERROR : INPUT_BORDER,
    INPUT_FOCUS,
    INPUT_DISABLED,
    INPUT_PLACEHOLDER,
  );
}

/**
 * Full class list for a wrapper that holds the focusable element (and maybe
 * an affix). Padding is left to the children so an affix can sit flush.
 */
export function inputFrameChrome({
  error = false,
}: { error?: boolean } = {}): string {
  return cx(
    INPUT_FRAME,
    error ? INPUT_BORDER_ERROR : INPUT_BORDER,
    INPUT_FOCUS_WITHIN,
  );
}
