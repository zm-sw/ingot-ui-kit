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

/**
 * Focus on the focused element itself (`<select>`, bare `<input>`).
 *
 * The ring comes from the `focus-ring` utility — the kit's one ring, drawn
 * from `--focus-ring` and the accent — so a focused field and a focused
 * button look like the same system. What stays here is the border: a field
 * has one, and moving it to the accent is what makes the focused control
 * read as the one being typed into, not merely as the one with a ring.
 *
 * `:focus` rather than `:focus-visible` on the border is deliberate: a
 * field the user clicked into IS receiving their keystrokes, so saying so
 * is not noise. The ring itself stays `:focus-visible` inside the utility.
 */
export const INPUT_FOCUS = "focus:border-accent focus-ring";

/**
 * The same for a wrapper that contains the input (a field with an affix
 * inside the frame). `focus-visible` never matches a `<div>`, so the ring
 * utility for a wrapper watches `:focus-within` instead — the look is the
 * same one.
 */
export const INPUT_FOCUS_WITHIN = "focus-within:border-accent focus-ring-within";

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
