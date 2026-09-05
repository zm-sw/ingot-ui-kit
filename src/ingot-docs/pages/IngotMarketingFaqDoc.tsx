import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingFaqDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingFaqDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. The prototype had an accessibility hole: the question was a
// button without ``aria-expanded``/``aria-controls`` and 2 of 3 answers were
// empty. Both are held by contract — the attributes by the component,
// ``answer`` by the type.
export const IngotMarketingFaqDoc: IngotDocPage = {
  name: "IngotMarketingFaq",
  status: "beta",
  version: "1.0",
  tag: ".faq-item",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-2", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Časté dotazy — otázka je ovládací prvek hlásící svůj stav, odpověď pojmenovaná oblast. Odpověď je povinná.",
    en: "A FAQ — the question is a control announcing its state, the answer a named region. The answer is required.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Veřejná stránka odpovídá na námitky před registrací a odpovědi se vejdou na pár
        vět.
      </>,
      <>
        Otázek je tolik, že vypsané pod sebou by zabraly víc místa, než kolik jim v
        sekci patří.
      </>,
    ],
    en: [
      <>
        A public page answers objections before sign-up and the answers fit in a few
        sentences.
      </>,
      <>
        There are enough questions that spelling them all out would take more room than
        the section can give.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to sbalitelný blok postranního panelu v aplikaci. Na to je{" "}
        <IngotCode>IngotDisclosure</IngotCode>: mono uppercase popisek, stav drží
        prohlížeč přes <IngotCode>details</IngotCode>.
      </>,
      <>
        Odpověď je důležitá natolik, že ji čtenář nesmí minout. Sbalený obsah říká
        „tohle nepotřebuješ hned“ — u varování je to špatná zpráva o obsahu.
      </>,
    ],
    en: [
      <>
        It is a collapsible block in an app side panel. That is{" "}
        <IngotCode>IngotDisclosure</IngotCode>: a mono uppercase label, with the browser
        holding state through <IngotCode>details</IngotCode>.
      </>,
      <>
        The answer matters enough that the reader must not miss it. Collapsed content
        says “you do not need this yet” — for a warning that is the wrong thing to say.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotMarketingFaqItem[]",
      required: true,
      note: {
        cs: "Dotazy v pořadí, ve kterém se mají číst. Otevřený je vždy nejvýš jeden.",
        en: "The questions in reading order. At most one is open at a time.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na seznamu; otázky a odpovědi si od něj odvodí vlastní.",
        en: "An anchor for tests — on the list; questions and answers derive their own from it.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingFaqItem",
      note: {
        cs: "Jeden dotaz. Předává se polem items.",
        en: "One question. Passed through the items array.",
      },
      props: [
        {
          name: "id",
          type: "string",
          required: true,
          note: {
            cs: "Stabilní klíč položky z dat — ne index, obsah se přeskládává.",
            en: "A stable item key from the data — not an index, content gets reordered.",
          },
        },
        {
          name: "question",
          type: "string",
          required: true,
          note: {
            cs: "Otázka. Je to ovládací prvek, ne nadpis.",
            en: "The question. It is a control, not a heading.",
          },
        },
        {
          name: "answer",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Odpověď. POVINNÁ — položka bez odpovědi neprojde typecheckem, takže prázdné FAQ nejde napsat.",
            en: "The answer. REQUIRED — an item without one fails typecheck, so an empty FAQ cannot be written.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Otázka nese <IngotCode>aria-expanded</IngotCode> i{" "}
        <IngotCode>aria-controls</IngotCode> a drží je komponenta, ne volající —
        atribut, který si musí přepnout někdo jiný, se dřív nebo později přepínat
        přestane.
      </>,
      <>
        Rozbalená odpověď je pojmenovaná oblast, takže se v odečítači dá přeskočit jako
        celek. Klávesnice funguje bez naší pomoci: otázka je nativní ovládací prvek,
        Enter i mezerník na ní přepínají.
      </>,
    ],
    en: [
      <>
        The question carries both <IngotCode>aria-expanded</IngotCode> and{" "}
        <IngotCode>aria-controls</IngotCode>, and the component holds them, not the
        caller — an attribute somebody else has to flip eventually stops being flipped.
      </>,
      <>
        The expanded answer is a named region, so a screen reader can skip it as a
        whole. The keyboard works without our help: the question is a native control,
        Enter and Space toggle it.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Otázka i odpověď jsou obsah a dodává je volající přeložené — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        Odpověď je <IngotCode>ReactNode</IngotCode>, ne řetězec, takže překlad může nést
        odkaz nebo zvýraznění, aniž by se do textu musely psát značky.
      </>,
    ],
    en: [
      <>
        Question and answer are content and arrive translated from the caller — the kit
        has no translation namespace of its own.
      </>,
      <>
        The answer is a <IngotCode>ReactNode</IngotCode>, not a string, so a translation
        can carry a link or emphasis without markup having to be written into the text.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Otevřená je vždy nejvýš jedna odpověď a nejde to vypnout. Rozbalit všechno
        najednou by z FAQ udělalo dlouhý seznam odstavců, což je přesně to, čemu se
        sbalováním vyhýbá.
      </>,
      <>
        Sbalování se neanimuje a sbalený text nenajde hledání na stránce. Stav drží
        React, ne <IngotCode>details</IngotCode> — cena za to, že je otevřená vždy jen
        jedna položka.
      </>,
    ],
    en: [
      <>
        At most one answer is open and that cannot be turned off. Expanding everything
        at once would turn the FAQ into a long list of paragraphs, which is exactly what
        collapsing avoids.
      </>,
      <>
        Collapsing is not animated and find-on-page does not reach collapsed text. React
        holds the state, not <IngotCode>details</IngotCode> — the price of keeping
        exactly one item open.
      </>,
    ],
  },
};
