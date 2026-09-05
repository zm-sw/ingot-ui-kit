import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingStepsDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingStepsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. The number is computed from the order so "01, 02, 04" cannot be written.
export const IngotMarketingStepsDoc: IngotDocPage = {
  name: "IngotMarketingSteps",
  status: "beta",
  version: "1.0",
  tag: ".step",
  tokens: [
    "--border",
    "--surface",
    "--accent-bg",
    "--accent-ink",
    "--ink",
    "--ink-3",
    "--ink-4",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Kroky „jak to funguje“ — karty s pořadovým číslem a šipkou k dalšímu kroku. Číslo se počítá z pořadí, nepíše se.",
    en: "The “how it works” steps — cards with an ordinal and an arrow to the next one. The number comes from the order, it is not typed.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce popisuje postup a na pořadí záleží: druhý krok nedává smysl před prvním.
      </>,
      <>
        Kroků je tři, nebo čtyři u procesu — <IngotCode>columns</IngotCode> nabízí jen
        tyhle dvě hodnoty, protože „kolik chceš“ by z pravidla handoffu udělalo
        doporučení.
      </>,
    ],
    en: [
      <>
        The section describes a procedure and the order matters: step two makes no sense
        before step one.
      </>,
      <>
        There are three steps, or four for a process — <IngotCode>columns</IngotCode>{" "}
        offers only those two values, because “as many as you like” would turn the
        handoff rule into a suggestion.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Položky jsou rovnocenné a pořadí je nahodilé. Pak je to výčet featur —{" "}
        <IngotCode>IngotMarketingTri</IngotCode>.
      </>,
      <>
        Je to průvodce v aplikaci, kterým uživatel prochází. Na to je{" "}
        <IngotCode>IngotStepCard</IngotCode>: ta drží stav kroku (hotovo, běží) a sbalí
        se; tyhle karty jsou statický popis.
      </>,
    ],
    en: [
      <>
        The items are equal and the order is arbitrary. Then it is a feature list —{" "}
        <IngotCode>IngotMarketingTri</IngotCode>.
      </>,
      <>
        It is an in-app wizard the user walks through. That is{" "}
        <IngotCode>IngotStepCard</IngotCode>: it holds step state (done, in progress)
        and collapses; these cards are a static description.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotMarketingStepItem[]",
      required: true,
      note: {
        cs: "Kroky v pořadí, ve kterém se mají číst. Číslo si komponenta odvodí sama.",
        en: "The steps in reading order. The component derives the number itself.",
      },
    },
    {
      name: "columns",
      type: "3 | 4",
      required: false,
      note: {
        cs: "Trojsloupcová mřížka je výchozí; čtyři sloupce jen pro kroky procesu.",
        en: "Three columns is the default; four only for process steps.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na seznamu.",
        en: "An anchor for tests — on the list.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingStepItem",
      note: {
        cs: "Jeden krok. Předává se polem items.",
        en: "One step. Passed through the items array.",
      },
      props: [
        {
          name: "title",
          type: "string",
          required: true,
          note: {
            cs: "Co se v kroku dělá. V kartě má nejvyšší váhu — víc než pořadí.",
            en: "What the step does. It carries the most weight in the card — more than the ordinal.",
          },
        },
        {
          name: "text",
          type: "string",
          required: true,
          note: { cs: "Jedna věta pod titulkem.", en: "One sentence under the title." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Kroky jsou <IngotCode>ol</IngotCode>, takže odečítač hlásí pořadí i počet —
        pořadí je tu význam, ne vzhled.
      </>,
      <>
        Šipka k dalšímu kroku je dekorace a poslední karta ji nemá: pořadí se čte ze
        seznamu, ne z ikony.
      </>,
    ],
    en: [
      <>
        The steps are an <IngotCode>ol</IngotCode>, so a screen reader announces
        position and count — the order is meaning here, not decoration.
      </>,
      <>
        The arrow to the next step is decoration and the last card has none: the order
        is read from the list, not from an icon.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> i <IngotCode>text</IngotCode> chodí přeložené od
        volajícího.
      </>,
      <>
        Číslo se sází mono s <IngotCode>01</IngotCode> místo <IngotCode>1</IngotCode>,
        takže je v každém jazyce stejně široké a karty se nerozjedou.
      </>,
    ],
    en: [
      <>
        Both <IngotCode>title</IngotCode> and <IngotCode>text</IngotCode> arrive
        translated from the caller.
      </>,
      <>
        The ordinal is set in mono as <IngotCode>01</IngotCode> rather than{" "}
        <IngotCode>1</IngotCode>, so it is the same width in every language and the
        cards do not drift.
      </>,
    ],
  },
};
