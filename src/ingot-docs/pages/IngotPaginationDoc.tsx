import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPaginationDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPaginationDemo?raw");

export const IngotPaginationDoc: IngotDocMeta = {
  name: "IngotPagination",
  status: "beta",
  version: "1.1",
  tag: ".pager",
  tokens: ["--ink-3"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Stránkování pod tabulkou. Řízené volajícím — s tabulkou se nepře o to, kdo drží stav stránky.",
    en: "Pagination under a table. Controlled by the caller — it never fights the table over who owns the page state.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Seznam je delší, než co dává smysl vykreslit najednou, a data se načítají po
        stránkách — typicky ze serveru.
      </>,
      <>
        Pod tabulkou má stát pager ve tvaru předchozí / stav / další. Pořadí bloků list
        obrazovky je: filtr bar, pruh hromadných akcí, tabulka, pager.
      </>,
    ],
    en: [
      <>
        The list is longer than makes sense to render at once and the data is fetched a
        page at a time — typically from a server.
      </>,
      <>
        A previous / status / next pager belongs under the table. The block order of a
        list screen is: filter bar, bulk-action bar, table, pager.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotPaginationDoc.body"),
};
