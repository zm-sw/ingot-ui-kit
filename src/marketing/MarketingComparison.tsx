import type { JSX } from "react";

import { IngotIcon, type IngotIconName } from "@/ingot";

/**
 * Srovnání (KAN-664) — trojsloupcová mřížka z handoffu Veřejné stránky:
 * Úkol / Dnes / S Forgmaticem, třetí sloupec zvýrazněný. Buňky nesou
 * ikonu vedle textu.
 *
 * Zvýraznění (``featured``) je jediný akcentový prvek sekce — rámeček
 * a tint akcentové rodiny. Zvýrazněný smí být nejvýš jeden sloupec;
 * dva zvýrazněné sloupce už nic nesrovnávají.
 */
export interface MarketingComparisonCell {
  icon?: IngotIconName;
  text: string;
}

export interface MarketingComparisonColumn {
  title: string;
  cells: readonly MarketingComparisonCell[];
  /** Zvýrazněný sloupec — akcentový rámeček. Nejvýš jeden. */
  featured?: boolean;
}

export function MarketingComparison({
  columns,
  testId,
}: {
  columns: readonly MarketingComparisonColumn[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid gap-6 min-[1100px]:grid-cols-3"
      data-testid={testId}
    >
      {columns.map((column) => (
        <div
          key={column.title}
          className={
            column.featured
              ? "rounded-lg border border-accent-border bg-accent-bg p-6"
              : "rounded-lg border border-border bg-surface p-6"
          }
        >
          <h3
            className={
              column.featured
                ? "text-[15px] font-semibold text-accent-ink"
                : "text-[15px] font-semibold text-ink"
            }
          >
            {column.title}
          </h3>
          <ul className="mt-4 list-none space-y-3 p-0">
            {column.cells.map((cell) => (
              <li
                key={cell.text}
                className={
                  column.featured
                    ? "flex items-start gap-2.5 text-[13px] leading-relaxed text-accent-ink"
                    : "flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-2"
                }
              >
                {cell.icon !== undefined && (
                  <span className="mt-0.5 shrink-0">
                    <IngotIcon name={cell.icon} size={14} />
                  </span>
                )}
                {cell.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
