import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";

import { cx } from "./cx";

//: ``elevated`` (``shadow-lg``) tu bylo do KAN-653 a nemělo v repu jediného
//: konzumenta — spec ho nezná a stín té velikosti patří pod modál, ne pod
//: kartu. ``flat`` a ``raised`` konzumenty mají, takže zůstávají jako
//: zdokumentovaná odchylka od specu, který výšku plochy neřeší vůbec.
type CardElevation = "flat" | "raised";
type CardTone = "default" | "dark";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padded?: boolean;
  /** Zvedne kartu při najetí. Jen pro klikatelné dlaždice. */
  hover?: boolean;
  /** ``dark`` je obrácená plocha pro sdělení platformy — max. jedna na obrazovku. */
  tone?: CardTone;
}

//: Barva plochy a stín jsou schválně DVĚ různá pole, ne jeden řetězec na
//: variantu. Kdyby ``tone="dark"`` posílal ``bg-ink`` vedle ``bg-surface``
//: z elevace, rozhodovalo by o výsledku pořadí ve vygenerovaném CSS, ne
//: pořadí v ``cx()`` — obě utility mají tutéž specificitu.
const SURFACE = "border border-border bg-surface";

//: Světlá: obrácená plocha (``--ink`` pod barvou stránky). Tmavá: obrátit
//: se nedá znovu — v tmavém motivu už je plocha stránky tmavá, takže se
//: karta místo toho ZVEDNE na ``--surface-2``, přesně jak to dělá handoff
//: (``[data-theme="dark"] .card-dark``). Tenhle override patří sem, ne do
//: palety: běžná ``.card`` na ``--surface`` zůstává v obou motivech.
const SURFACE_DARK =
  "border border-ink bg-ink text-bg dark:border-border-strong dark:bg-surface-2 dark:text-ink";

//: Tón se dědí do ``CardTitle``. Bez toho by nadpis v tmavé kartě zůstal
//: na ``--ink`` — tedy near-black text na near-black ploše ve světlém
//: motivu. Kontext, ne ``[&_h3]`` varianta: ta by mlčky minula každý
//: nadpis, který si ``CardTitle`` obalí.
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
          // Zvednutí o 3px + větší stín, jak to má handoff (``.card-hover``).
          // ``motion-reduce`` ho vypíná — pohyb na najetí je přesně to, co si
          // ta předvolba vymiňuje.
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
