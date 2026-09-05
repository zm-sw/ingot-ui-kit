import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotEyebrowDemo";
import demoSource from "@/ingot-docs/demos/IngotEyebrowDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotEyebrowDoc: IngotDocPage = {
  name: "IngotEyebrow",
  status: "beta",
  version: "1.0",
  tag: ".eyebrow",
  tokens: ["--font-mono", "--ink-3", "--ink-4", "--accent-ink", "--ok"],
  classNameNote: {
    cs: "Bere `className` na rozvržení — odsazení a flex. Barvu a písmo určují `size` a `tone`.",
    en: "Takes `className` for layout — margins and flex. `size` and `tone` decide colour and type.",
  },
  summary: {
    cs: "Malý mono popisek verzálkami nad věcí, kterou pojmenovává — skupina v menu, metrika, krok. Jeden zápis pro idiom, který se dřív kreslil deseti způsoby.",
    en: "The small uppercase mono caption above the thing it names — a nav group, a metric, a step. One drawing for an idiom that used to be hand-drawn ten ways.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad hodnotou nebo blokem stojí krátké jméno toho, co to je: „Sklad“
        nad cestou, „Ve výrobě“ nad číslem, „Krok 2“ nad nadpisem karty.
      </>,
      <>
        Popisek skupiny v menu nebo v bočním rejstříku — text, který se čte
        jako orientace, ne jako obsah.
      </>,
      <>
        Kicker nad odstavcem v průvodci nebo na veřejné stránce (
        <IngotCode>size=&quot;md&quot;</IngotCode>).
      </>,
    ],
    en: [
      <>
        A short name of what the thing is, set above a value or a block:
        “Warehouse” above a path, “In production” above a number, “Step 2”
        above a card title.
      </>,
      <>
        A group caption in a menu or a side index — text read as orientation,
        not as content.
      </>,
      <>
        A kicker above a paragraph in a guide or on a public page (
        <IngotCode>size=&quot;md&quot;</IngotCode>).
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Text pojmenovává STAV („ve výrobě“, „hotovo“) — to je{" "}
        <IngotCode>IngotBadge</IngotCode>: má rámeček, tón a pravidla pro
        kontrast, které holý popisek nemá.
      </>,
      <>
        Text je nadpis, který má stát v osnově stránky — to je{" "}
        <IngotCode>IngotSection</IngotCode>. Eyebrow žádnou roli nadpisu
        nenese schválně.
      </>,
      <>
        Popisek pole formuláře. Ten je <IngotCode>label</IngotCode> a patří
        k <IngotCode>IngotField</IngotCode>, aby ho odečítač spojil se
        vstupem.
      </>,
    ],
    en: [
      <>
        The text names a STATE (“in production”, “done”) — that is{" "}
        <IngotCode>IngotBadge</IngotCode>: it has a border, a tone and
        contrast rules a bare caption does not.
      </>,
      <>
        The text is a heading that belongs in the page outline — that is{" "}
        <IngotCode>IngotSection</IngotCode>. An eyebrow deliberately carries no
        heading role.
      </>,
      <>
        A form field's label. That is a <IngotCode>label</IngotCode> and
        belongs to <IngotCode>IngotField</IngotCode>, so a screen reader ties
        it to the input.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Popisek, už přeložený. Verzálky dělá CSS.",
        en: "The caption, already translated. Uppercase is done by CSS.",
      },
    },
    {
      name: "as",
      type: '"p" | "span" | "div"',
      required: false,
      note: {
        cs: "Element. Výchozí p; span do řádku, div pro blok s dalším obsahem.",
        en: "The element. Defaults to p; span inline, div for a block holding other content.",
      },
    },
    {
      name: "size",
      type: '"sm" | "md"',
      required: false,
      note: {
        cs: "sm (10,5 px) uvnitř komponent, md (token text-eyebrow, 11 px) nad odstavcem.",
        en: "sm (10.5 px) inside components, md (the text-eyebrow token, 11 px) above prose.",
      },
    },
    {
      name: "tone",
      type: '"neutral" | "muted" | "accent" | "ok" | "inherit"',
      required: false,
      note: {
        cs: "Barva z tokenů. inherit nechá barvu rodiči — odkaz, který mění barvu při najetí.",
        en: "Colour from tokens. inherit leaves colour to the parent — a link that changes colour on hover.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení (odsazení, flex). Barvu a písmo určuje size a tone.",
        en: "Layout only (margins, flex). Colour and type come from size and tone.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy.",
        en: "An anchor for tests.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Není to nadpis: žádná role, žádná úroveň. Odečítač ho čte jako text
        před hodnotou, ke které patří — proto stojí v DOM přímo před ní.
      </>,
      <>
        Verzálky dělá <IngotCode>text-transform</IngotCode>, ne přepsaný
        řetězec, takže odečítač čte slova, ne písmena.
      </>,
    ],
    en: [
      <>
        Not a heading: no role, no level. A screen reader reads it as the text
        before the value it belongs to — which is why it sits directly before
        it in the DOM.
      </>,
      <>
        Uppercase comes from <IngotCode>text-transform</IngotCode>, not a
        rewritten string, so a screen reader reads words, not letters.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Text dodává volající už přeložený — kit vlastní jmenný prostor
        překladů nemá.
      </>,
    ],
    en: [
      <>
        The text arrives already translated from the caller — the kit has no
        translation namespace of its own.
      </>,
    ],
  },
};
