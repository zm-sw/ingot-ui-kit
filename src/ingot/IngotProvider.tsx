import {
  createContext,
  useContext,
  useMemo,
  type JSX,
  type ReactNode,
} from "react";

/**
 * Kit-wide defaults for the few labels a primitive has to say itself.
 *
 * The kit has no translation namespace: every visible text arrives from
 * the caller already translated. A handful of labels, though, are said by
 * the primitive when the caller stays silent — the undo action on a toast,
 * the bulb and the close button of a page hint, the placeholder of a secret
 * field. Those used to default to Czech, which for the public web and for
 * third-party apps is a bug: a consumer in another language was handed
 * Czech without asking.
 *
 * **Without a provider the defaults are English.** Wrap the tree in
 * ``<IngotProvider lang="cs">`` to get the Czech set, or pass ``labels`` to
 * override single entries. A component's own prop (``undoLabel``,
 * ``bulbLabel``, ``secretPlaceholder``) always wins over the provider.
 *
 * The dictionary is deliberately tiny and typed: adding a language means
 * adding a full ``IngotLabels`` record, so a language cannot be promised
 * without every label being written. The ``ingot-no-hardcoded-text`` guard
 * keeps every other Czech string out of the kit — this file is its one
 * exemption.
 */

export type IngotLang = "cs" | "en";

export interface IngotLabels {
  /** Label of the undo action on a toast. */
  toastUndo: string;
  /** aria-label of the toast's close button. */
  toastClose: string;
  /** aria-label of the page hint bulb. */
  pageHintBulb: string;
  /** aria-label of the page hint close button. */
  pageHintDismiss: string;
  /** Placeholder of a secret field whose value is stored. */
  secretSet: string;
  /** Placeholder of a secret field without a stored value. */
  secretUnset: string;
  /** Name of a table's column picker (its button and its panel). */
  tableColumns: string;
  /** Label of the search field in the column picker. */
  tableColumnsSearch: string;
  /** The picker's action that drops the user's layout. */
  tableReset: string;
  /** Name of a column's menu. */
  tableColumnMenu: string;
  tableSortAsc: string;
  tableSortDesc: string;
  tableMoveFirst: string;
  tableMoveLeft: string;
  tableMoveRight: string;
  tableMoveLast: string;
  tableHideColumn: string;
  /** Menu item that opens the column's filter. */
  tableFilter: string;
  /** Name of the column's resize handle. */
  tableResize: string;
  /** Footer hint words next to the key caps: J K, X, Enter. */
  tableKeysMove: string;
  tableKeysSelect: string;
  tableKeysOpen: string;
}

export const INGOT_LABELS: Record<IngotLang, IngotLabels> = {
  en: {
    toastUndo: "Undo",
    toastClose: "Close notification",
    pageHintBulb: "Highlight what this hint is about",
    pageHintDismiss: "Hide this hint on this page",
    secretSet: "set",
    secretUnset: "not set",
    tableColumns: "Columns",
    tableColumnsSearch: "Search columns",
    tableReset: "Reset to default",
    tableColumnMenu: "Column options",
    tableSortAsc: "Sort ascending",
    tableSortDesc: "Sort descending",
    tableMoveFirst: "Move to first position",
    tableMoveLeft: "Move left",
    tableMoveRight: "Move right",
    tableMoveLast: "Move to last position",
    tableHideColumn: "Hide column",
    tableFilter: "Filter",
    tableResize: "Resize column",
    tableKeysMove: "move",
    tableKeysSelect: "select",
    tableKeysOpen: "open",
  },
  cs: {
    toastUndo: "Zpět",
    toastClose: "Zavřít oznámení",
    pageHintBulb: "Zvýraznit, čeho se nápověda týká",
    pageHintDismiss: "Skrýt nápovědu na této stránce",
    secretSet: "nastaveno",
    secretUnset: "nenastaveno",
    tableColumns: "Sloupce",
    tableColumnsSearch: "Hledat sloupce",
    tableReset: "Obnovit výchozí",
    tableColumnMenu: "Možnosti sloupce",
    tableSortAsc: "Řadit vzestupně",
    tableSortDesc: "Řadit sestupně",
    tableMoveFirst: "Přesunout na začátek",
    tableMoveLeft: "Přesunout doleva",
    tableMoveRight: "Přesunout doprava",
    tableMoveLast: "Přesunout na konec",
    tableHideColumn: "Skrýt sloupec",
    tableFilter: "Filtrovat",
    tableResize: "Změnit šířku sloupce",
    tableKeysMove: "pohyb",
    tableKeysSelect: "výběr",
    tableKeysOpen: "otevřít",
  },
};

const IngotLabelsContext = createContext<IngotLabels>(INGOT_LABELS.en);

export function IngotProvider({
  lang = "en",
  labels,
  children,
}: {
  /** Which built-in dictionary to start from. Defaults to English. */
  lang?: IngotLang;
  /** Overrides for single labels; whatever is missing comes from ``lang``. */
  labels?: Partial<IngotLabels>;
  children: ReactNode;
}): JSX.Element {
  const value = useMemo(
    () => ({ ...INGOT_LABELS[lang], ...labels }),
    [lang, labels],
  );
  return (
    <IngotLabelsContext.Provider value={value}>
      {children}
    </IngotLabelsContext.Provider>
  );
}

/** The labels in effect — the English set when no provider is above. */
export function useIngotLabels(): IngotLabels {
  return useContext(IngotLabelsContext);
}
