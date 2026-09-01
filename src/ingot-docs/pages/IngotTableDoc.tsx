import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotTableDemo";
import demoSource from "@/ingot-docs/demos/IngotTableDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotTableDoc: IngotDocPage = {
  name: "IngotTable",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Tabulka se sloupci jako daty. Drží scope na záhlaví, jeden zdroj pravdy pro colSpan a řádkové akce neschovává za hover.",
    en: "A table whose columns are data. It keeps scope on the headers, one source of truth for colSpan, and never hides row actions behind hover.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka vypisuje seznam záznamů se stejnou sadou sloupců — zdaleka
        nejčastější tvar admin obrazovky.
      </>,
      <>
        Sloupce vznikají za běhu — přidávají se podle oprávnění, plánu nebo
        nastavení tenanta. Jako data se filtrují jedním <IngotCode>filter</IngotCode>,
        jako JSX by to byla podmínka v hlavičce <em>a</em> v každém řádku.
      </>,
      <>
        Řádek má akce (upravit, smazat). Tabulka jim přidá poslední sloupec
        a nechá je viditelné, místo aby je schovala za hover.
      </>,
    ],
    en: [
      <>
        The screen lists records that share one set of columns — by far the
        most common shape of an admin screen.
      </>,
      <>
        The columns are decided at runtime — by permission, plan or tenant
        settings. As data they are filtered by a single <IngotCode>filter</IngotCode>;
        as JSX it would be a condition in the header <em>and</em> in every
        row.
      </>,
      <>
        Rows carry actions (edit, delete). The table gives them a trailing
        column and leaves them visible instead of hiding them behind hover.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Data nejsou mřížka. Dvojice „popisek — hodnota“ u jednoho záznamu je
        definiční seznam, ne tabulka; odečítač by ohlašoval souřadnice, které
        nikam nevedou.
      </>,
      <>
        Rozvržení je mřížka jen vizuálně (dlaždice, karty vedle sebe). Na to
        je CSS grid — <IngotCode>&lt;table&gt;</IngotCode> tomu dává význam, který nemá.
      </>,
      <>
        Potřebuješ něco z výčtu „co první verze neumí“ níž a nemůžeš na to
        počkat. Konverze, která by byla UX regrese, je důvod tabulku
        nepoužít — ne důvod si ji obejít.
      </>,
    ],
    en: [
      <>
        The data is not a grid. Label–value pairs for a single record are a
        description list, not a table; a screen reader would announce
        coordinates that lead nowhere.
      </>,
      <>
        The layout is a grid only visually (tiles, cards side by side). That
        is CSS grid — a <IngotCode>&lt;table&gt;</IngotCode> gives it meaning it does
        not have.
      </>,
      <>
        You need something from "what the first version cannot do" below and
        cannot wait for it. A conversion that would be a UX regression is a
        reason not to use the table — not a reason to work around it.
      </>,
    ],
  },
  props: [
    {
      name: "columns",
      type: "readonly IngotColumn<Row>[]",
      required: true,
      note: {
        cs: "Sloupce jako data — přidání sloupce nerozejde colSpan. Vlastnosti sloupce viz tabulka níž.",
        en: "Columns as data — adding one cannot break colSpan. Column properties are in the table below.",
      },
    },
    {
      name: "rows",
      type: "readonly Row[]",
      required: true,
      note: {
        cs: "Právě vykreslovaná stránka dat.",
        en: "The page of data currently being rendered.",
      },
    },
    {
      name: "rowKey",
      type: "(row: Row) => string",
      required: true,
      note: { cs: "Stabilní identita řádku.", en: "Stable row identity." },
    },
    {
      name: "empty",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Co ukázat místo řádků — typicky IngotEmptyState.",
        en: "What to show instead of rows — typically IngotEmptyState.",
      },
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      note: {
        cs: "Tabulka dostane aria-busy a jeden role=status řádek.",
        en: "The table gets aria-busy and a single role=status row.",
      },
    },
    {
      name: "loadingLabel",
      type: "string",
      required: false,
      note: {
        cs: "Přeložené „Načítám…“. Povinné, když loading může nastat.",
        en: 'Translated "Loading…". Required once loading can happen.',
      },
    },
    {
      name: "actions",
      type: "(row: Row) => ReactNode",
      required: false,
      note: {
        cs: "Řádkové akce; přidá poslední sloupec.",
        en: "Row actions; adds a trailing column.",
      },
    },
    {
      name: "actionsLabel",
      type: "string",
      required: false,
      note: {
        cs: "Záhlaví sloupce akcí — jen pro odečítač.",
        en: "Header of the actions column — for screen readers only.",
      },
    },
    {
      name: "caption",
      type: "string",
      required: false,
      note: {
        cs: "Popis tabulky pro odečítač, vykreslený mimo obraz.",
        en: "Table description for screen readers, rendered off-screen.",
      },
    },
    {
      name: "stickyHeader",
      type: "boolean",
      required: false,
      note: {
        cs: "Záhlaví zůstane viditelné ve scrollboxu s omezenou výškou.",
        en: "Keeps the header visible inside a height-constrained scroll box.",
      },
    },
    {
      name: "density",
      type: '"default" | "compact"',
      required: false,
      note: {
        cs: "compact stáhne padding buňky na 8px — když se řádky na obrazovku počítají.",
        en: "compact tightens cell padding to 8px — for screens where rows per screen matter.",
      },
    },
    {
      name: "sort",
      type: "IngotSort",
      required: false,
      note: {
        cs: "Aktuální řazení {key, dir}. Tabulka data neřadí — pořadí určuje pole rows.",
        en: "The current sort {key, dir}. The table never sorts — the order is whatever rows holds.",
      },
    },
    {
      name: "onSortChange",
      type: "(sort: IngotSort) => void",
      required: false,
      note: {
        cs: "Klik na řaditelnou hlavičku: neaktivní → asc, asc ↔ desc.",
        en: "Click on a sortable header: inactive → asc, asc ↔ desc.",
      },
    },
    {
      name: "selectedKeys",
      type: "ReadonlySet<string>",
      required: false,
      note: {
        cs: "Klíče vybraných řádků (rowKey). Spolu s onSelectedKeysChange zapne checkbox sloupec.",
        en: "Keys of the selected rows (rowKey). Together with onSelectedKeysChange it enables the checkbox column.",
      },
    },
    {
      name: "onSelectedKeysChange",
      type: "(keys: ReadonlySet<string>) => void",
      required: false,
      note: {
        cs: "Nová množina po každé změně výběru — řádek i vybrat/zrušit vše.",
        en: "The new set after every selection change — a row as well as select/clear all.",
      },
    },
    {
      name: "selectAllLabel",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený popisek checkboxu „vybrat vše“ v hlavičce.",
        en: 'Translated label of the "select all" checkbox in the header.',
      },
    },
    {
      name: "selectRowLabel",
      type: "(row: Row) => string",
      required: false,
      note: {
        cs: "Přeložený popisek checkboxu řádku („Vybrat {název}“).",
        en: 'Translated label of a row checkbox ("Select {name}").',
      },
    },
    {
      name: "bulkbar",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Pruh hromadných akcí nad tabulkou; ukáže se jen s neprázdným výběrem.",
        en: "The bulk-action bar above the table; shown only while the selection is non-empty.",
      },
    },
    {
      name: "rowClassName",
      type: "(row: Row) => string | undefined",
      required: false,
      note: {
        cs: "Stav celého řádku (nevybratelný, zvýrazněný), ne styl po buňkách.",
        en: "Whole-row state (not selectable, highlighted), not per-cell styling.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída tabulky, typicky min-w-[40rem].",
        en: "Pass-through class on the table, typically min-w-[40rem].",
      },
    },
    {
      name: "rowTestId",
      type: "(row: Row) => string",
      required: false,
      note: {
        cs: "data-testid řádku — E2E na něm na některých stránkách visí.",
        en: "data-testid of a row — some screens' end-to-end tests hang off it.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid tabulky.", en: "data-testid of the table." },
    },
  ],
  extraProps: [
    {
      name: "IngotColumn<Row>",
      note: {
        cs: (
          <>
            Jeden prvek pole <IngotCode>columns</IngotCode>. Sloupec se nastavuje tady,
            ne na tabulce — proto by z tabulky vlastností výš jinak zbyl
            jediný řádek.
          </>
        ),
        en: (
          <>
            One entry of the <IngotCode>columns</IngotCode> array. A column is
            configured here, not on the table — which is why the property
            table above would otherwise collapse to a single row.
          </>
        ),
      },
      props: [
        {
          name: "key",
          type: "string",
          required: true,
          note: {
            cs: "Stabilní klíč sloupce (React key), ne popisek.",
            en: "Stable column key (the React key), not a label.",
          },
        },
        {
          name: "header",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Záhlaví sloupce — už přeložené.",
            en: "Column header — already translated.",
          },
        },
        {
          name: "cell",
          type: "(row: Row, index: number) => ReactNode",
          required: true,
          note: {
            cs: "Obsah buňky. index je pořadí v právě vykreslované stránce dat.",
            en: "Cell contents. index is the position within the page of data being rendered.",
          },
        },
        {
          name: "align",
          type: '"start" | "end"',
          required: false,
          note: {
            cs: '"end" = číselný sloupec: doprava a tabular-nums.',
            en: '"end" = numeric column: right-aligned and tabular-nums.',
          },
        },
        {
          name: "cellClassName",
          type: "string",
          required: false,
          note: {
            cs: "Šířka a zalomení musí sedět na <td>, ne na obalu uvnitř něj.",
            en: "Width and wrapping must sit on the <td>, not on a wrapper inside it.",
          },
        },
        {
          name: "sortable",
          type: "boolean",
          required: false,
          note: {
            cs: "Hlavička se stane tlačítkem. Bez sort + onSortChange na tabulce se ignoruje.",
            en: "The header becomes a button. Ignored without sort + onSortChange on the table.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Záhlaví staví primitivum: každá hlavička je{" "}
        <IngotCode>&lt;th scope=&quot;col&quot;&gt;</IngotCode>. Ruční{" "}
        <IngotCode>&lt;thead&gt;</IngotCode> ten <IngotCode>scope</IngotCode> většinou nemá, a bez
        něj odečítač neví, ke kterému sloupci buňka patří.
      </>,
      <>
        <IngotCode>colSpan</IngotCode> prázdného a načítacího řádku se{" "}
        <strong>počítá</strong> ze sloupců a případného sloupce akcí. Ruční
        tabulky ho mají natvrdo a přidání sloupce jim ho tiše rozejde.
      </>,
      <>
        Řádkové akce se <strong>neschovávají za hover</strong>. Vzor{" "}
        <IngotCode>opacity-0 group-hover:…</IngotCode> je pro klávesnici i dotyk past;
        primitivum ho nedělá.
      </>,
      <>
        <IngotCode>loading</IngotCode> nasadí na tabulku <IngotCode>aria-busy</IngotCode> a jeden{" "}
        <IngotCode>role=&quot;status&quot;</IngotCode> řádek, takže se ohlásí jednou —
        ne jednou za buňku.
      </>,
      <>
        <IngotCode>caption</IngotCode> se vykresluje mimo obraz: čte ho odečítač, aniž
        by nad tabulkou přibyl nadpis, který návrh nepočítal.
      </>,
      <>
        Seřazený sloupec nese <IngotCode>aria-sort</IngotCode> a řaditelná
        hlavička je tlačítko — klávesnice řadí stejně jako myš. Šipka
        v hlavičce je jen dekor; stav čte odečítač z atributu.
      </>,
      <>
        Vybraný řádek nese <IngotCode>aria-selected</IngotCode> a checkbox
        v hlavičce umí i částečný stav (indeterminate), když je vybraná jen
        část řádků.
      </>,
    ],
    en: [
      <>
        The primitive builds the header: every heading is a{" "}
        <IngotCode>&lt;th scope=&quot;col&quot;&gt;</IngotCode>. A hand-rolled{" "}
        <IngotCode>&lt;thead&gt;</IngotCode> usually lacks that <IngotCode>scope</IngotCode>, and
        without it a screen reader cannot tell which column a cell belongs to.
      </>,
      <>
        The <IngotCode>colSpan</IngotCode> of the empty and loading rows is{" "}
        <strong>computed</strong> from the columns plus the actions column, if
        any. Hand-rolled tables hard-code it, and adding a column breaks it
        silently.
      </>,
      <>
        Row actions are <strong>not hidden behind hover</strong>. The{" "}
        <IngotCode>opacity-0 group-hover:…</IngotCode> pattern is a trap for keyboard
        and touch alike; the primitive does not do it.
      </>,
      <>
        <IngotCode>loading</IngotCode> puts <IngotCode>aria-busy</IngotCode> on the table and a
        single <IngotCode>role=&quot;status&quot;</IngotCode> row, so it is announced
        once — not once per cell.
      </>,
      <>
        <IngotCode>caption</IngotCode> is rendered off-screen: a screen reader reads it
        without adding a heading above the table that the design did not plan
        for.
      </>,
      <>
        The sorted column carries <IngotCode>aria-sort</IngotCode> and a sortable
        header is a button — the keyboard sorts the same way the mouse does.
        The arrow in the header is decoration; a screen reader reads the
        state from the attribute.
      </>,
      <>
        A selected row carries <IngotCode>aria-selected</IngotCode> and the header
        checkbox knows the partial (indeterminate) state for when only some
        rows are selected.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>header</IngotCode> každého sloupce, <IngotCode>caption</IngotCode>,{" "}
        <IngotCode>actionsLabel</IngotCode> a <IngotCode>loadingLabel</IngotCode> — všechno už
        přeložené od volajícího.
      </>,
      <>
        <IngotCode>loadingLabel</IngotCode> je nepovinný jen typově. Jakmile může
        nastat <IngotCode>loading</IngotCode>, je bez něj hlášení prázdné.
      </>,
      <>
        Obsah prázdného stavu překládá volající u{" "}
        <IngotCode>IngotEmptyState</IngotCode>, ne tabulka.
      </>,
      <>
        <IngotCode>selectAllLabel</IngotCode> a <IngotCode>selectRowLabel</IngotCode>{" "}
        pojmenují checkboxy pro odečítač; obsah <IngotCode>bulkbar</IngotCode>{" "}
        („3 vybrané“ a tlačítka) skládá volající — jen on umí počet
        vyskloňovat.
      </>,
    ],
    en: [
      <>
        Every column's <IngotCode>header</IngotCode>, plus <IngotCode>caption</IngotCode>,{" "}
        <IngotCode>actionsLabel</IngotCode> and <IngotCode>loadingLabel</IngotCode> — all
        translated by the caller.
      </>,
      <>
        <IngotCode>loadingLabel</IngotCode> is optional only in the type. Once{" "}
        <IngotCode>loading</IngotCode> can occur, the announcement is empty without it.
      </>,
      <>
        The empty state's text is translated by the caller at{" "}
        <IngotCode>IngotEmptyState</IngotCode>, not by the table.
      </>,
      <>
        <IngotCode>selectAllLabel</IngotCode> and <IngotCode>selectRowLabel</IngotCode>{" "}
        name the checkboxes for screen readers; the <IngotCode>bulkbar</IngotCode>{" "}
        content ("3 selected" plus buttons) is composed by the caller — only
        the caller can pluralise the count.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        <strong>Řazení dat.</strong> Tabulka kreslí jen stav: pořadí určuje
        pole <IngotCode>rows</IngotCode> a řadí volající nebo server. Klientský
        fallback by nad stránkovanými daty tiše lhal o celku.
      </>,
      <>
        <strong>Stránkování.</strong> Není prop tabulky — je to samostatné{" "}
        <IngotCode>IngotPagination</IngotCode> a stav stránky drží volající,
        stejně jako výběr a řazení.
      </>,
      <>
        <strong>Virtualizace.</strong> Vykreslí se všechny řádky, které
        dostane.
      </>,
      <>
        <strong>Inline edit.</strong> Buňka je výstup; úprava patří do
        dialogu nebo na detail.
      </>,
      <>
        Zbylé schopnosti přibudou, až si o ně řekne konkrétní obrazovka.
        Schopnost bez konzumenta je nezapojený slib — a u tabulky, na které
        visí desítky obrazovek, se špatný návrh bere zpátky nejdráž.
      </>,
    ],
    en: [
      <>
        <strong>Sorting the data.</strong> The table only draws the state: the
        order is whatever <IngotCode>rows</IngotCode> holds and the caller or
        the server sorts. A client-side fallback would quietly lie about the
        whole over paginated data.
      </>,
      <>
        <strong>Pagination.</strong> Not a table prop — it is the separate{" "}
        <IngotCode>IngotPagination</IngotCode>, and the caller owns the page
        state, just like selection and sorting.
      </>,
      <>
        <strong>Virtualisation.</strong> Every row it is given is rendered.
      </>,
      <>
        <strong>Inline editing.</strong> A cell is output; editing belongs in
        a dialog or on a detail screen.
      </>,
      <>
        The remaining capabilities arrive once a concrete screen asks for
        them. A capability with no consumer is an unconnected promise — and on
        a table that dozens of screens hang off, a bad design is the most
        expensive one to take back.
      </>,
    ],
  },
};
