import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingCtaDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingCtaDemo?raw");

export const IngotMarketingCtaDoc: IngotDocMeta = {
  name: "IngotMarketingCta",
  status: "beta",
  version: "1.0",
  tag: ".cta",
  tokens: ["--ink", "--bg", "--accent", "--accent-ink"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Závěrečná výzva — tmavý blok se dvěma akcemi. Hlavní akce je akcentová a je jediným barevným prvkem bloku.",
    en: "The closing call to action — a dark block with two actions. The primary one is accented and the block's only colour.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Stránka končí a čtenáři se má nabídnout jeden zjevný další krok.</>,
      <>
        Vedle hlavní akce dává smysl měkčí varianta (ukázka, kontakt) pro toho, kdo se
        ještě nechce registrovat.
      </>,
    ],
    en: [
      <>The page ends and the reader is to be offered one obvious next step.</>,
      <>
        Beside the primary action a softer one (a demo, a contact) makes sense for
        someone not ready to sign up.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingCtaDoc.body"),
};
