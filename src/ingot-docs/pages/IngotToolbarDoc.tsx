import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotToolbarDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotToolbarDemo?raw");

export const IngotToolbarDoc: IngotDocMeta = {
  name: "IngotToolbar",
  status: "beta",
  version: "1.0",
  tag: ".toolbar",
  tokens: ["--ink-2", "--ink-3"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Filtr bar nad seznamem. Drží mezery, zalamování a pravý konec; čím se filtruje, dodává volající.",
    en: "A filter bar above a list. It owns spacing, wrapping and the right end; what filters, the caller supplies.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad tabulkou nebo seznamem stojí vyhledávání, selecty či přepínače, které
        zužují, co je vidět. Pořadí bloků list obrazovky je: filtr bar, pruh hromadných
        akcí, tabulka, pager.
      </>,
      <>
        Vpravo od filtrů patří primární akce obrazovky („Přidat“) — na to je slot{" "}
        <IngotCode>end</IngotCode>, aby konec neukradl poslední filtr.
      </>,
    ],
    en: [
      <>
        A search box, selects or toggles narrowing what is visible sit above a table or
        list. The block order of a list screen is: filter bar, bulk-action bar, table,
        pager.
      </>,
      <>
        The screen's primary action ("Add") belongs to the right of the filters — that
        is the <IngotCode>end</IngotCode> slot, so the last filter cannot steal the
        right end.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotToolbarDoc.body"),
};
