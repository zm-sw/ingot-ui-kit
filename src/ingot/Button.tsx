import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";

type ButtonVariant =
  | "primary"
  | "accent"
  | "ok"
  | "secondary"
  | "ghost"
  | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Čtvercové tlačítko jen s ikonou. Vyžaduje ``aria-label``. */
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

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
};

// Výšky 28 / 34 / 42 px z Ingot handoffu v0.1 (``.btn-icon`` 34×34,
// ``.btn-icon.btn-sm`` 28×28, ``.btn-lg`` padding 12px na 14.5px textu).
// Tailwind spacing škála nese jen 28 (``h-7``), zbylé dvě jsou proto
// arbitrary — přidávat kvůli nim dvě položky do ``theme.spacing`` by
// znamenalo dvě jména navíc pro hodnoty, které používá jediný soubor.
const SIZE: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-xs",
  md: "h-[34px] px-4 text-sm",
  lg: "h-[42px] px-5 text-[15px]",
};

//: Ikonová varianta je čtvercová: šířka = výška, žádné vodorovné odsazení.
const SIZE_ICON_ONLY: Record<ButtonSize, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-[34px] w-[34px] text-sm",
  lg: "h-[42px] w-[42px] text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading = false,
    iconOnly = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  if (
    import.meta.env.DEV &&
    iconOnly &&
    !rest["aria-label"] &&
    !rest["aria-labelledby"]
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[ingot] <Button iconOnly> without aria-label/aria-labelledby: " +
        'a screen reader announces just "button".',
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "relative inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed",
        VARIANT[variant],
        iconOnly ? SIZE_ICON_ONLY[size] : SIZE[size],
        className,
      )}
      {...rest}
    >
      {/* Spinner leží PŘES obsah, obsah zůstává ve flow a jen zprůhlední.
          Kdyby ho spinner nahradil, tlačítko by se v půlce akce zúžilo na
          šířku spinneru a přeskládalo řádek pod sebou — proto ten zámek
          šířky z handoffu (Button v1.4). */}
      {loading && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
        </span>
      )}
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
    </button>
  );
});
