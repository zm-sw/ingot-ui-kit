import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotTooltipDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotTooltipDemo?raw");

export const IngotTooltipDoc: IngotDocMeta = {
  name: "IngotTooltip",
  status: "beta",
  // 1.1 (KAN-966) - the bubble is positioned before paint like the popover, so it
  // no longer appears once at the previous opening's coordinates and jumps.
  version: "1.1",
  tag: ".tooltip",
  tokens: ["--ink", "--bg", "--r-md", "--shadow-lg"],
  classNameNote: {
    cs: "`className` nebere. Bublina má jednu podobu na celý produkt; umístění řídí `placement`.",
    en: "Does not take `className`. The bubble has one shape across the product; `placement` drives where it lands.",
  },
  summary: {
    cs: "Krátký popisek u prvku, na hover i na fokus. Popisuje, nepojmenovává — jméno prvku zůstává na něm.",
    en: "A short description next to a control, on hover and on focus. It describes, it does not name — the control keeps its own name.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Ikonové tlačítko potřebuje vysvětlit, co udělá — řádkové akce ho používají
        přesně na tohle.
      </>,
      <>
        Zkratka nebo číslo potřebuje jednu větu navíc, která se do rozvržení nevejde.
      </>,
      <>
        Prvek je vypnutý a je potřeba říct proč. Popisek patří k obalu, ne k vypnutému
        tlačítku, které fokus nebere.
      </>,
    ],
    en: [
      <>
        An icon button needs to say what it does — the row actions use it for exactly
        that.
      </>,
      <>
        An abbreviation or a number needs one more sentence that does not fit the
        layout.
      </>,
      <>
        A control is disabled and the reason has to be given. The tooltip belongs on the
        wrapper, not on a disabled button that takes no focus.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotTooltipDoc.body"),
};
