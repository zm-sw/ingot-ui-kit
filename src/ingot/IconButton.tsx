import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";
import type { IngotSize, IngotTone } from "./vocabulary";

/**
 * A square button whose only content is an icon: the close cross of a
 * dialog, the bulb of a page hint, the chevron that folds a step card, a
 * row action.
 *
 * Internal, not exported from the barrel — consumers reach for
 * `Button iconOnly`. Inside the kit this is the single drawing of the
 * idiom: before it existed five components drew their own square button
 * with three sizes (26, 28 px), three radii and three hover colours.
 *
 * `label` is required and becomes `aria-label`: a button with no text is
 * otherwise announced as just "button".
 */
/** Three of the shared six: an icon button is an action, and an action is
 * neutral, dangerous or the one being encouraged. */
export type IconButtonTone = Extract<IngotTone, "neutral" | "danger" | "accent">;
/** No `lg`: a large icon-only button is a Button with `iconOnly`. */
export type IconButtonSize = Extract<IngotSize, "sm" | "md">;

/** `sm` is 28px; `md` is 34px, the height of `Button size="md"`. */
const SIZE: Record<IconButtonSize, string> = {
  sm: "h-7 w-7",
  md: "h-[34px] w-[34px]",
};

const TONE: Record<IconButtonTone, string> = {
  neutral: "text-ink-3 hover:bg-surface-2 hover:text-ink",
  danger: "text-ink-3 hover:bg-danger-bg hover:text-danger",
  accent: "text-accent hover:bg-accent-bg hover:text-accent-ink",
};

export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
    /** Translated accessible name. Required — the button has no text. */
    label: string;
    size?: IconButtonSize;
    tone?: IconButtonTone;
    /** Layout only (margins, alignment). Size and colour come from props. */
    className?: string;
    children: ReactNode;
  }
>(function IconButton(
  { label, size = "sm", tone = "neutral", className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cx(
        "grid shrink-0 place-items-center rounded transition-colors",
        "focus-ring",
        // Vertical only: `IngotRowActions` sets these 2 px apart, so a
        // sideways hit area would reach over the neighbour and Edit would
        // fire Delete.
        "touch-target-y",
        "disabled:cursor-not-allowed disabled:opacity-50",
        SIZE[size],
        TONE[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
