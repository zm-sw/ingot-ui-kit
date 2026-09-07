import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAccentSwatchesDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAccentSwatchesDemo?raw");

export const IngotAccentSwatchesDoc: IngotDocMeta = {
  name: "IngotAccentSwatches",
  status: "beta",
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.3 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.3",
  tag: ".swatches",
  tokens: ["--accent", "--ink", "--border-strong"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Volba akcentové rodiny — pět puntíků, každý obarvený tokenem, který nabízí. Žádný hex v kódu.",
    en: "The accent-family picker — five dots, each painted by the token it offers. No hex in the code.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Uživatel si volí akcentovou rodinu — v nastavení aplikace nebo v liště doc webu.
      </>,
      <>
        Volba se má ukázat jako barva, ne jako název. Jméno „smaragdová“ nikomu neřekne,
        jak bude obrazovka vypadat.
      </>,
    ],
    en: [
      <>
        The user picks an accent family — in app settings or in the doc web's top bar.
      </>,
      <>
        The choice should be shown as a colour, not a name. “Emerald” tells nobody how
        the screen will look.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotAccentSwatchesDoc.body"),
};
