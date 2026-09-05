import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

import { cx } from "./cx";

type ButtonVariant =
  | "primary"
  | "accent"
  | "ok"
  | "secondary"
  | "ghost"
  | "danger"
  | "inverse";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** A square button with only an icon. Requires ``aria-label``. */
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/**
 * **``as="a"`` is a link, not a button that looks like a link.** It
 * renders ``<a href>``, so a screen reader announces it as a link, it can
 * be opened in a new tab and it works without JavaScript. A button that
 * navigates lies about all three.
 *
 * Hence ``href`` is REQUIRED: an ``<a>`` without it is not a link — it
 * does not enter the tab order and Enter does nothing on it.
 *
 * This branch has NO ``loading`` and ``disabled``, on purpose. A link
 * cannot be disabled or marked as in progress; whoever needs both needs a
 * button. The type says so before it is tried.
 */
type ButtonAsLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    as: "a";
    href: string;
  };

type ButtonAsButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    loading?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-bg hover:bg-ink-2 disabled:bg-ink-4 disabled:text-bg/70",
  // ``dark:text-bg`` on accent/danger: the dark palette brightens
  // ``--accent``/``--danger`` so they stay readable AS TEXT on dark
  // surfaces, which pushes white-on-token below WCAG AA 4.5:1 (no
  // single luminance can serve both roles). Inverting to page-bg ink
  // on the bright token clears AA in dark while light keeps white.
  accent:
    "bg-accent text-white dark:text-bg hover:bg-accent-ink disabled:bg-ink-4 disabled:text-white/70 dark:disabled:text-bg/70",
  // ``ok`` — the positive/confirm counterpart to ``danger`` (approve,
  // promote). Same dual-role dark handling: ``--ok`` brightens under
  // ``.dark`` to read as text, so white-on-token drops below AA there —
  // invert to page-bg ink in dark, keep white in light.
  ok:
    "bg-ok text-white dark:text-bg hover:bg-ok/90 disabled:bg-ink-4 disabled:text-white/70 dark:disabled:text-bg/70",
  secondary:
    "bg-surface text-ink border border-border-strong hover:bg-surface-2 disabled:text-ink-4",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 disabled:text-ink-4",
  danger:
    "bg-danger text-white dark:text-bg hover:bg-danger/90 disabled:bg-ink-4 disabled:text-white/70 dark:disabled:text-bg/70",
  // Secondary action on an INVERTED surface (a dark CTA block, a footer).
  // Drawn with ``--bg``, the page colour, because the surface under it is
  // ``--ink`` — in dark mode it inverts along with it and introduces no
  // colour of its own. On an ordinary surface it is invisible, and that is
  // intent: a variant for the inverted block, not a lighter ``ghost``.
  inverse:
    "bg-transparent text-bg border border-bg/40 hover:bg-bg/10 disabled:text-bg/50",
};

// Heights 28 / 34 / 42 px from the Ingot v0.1 handoff (``.btn-icon`` 34×34,
// ``.btn-icon.btn-sm`` 28×28, ``.btn-lg`` padding 12px on 14.5px text).
// The Tailwind spacing scale carries only 28 (``h-7``); the other two are
// arbitrary values — adding two entries to ``theme.spacing`` for them would
// mean two extra names for values used by a single file.
const SIZE: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-xs",
  md: "h-[34px] px-4 text-sm",
  lg: "h-[42px] px-5 text-[15px]",
};

// The icon-only variant is square: width = height, no horizontal padding.
const SIZE_ICON_ONLY: Record<ButtonSize, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-[34px] w-[34px] text-sm",
  lg: "h-[42px] w-[42px] text-[15px]",
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "secondary",
    size = "md",
    iconOnly = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
  } = props;

  if (
    import.meta.env.DEV &&
    iconOnly &&
    !props["aria-label"] &&
    !props["aria-labelledby"]
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[ingot] <Button iconOnly> without aria-label/aria-labelledby: " +
        'a screen reader announces just "button".',
    );
  }

  // The look is ONE computation for both branches. If each computed it
  // itself, the link would be "almost like" the button and the difference
  // would surface on the screen where they stand side by side.
  const classes = cx(
    "relative inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed",
    VARIANT[variant],
    iconOnly ? SIZE_ICON_ONLY[size] : SIZE[size],
    className,
  );

  function label(loading: boolean): ReactNode {
    return (
      <span
        className={cx(
          "inline-flex items-center justify-center gap-2",
          loading && "invisible",
        )}
      >
        {leadingIcon}
        <span>{children}</span>
        {trailingIcon}
      </span>
    );
  }

  if (props.as === "a") {
    const {
      as: _as,
      variant: _variant,
      size: _size,
      iconOnly: _iconOnly,
      leadingIcon: _leadingIcon,
      trailingIcon: _trailingIcon,
      className: _className,
      children: _children,
      ...rest
    } = props;
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} className={classes} {...rest}>
        {label(false)}
      </a>
    );
  }

  const {
    as: _as,
    variant: _variant,
    size: _size,
    iconOnly: _iconOnly,
    leadingIcon: _leadingIcon,
    trailingIcon: _trailingIcon,
    className: _className,
    children: _children,
    loading = false,
    disabled,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {/* The spinner lies OVER the content; the content stays in flow and
          only turns transparent. If the spinner replaced it, the button
          would shrink to the spinner's width mid-action and reflow the row
          beneath — hence the width lock from the handoff (Button v1.4). */}
      {loading && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
        </span>
      )}
      {label(loading)}
    </button>
  );
});
