import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingSectionHeadDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingSectionHeadDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664, moved into the kit by owner decision: the blocks lived in
// ``src/marketing`` with the reasoning "they have no consumer in the
// admin", yet ``files`` lets only ``src/ingot`` out of the package — the
// public web they were made for could not install them.
//
// ``beta``, because they have just been renamed: the API shape is still
// being found.
export const IngotMarketingSectionHeadDoc: IngotDocPage = {
  name: "IngotMarketingSectionHead",
  status: "beta",
  // 1.1 — eyebrow set by IngotEyebrow (size md, accent tone).
  version: "1.1",
  tag: ".section-head",
  tokens: ["--accent", "--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Hlavička marketingové sekce — nadpis vlevo, uvozující odstavec vpravo. Akcent nese jediný prvek: eyebrow.",
    en: "A marketing section head — the heading on the left, the lede on the right. One element carries the accent: the eyebrow.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce veřejné stránky začíná a potřebuje nadpis s uvozujícím
        odstavcem. Dvousloupec drží pravidlo handoffu: nadpis nese levý
        sloupec, kontext pravý.
      </>,
      <>
        Sekce potřebuje krátký štítek nad nadpisem —{" "}
        <IngotCode>eyebrow</IngotCode> je JEDINÝ akcentový prvek sekce
        a tím určuje, kam padne oko první.
      </>,
    ],
    en: [
      <>
        A section of a public page opens and needs a heading with a lede.
        The two-column split holds the handoff rule: the heading carries
        the left column, the context the right one.
      </>,
      <>
        The section needs a short label above the heading —{" "}
        <IngotCode>eyebrow</IngotCode> is the ONLY accented element of the
        section and so decides where the eye lands first.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to sekce admin obrazovky. Na to je{" "}
        <IngotCode>IngotSection</IngotCode>: menší rozestupy, jeden
        sloupec a nadpis, který se zapíše do osnovy obrazovky.
      </>,
      <>
        Je to nadpis celé stránky. Ten sází{" "}
        <IngotCode>IngotPageHeader</IngotCode> a je{" "}
        <IngotCode>h1</IngotCode>; tahle hlavička je{" "}
        <IngotCode>h2</IngotCode> a předpokládá, že nad ní nějaký{" "}
        <IngotCode>h1</IngotCode> stojí.
      </>,
    ],
    en: [
      <>
        It is a section of an admin screen. That is{" "}
        <IngotCode>IngotSection</IngotCode>: tighter spacing, one column
        and a heading that enters the screen outline.
      </>,
      <>
        It is the heading of the whole page. That is{" "}
        <IngotCode>IngotPageHeader</IngotCode> and it is an{" "}
        <IngotCode>h1</IngotCode>; this head is an{" "}
        <IngotCode>h2</IngotCode> and assumes an{" "}
        <IngotCode>h1</IngotCode> stands above it.
      </>,
    ],
  },
  props: [
    {
      name: "eyebrow",
      type: "string",
      required: false,
      note: {
        cs: "Krátký štítek nad nadpisem — jediný akcentový prvek sekce.",
        en: "A short label above the heading — the section's only accented element.",
      },
    },
    {
      name: "title",
      type: "string",
      required: true,
      note: {
        cs: "Nadpis sekce. Sází se jako h2 a dodává se už přeložený.",
        en: "The section heading. Set as an h2 and supplied already translated.",
      },
    },
    {
      name: "lede",
      type: "string",
      required: false,
      note: {
        cs: "Uvozující odstavec v pravém sloupci. Bez něj se nadpis roztáhne přes celou šířku.",
        en: "The lede in the right column. Without it the heading spans the full width.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy — na mřížce.", en: "An anchor for tests — on the grid." },
    },
  ],
  a11y: {
    cs: [
      <>
        Nadpis je <IngotCode>h2</IngotCode>, ne odstavec obarvený na
        velikost nadpisu. Osnova stránky je jedna z mála věcí, které se
        čtou naslepo.
      </>,
      <>
        <IngotCode>eyebrow</IngotCode> je odstavec, ne nadpis vyšší
        úrovně. Kdyby byl nadpisem, měla by sekce dva nadpisy nad sebou
        a osnova by tvrdila, že jde o dvě sekce.
      </>,
    ],
    en: [
      <>
        The heading is an <IngotCode>h2</IngotCode>, not a paragraph
        coloured to heading size. The page outline is one of the few
        things read blind.
      </>,
      <>
        <IngotCode>eyebrow</IngotCode> is a paragraph, not a
        higher-level heading. Were it a heading, the section would have
        two stacked headings and the outline would claim two sections.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Všechny tři texty jsou obsah z brandingu nebo CMS a dodává je
        volající už přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Dvousloupec počítá s tím, že se délky textů mezi jazyky liší:
        pod 1100 px se skládá na jeden sloupec, takže delší překlad
        nadpis nerozláme.
      </>,
    ],
    en: [
      <>
        All three texts are content from branding or a CMS and arrive
        already translated from the caller — the kit has no translation
        namespace of its own.
      </>,
      <>
        The two-column split expects text lengths to differ between
        languages: below 1100 px it folds to one column, so a longer
        translation does not break the heading apart.
      </>,
    ],
  },
};
