import type { JSX } from "react";

import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * Srovnání (KAN-664) — ŘÁDKOVÁ tabulka z handoffu Veřejné stránky:
 * hlavička Úkol / Dnes / S platformou na ``--surface-2``, pak jeden
 * řádek na jeden úkol.
 *
 * 🪤 **Párování je vlastnost ŘÁDKU, ne sloupce.** Tři samostatné karty
 * vedle sebe vypadají skoro stejně, jenže čtenář v nich musí spárovat
 * n-tou odrážku s n-tou odrážkou vedle — a jakmile se jeden sloupec
 * o položku posune, srovnání tiše lže. Proto komponenta bere řádky
 * (``rows``), ne sloupce: dvojici „dnes / s platformou" k jednomu úkolu
 * nejde napsat rozpojenou.
 *
 * Třetí sloupec je zvýrazněný (``--accent-bg`` / ``--accent-ink``) a je
 * jediným akcentovým prvkem sekce. Na úzkém viewportu se tabulka roluje
 * vodorovně — mřížka se nesmí složit, protože složená přestane srovnávat.
 */
export interface IngotMarketingComparisonCell {
  icon?: IngotIconName;
  text: string;
}

export interface IngotMarketingComparisonRow {
  /** Stabilní klíč řádku z dat (ne index — řádky se přeskládávají). */
  id: string;
  /** Úkol, který se srovnává — první sloupec. */
  task: string;
  /** Jak to vypadá dnes. */
  before: IngotMarketingComparisonCell;
  /** Jak to vypadá s platformou — zvýrazněný sloupec. */
  after: IngotMarketingComparisonCell;
}

export interface IngotMarketingComparisonHeaders {
  task: string;
  before: string;
  after: string;
}

function Cell({
  cell,
  highlighted,
}: {
  cell: IngotMarketingComparisonCell;
  highlighted?: boolean;
}): JSX.Element {
  return (
    <div
      className={
        highlighted
          ? "flex items-center gap-2 border-l border-border bg-accent-bg px-[18px] py-[15px] text-[13.5px] text-ink-2"
          : "flex items-center gap-2 border-l border-border px-[18px] py-[15px] text-[13.5px] text-ink-3"
      }
    >
      {cell.icon !== undefined && (
        <span className="shrink-0">
          <IngotIcon name={cell.icon} size={14} />
        </span>
      )}
      {cell.text}
    </div>
  );
}

export function IngotMarketingComparison({
  headers,
  rows,
  testId,
}: {
  /** Záhlaví tří sloupců — obsah, dodaný přeložený. */
  headers: IngotMarketingComparisonHeaders;
  rows: readonly IngotMarketingComparisonRow[];
  testId?: string;
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {/* Vodorovný scroll, ne zlom do sloupce: řádek, který se rozpadne,
          přestane být srovnáním. */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]" data-testid={testId}>
          <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border bg-surface-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
            <div className="px-[18px] py-[11px]">{headers.task}</div>
            <div className="border-l border-border px-[18px] py-[11px]">
              {headers.before}
            </div>
            <div className="border-l border-border bg-accent-bg px-[18px] py-[11px] font-semibold text-accent-ink">
              {headers.after}
            </div>
          </div>
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={
                index < rows.length - 1
                  ? "grid grid-cols-[1.1fr_1fr_1fr] border-b border-border"
                  : "grid grid-cols-[1.1fr_1fr_1fr]"
              }
              data-testid={testId ? `${testId}-row-${row.id}` : undefined}
            >
              <div className="px-[18px] py-[15px] text-sm font-medium text-ink">
                {row.task}
              </div>
              <Cell cell={row.before} />
              <Cell cell={row.after} highlighted />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
