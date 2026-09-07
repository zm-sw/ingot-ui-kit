import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMegaMenuDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMegaMenuDemo?raw");

export const IngotMegaMenuDoc: IngotDocMeta = {
  name: "IngotMegaMenu",
  status: "beta",
  // 2.3: muted + marker on the item — a dimmed link with a spark that
  // NAVIGATES (the target page draws the gate); the menu does not lock.
  // 2.4 — caption set by IngotEyebrow, the kit's shared mono label.
  // 2.5 — row states come from the kit's shared menu row: current lifts to surface-2, hover goes to ink.
  // 2.6 — panel sits on MENU_LAYER instead of a fixed z-index, so it stays above every open dialog.
  // 2.7 (KAN-849) — the panel fades in, from the kit's motion tokens; motion-reduce turns the movement off.
  // 2.8 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "2.8",
  tag: ".megamenu",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--accent-ink",
    "--font-mono",
    "--r-sm",
    "--r-lg",
    "--shadow-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Rozbalené menu sekce z horní lišty — skupiny odkazů v jednom nebo dvou sloupcích a náhledový sloupec, který popisuje položku pod kurzorem i pod fokusem.",
    en: "The opened section menu from the top bar — groups of links in one or two columns, plus a preview column describing the item under the cursor and under focus alike.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce horní lišty, která má víc obrazovek. Tlačítko sekce rozbaluje tohle menu a
        teprve v něm jsou odkazy.
      </>,
      <>
        Odkazy, které se dají poskládat do pojmenovaných skupin. Nadpis skupiny je
        pracovní rozdělení, ne dekorace — čtenář podle něj hledá.
      </>,
      <>
        Obrazovky, ke kterým se hodí jedna věta kontextu. Náhledový sloupec ji ukazuje
        pro položku, na které čtenář stojí, a odečítač ji slyší přímo z odkazu.
      </>,
      <>
        Platforma i zákaznická část. Obě sdílejí tutéž lištu i totéž menu, liší se jen
        obsahem skupin.
      </>,
    ],
    en: [
      <>
        A top-bar section with more than one screen. The section button opens this menu,
        and only inside it are the links.
      </>,
      <>
        Links that can be arranged into named groups. A group heading is a working
        division, not decoration — readers navigate by it.
      </>,
      <>
        Screens that benefit from one sentence of context. The preview column shows it
        for the item the reader is on, and a screen reader hears it from the link
        itself.
      </>,
      <>
        Both the platform side and the customer side. They share the same bar and the
        same menu, and differ only in the contents of the groups.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMegaMenuDoc.body"),
};
