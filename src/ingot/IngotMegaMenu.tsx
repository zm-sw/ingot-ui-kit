import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Rozbalené menu sekce z horní lišty — tři sloupce odkazů a náhled.
 *
 * Tvar je pevný schválně: **tři sloupce plus náhled**. Sekce, která se
 * do tří sloupců nevejde, není sekce, ale dvě — a menu, které roste
 * s aplikací, je za rok seznam všeho, co kdy vzniklo.
 *
 * 🪤 **Náhled popisuje PRVNÍ položku sekce, ne poslední, na které byla
 * myš.** Náhled, který se mění pod kurzorem, je ve chvíli, kdy čtenář
 * dojede k pravému okraji, náhodný — a hlavně nefunguje pro toho, kdo
 * menu ovládá klávesnicí a myš nemá vůbec.
 *
 * Otevřená sekce se v liště značí ``--surface-3``, ne akcentem: akcent
 * v téhle aplikaci znamená akci, a rozbalené menu žádná akce není.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */

export interface IngotMegaMenuItem {
  href: string;
  label: string;
  /** Ikona před popiskem. Dekorativní — popisek nese význam. */
  icon?: ReactNode;
  /** Počet záznamů vpravo. Mono, protože je to číslo k porovnání. */
  count?: number;
  /** Právě otevřená položka. */
  current?: boolean;
}

export interface IngotMegaMenuColumn {
  /** Nadpis sloupce — mono verzálky. */
  title: string;
  items: readonly IngotMegaMenuItem[];
}

export function IngotMegaMenu({
  columns,
  preview,
  label,
  testId,
}: {
  /** Sloupce odkazů. Tři je cíl; víc se do mřížky nevejde. */
  columns: readonly IngotMegaMenuColumn[];
  /** Náhledový sloupec vpravo — popisuje první položku sekce. */
  preview?: ReactNode;
  /** Přeložený ``aria-label`` menu. */
  label: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="absolute left-4 top-[calc(100%+6px)] z-[60] flex overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
      data-testid={testId}
    >
      <nav aria-label={label} className="flex">
        {columns.map((column) => (
          <div
            key={column.title}
            className="flex min-w-[180px] flex-col gap-1.5 border-r border-border px-[22px] py-5"
          >
            <p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
              {column.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {column.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cx(
                      "flex items-center gap-2.5 rounded px-2 py-1.5 text-sm",
                      item.current
                        ? "bg-surface-3 font-medium text-ink"
                        : "text-ink hover:bg-surface-2 hover:text-accent-ink",
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {item.count !== undefined && (
                      <span className="ml-auto font-mono text-[11px] text-ink-4">
                        {item.count}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {preview !== undefined && (
        <div className="w-[300px] bg-surface-2 px-[22px] py-5">{preview}</div>
      )}
    </div>
  );
}
