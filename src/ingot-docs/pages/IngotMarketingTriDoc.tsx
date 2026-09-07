import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingTriDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingTriDemo?raw");

export const IngotMarketingTriDoc: IngotDocMeta = {
  name: "IngotMarketingTri",
  status: "beta",
  version: "1.0",
  tag: ".tri",
  tokens: [
    "--border",
    "--surface",
    "--accent",
    "--accent-bg",
    "--accent-border",
    "--ink",
    "--ink-3",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Trojice featur pod hlavičkou sekce — ikona v akcentovém rámečku, titulek a věta. Jeden rám, panely oddělené vlasovou linkou.",
    en: "Three features under a section head — an icon in an accent frame, a title and a sentence. One frame, panels split by a hairline.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce veřejné stránky vyjmenovává, co produkt umí, a položky patří k sobě
        natolik, že mají stát v jednom rámu.
      </>,
      <>
        Každá položka se dá napsat na jednu větu. Trojice je výčet, ne místo na odstavce
        — delší text patří do kroků nebo segmentů.
      </>,
    ],
    en: [
      <>
        A section of a public page lists what the product does and the items belong
        together closely enough to stand in one frame.
      </>,
      <>
        Every item fits in one sentence. The trio is a list, not a place for paragraphs
        — longer text belongs in steps or segments.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingTriDoc.body"),
};
