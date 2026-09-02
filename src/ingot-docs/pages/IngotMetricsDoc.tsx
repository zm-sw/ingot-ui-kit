import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMetricsDemo";
import demoSource from "@/ingot-docs/demos/IngotMetricsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotMetricsDoc: IngotDocPage = {
  name: "IngotMetrics",
  status: "beta",
  // 1.1: buňka stripu umí volitelnou křivku vývoje (trend) — rozhodnutí
  // vlastníka 2026-09-02, bod 07. 1.2: testId na buňce.
  version: "1.2",
  tag: ".metricstrip",
  tokens: [
    "--surface",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--warn",
    "--danger",
    "--accent",
    "--font-mono",
    "--r-md",
  ],
  summary: {
    cs: "Čísla, podle kterých se obrazovka čte na první pohled. Dvě hustoty jedné komponenty: pruh pod hlavičkou a kompaktní shluk do hlavičky.",
    en: "The numbers by which a screen is read at a glance. Two densities of one component: a strip below the header and a compact cluster inside it.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Pruh pod hlavičkou seznamu — varianta <IngotCode>strip</IngotCode>.
        Čtyři až šest čísel, která popisují celou obrazovku, ne jeden
        vybraný řádek.
      </>,
      <>
        Kompaktní shluk vedle akcí v hlavičce — varianta{" "}
        <IngotCode>inline</IngotCode>. Dvě až tři čísla, na která se
        nevyplatí obětovat celý pruh.
      </>,
      <>
        Číslo, které má vedle sebe potřebovat větu. Ve variantě{" "}
        <IngotCode>strip</IngotCode> ji nese <IngotCode>note</IngotCode> —
        „po termínu: 2“ a hned pod tím které dvě to jsou.
      </>,
    ],
    en: [
      <>
        A strip below a list header — the <IngotCode>strip</IngotCode>{" "}
        variant. Four to six numbers that describe the whole screen, not one
        selected row.
      </>,
      <>
        A compact cluster next to the actions in a header — the{" "}
        <IngotCode>inline</IngotCode> variant. Two or three numbers not
        worth a whole strip.
      </>,
      <>
        A number that needs a sentence beside it. In the{" "}
        <IngotCode>strip</IngotCode> variant <IngotCode>note</IngotCode>{" "}
        carries it — “overdue: 2”, and right below it which two.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Graf nebo trend. Buňka ukazuje jedno číslo teď, ne jeho vývoj —
        vývoj se do dvaadvaceti pixelů výšky vykreslit nedá.
      </>,
      <>
        Stav jedné položky. „Čeká na potvrzení“ u konkrétní objednávky je
        odznak, tedy <IngotCode>IngotBadge</IngotCode>; metriky mluví
        o množině.
      </>,
      <>
        Zvýraznění toho nejdůležitějšího čísla barvou. Tón je informace, ne
        důraz: <IngotCode>danger</IngotCode> znamená, že to číslo je
        problém, ne že je nejdůležitější. Obarvená polovina pruhu nesděluje
        nic.
      </>,
    ],
    en: [
      <>
        A chart or a trend. A cell shows one number now, not its
        development — development does not fit into twenty-two pixels of
        height.
      </>,
      <>
        The state of a single item. “Awaiting confirmation” on one specific
        order is a badge, that is <IngotCode>IngotBadge</IngotCode>; metrics
        talk about a set.
      </>,
      <>
        Highlighting the most important number with colour. The tone is
        information, not emphasis: <IngotCode>danger</IngotCode> means that
        number is a problem, not that it matters most. Half a strip in
        colour says nothing.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotMetric[]",
      required: true,
      note: {
        cs: "Buňky v pořadí, ve kterém se čtou. Pro strip čtyři až šest, pro inline dvě až tři.",
        en: "The cells in the order they are read. Four to six for strip, two or three for inline.",
      },
    },
    {
      name: "variant",
      type: '"strip" | "inline"',
      required: false,
      note: {
        cs: "Hustota, ne jiná komponenta: dvě komponenty by se rozešly, jakmile by někdo jednu z nich doladil. Výchozí je strip — pruh pod hlavičkou.",
        en: "A density, not a separate component: two components would drift apart the moment someone tuned one of them. The default is strip — the band below the header.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label skupiny. Říká, o čem ta čísla jsou.",
        en: "A translated aria-label for the group. It says what the numbers are about.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro test. Na vzhled ani na chování nemá vliv.",
        en: "An anchor for tests. It affects neither appearance nor behaviour.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMetric",
      note: {
        cs: "Jedna buňka, předává se vlastností items.",
        en: "One cell, passed through the items prop.",
      },
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Popisek nad hodnotou (strip) nebo za ní (inline). Slouží zároveň jako klíč, takže musí být v seznamu jedinečný.",
            en: "The label above the value (strip) or after it (inline). It doubles as the key, so it must be unique within the list.",
          },
        },
        {
          name: "value",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Hodnota. Číslo, ale klidně i „12 / 40“ nebo „19 h“.",
            en: "The value. A number, but “12 / 40” or “19 h” work just as well.",
          },
        },
        {
          name: "note",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Věta pod hodnotou. Vykreslí se jen ve variantě strip — inline pro ni nemá místo.",
            en: "A sentence below the value. Rendered only in the strip variant — inline has no room for it.",
          },
        },
        {
          name: "tone",
          type: '"neutral" | "warn" | "danger"',
          required: false,
          note: {
            cs: "Obarví hodnotu, když je to problém. Výchozí je neutral.",
            en: "Colours the value when it is a problem. The default is neutral.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva testu na buňce — testy míří na konkrétní číslo, ne na celý pruh.",
            en: "A test anchor on the cell — tests target a specific number, not the whole strip.",
          },
        },
        {
          name: "trend",
          type: "readonly number[]",
          required: false,
          note: {
            cs: "Křivka vývoje, zleva doprava, jen ve variantě strip. Kreslí se normalizovaná — vypovídá tvar, ne měřítko; co období ukazuje, řekni větou vedle pruhu. Údaj je číslo, křivka kontext.",
            en: "A trend line, left to right, strip variant only. Drawn normalised — the shape speaks, not the scale; say what period it shows in a sentence next to the strip. The number is the datum, the line is context.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Pruh je <IngotCode>role="group"</IngotCode> s{" "}
        <IngotCode>aria-label</IngotCode>, takže se čísla ohlásí jako jeden
        celek, ne jako pět nesouvisejících odstavců uprostřed stránky.
      </>,
      <>
        Tón je jediné, co barva sděluje — a sděluje to i jinak: hodnota má
        vedle sebe popisek a ve variantě <IngotCode>strip</IngotCode> i
        poznámku. Kdo červenou nerozezná, přečte si totéž slovy.
      </>,
      <>
        Hodnota je mono s <IngotCode>tabular-nums</IngotCode>, popisek ne.
        Čísla se v pruhu čtou pod sebou a proporcionální číslice je rozhodí;
        je to součást specifikace, ne detail. Popisek je věta, ne údaj.
      </>,
    ],
    en: [
      <>
        The strip is a <IngotCode>role="group"</IngotCode> with an{" "}
        <IngotCode>aria-label</IngotCode>, so the numbers are announced as
        one whole, not as five unrelated paragraphs in the middle of the
        page.
      </>,
      <>
        The tone is the only thing colour conveys — and it conveys it in
        other ways too: every value has a label beside it and, in the{" "}
        <IngotCode>strip</IngotCode> variant, a note as well. Anyone who
        cannot tell the red apart reads the same thing in words.
      </>,
      <>
        The value is monospaced with <IngotCode>tabular-nums</IngotCode>,
        the label is not. Numbers in a strip are read one under another and
        proportional digits throw that off; it is part of the specification,
        not a detail. A label is a sentence, not a figure.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky, poznámky i <IngotCode>label</IngotCode> skupiny dodává
        volající přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Buňky mají pevnou minimální šířku a mřížka se zalamuje. Dlouhý
        překlad popisku sníží počet buněk na řádek, takže popisky drž na
        dvou slovech.
      </>,
      <>
        Formátování čísel je na volajícím: oddělovač tisíců, měna i
        jednotky se liší podle jazyka a komponenta hodnotu vypíše tak, jak
        ji dostane.
      </>,
    ],
    en: [
      <>
        Labels, notes and the group's <IngotCode>label</IngotCode> are
        supplied by the caller already translated — the kit has no
        translation namespace of its own.
      </>,
      <>
        Cells have a fixed minimum width and the grid wraps. A long
        translated label reduces how many cells fit on a row, so keep labels
        to two words.
      </>,
      <>
        Number formatting is the caller's: thousands separators, currency
        and units differ by language, and the component prints the value
        exactly as it receives it.
      </>,
    ],
  },
};
