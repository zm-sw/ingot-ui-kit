import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotEmptyStateDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotEmptyStateDemo?raw");

export const IngotEmptyStateDoc: IngotDocMeta = {
  name: "IngotEmptyState",
  status: "stable",
  version: "1.0",
  tag: ".empty",
  tokens: ["--ink-2", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Prázdný stav: jedna věta, co tu není, volitelně proč a volitelně afordance, jak to změnit.",
    en: "Empty state: one sentence saying what is missing, optionally why, and optionally the affordance that changes it.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Seznam, tabulka nebo panel nemá co ukázat a ticho by čtenář přečetl jako chybu
        načítání.
      </>,
      <>
        Prázdno je legitimní počáteční stav a existuje jeden krok, kterým se dá změnit.
        Ten krok patří do <IngotCode>action</IngotCode>.
      </>,
      <>
        Jako <IngotCode>empty</IngotCode> pro <IngotCode>IngotTable</IngotCode>. Ty dvě
        se dodávaly spolu právě proto, že tabulka bez prázdného stavu není hotová.
      </>,
    ],
    en: [
      <>
        A list, table or panel has nothing to show, and silence would read as a loading
        failure.
      </>,
      <>
        Empty is a legitimate starting state and there is one step that changes it. That
        step belongs in <IngotCode>action</IngotCode>.
      </>,
      <>
        As <IngotCode>empty</IngotCode> for <IngotCode>IngotTable</IngotCode>. The two
        shipped together precisely because a table without an empty state is not
        finished.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotEmptyStateDoc.body"),
};
