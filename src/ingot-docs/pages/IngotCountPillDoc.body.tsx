import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Jde o stav, ne o počet („ve výrobě“). To je <IngotCode>IngotBadge</IngotCode> —
        verzálkový štítek se <IngotCode>letter-spacing</IngotCode>, jiný tvar i jiný
        význam.
      </>,
      <>
        Číslo je hlavní údaj obrazovky, ne dovětek. Velká čísla s popiskem jsou{" "}
        <IngotCode>IngotMetrics</IngotCode>.
      </>,
      <>
        Počet se dá zmáčknout a něco tím filtrovat. Pak je to{" "}
        <IngotCode>IngotChip</IngotCode>: pilulka je text, ne ovládací prvek.
      </>,
    ],
    en: [
      <>
        It is a state, not a count (“in production”). That is{" "}
        <IngotCode>IngotBadge</IngotCode> — an upper-case label with{" "}
        <IngotCode>letter-spacing</IngotCode>, a different shape and a different
        meaning.
      </>,
      <>
        The number is the screen&apos;s main figure, not an afterthought. Large numbers
        with a caption are <IngotCode>IngotMetrics</IngotCode>.
      </>,
      <>
        The count can be pressed and filters something. Then it is{" "}
        <IngotCode>IngotChip</IngotCode>: the pill is text, not a control.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Číslo. Nic jiného se do pilulky téhle velikosti nevejde.",
        en: "The number. Nothing else belongs in a pill this size.",
      },
    },
    {
      name: "onInk",
      type: "boolean",
      required: false,
      note: {
        cs: "Na tmavém podkladu — uvnitř tmavého panelu nebo zapnutého prvku.",
        en: "On a dark surface — inside a dark panel or a pressed element.",
      },
    },
    {
      name: "label",
      type: "string",
      required: false,
      note: {
        cs: "Co se počítá, pro odečítač, když pilulka stojí sama. Vedle nadpisu ho vynech — text vedle ji už pojmenoval.",
        en: "What is being counted, for a screen reader, when the pill stands alone. Leave it out next to a heading — the text beside it already names it.",
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
        <IngotCode>label</IngotCode> je nepovinný záměrně. Pilulka se skoro vždy čte
        spolu s textem vedle sebe — v tabu („Položky 12“) nebo za nadpisem („Struktura
        článku 10“) — a druhé jméno by tam řeklo totéž podruhé.
      </>,
      <>
        Pilulka, která stojí sama, <strong>label mít musí</strong>: „10“ samo o sobě
        neznamená nic. S ním se čte jako jeden prvek se jménem, bez něj jako text v
        pořadí čtení.
      </>,
      <>
        Nula se kreslí. U odznaku nepřečtených zpráv je nula šum, tady je to odpověď —
        pohled je prázdný. Skrytá nula by prázdnou sekci nechala vypadat stejně jako
        sekci, u které počet nikdo nezná.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> is optional on purpose. The pill is nearly always
        read together with the text beside it — inside a tab (“Items 12”) or after a
        heading (“Article structure 10”) — and a second name would say the same thing
        twice.
      </>,
      <>
        A pill standing on its own <strong>must</strong> have a label: “10” by itself
        means nothing. With one it is read as a single named element, without one as
        text in reading order.
      </>,
      <>
        Zero is drawn. On an unread-message badge a zero is noise; here it is the answer
        — the view is empty. A hidden zero would leave an empty section looking exactly
        like one whose count nobody knows.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> dodává volající přeložený — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        Číslo se neformátuje: oddělovač tisíců patří jazyku volajícího, a do pilulky
        téhle velikosti stejně patří jen krátké počty.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> arrives translated from the caller — the kit has no
        i18n namespace of its own.
      </>,
      <>
        The number is not formatted: a thousands separator belongs to the caller&apos;s
        language, and only short counts belong in a pill this size anyway.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Nemá práh typu <IngotCode>99+</IngotCode>. Zkracovat počet je rozhodnutí o
        významu, ne o šířce — 120 bloků a 2000 bloků nejsou totéž a kit neví, kdy na tom
        čtenáři záleží. Až o práh někdo požádá s konkrétní obrazovkou, přibude i s
        pravidlem, kdy se používá.
      </>,
    ],
    en: [
      <>
        There is no <IngotCode>99+</IngotCode> threshold. Shortening a count is a
        decision about meaning, not about width — 120 blocks and 2000 blocks are not the
        same thing, and the kit does not know when the reader cares. When somebody asks
        for a threshold with a concrete screen behind it, it arrives together with the
        rule for when it applies.
      </>,
    ],
  },
};

export default body;
