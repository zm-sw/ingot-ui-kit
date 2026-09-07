import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSegmentedDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSegmentedDemo?raw");

export const IngotSegmentedDoc: IngotDocMeta = {
  name: "IngotSegmented",
  status: "beta",
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.2",
  tag: ".seg",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Přepínač lišty — dvě až tři krátké volby vedle sebe, vybraná vystoupí na plochu. Volba se projeví hned.",
    en: "A top-bar switch — two or three short choices side by side, the selected one lifted onto the surface. The choice applies at once.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Voleb je málo, jsou krátké a vejdou se vedle sebe — motiv, jazyk, hustota.</>,
      <>
        Volba se projeví okamžitě a nepotvrzuje se. Přepínač, po kterém se ještě někam
        ukládá, je formulář, ne lišta.
      </>,
    ],
    en: [
      <>
        There are few choices, they are short and they fit side by side — theme,
        language, density.
      </>,
      <>
        The choice applies immediately and is not confirmed. A switch that still has to
        be saved somewhere is a form, not a bar.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSegmentedDoc.body"),
};
