import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotCalloutDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotCalloutDemo?raw");

export const IngotCalloutDoc: IngotDocPage = {
  name: "IngotCallout",
  status: "beta",
  version: "1.0",
  tag: ".callout",
  tokens: [
    "--accent",
    "--accent-bg",
    "--accent-border",
    "--ok",
    "--ok-bg",
    "--ok-border",
    "--warn",
    "--warn-bg",
    "--warn-border",
    "--danger",
    "--danger-bg",
    "--danger-border",
    "--ink",
    "--ink-2",
    "--r-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Tón určuje plochu, rám i ikonu; kdyby šly přepsat zvenčí, varování by v jedné aplikaci vypadalo třemi způsoby — přesně to, co tohle primitivum ruší.",
    en: "Does not take `className`. The tone decides the surface, the border and the icon; if they could be overridden from outside, one warning would look three ways in one application — exactly what this primitive exists to end.",
  },
  summary: {
    cs: "Podbarvený blok s poznámkou, varováním nebo důsledkem u obsahu, ke kterému patří. Tón určuje i to, jestli ho odečítač ohlásí.",
    en: "A tinted block with a note, a warning or a consequence, next to the content it belongs to. The tone also decides whether a screen reader announces it.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        K sekci patří dvě tři věty, které mění, jak se má číst — od kdy platí ceník, co
        se stane při uložení.
      </>,
      <>Je potřeba varovat před důsledkem akce dřív, než na ni uživatel sáhne.</>,
      <>Výsledek dlouhé operace má zůstat na stránce, ne zmizet jako toast.</>,
    ],
    en: [
      <>
        A section needs two or three sentences that change how it should be read — when
        a price list starts, what saving will do.
      </>,
      <>A consequence has to be flagged before the user reaches for the action.</>,
      <>
        The result of a long operation should stay on the page rather than vanish like a
        toast.
      </>,
    ],
  },
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
      type: '"info" | "ok" | "warn" | "danger"',
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
