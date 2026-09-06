import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotChipDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotChipDemo?raw");

export const IngotChipDoc: IngotDocPage = {
  name: "IngotChip",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.2 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.2",
  tag: ".chip",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--border-strong",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--accent",
    "--accent-bg",
    "--r-full",
  ],
  classNameNote: {
    cs: "`className` nebere. Chip vypadá stejně na každé obrazovce — právě proto, že si ho dosud kreslila každá zvlášť; rozvržení řady patří obalu, typicky `IngotChipGroup`.",
    en: "Does not take `className`. A chip looks the same on every screen — which is the whole point, since until now every screen drew its own; laying the row out belongs to the wrapper, typically `IngotChipGroup`.",
  },
  summary: {
    cs: "Malá pilulka, se kterou uživatel něco dělá: zapnutý filtr, nebo vybraná volba s křížkem. Ovládací prvek, ne štítek.",
    en: "A small pill the user operates: a filter switched on, or a chosen value with a cross. A control, not a label.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Filtruje se zapínáním a vypínáním voleb, které jsou vidět všechny naráz. Filtr
        schovaný v rozbalovátku je <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        Ukazuje se, co uživatel vybral, a každou položku jde vzít zpátky —{" "}
        <IngotCode>onRemove</IngotCode> s křížkem.
      </>,
      <>
        Voleb je málo a jejich popisky jsou krátké. Řada, která se zalomí na tři řádky,
        už je seznam.
      </>,
    ],
    en: [
      <>
        Filtering is done by switching choices on and off, all of them visible at once.
        A filter hidden in a dropdown is <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        What the user picked is on show and each item can be taken back —{" "}
        <IngotCode>onRemove</IngotCode> with the cross.
      </>,
      <>
        There are few choices and their labels are short. A row that wraps onto three
        lines is a list by then.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Jde o STAV záznamu, se kterým se nedá nic dělat („ve výrobě“, „hotovo“). To je{" "}
        <IngotCode>IngotBadge</IngotCode>. Kdo je slije dohromady, dostane buď badge, na
        kterou uživatel marně kliká, nebo chip, který odečítač ohlásí jako text.
      </>,
      <>
        Vybírá se právě jedna hodnota z krátké sady. To je{" "}
        <IngotCode>IngotSegmented</IngotCode> — chipy neřeknou, že se vylučují.
      </>,
      <>
        Přepíná se pohled na obsah stránky. To jsou <IngotCode>IngotTabs</IngotCode>.
      </>,
    ],
    en: [
      <>
        It is a record&apos;s STATE, with nothing to do to it (“in production”, “done”).
        That is <IngotCode>IngotBadge</IngotCode>. Merge the two and you get either a
        badge users click at in vain, or a chip a screen reader announces as text.
      </>,
      <>
        Exactly one value is being picked from a short set. That is{" "}
        <IngotCode>IngotSegmented</IngotCode> — chips never say that they exclude one
        another.
      </>,
      <>
        A view of the page content is being switched. Those are{" "}
        <IngotCode>IngotTabs</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Text chipu, dodaný přeložený. Jedno až dvě slova.",
        en: "The chip's text, supplied translated. One or two words.",
      },
    },
    {
      name: "pressed",
      type: "boolean",
      required: false,
      note: {
        cs: "Režim přepínače: je filtr zapnutý? Kreslí se inverzně a hlásí přes aria-pressed.",
        en: "Toggle mode: is the filter on? Drawn inverse and announced by aria-pressed.",
      },
    },
    {
      name: "onToggle",
      type: "() => void",
      required: false,
      note: {
        cs: "Povinné s pressed. Chip si stav nepamatuje — drží ho volající.",
        en: "Required alongside pressed. The chip does not remember the state — the caller holds it.",
      },
    },
    {
      name: "onRemove",
      type: "() => void",
      required: false,
      note: {
        cs: "Režim odebratelný: vykreslí křížek. S pressed se nekombinuje — typy to nedovolí.",
        en: "Removable mode: renders the cross. Never combined with pressed — the types refuse it.",
      },
    },
    {
      name: "removeLabel",
      type: "string",
      required: false,
      note: {
        cs: "Povinné s onRemove. Pojmenuje křížek pro odečítač, a to konkrétním chipem („Odebrat: Soustružení“).",
        en: "Required alongside onRemove. Names the cross for a screen reader, and names the chip it drops (“Remove: Turning”).",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Zešedne a zmizí z dosahu klávesnice.",
        en: "Greys out and leaves the keyboard's reach.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy; křížek si od ní odvodí `${testId}-remove`.",
        en: "An anchor for tests; the cross derives `${testId}-remove` from it.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotChipGroup",
      note: {
        cs: "Pojmenovaná řada chipů. Obaluje je — bez ní jsou to volná tlačítka.",
        en: "A named row of chips. It wraps them — without it they are loose buttons.",
      },
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "K čemu řada je („Filtr podle operace“), dodané přeložené.",
            en: "What the row is for (“Filter by process”), supplied translated.",
          },
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: { cs: "Chipy řady.", en: "The row's chips." },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva pro testy na skupině.",
            en: "An anchor for tests on the group.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Chip je tlačítko, ne text. Přepínač nese <IngotCode>aria-pressed</IngotCode>,
        takže odečítač hlásí „zapnuto“ i „vypnuto“ — ne jen jméno.
      </>,
      <>
        Zapnutý chip se nepozná jen barvou: převrátí se figura a pozadí, což drží i v
        odstínech šedi, a <IngotCode>aria-pressed</IngotCode> to říká slovy.
      </>,
      <>
        <IngotCode>removeLabel</IngotCode> je povinný a jmenuje konkrétní chip. Osm
        chipů by jinak nabídlo osm tlačítek pod jedním jménem a odečítač by neřekl,
        které z nich co odebere.
      </>,
      <>
        Oba režimy se vylučují na úrovni typů. Odebratelný přepínač by vložil tlačítko
        do tlačítka — neplatné HTML, které si každý prohlížeč vyloží po svém.
      </>,
      <>
        Řadu chipů pojmenuje <IngotCode>IngotChipGroup</IngotCode>. Bez ní odečítač
        potká volná tlačítka a nikdy se nedozví, co filtrují ani kolik jich je.
      </>,
    ],
    en: [
      <>
        A chip is a button, not text. The toggle carries{" "}
        <IngotCode>aria-pressed</IngotCode>, so a screen reader announces “pressed” and
        “not pressed” — not only the name.
      </>,
      <>
        A chip that is on is not told by colour: figure and ground swap, which holds in
        greyscale, and <IngotCode>aria-pressed</IngotCode> says it in words.
      </>,
      <>
        <IngotCode>removeLabel</IngotCode> is required and names the particular chip.
        Eight chips would otherwise offer eight buttons under one name, and a screen
        reader would not say which of them drops what.
      </>,
      <>
        The two modes exclude each other in the types. A removable toggle would put a
        button inside a button — invalid HTML that every browser resolves its own way.
      </>,
      <>
        <IngotCode>IngotChipGroup</IngotCode> names the row. Without it a screen reader
        meets loose buttons and never learns what they filter, nor how many there are.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Text chipu i <IngotCode>removeLabel</IngotCode> dodává volající přeložené — kit
        vlastní jmenný prostor překladů nemá.
      </>,
      <>
        <IngotCode>removeLabel</IngotCode> se skládá ze slovesa a jména chipu. V jazyce,
        který skloňuje, tu skladbu volající řeší sám; kit neví, co je za text uvnitř.
      </>,
    ],
    en: [
      <>
        Both the chip&apos;s text and <IngotCode>removeLabel</IngotCode> arrive
        translated from the caller — the kit has no i18n namespace of its own.
      </>,
      <>
        <IngotCode>removeLabel</IngotCode> is a verb plus the chip&apos;s name. In a
        language that inflects, the caller composes that themselves; the kit does not
        know what the text inside is.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Chip nenese ikonu ani počet. Obojí je snadné dodat, až o to někdo požádá s
        konkrétní obrazovkou — zatím by to byly dvě prázdné vlastnosti navíc.
      </>,
      <>
        Klávesnice mezi chipy nechodí šipkami: jsou to samostatná tlačítka, ne jedna
        volba z sady. Kdo potřebuje šipky, popisuje{" "}
        <IngotCode>IngotSegmented</IngotCode>.
      </>,
    ],
    en: [
      <>
        A chip carries neither an icon nor a count. Both are easy to add when somebody
        asks with a concrete screen behind them — for now they would be two empty props.
      </>,
      <>
        Arrow keys do not walk between chips: they are separate buttons, not one choice
        out of a set. Anyone who needs arrows is describing{" "}
        <IngotCode>IngotSegmented</IngotCode>.
      </>,
    ],
  },
};
