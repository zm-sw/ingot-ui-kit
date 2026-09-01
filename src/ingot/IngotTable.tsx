import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Tabulka — čtvrté primitivum Ingotu (KAN-585), rozšířené na v2 (KAN-654).
 *
 * Největší celkový výnos v celém programu (43 admin stránek si `<table>` píše
 * ručně) a zároveň **největší návrhová plocha a blast radius**: špatně
 * navrženou tabulku, na které visí 43 obrazovek, nelze levně vzít zpět.
 *
 * ## v1 → v2
 *
 * v1 byla ZÁMĚRNĚ minimální: sloupce · prázdný stav (`IngotEmptyState`) ·
 * řádkové akce · loading · sticky hlavička · stav řádku (KAN-590). Řazení,
 * bulk-select a stránkování čekaly na konkrétního žadatele — a KAN-654 je
 * dodal (inventura: bulk select ~6 stránek, ruční pager 10 stránek).
 *
 * v2 přidává, **zpětně kompatibilně** (žádný dnešní konzument se nemusí
 * měnit):
 *
 * - **Výběr řádků + bulkbar** (`selectedKeys` + `onSelectedKeysChange`).
 *   Řízený zvenku: tabulka stav výběru nedrží, protože bulk akce ho stejně
 *   potřebuje volající. Checkbox sloupec je první, řádek nese
 *   `aria-selected` a nad tabulkou se s neprázdným výběrem ukáže `bulkbar`
 *   (obsah dodá volající — jen on umí říct „3 vybrané" přeloženě).
 * - **Řazení** (`sort` + `onSortChange`, sloupec `sortable`). Taky řízené:
 *   tabulka data NEřadí — často se řadí na serveru a klientský fallback by
 *   tiše lhal o celku. Aktivní hlavička nese `aria-sort`.
 *   Handoff CSS vizuál stavu řazení nemá; šipka v hlavičce (↑/↓, klidové ↕)
 *   je doplněk specu — zapsáno i na doc stránce.
 * - **`density`** `default | compact` — compact stáhne padding buňky na 8px
 *   pro obrazovky, kde se počet řádků na obrazovku počítá.
 *
 * Stránkování v tabulce **není ani ve v2** — je to samostatné
 * `IngotPagination` a stav stránky drží volající, stejně jako výběr a
 * řazení. Jeden vlastník stavu = žádná přetahovaná.
 *
 * ## Co tabulka opravuje strukturálně, ne domluvou
 *
 * - **`colSpan` se počítá.** Ruční prázdné stavy v repu mají `colSpan={8}`
 *   natvrdo; přidání sloupce ten počet tiše rozejde a nikdo si toho
 *   nevšimne. Tady je to `columns.length + výběr + akce`.
 * - **`<th scope="col">` vždycky.** Ze 42 souborů s ručním `<thead>` má
 *   `scope` jen 12 — odečítač obrazovky ve zbytku neví, ke kterému sloupci
 *   buňka patří.
 * - **Řádkové akce se neschovávají za hover.** Primitivum na ně nedává
 *   `opacity-0 group-hover:…`; to je vzor, který je pro klávesnici past.
 *
 * Ingot **nemá vlastní i18n namespace** — `loadingLabel`, `actionsLabel`,
 * `selectAllLabel`, `selectRowLabel` i obsah prázdného stavu a bulkbaru
 * dodává volající už přeložené.
 */

export interface IngotColumn<Row> {
  /** Stabilní klíč sloupce (React key, ne popisek). */
  key: string;
  /** Záhlaví — už přeložené. */
  header: ReactNode;
  /**
   * Obsah buňky. `index` je pořadí v právě vykreslované stránce dat —
   * sloupec „pořadí" (`#1`, `#2`, …) ho jinak nemá odkud vzít a musel by si
   * ho hledat `indexOf`em přes celé pole.
   */
  cell: (row: Row, index: number) => ReactNode;
  /** `"end"` = číselný sloupec: doprava a `tabular-nums`. */
  align?: "start" | "end";
  /**
   * Třídy navíc na `<td>` tohoto sloupce.
   *
   * Není to průchozí díra pro libovolný styl, ale nutnost: `max-w-md`,
   * `whitespace-nowrap` nebo `mono` musí sedět na buňce, ne na obalu uvnitř
   * ní — jinak neomezí šířku sloupce. Doloženo na konverzích v tomhle PR
   * (AdminAuditLog, AdminQuality, UnmatchedInboundPanel).
   */
  cellClassName?: string;
  /**
   * Po sloupci se dá řadit — hlavička se stane tlačítkem. Vyžaduje `sort`
   * a `onSortChange` na tabulce; bez nich se `sortable` ignoruje, protože
   * tlačítko, které nic nedělá, je horší než žádné.
   */
  sortable?: boolean;
}

export interface IngotSort {
  /** `key` sloupce, podle kterého je seřazeno. */
  key: string;
  dir: "asc" | "desc";
}

export function IngotTable<Row>({
  columns,
  rows,
  rowKey,
  rowTestId,
  rowClassName,
  loading = false,
  loadingLabel,
  empty,
  actions,
  actionsLabel,
  caption,
  className,
  stickyHeader = false,
  density = "default",
  sort,
  onSortChange,
  selectedKeys,
  onSelectedKeysChange,
  selectAllLabel,
  selectRowLabel,
  bulkbar,
  testId,
}: {
  columns: readonly IngotColumn<Row>[];
  rows: readonly Row[];
  /** Stabilní identita řádku. */
  rowKey: (row: Row) => string;
  /** Volitelné `data-testid` řádku — E2E na některých stránkách na něm visí. */
  rowTestId?: (row: Row) => string;
  /**
   * Třídy navíc na `<tr>` — pro STAV řádku, ne pro jeho styl.
   *
   * Odlišení od `cellClassName`: to je vlastnost sloupce (šířka, zarovnání) a
   * je statické, kdežto tohle je vlastnost řádku a mění se s daty
   * (nevybratelný, zvýrazněný). Přes `cellClassName` by ztmavení řádku
   * nešlo — musela by ho nést každá buňka a hodnota by na sloupci nezávisela.
   */
  rowClassName?: (row: Row) => string | undefined;
  /** Čeká se na data; tabulka dostane `aria-busy` a jeden `role="status"` řádek. */
  loading?: boolean;
  /** Přeložené „Načítám…". Povinné, když `loading` může nastat. */
  loadingLabel?: string;
  /** Co ukázat místo řádků, když žádné nejsou — typicky `<IngotEmptyState>`. */
  empty?: ReactNode;
  /** Řádkové akce; přidá poslední sloupec. */
  actions?: (row: Row) => ReactNode;
  /** Přeložené záhlaví sloupce akcí — vykreslí se jen pro odečítač. */
  actionsLabel?: string;
  /** Popis tabulky pro odečítač; vykreslí se jako `<caption>` mimo obraz. */
  caption?: string;
  /** Průchozí třída tabulky (typicky `min-w-[40rem]`). */
  className?: string;
  /**
   * Hlavička zůstane vidět při rolování — jen když tabulku obaluje scrollbox
   * (`max-h-*` + `overflow-y-auto`); mimo něj `sticky` nic nedělá.
   */
  stickyHeader?: boolean;
  /**
   * `"compact"` stáhne padding buňky na 8px (spec `density`). Výchozí
   * hustota zůstává ta z v1, aby se konverze nemusely přepisovat.
   */
  density?: "default" | "compact";
  /**
   * Aktuální řazení. Tabulka data NEřadí — jen kreslí stav a hlásí kliknutí
   * přes `onSortChange`; pořadí určuje pole `rows` (server nebo volající).
   */
  sort?: IngotSort;
  /** Klik na řaditelnou hlavičku: neaktivní → asc, asc ↔ desc. */
  onSortChange?: (sort: IngotSort) => void;
  /**
   * Klíče vybraných řádků (`rowKey`). Spolu s `onSelectedKeysChange` zapne
   * checkbox sloupec; výběr drží volající, protože bulk akce je jeho.
   */
  selectedKeys?: ReadonlySet<string>;
  /** Nová množina po každé změně výběru (řádek i vybrat/zrušit vše). */
  onSelectedKeysChange?: (keys: ReadonlySet<string>) => void;
  /** Přeložený popisek checkboxu „vybrat vše" v hlavičce. */
  selectAllLabel?: string;
  /** Přeložený popisek checkboxu řádku („Vybrat {název}"). */
  selectRowLabel?: (row: Row) => string;
  /**
   * Obsah pruhu bulk akcí nad tabulkou; ukáže se jen s neprázdným výběrem.
   * Počet („3 vybrané") i tlačítka skládá volající — jen on to umí přeložit.
   */
  bulkbar?: ReactNode;
  testId?: string;
}): JSX.Element {
  const selectable = selectedKeys != null && onSelectedKeysChange != null;
  // Jediný zdroj pravdy pro šířku prázdného i loading řádku. Ruční
  // `colSpan={8}` je přesně to, co se při přidání sloupce rozejde.
  const span = columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const cellPad = density === "compact" ? "p-2" : "px-3 py-2";
  // Sloupec s checkboxem je úzký schválně — `w-0` + padding, ať nekrade
  // místo datovým sloupcům.
  const checkPad = density === "compact" ? "w-0 p-2" : "w-0 px-3 py-2";

  const allKeys = selectable ? rows.map((row) => rowKey(row)) : [];
  const allSelected =
    selectable && allKeys.length > 0 && allKeys.every((key) => selectedKeys.has(key));
  const someSelected =
    selectable && !allSelected && allKeys.some((key) => selectedKeys.has(key));

  function toggleRow(key: string): void {
    if (!selectable) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectedKeysChange(next);
  }

  function toggleAll(): void {
    if (!selectable) return;
    // „Vybrat vše" = všechny PRÁVĚ vykreslené řádky, ne celý dataset —
    // tabulka jiné řádky nezná a tichý výběr neviditelných záznamů je
    // přesně to překvapení, kvůli kterému bulk akce potřebují bulkbar.
    onSelectedKeysChange(allSelected ? new Set() : new Set(allKeys));
  }

  function headerSort(col: IngotColumn<Row>): void {
    if (!onSortChange) return;
    onSortChange({
      key: col.key,
      dir: sort?.key === col.key && sort.dir === "asc" ? "desc" : "asc",
    });
  }

  const table = (
    <table
      className={className ? `w-full text-left text-sm ${className}` : "w-full text-left text-sm"}
      aria-busy={loading || undefined}
      data-testid={testId}
    >
      {caption != null && <caption className="sr-only">{caption}</caption>}
      <thead
        className={
          stickyHeader
            ? // ``bg-surface-2`` není kosmetika: bez neprůhledného pozadí
              // prosvítají pod sticky hlavičkou rolující řádky.
              "sticky top-0 z-10 border-b border-border bg-surface-2 text-xs uppercase text-ink-3"
            : "border-b border-border text-xs uppercase text-ink-3"
        }
      >
        <tr>
          {selectable && (
            <th scope="col" className={checkPad}>
              <input
                type="checkbox"
                className="block accent-accent"
                checked={allSelected}
                // `indeterminate` nemá HTML atribut, jde nastavit jen na
                // elementu — proto ref, ne prop.
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                aria-label={selectAllLabel}
              />
            </th>
          )}
          {columns.map((col) => {
            const sortable = col.sortable && onSortChange != null;
            const dir = sortable && sort?.key === col.key ? sort.dir : undefined;
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={
                  dir != null ? (dir === "asc" ? "ascending" : "descending") : undefined
                }
                className={cx(
                  cellPad,
                  "font-medium",
                  col.align === "end" && "text-right",
                )}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => headerSort(col)}
                    className={cx(
                      "inline-flex items-center gap-1 uppercase hover:text-ink",
                      col.align === "end" && "flex-row-reverse",
                    )}
                  >
                    {col.header}
                    {/* Handoff CSS stav řazení nekreslí — šipka je doplněk
                        specu (KAN-654). Klidové ↕ říká „tady se dá řadit";
                        pro odečítač je stav v aria-sort, šipka je dekor. */}
                    <span aria-hidden="true" className={dir != null ? "" : "text-ink-4"}>
                      {dir != null ? (dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
          {actions && (
            <th scope="col" className={cx(cellPad, "text-right font-medium")}>
              {/* Sloupec akcí popisek vidět nepotřebuje, odečítač ano —
                  jinak je to bezejmenný sloupec. */}
              <span className="sr-only">{actionsLabel}</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={span} className="px-3 py-8 text-center text-sm text-ink-3">
              {/* Ne prázdné tělo se spinnerem: odečítač musí slyšet, že se
                  čeká, ne mlčení, které zní jako „nic tu není". */}
              <span role="status">{loadingLabel}</span>
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={span} className="p-0">
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => {
            const key = rowKey(row);
            const selected = selectable && selectedKeys.has(key);
            // Volá se JEDNOU za řádek: je to funkce volajícího a druhé
            // zavolání by si klidně mohlo odpovědět jinak.
            const extra = rowClassName?.(row);
            return (
              <tr
                key={key}
                className={cx("border-b border-border", selected && "bg-accent-bg", extra)}
                aria-selected={selectable ? selected : undefined}
                data-testid={rowTestId?.(row)}
              >
                {selectable && (
                  <td className={checkPad}>
                    <input
                      type="checkbox"
                      className="block accent-accent"
                      checked={selected}
                      onChange={() => toggleRow(key)}
                      aria-label={selectRowLabel?.(row)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      cellPad,
                      col.align === "end" && "text-right tabular-nums",
                      col.cellClassName,
                    )}
                  >
                    {col.cell(row, index)}
                  </td>
                ))}
                {actions && (
                  <td className={cx(cellPad, "text-right")}>{actions(row)}</td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  if (!selectable) return table;

  // Obal jen s výběrem: bez něj zůstává kořenem `<table>` jako ve v1,
  // takže se konzumentům nemění DOM, na kterém jim visí styly a testy.
  return (
    <div>
      {selectedKeys.size > 0 && bulkbar != null && (
        <div
          role="status"
          className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-accent-border bg-accent-bg px-3 py-2 text-sm text-ink"
        >
          {bulkbar}
        </div>
      )}
      {table}
    </div>
  );
}
