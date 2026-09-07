import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotOpIconDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotOpIconDemo?raw");

export const IngotOpIconDoc: IngotDocMeta = {
  name: "IngotOpIcon",
  status: "stable",
  version: "1.2",
  tag: "[data-op-icon]",
  tokens: ["currentColor"],
  classNameNote: {
    cs: "Bere `className` na umístění; barvu určuje kategorie procesu, velikost `size`.",
    en: "Takes `className` for placement; the process category decides the colour and `size` the size.",
  },
  summary: {
    cs: "Ikona výrobní operace. Kresbu bere z knihovny operací, barvu z kategorie procesu a klíč z databáze — sama si nevymýšlí nic.",
    en: "A manufacturing-operation icon. It takes the drawing from the operation library, the ink from the process category and the key from the database — it invents nothing.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Ukazuješ operaci, kterou má proces uloženou v <IngotCode>icon_key</IngotCode> —
        v koši, na kartě procesu, v přehledu technologií.
      </>,
      <>
        Ikona stojí <strong>vedle názvu operace</strong>. To je její normální tvar; sama
        je zkratka, ne popisek.
      </>,
    ],
    en: [
      <>
        You are showing an operation the process has stored in{" "}
        <IngotCode>icon_key</IngotCode> — in the cart, on a process card, in a
        technology overview.
      </>,
      <>
        The icon sits <strong>next to the operation name</strong>. That is its normal
        shape; on its own it is shorthand, not a label.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotOpIconDoc.body"),
};
