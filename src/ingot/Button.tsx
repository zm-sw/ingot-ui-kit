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
  /** Čtvercové tlačítko jen s ikonou. Vyžaduje ``aria-label``. */
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/**
 * 🪤 **``as="a"`` je odkaz, ne tlačítko, které vypadá jako odkaz.**
 * Vykreslí se ``<a href>``, takže odečítač ho hlásí jako odkaz, dá se
 * otevřít v novém panelu a funguje bez JavaScriptu. Tlačítko, které
 * naviguje, o všech třech věcech lže.
 *
 * Proto ``href`` POVINNÝ: ``<a>`` bez něj není odkaz — do pořadí
 * tabulátoru se nedostane a Enter na něm nic nedělá.
 *
 * ``loading`` a ``disabled`` tahle větev NEMÁ, a to schválně. Odkaz se
 * nedá zakázat ani označit za rozpracovaný; kdo potřebuje obojí,
 * potřebuje tlačítko. Typ to říká dřív, než se to zkusí.
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
  //: Vedlejší akce na OBRÁCENÉ ploše (tmavý blok CTA, patička). Kreslí
  //: se ``--bg``, tedy barvou stránky, protože plocha pod ní je
  //: ``--ink`` — v tmavém motivu se obrátí spolu s ní a žádnou vlastní
  //: barvu nezavádí. Na běžné ploše je neviditelná, a to je záměr: je
  //: to varianta pro obrácený blok, ne světlejší ``ghost``.
  inverse:
    "bg-transparent text-bg border border-bg/40 hover:bg-bg/10 disabled:text-bg/50",
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

  //: Vzhled je JEDEN výpočet pro obě větve. Kdyby si ho každá počítala
  //: po svém, byl by odkaz „skoro jako" tlačítko a rozdíl by se objevil
  //: až na obrazovce, kde stojí vedle sebe.
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
      {label(loading)}
    </button>
  );
});
