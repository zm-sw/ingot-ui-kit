import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSideNavDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSideNavDemo?raw");

export const IngotSideNavDoc: IngotDocMeta = {
  name: "IngotSideNav",
  status: "stable",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.2 — class composition via cx(); no visible change.
  // 1.3 — row states come from the kit's shared menu row; no visible change.
  // 1.4 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.4",
  tag: ".sidenav",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--ink-4",
    "--font-mono",
    "--r-sm",
    "--shadow-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Šířku a přilnutí menu drží sloupec kolem něj, ne položky uvnitř.",
    en: "Does not take `className`. The column around it holds the menu's width and stickiness, not the items inside.",
  },
  summary: {
    cs: "Pojmenovaná skupina odkazů, jeden z nich aktivní. Popisek navigace a aria-current drží primitivum, ne domluva.",
    en: "A named group of links with one of them active. The primitive owns the navigation label and aria-current — not an agreement to remember them.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Boční menu, které přepíná obsah vedle sebe a jedna položka je právě zobrazená.
      </>,
      <>
        Na stránce je navigací víc (průvodci a komponenty, sekce a podsekce). Každá
        dostane vlastní <IngotCode>label</IngotCode>, takže je odečítač od sebe rozezná.
      </>,
    ],
    en: [
      <>
        A side menu that switches the content beside it, with one item currently shown.
      </>,
      <>
        The page has more than one navigation (guides and components, sections and
        subsections). Each gets its own <IngotCode>label</IngotCode>, so a screen reader
        can tell them apart.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSideNavDoc.body"),
};
