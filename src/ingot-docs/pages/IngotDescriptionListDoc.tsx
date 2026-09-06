import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotDescriptionListDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotDescriptionListDemo?raw");

export const IngotDescriptionListDoc: IngotDocPage = {
  name: "IngotDescriptionList",
  status: "beta",
  version: "1.0",
  tag: ".dl",
  tokens: ["--ink", "--ink-4", "--font-mono", "--s-3", "--s-5"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění bloku. Mezery mezi dvojicemi ani sazbu popisku ne — to je rytmus detailu a má být na všech obrazovkách stejný.",
    en: "Takes `className`, but only for placing the block. Not the gaps between pairs or the setting of the label — that is the rhythm of a detail and should be the same on every screen.",
  },
  summary: {
    cs: "Fakta o záznamu: popisek, hodnota, popisek, hodnota. Sémantický `dl`, ne mřížka spanů — a fakta jsou mono.",
    en: "The facts about a record: label, value, label, value. A semantic `dl`, not a grid of spans — and facts are mono.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Hlavička detailu záznamu: číslo, zákazník, stav, termín. Nejčastější blok
        detailové obrazovky vůbec.
      </>,
      <>
        Souhrn nad formulářem nebo v postranním panelu — to, co se nemění a nedá se to
        editovat tady.
      </>,
    ],
    en: [
      <>
        The head of a record's detail: number, customer, state, due date. The commonest
        block on a detail screen there is.
      </>,
      <>
        A summary above a form or in a side panel — what does not change and cannot be
        edited here.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Dá se to editovat. Popisek s hodnotou, do které se píše, je{" "}
        <IngotCode>IngotField</IngotCode> — a pokud má popisek stát vlevo, má na to{" "}
        <IngotCode>labelPlacement=&quot;side&quot;</IngotCode>.
      </>,
      <>
        Je toho víc než pár položek a čte se to po řádcích napříč záznamy. To je{" "}
        <IngotCode>IngotTable</IngotCode>: seznam dvojic není tabulka a tabulka není
        seznam dvojic.
      </>,
      <>
        Velká čísla, na která se má obrazovka dívat. To jsou{" "}
        <IngotCode>IngotMetrics</IngotCode> — dlaždice s číslem a popiskem, ne řádek
        faktů.
      </>,
    ],
    en: [
      <>
        It can be edited. A label with a value being typed into is{" "}
        <IngotCode>IngotField</IngotCode> — and if the label is to stand on the left,
        that is <IngotCode>labelPlacement=&quot;side&quot;</IngotCode>.
      </>,
      <>
        There is more than a handful and it is read row by row across records. That is{" "}
        <IngotCode>IngotTable</IngotCode>: a list of pairs is not a table and a table is
        not a list of pairs.
      </>,
      <>
        Large figures the screen is meant to look at. Those are{" "}
        <IngotCode>IngotMetrics</IngotCode> — tiles with a number and a caption, not a
        row of facts.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotDescriptionItem[]",
      required: true,
      note: {
        cs: "Dvojice popisek–hodnota v pořadí, ve kterém se mají číst.",
        en: "The label–value pairs, in the order they are to be read.",
      },
    },
    {
      name: "columns",
      type: "1 | 2",
      required: false,
      note: {
        cs: "`1` (výchozí) se čte dolů — úzký panel, postranní sloupec. `2` postaví dvojice vedle sebe pro široký detail a pod `sm` se vrátí k jednomu, kde by dva sloupce nenechaly místo ani popisku, ani hodnotě.",
        en: "`1` (the default) reads down the page — a narrow panel, a side column. `2` puts pairs side by side for a wide detail and folds back to one below `sm`, where two columns would leave room for neither the label nor the value.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen umístění bloku.",
        en: "Placing the block only.",
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
      name: "IngotDescriptionItem",
      note: {
        cs: "Jedna dvojice — to, co jde do `items`.",
        en: "One pair — what goes into `items`.",
      },
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Co ta hodnota je, už přeložené. Kreslí se jako eyebrow.",
            en: "What the value is, already translated. Drawn as an eyebrow.",
          },
        },
        {
          name: "value",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Sama hodnota. Smí to být i `IngotBadge` nebo `IngotAvatar` — fakt nemusí být text.",
            en: "The value itself. It may be an `IngotBadge` or an `IngotAvatar` — a fact need not be text.",
          },
        },
        {
          name: "mono",
          type: "boolean",
          required: false,
          note: {
            cs: "Hodnota je fakt — číslo, kód, datum. Zapne mono a `tabular-nums`. Je to pravidlo systému („Fakta jsou mono“), ne libovůle: v běžném řezu mají číslice různou šířku a dva řádky pod sebou se nedají porovnat.",
            en: 'The value is a fact — a number, a code, a date. Turns on mono and `tabular-nums`. It is a rule of the system ("facts are mono"), not a preference: in the body face the digits are different widths and two rows cannot be compared.',
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Je to opravdový <IngotCode>dl</IngotCode> s <IngotCode>dt</IngotCode> a{" "}
        <IngotCode>dd</IngotCode>. Právě to říká, že tenhle popisek pojmenovává tuhle
        hodnotu; mřížka spanů vypadá stejně a odečítači neřekne nic — přečte osm textů
        za sebou a čtenář si má pořadí domyslet.
      </>,
      <>
        Každá dvojice je vlastní řádek mřížky, takže dlouhá hodnota nevytáhne popisek
        souseda z linky. Vizuální zarovnání je tu součást čitelnosti, ne estetika.
      </>,
    ],
    en: [
      <>
        It is a real <IngotCode>dl</IngotCode> with <IngotCode>dt</IngotCode> and{" "}
        <IngotCode>dd</IngotCode>. That is what says this label names this value; a grid
        of spans looks the same and tells a screen reader nothing — it reads eight texts
        in a row and leaves the reader to infer the pairing.
      </>,
      <>
        Each pair is its own grid row, so a long value cannot drag its neighbour's label
        out of line. The alignment here is part of readability, not decoration.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky i hodnoty dodává volající už přeložené — kit vlastní jmenný prostor
        překladů nemá.
      </>,
      <>
        Sloupce mají stejnou šířku a nezužují se podle jazyka: delší německý popisek se
        zalomí, nezmenší hodnotu vedle.
      </>,
    ],
    en: [
      <>
        Both labels and values arrive from the caller already translated — the kit has
        no i18n namespace of its own.
      </>,
      <>
        The columns are equal and do not narrow with the language: a longer German label
        wraps, it does not shrink the value beside it.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Jeden nebo dva sloupce. Tři dvojice vedle sebe znamenají hodnotu na dvacet
        pixelů a popisek na dva řádky — a detail, který se místo čtení luští.
      </>,
      <>
        Neumí vynechat prázdnou položku. Jestli se „Termín: —“ má ukázat, nebo zmizet,
        je rozhodnutí o významu (nezadáno vs. nemá termín), a to kit za obrazovku udělat
        nemůže.
      </>,
    ],
    en: [
      <>
        One or two columns. Three pairs side by side means a value twenty pixels wide
        and a label on two lines — a detail that is deciphered rather than read.
      </>,
      <>
        It cannot drop an empty item. Whether "Due: —" should show or disappear is a
        decision about meaning (not entered vs. has no due date), and the kit cannot
        make that for a screen.
      </>,
    ],
  },
};
