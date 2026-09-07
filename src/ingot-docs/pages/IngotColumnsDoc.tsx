import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotColumnsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotColumnsDemo?raw");

export const IngotColumnsDoc: IngotDocMeta = {
  name: "IngotColumns",
  status: "beta",
  // 1.1 (KAN-986) — four columns, tiles by minimum width, and the gap as a
  // step of the space scale. Nothing to edit: the defaults render exactly
  // what they rendered.
  version: "1.1",
  tag: ".columns",
  tokens: ["--s-3", "--s-4", "--s-5"],
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
  body: () => import("@/ingot-docs/pages/IngotColumnsDoc.body"),
};
