import { type JSX, type ReactNode } from "react";

import { Button } from "./Button";
import { cx } from "./cx";

/**
 * Stránkování pod tabulkou (KAN-654).
 *
 * Deset stránek si pager psalo ručně (např. audit log) a primitivum
 * neexistovalo — v1 tabulky ho schválně odkládala, dokud nebude jasné, kdo
 * drží stav. Odpověď: **volající**. Pager je proto řízený (`page` +
 * `onPageChange`) a s tabulkou se o stav nepře — stejně jako `sort` a
 * `selectedKeys` na `IngotTable`.
 *
 * Tvar je zámerně prev/next + stav, ne číslované stránky: ruční pagery
 * v repu jsou všechny prev/next a číslovaná lišta by byla schopnost bez
 * konzumenta. Přibude, až si o ni řekne konkrétní obrazovka.
 *
 * Ingot nemá vlastní i18n namespace — `prevLabel`, `nextLabel`, `label`
 * i složený `status` („Strana 2 z 8") dodává volající už přeložené.
 */
export function IngotPagination({
  page,
  pageCount,
  onPageChange,
  prevLabel,
  nextLabel,
  status,
  label,
  className,
  testId,
}: {
  /** Aktuální stránka, číslovaná od 1. */
  page: number;
  /** Celkový počet stránek. */
  pageCount: number;
  /** Volá se s novým číslem stránky; mimo rozsah se nevolá vůbec. */
  onPageChange: (page: number) => void;
  /** Přeložené „Předchozí". */
  prevLabel: string;
  /** Přeložené „Další". */
  nextLabel: string;
  /** Už složený stav („Strana 2 z 8") — interpolaci umí jen volající. */
  status?: ReactNode;
  /** Přeložený popisek `<nav>` pro odečítač („Stránkování"). */
  label?: string;
  className?: string;
  testId?: string;
}): JSX.Element {
  // `<nav>`, ne `<div>`: odečítač dostane orientační bod a s `label`
  // rozliší dva pagery na jedné obrazovce.
  return (
    <nav
      aria-label={label}
      className={cx("mt-3 flex items-center gap-3", className)}
      data-testid={testId}
    >
      <Button
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {prevLabel}
      </Button>
      {status != null && (
        // `aria-live` schválně chybí: stav se mění jen po kliknutí
        // uživatele a fokus zůstává na tlačítku — hlášení navíc by rušilo.
        <span className="text-sm tabular-nums text-ink-3">{status}</span>
      )}
      <Button
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
