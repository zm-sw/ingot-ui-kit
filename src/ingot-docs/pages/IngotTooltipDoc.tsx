import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-847. Replaces the title attribute, which IngotRowActions used to
// lean on: a browser tooltip never shows on touch and a screen reader may
// skip it, which for a row of icon buttons is the whole label.
const demo = () =>
  import("@/ingot-docs/demos/IngotTooltipDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotTooltipDemo?raw");

export const IngotTooltipDoc: IngotDocPage = {
  name: "IngotTooltip",
  status: "beta",
  version: "1.0",
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
  avoidWhen: {
    cs: [
      <>
        Text je potřeba k tomu, aby se dalo jednat. Tooltip je nápověda pro myš a oko —
        co člověk potřebuje k rozhodnutí, patří do popisku nebo vedle prvku.
      </>,
      <>
        Obsah se dá vybrat, prokliknout nebo s ním pracovat — to je{" "}
        <IngotCode>IngotPopover</IngotCode>.
      </>,
      <>
        Nahrazuje se jím jméno prvku. Jméno nese <IngotCode>aria-label</IngotCode>{" "}
        tlačítka; tooltip ho jen popisuje.
      </>,
    ],
    en: [
      <>
        The text is needed in order to act. A tooltip is a hint for the mouse and the
        eye — what a person needs to decide belongs in the label or next to the control.
      </>,
      <>
        The content can be selected, clicked through or worked with — that is{" "}
        <IngotCode>IngotPopover</IngotCode>.
      </>,
      <>
        It is used instead of the control's name. The name is the button's{" "}
        <IngotCode>aria-label</IngotCode>; the tooltip only describes it.
      </>,
    ],
  },
  props: [
    {
      name: "text",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený popis. Krátký — nejvýš věta.",
        en: "Translated description. Short — a sentence at most.",
      },
    },
    {
      name: "children",
      type: "ReactElement",
      required: true,
      note: {
        cs: "Prvek, který popisuje. Musí umět ref a aria-describedby — každé ovládání kitu to umí.",
        en: "The control it describes. It must take a ref and aria-describedby — every kit control does.",
      },
    },
    {
      name: "placement",
      type: "IngotPlacement",
      required: false,
      note: {
        cs: "Výchozí top-start. Když se nahoru bublina nevejde, překlopí se dolů.",
        en: "Defaults to top-start. When there is no room above, the bubble flips below.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  a11y: {
    cs: [
      <>
        Bublina je <IngotCode>role=&quot;tooltip&quot;</IngotCode> a váže se přes{" "}
        <IngotCode>aria-describedby</IngotCode>. Odečítač tak přečte jméno prvku a pak
        popis — ne dvakrát totéž.
      </>,
      <>
        Ukazuje se na hover i na fokus. Klávesnice není druhá kategorie: co se dozví
        myš, musí se dozvědět i ona.
      </>,
      <>
        Escape bublinu skryje, i když kurzor zůstane — WCAG 1.4.13. Bublina nesmí zůstat
        přes obsah, který zakrývá.
      </>,
      <>
        Bublina sama fokus nebere a je <IngotCode>pointer-events: none</IngotCode>:
        nesmí stát v cestě prvku, který popisuje.
      </>,
    ],
    en: [
      <>
        The bubble is <IngotCode>role=&quot;tooltip&quot;</IngotCode> and is tied with{" "}
        <IngotCode>aria-describedby</IngotCode>. A screen reader then reads the
        control's name and the description — not the same words twice.
      </>,
      <>
        It shows on hover and on focus. The keyboard is not a second class: what the
        mouse learns, it has to learn too.
      </>,
      <>
        Escape hides the bubble even while the pointer stays — WCAG 1.4.13. A bubble
        must not sit over the content it covers.
      </>,
      <>
        The bubble takes no focus and is <IngotCode>pointer-events: none</IngotCode>: it
        must not stand in the way of the control it describes.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>text</IngotCode> dodává volající přeložený — kit vlastní překlady
        nemá.
      </>,
    ],
    en: [
      <>
        <IngotCode>text</IngotCode> arrives translated from the caller — the kit has no
        translations of its own.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Bez šipky k prvku a bez podpory dotykového „podržet a zobrazit“. Na dotyku
        popisek nese jméno prvku, což je i důvod, proč je povinné.
      </>,
    ],
    en: [
      <>
        No arrow pointing at the control and no touch press-and-hold. On touch the
        control's own label carries the meaning, which is also why that label is
        required.
      </>,
    ],
  },
};
