import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";

import { cx } from "./cx";

// ``elevated`` (``shadow-lg``) used to be here and had not a single
// consumer — the spec does not know it and a shadow of that size belongs
// under a modal, not a card. ``flat`` and ``raised`` have consumers, so
// they stay as a documented deviation from a spec that does not address
// surface elevation at all.
type CardElevation = "flat" | "raised";
type CardTone = "default" | "dark";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padded?: boolean;
  /** Lifts the card on hover. Only for clickable tiles. */
  hover?: boolean;
  /** ``dark`` is the inverted surface for a platform message — at most one per screen. */
  tone?: CardTone;
}

// Surface colour and shadow are deliberately TWO separate fields, not one
// string per variant. If ``tone="dark"`` sent ``bg-ink`` next to the
// elevation's ``bg-surface``, the outcome would be decided by the order in
// the generated CSS, not the order in ``cx()`` — both utilities have the
// same specificity.
const SURFACE = "border border-border bg-surface";

// Light: an inverted surface (``--ink`` under the page colour). Dark:
// cannot invert again — the page surface is already dark in the dark
// theme, so the card LIFTS to ``--surface-2`` instead, exactly as the
// handoff does (``[data-theme="dark"] .card-dark``). This override belongs
// here, not in the palette: an ordinary ``.card`` on ``--surface`` stays
// the same in both themes.
const SURFACE_DARK =
  "border border-ink bg-ink text-bg dark:border-border-strong dark:bg-surface-2 dark:text-ink";

// The tone is inherited by ``CardTitle``. Without it a title in a dark card
// would stay on ``--ink`` — near-black text on a near-black surface in the
// light theme. A context, not an ``[&_h3]`` variant: that would silently
// miss every heading ``CardTitle`` wraps.
const CardToneContext = createContext<CardTone>("default");

const SHADOW: Record<CardElevation, string> = {
  flat: "",
  raised: "shadow-sm",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    elevation = "flat",
    padded = true,
    hover = false,
    tone = "default",
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <CardToneContext.Provider value={tone}>
      <div
        ref={ref}
        className={cx(
          "rounded-md",
          tone === "dark" ? SURFACE_DARK : SURFACE,
          SHADOW[elevation],
          // A 3px lift + a larger shadow, as the handoff has it
          // (``.card-hover``). ``motion-reduce`` turns it off — movement on
          // hover is exactly what that preference asks to avoid.
          hover &&
            "cursor-pointer transition-[transform,box-shadow] hover:-translate-y-[3px] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          padded && "p-5",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </CardToneContext.Provider>
  );
});

export function CardHeader({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={cx("mb-3", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  const tone = useContext(CardToneContext);
  return (
    <h3
      className={cx(
        "text-base font-semibold tracking-snug",
        tone === "dark" ? "text-bg dark:text-ink" : "text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </h3>
  );
}
