import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotColumnsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotColumnsDemo?raw");

export const IngotColumnsDoc: IngotDocPage = {
  name: "IngotColumns",
  status: "beta",
  version: "1.0",
  tag: ".columns",
  tokens: ["--s-4"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění bloku — kde na stránce stojí. Ne na šířku sloupců ani na mezeru mezi nimi: přesně kvůli tomu, že si je každá obrazovka určovala sama, tohle primitivum vzniklo.",
    en: "Takes `className`, but only for placing the block — where on the page it stands. Not for the width of the columns or the gap between them: that each screen decided those for itself is exactly why this primitive exists.",
  },
  summary: {
    cs: "Dva nebo tři sloupce uvnitř bloku a jedno pravidlo, kdy přestanou být sloupci. Formulář, detail záznamu, karty vedle sebe.",
    en: "Two or three columns inside a block, and one rule for when they stop being columns. A form, a record's detail, cards side by side.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Formulář, kde krátká pole patří k sobě — IČO vedle DIČ, město vedle PSČ. Pod
        sebou zabírají dvakrát tolik obrazovky a nic tím neřeknou.
      </>,
      <>Detail záznamu: metadata v jednom sloupci, obsah ve druhém.</>,
      <>
        Karty vedle sebe. Tři je maximum — čtvrtý sloupec je na 1440 px užší než 300 px
        a karta v něm se láme.
      </>,
    ],
    en: [
      <>
        A form where short fields belong together — company number beside VAT number,
        town beside post code. Stacked they take twice the screen and say nothing more
        for it.
      </>,
      <>A record's detail: metadata in one column, the content in the other.</>,
      <>
        Cards side by side. Three is the maximum — a fourth column at 1440 px is under
        300 px wide, and a card in it breaks.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Rozvržení celé stránky. To je <IngotCode>IngotPageLayout</IngotCode> (rytmus
        bloků, postranní rejstřík) uvnitř <IngotCode>IngotAppFrame</IngotCode> (šířka,
        okraje). Tohle je vnitřek jednoho bloku.
      </>,
      <>
        Dvojice popisek–hodnota v detailu. Ta má vlastní sémantiku (
        <IngotCode>dl</IngotCode>) a je to <IngotCode>IngotDescriptionList</IngotCode>,
        ne mřížka, do které někdo naskládal spany.
      </>,
      <>
        Tabulka. Sloupce, které mají záhlaví a řadí se, jsou{" "}
        <IngotCode>IngotTable</IngotCode> — mřížka je rozvržení, ne data.
      </>,
    ],
    en: [
      <>
        The layout of a whole page. That is <IngotCode>IngotPageLayout</IngotCode> (the
        rhythm of blocks, the side index) inside <IngotCode>IngotAppFrame</IngotCode>{" "}
        (width, margins). This is the inside of one block.
      </>,
      <>
        Label–value pairs in a detail. Those carry their own semantics (
        <IngotCode>dl</IngotCode>) and are <IngotCode>IngotDescriptionList</IngotCode>,
        not a grid somebody stacked spans into.
      </>,
      <>
        A table. Columns with headers that sort are <IngotCode>IngotTable</IngotCode> —
        a grid is layout, not data.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Obsah sloupců. Každý potomek zabírá jeden sloupec; přes celou šířku se dá pustit jen `IngotColumnsFull`.",
        en: "The columns' contents. Each child takes one column; only `IngotColumnsFull` runs the whole width.",
      },
    },
    {
      name: "columns",
      type: "2 | 3",
      required: false,
      note: {
        cs: "Kolik sloupců, jakmile je na ně místo. Výchozí 2.",
        en: "How many columns, once there is room for them. Defaults to 2.",
      },
    },
    {
      name: "collapseBelow",
      type: '"md" | "lg"',
      required: false,
      note: {
        cs: "Pod touhle šířkou je z toho jeden sloupec. Výchozí `md`. „Nikdy“ tu není: dva sloupce na telefonu jsou dva sloupce po 150 px a to, co stálo za postavení vedle sebe, se v nich nedá číst.",
        en: 'Below this width it becomes one column. Defaults to `md`. There is no "never": two columns on a phone are two columns of about 150 px, and whatever was worth putting side by side cannot be read in them.',
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen umístění bloku. Šířka sloupců ani mezera sem nepatří.",
        en: "Placement of the block only. The width of the columns and the gap do not belong here.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  extraProps: [
    {
      name: "IngotColumnsFull",
      note: {
        cs: "Potomek, který místo jednoho sloupce zabere celý řádek — poznámka nad dvojicí polí, textarea pod nimi.",
        en: "A child that takes the whole row instead of one column — a note above a pair of fields, a textarea under them.",
      },
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Co má jít přes celou šířku.",
            en: "What is to run the whole width.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Mřížka nemění pořadí čtení: potomci jsou v DOM v tom pořadí, ve kterém je
        volající napsal, a odečítač i klávesnice jdou po nich stejně. Mřížka, která
        přesouvá prvky vizuálně jinam, než kde jsou v dokumentu, je nejběžnější způsob,
        jak se pořadí tabulátoru rozejde s tím, co je vidět.
      </>,
      <>
        Sloupec sám o sobě není orientační bod ani seznam — je to rozvržení. Význam
        nesou bloky uvnitř (<IngotCode>IngotSection</IngotCode>,{" "}
        <IngotCode>IngotField</IngotCode>), a mřížka jim do něj nesahá.
      </>,
    ],
    en: [
      <>
        The grid does not reorder reading: children sit in the DOM in the order the
        caller wrote them, and a screen reader and the keyboard follow the same one. A
        grid that moves elements visually away from where they are in the document is
        the commonest way for tab order to part company with what is on screen.
      </>,
      <>
        A column is not a landmark or a list in itself — it is layout. The meaning is
        carried by the blocks inside (<IngotCode>IngotSection</IngotCode>,{" "}
        <IngotCode>IngotField</IngotCode>), and the grid does not reach into it.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Mřížka nekreslí žádný text. Sloupce se nezužují ani nerozšiřují podle jazyka —
        delší německý popisek se zalomí, nezmenší sloupec vedle.
      </>,
    ],
    en: [
      <>
        The grid draws no text. Columns do not narrow or widen with the language — a
        longer German label wraps, it does not shrink the column beside it.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Sloupce jsou stejně široké. Poměr 2 : 1 (obsah vedle úzkého panelu) tu není,
        protože pro něj zatím není obrazovka — a jakmile bude, je to pojmenovaný tvar s
        pravidlem, ne číslo, které si každý zadá jinak.
      </>,
      <>
        Popisek vlevo od pole není věc mřížky: mřížka nedosáhne dovnitř{" "}
        <IngotCode>IngotField</IngotCode> a dvojice popisek–pole musí zůstat jedním
        prvkem, aby <IngotCode>htmlFor</IngotCode> dál platilo. Proto to umí samo pole —{" "}
        <IngotCode>labelPlacement=&quot;side&quot;</IngotCode>.
      </>,
    ],
    en: [
      <>
        The columns are equal. A 2 : 1 ratio (content beside a narrow panel) is not here
        because no screen needs one yet — and when one does, it arrives as a named shape
        with a rule, not as a number everybody enters differently.
      </>,
      <>
        A label to the left of a field is not the grid's business: the grid cannot reach
        inside <IngotCode>IngotField</IngotCode>, and the label–field pair has to stay
        one element for <IngotCode>htmlFor</IngotCode> to keep holding. So the field
        does it itself — <IngotCode>labelPlacement=&quot;side&quot;</IngotCode>.
      </>,
    ],
  },
};
