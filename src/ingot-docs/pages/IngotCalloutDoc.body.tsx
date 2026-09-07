import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Text je nápověda k celé obrazovce a řídí ho volba účtu — to je IngotPageHint.
      </>,
      <>
        Blok má otevírat přehled a nést, co čeká na akci — to je IngotAttentionPanel, a
        na stránce smí být jeden.
      </>,
      <>Zpráva je výsledek akce, který nemá zastavit práci — to je toast.</>,
      <>Chyba patří ke konkrétnímu poli. Ta patří k němu, ne do bloku nahoře.</>,
    ],
    en: [
      <>
        The text is help for the whole screen and is driven by an account preference —
        that is IngotPageHint.
      </>,
      <>
        The block should open an overview and carry what awaits action — that is
        IngotAttentionPanel, and a page may hold one.
      </>,
      <>
        The message is the result of an action and must not stop the work — that is a
        toast.
      </>,
      <>
        The error belongs to one field. It belongs at the field, not in a block at the
        top.
      </>,
    ],
  },
  props: [
    {
      name: "tone",
      type: 'Extract<IngotTone, "accent" | "ok" | "warn" | "danger">',
      required: false,
      note: {
        cs: "Význam bloku. Výchozí info. warn a danger se hlásí jako alert.",
        en: "The block's meaning. Defaults to info. warn and danger are announced as an alert.",
      },
    },
    {
      name: "title",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Jeden řádek bez tečky — vlastní nadpis bloku.",
        en: "One line without a full stop — the block's own heading.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Tělo: dvě tři věty. Delší text patří na stránku, ne do bloku.",
        en: "The body: two or three sentences. Longer text belongs on the page, not in a block.",
      },
    },
    {
      name: "actions",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Nejvýš dvě akce dole. Třetí znamená, že tohle je obrazovka, ne poznámka.",
        en: "At most two actions at the foot. A third means this is a screen, not a note.",
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
        warn a danger nesou role="alert" — odečítač je ohlásí, jakmile se objeví. info a
        ok se čtou v pořadí, v jakém stojí na stránce.
      </>,
      <>
        Blok, který křičí pokaždé, je blok, který se lidé naučí přeskakovat: proto alert
        jen u dvou tónů ze čtyř.
      </>,
      <>
        Barva není jediný signál — každý tón má vlastní ikonu a text říká totéž slovy.
      </>,
    ],
    en: [
      <>
        warn and danger carry role="alert" — a screen reader announces them as they
        appear. info and ok are read in the order they stand on the page.
      </>,
      <>
        A block that shouts every time is a block people learn to skip: hence the alert
        on two tones out of four.
      </>,
      <>
        Colour is not the only signal — each tone has its own icon and the text says the
        same thing in words.
      </>,
    ],
  },
  i18n: {
    cs: [<>Titulek i text dodává volající přeložené — kit vlastní překlady nemá.</>],
    en: [
      <>
        The title and the text arrive translated from the caller — the kit has no
        translations of its own.
      </>,
    ],
  },
};

export default body;
