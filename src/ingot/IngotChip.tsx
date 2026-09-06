import type { JSX, ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * A chip — a small pill the user OPERATES: a filter switched on, a choice
 * taken back off a list.
 *
 * **A chip is not a badge, and the difference is not decoration.**
 * `IngotBadge` names a state ("in production") and cannot be pressed: no
 * role, no focus, no keyboard. A chip is a control. Merge the two and you
 * get one of exactly two bugs, both of which cost a bug report to find:
 * a badge users click at and nothing happens, or a chip a screen reader
 * announces as a piece of text, so a keyboard user never learns it is
 * there.
 *
 * ## The two modes are exclusive, and the types say so
 *
 * A chip either **toggles** (`pressed` + `onToggle`) or is **removable**
 * (`onRemove` + `removeLabel`). Never both, and this is not a taste: a
 * removable toggle would put the cross inside the chip's own button, and a
 * button inside a button is invalid HTML that browsers resolve however
 * they like. The props are a union so that the combination cannot be
 * written down — the same reason `IngotBadge` has no `className`.
 *
 * That is why the two modes render differently. A toggle IS the button,
 * with `aria-pressed`. A removable chip is a plain `<span>` carrying its
 * own small `<button>` for the cross; the chip's text is not a control,
 * because there is nothing to do to it except take it away.
 *
 * ## Why `removeLabel` is required
 *
 * A cross with no text is a button with no name — a screen reader reads
 * "button" and the user is asked to guess. The label has to say WHICH
 * chip it drops ("Remove: Turning"), because a row of eight chips
 * otherwise offers eight buttons all called "Remove". It is required
 * rather than defaulted for the reason the kit applies everywhere: an
 * optional label is a label somebody forgets, and nobody sees the hole on
 * screen.
 *
 * The kit has no i18n namespace of its own: the text and `removeLabel`
 * arrive translated.
 */

interface ChipBase {
  /** The chip's text, already translated. One or two words. */
  children: ReactNode;
  /** Greys the chip out and takes it out of the keyboard's reach. */
  disabled?: boolean;
  testId?: string;
}

interface ChipToggle extends ChipBase {
  /** Is the filter on? Drawn inverse, and announced by `aria-pressed`. */
  pressed: boolean;
  onToggle: () => void;
  onRemove?: never;
  removeLabel?: never;
}

interface ChipRemovable extends ChipBase {
  /** Takes the chip off the list. Renders the cross. */
  onRemove: () => void;
  /** Names the cross for a screen reader: "Remove: Turning". Translated. */
  removeLabel: string;
  pressed?: never;
  onToggle?: never;
}

export type IngotChipProps = ChipToggle | ChipRemovable;

/** Shape shared by both modes, so a filter row and a chosen row line up. */
const SHELL =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium";

export function IngotChip(props: IngotChipProps): JSX.Element {
  const { children, disabled = false, testId } = props;

  if (props.onRemove) {
    return (
      <span
        className={cx(
          SHELL,
          "border-border bg-surface-2 text-ink-2",
          disabled && "opacity-50",
        )}
        data-testid={testId}
      >
        {children}
        <button
          type="button"
          onClick={props.onRemove}
          disabled={disabled}
          // The name says which chip goes, not just "remove": eight chips
          // would otherwise offer eight buttons under one name.
          aria-label={props.removeLabel}
          className="-mr-1 grid h-4 w-4 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-border hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed"
          data-testid={testId ? `${testId}-remove` : undefined}
        >
          <IngotIcon name="close" size={12} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onToggle}
      disabled={disabled}
      aria-pressed={props.pressed}
      className={cx(
        SHELL,
        // Pressed is not told by colour alone: the chip inverts, which is a
        // change of figure and ground that survives greyscale — and
        // `aria-pressed` says it in words.
        props.pressed
          ? "border-ink bg-ink text-surface"
          : "border-border bg-surface text-ink-2 hover:border-border-strong hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-bg",
        disabled && "cursor-not-allowed opacity-50",
      )}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

/**
 * A named row of chips.
 *
 * Without it a filter row is a handful of loose buttons: a screen reader
 * meets them one by one and never hears what they filter, nor how many
 * there are. `role="group"` with a name is the cheapest way to say "these
 * eight belong together and they are the process filter".
 *
 * It is a separate component rather than a wrapper baked into the chip
 * because a single chip — one removed module next to a field — is a real
 * and common case, and a group of one is noise in the reading order.
 */
export function IngotChipGroup({
  label,
  children,
  testId,
}: {
  /** What the row is for ("Filter by process"), already translated. */
  label: string;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-1.5"
      data-testid={testId}
    >
      {children}
    </div>
  );
}
