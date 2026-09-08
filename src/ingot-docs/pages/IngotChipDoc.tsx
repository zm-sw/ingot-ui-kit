import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotChipDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotChipDemo?raw");

export const IngotChipDoc: IngotDocMeta = {
  name: "IngotChip",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.2 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.3",
  tag: ".chip",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--border-strong",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--accent",
    "--accent-bg",
    "--r-full",
  ],
  classNameNote: {
    cs: "`className` nebere. Chip vypadá stejně na každé obrazovce — právě proto, že si ho dosud kreslila každá zvlášť; rozvržení řady patří obalu, typicky `IngotChipGroup`.",
    en: "Does not take `className`. A chip looks the same on every screen — which is the whole point, since until now every screen drew its own; laying the row out belongs to the wrapper, typically `IngotChipGroup`.",
  },
  summary: {
    cs: "Malá pilulka, se kterou uživatel něco dělá: zapnutý filtr, nebo vybraná volba s křížkem. Ovládací prvek, ne štítek.",
    en: "A small pill the user operates: a filter switched on, or a chosen value with a cross. A control, not a label.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Filtruje se zapínáním a vypínáním voleb, které jsou vidět všechny naráz. Filtr
        schovaný v rozbalovátku je <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        Ukazuje se, co uživatel vybral, a každou položku jde vzít zpátky —{" "}
        <IngotCode>onRemove</IngotCode> s křížkem.
      </>,
      <>
        Voleb je málo a jejich popisky jsou krátké. Řada, která se zalomí na tři řádky,
        už je seznam.
      </>,
    ],
    en: [
      <>
        Filtering is done by switching choices on and off, all of them visible at once.
        A filter hidden in a dropdown is <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        What the user picked is on show and each item can be taken back —{" "}
        <IngotCode>onRemove</IngotCode> with the cross.
      </>,
      <>
        There are few choices and their labels are short. A row that wraps onto three
        lines is a list by then.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotChipDoc.body"),
};
