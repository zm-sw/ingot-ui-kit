import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Rytmus obsahu jedné stránky — mezera mezi bloky, šířka čtení a
 * volitelný postranní rejstřík.
 *
 * Vnější rám (1440 px, odsazení od okrajů) drží shell pod horní lištou;
 * tohle primitivum drží to, co si do dneška každá obrazovka skládala
 * sama: **svislý rytmus bloků** (hlavička → metriky → toolbar → tabulka)
 * a **tvar obsahu**. (Rozhodnutí vlastníka 2026-09-02, bod 05.)
 *
 * Tři tvary, podle toho, co obrazovka je:
 *
 * * ``full`` — plná šířka rámu. Seznamy a tabulky; sloupec ukousnutý
 *   z tabulky je sloupec, který v ní chybí.
 * * ``reading`` — omezená šířka pro obrazovky, které se čtou: dlouhá
 *   nastavení, právní texty, detail bez tabulek. Řádek přes celý
 *   monitor se nečte, ale přelétá.
 * * ``aside`` se sloupcem vlevo — obrazovka s vlastním rejstříkem
 *   (``IngotSideNav``): rejstřík stojí, obsah roluje.
 *
 * Mřížka karet ani dvousloupcový detail tvar nemají schválně: to je
 * vnitřek bloku (grid utility na místě), ne rám stránky.
 */
export function IngotPageLayout({
  width = "full",
  aside,
  children,
  testId,
}: {
  /** ``full`` tabulky a seznamy · ``reading`` obrazovky, které se čtou. */
  width?: "full" | "reading";
  /**
   * Postranní rejstřík vlevo — typicky ``IngotSideNav``. Sloupec je
   * ``sticky``, takže při rolování obsahu zůstává po ruce.
   */
  aside?: ReactNode;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const body = (
    <div
      className={cx(
        "min-w-0 flex-1 space-y-6",
        width === "reading" && "max-w-3xl",
      )}
    >
      {children}
    </div>
  );

  if (aside === undefined) {
    return (
      <div className="w-full" data-testid={testId}>
        {body}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-8" data-testid={testId}>
      <div className="sticky top-6 w-56 shrink-0">{aside}</div>
      {body}
    </div>
  );
}
