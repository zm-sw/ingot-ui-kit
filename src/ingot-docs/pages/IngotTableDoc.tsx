import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotTableDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotTableDemo?raw");

export const IngotTableDoc: IngotDocMeta = {
  name: "IngotTable",
  status: "stable",
  // 1.1 — selection boxes are the kit's shared checkbox control (accent colour, 16px hit size).
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.3 (KAN-958) - the table always sits in a sideways scroll box, so a
  // wide one no longer pushes the whole document sideways.
  version: "1.3",
  tag: ".table-wrap",
  tokens: [
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--accent-bg",
    "--accent-border",
    "--r-md",
  ],
  classNameNote: {
    cs: "Bere `className` na rozvržení tabulky — typicky `min-w-[40rem]` pod vodorovným posuvníkem.",
    en: "Takes `className` for the table's layout — typically `min-w-[40rem]` under a horizontal scroller.",
  },
  summary: {
    cs: "Tabulka se sloupci jako daty. Drží scope na záhlaví, jeden zdroj pravdy pro colSpan a řádkové akce neschovává za hover.",
    en: "A table whose columns are data. It keeps scope on the headers, one source of truth for colSpan, and never hides row actions behind hover.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka vypisuje seznam záznamů se stejnou sadou sloupců — zdaleka nejčastější
        tvar admin obrazovky.
      </>,
      <>
        Sloupce vznikají za běhu — přidávají se podle oprávnění, plánu nebo nastavení
        tenanta. Jako data se filtrují jedním <IngotCode>filter</IngotCode>, jako JSX by
        to byla podmínka v hlavičce <em>a</em> v každém řádku.
      </>,
      <>
        Řádek má akce (upravit, smazat). Tabulka jim přidá poslední sloupec a nechá je
        viditelné, místo aby je schovala za hover.
      </>,
    ],
    en: [
      <>
        The screen lists records that share one set of columns — by far the most common
        shape of an admin screen.
      </>,
      <>
        The columns are decided at runtime — by permission, plan or tenant settings. As
        data they are filtered by a single <IngotCode>filter</IngotCode>; as JSX it
        would be a condition in the header <em>and</em> in every row.
      </>,
      <>
        Rows carry actions (edit, delete). The table gives them a trailing column and
        leaves them visible instead of hiding them behind hover.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotTableDoc.body"),
};
