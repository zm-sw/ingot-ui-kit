import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingPricingDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingPricingDemo?raw");

export const IngotMarketingPricingDoc: IngotDocMeta = {
  name: "IngotMarketingPricing",
  status: "beta",
  version: "1.0",
  tag: ".pricecard",
  tokens: ["--border", "--surface", "--ink", "--ink-2", "--ink-3", "--ok"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Karty plánů — cena, výčet vlastností a akce na patě. Zvýrazněná karta má obrys a odznak, ne akcentový rámeček.",
    en: "Plan cards — a price, a feature list and an action at the foot. The featured card gets an outline and a badge, not an accent frame.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Veřejná stránka nabízí plány a čtenář se má rozhodnout, který z nich chce.</>,
      <>
        Ceny i názvy plánů přicházejí z dat. <IngotCode>price</IngotCode> je už
        naformátovaný řetězec — formátování měny patří tam, kde se ví, jakou měnu a
        locale tenant má.
      </>,
    ],
    en: [
      <>A public page offers plans and the reader is to decide which one they want.</>,
      <>
        Prices and plan names come from data. <IngotCode>price</IngotCode> is an already
        formatted string — currency formatting belongs where the tenant's currency and
        locale are known.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingPricingDoc.body"),
};
