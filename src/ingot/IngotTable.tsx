import { type JSX, type ReactNode } from "react";

/**
 * Tabulka — čtvrté primitivum Ingotu (KAN-585).
 *
 * Největší celkový výnos v celém programu (43 admin stránek si `<table>` píše
 * ručně) a zároveň **největší návrhová plocha a blast radius**: špatně
 * navrženou tabulku, na které visí 43 obrazovek, nelze levně vzít zpět.
 *
 * ## Proto ZÁMĚRNĚ minimální v1
 *
 * **Umí:** sloupce · prázdný stav (`IngotEmptyState`) · řádkové akce ·
 * loading stav · sticky hlavička · stav řádku (KAN-590).
 *
 * **Neumí a čeká na konkrétního žadatele:** řazení · bulk-select toolbar ·
 * virtualizace · inline edit · stránkování. Každá další schopnost přibude, až
 * si o ni řekne konkrétní obrazovka — primitivum bez konzumenta je nezapojený
 * slib.
 *
 * `stickyHeader` a `rowClassName` přibyly v KAN-590 přesně takhle: první
 * Aplikace (`apps/nesting`) staví výběrovou tabulku ve `max-h-96` scrollboxu,
 * kde by bez sticky hlavičky odjely popisky sloupců pryč, a její nevybratelné
 * řádky se ztmavují celé, ne po buňkách. Bez těch dvou by konverze na
 * primitivum byla UX regrese — a regrese je důvod tabulku NEpoužít.
 *
 * Stránkování schválně **není** samostatné primitivum: ručních výskytů je jen
 * deset a stránkování navržené odděleně od tabulky se s ní pak pere o to, kdo
 * drží stav. Rozhodne se spolu s tabulkou, až bude žadatel.
 *
 * ## Co tabulka opravuje strukturálně, ne domluvou
 *
 * - **`colSpan` se počítá.** Ruční prázdné stavy v repu mají `colSpan={8}`
 *   natvrdo; přidání sloupce ten počet tiše rozejde a nikdo si toho
 *   nevšimne. Tady je to `columns.length + (actions ? 1 : 0)`.
 * - **`<th scope="col">` vždycky.** Ze 42 souborů s ručním `<thead>` má
 *   `scope` jen 12 — odečítač obrazovky ve zbytku neví, ke kterému sloupci
 *   buňka patří.
 * - **Řádkové akce se neschovávají za hover.** Primitivum na ně nedává
 *   `opacity-0 group-hover:…`; to je vzor, který je pro klávesnici past.
 *
 * Ingot **nemá vlastní i18n namespace** — `loadingLabel`, `actionsLabel`
 * i obsah prázdného stavu dodává volající už přeložené.
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
  testId?: string;
}): JSX.Element {
  // Jediný zdroj pravdy pro šířku prázdného i loading řádku. Ruční
  // `colSpan={8}` je přesně to, co se při přidání sloupce rozejde.
  const span = columns.length + (actions ? 1 : 0);

  return (
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
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={
                col.align === "end"
                  ? "px-3 py-2 text-right font-medium"
                  : "px-3 py-2 font-medium"
              }
            >
              {col.header}
            </th>
          ))}
          {actions && (
            <th scope="col" className="px-3 py-2 text-right font-medium">
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
            // Volá se JEDNOU za řádek: je to funkce volajícího a druhé
            // zavolání by si klidně mohlo odpovědět jinak.
            const extra = rowClassName?.(row);
            return (
              <tr
                key={rowKey(row)}
                className={
                  extra
                    ? `border-b border-border ${extra}`
                    : "border-b border-border"
                }
                data-testid={rowTestId?.(row)}
              >
                {columns.map((col) => {
                  const base =
                    col.align === "end"
                      ? "px-3 py-2 text-right tabular-nums"
                      : "px-3 py-2";
                  return (
                    <td
                      key={col.key}
                      className={
                        col.cellClassName
                          ? `${base} ${col.cellClassName}`
                          : base
                      }
                    >
                      {col.cell(row, index)}
                    </td>
                  );
                })}
                {actions && (
                  <td className="px-3 py-2 text-right">{actions(row)}</td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
