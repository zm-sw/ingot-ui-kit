import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Filtr bar nad seznamem (KAN-654) — shell pattern `.toolbar` + `.search`.
 *
 * Samostatné primitivum, ne slot `IngotTable`: inventura našla ~19 stránek
 * s ručním filter barem a 3 rivalské `*FilterBar.tsx`, a tabulka není jediný
 * konzument — filtr bar mívá i mřížka karet nebo seznam. Slot tabulky by ho
 * pro ně nechal znovu vynalézt.
 *
 * Závazné pořadí bloků list obrazovky: **toolbar → (bulk bar) → tabulka →
 * pager** (bulk bar kreslí `IngotTable`, pager je `IngotPagination`).
 *
 * Schválně jen rozvržení: vyhledávací pole, selecty i tlačítka dodává
 * volající jako `children` — primitivum drží mezery, zalamování a pravý
 * konec (`end`), ne to, čím se filtruje. Žádné `role="toolbar"`: ta role
 * slibuje šipkovou navigaci, kterou by pak musel někdo doopravdy napsat,
 * a filtr bar je obyčejná skupina formulářových prvků.
 */
export function IngotToolbar({
  children,
  end,
  className,
  testId,
}: {
  /** Filtry zleva: vyhledávání, selecty, přepínače — už přeložené. */
  children: ReactNode;
  /** Pravý konec baru — typicky primární akce („Přidat"). */
  end?: ReactNode;
  /** Průchozí třída obalu (výjimečně — mezery drží primitivum). */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className={cx("mb-3 flex flex-wrap items-center gap-2", className)}
      data-testid={testId}
    >
      {children}
      {/* `ml-auto` až na obalu konce: kdyby ho nesl poslední filtr, přidání
          dalšího filtru by pravý konec „ukradlo". */}
      {end != null && <div className="ml-auto flex items-center gap-2">{end}</div>}
    </div>
  );
}
