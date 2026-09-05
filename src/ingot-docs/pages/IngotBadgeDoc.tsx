import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotBadgeDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotBadgeDemo?raw");

export const IngotBadgeDoc: IngotDocPage = {
  name: "IngotBadge",
  status: "stable",
  version: "1.0",
  tag: ".badge",
  tokens: [
    "--surface-2",
    "--border",
    "--ink",
    "--ink-2",
    "--accent-ink",
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
    "--font-mono",
    "--r-xs",
  ],
  classNameNote: {
    cs: "`className` nebere schválně: `bg-*` zvenčí by tiše přebilo tón a dvě různá sdělení by se kreslila stejně.",
    en: "Deliberately does not take `className`: a `bg-*` from outside would quietly override the tone and two different messages would look alike.",
  },
  summary: {
    cs: "Stavový štítek: stav entity jedním slovem, mono a verzálkami. Pojmenovává stav, ne akci.",
    en: "A status badge: the state of an entity in one word, mono and upper-case. It names a state, not an action.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Entita má stav, který se čte na první pohled — objednávka „ve výrobě“, poptávka
        „zamítnuto“, účet „archivováno“.
      </>,
      <>
        V řádku tabulky nebo v hlavičce detailu, kde by jinak vznikl další ručně
        obarvený <IngotCode>&lt;span&gt;</IngotCode>.
      </>,
      <>
        Stav právě běží a má to být vidět — <IngotCode>dot</IngotCode> přidá tečku. Je
        to dekorace navíc, význam pořád nese text.
      </>,
    ],
    en: [
      <>
        An entity has a state that is read at a glance — an order &quot;in
        production&quot;, a quote &quot;rejected&quot;, an account &quot;archived&quot;.
      </>,
      <>
        In a table row or a detail header, where another hand-coloured{" "}
        <IngotCode>&lt;span&gt;</IngotCode> would otherwise appear.
      </>,
      <>
        The state is live and that should show — <IngotCode>dot</IngotCode> adds a dot.
        It is decoration on top; the meaning still lives in the text.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to počet. Odznak s číslem je jiné primitivum s jinou specifikací: kulatý,
        práh <IngotCode>99+</IngotCode>, povinný popisek pro odečítač, nula se nekreslí
        — a kit ho zatím nemá. Číslo není stav a plést je znamená, že jednou přibude
        štítek, který svítí pořád.
      </>,
      <>
        Má se na to dát kliknout. Filtr, který jde zapnout, je chip a musí být tlačítko
        s fokusem a klávesovou obsluhou. Štítek je text, ne ovládací prvek —{" "}
        <IngotCode>onClick</IngotCode> na něm proto nenajdeš.
      </>,
      <>
        Na jeden řádek tabulky by jich šlo víc než jeden. Dva štítky vedle sebe se čtou
        jako jeden složený stav, který nikdo nedefinoval; slož je do jednoho slova, nebo
        ten druhý dej do sloupce.
      </>,
      <>
        Sdělení je věta, ne stav. Verzálky ji udělají nečitelnou a{" "}
        <IngotCode>IngotEmptyState</IngotCode> nebo obyčejný odstavec ji unesou líp.
      </>,
    ],
    en: [
      <>
        It is a count. A badge with a number is a different primitive with a different
        specification: round, a <IngotCode>99+</IngotCode> threshold, a mandatory
        screen-reader label, zero is not drawn — and the kit does not have it yet. A
        number is not a state, and confusing the two ends with a badge that is always
        lit.
      </>,
      <>
        It is meant to be clicked. A filter you can switch on is a chip and has to be a
        button, with focus and keyboard handling. A badge is text, not a control — which
        is why it has no <IngotCode>onClick</IngotCode>.
      </>,
      <>
        More than one of them could end up in a single table row. Two badges side by
        side read as one compound state nobody defined; fold them into one word, or move
        the second into a column of its own.
      </>,
      <>
        The message is a sentence, not a state. Upper case makes it unreadable, and{" "}
        <IngotCode>IngotEmptyState</IngotCode> or an ordinary paragraph carries it
        better.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Stav jedním slovem, už přeložený. Význam nese text, ne barva.",
        en: "The state in one word, already translated. The meaning is in the text, not the colour.",
      },
    },
    {
      name: "tone",
      type: "neutral | ok | warn | danger | accent | ink",
      required: false,
      note: {
        cs: "Výchozí neutral. Uzavřená množina — sedmá barva by byla sedmý význam, který nikdo nedefinoval.",
        en: "Defaults to neutral. A closed set — a seventh colour would be a seventh meaning nobody defined.",
      },
    },
    {
      name: "dot",
      type: "boolean",
      required: false,
      note: {
        cs: "Tečka pro živý stav. Je aria-hidden, takže nic nepřidává odečítači.",
        en: "A dot for a live state. It is aria-hidden, so it adds nothing for a screen reader.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid štítku.",
        en: "data-testid of the badge.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Barva význam nenese nikdy sama. Text je povinný právě proto, že barva je pro
        část čtenářů neviditelná a v tisku zmizí úplně.
      </>,
      <>
        Všech šest tónů drží kontrast textu proti vlastnímu pozadí nad 4,5 : 1 ve
        světlém i tmavém motivu. Není to slib v próze — měří se to nad skutečnými
        hodnotami tokenů.
      </>,
      <>
        Štítek není interaktivní: nemá roli, fokus ani klávesovou obsluhu. Kdyby ji
        dostal, musel by být tlačítkem — a to už je chip, ne štítek.
      </>,
      <>
        <IngotCode>dot</IngotCode> je <IngotCode>aria-hidden</IngotCode>. Tečka, kterou
        by odečítač přečetl, by hlásila znak navíc, ne stav.
      </>,
    ],
    en: [
      <>
        Colour never carries the meaning on its own. The text is required precisely
        because colour is invisible to some readers and disappears entirely in print.
      </>,
      <>
        All six tones keep the text above 4.5 : 1 against their own background in both
        light and dark. That is not a promise in prose — it is measured against the real
        token values.
      </>,
      <>
        The badge is not interactive: no role, no focus, no keyboard handling. If it had
        them it would have to be a button — and that is a chip, not a badge.
      </>,
      <>
        <IngotCode>dot</IngotCode> is <IngotCode>aria-hidden</IngotCode>. A dot a screen
        reader would read out announces an extra character, not a state.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Text dodává volající už přeložený — Ingot nemá vlastní i18n namespace.</>,
      <>
        Verzálky dělá CSS, ne <IngotCode>toUpperCase()</IngotCode>. Velká písmena se v
        některých jazycích tvoří jinak a řetězec přepsaný v kódu by to nesl s sebou i
        tam, kde se štítek zrovna nekreslí.
      </>,
      <>
        Stav je jedno slovo. Překlad, který se rozroste do věty, je signál, že to není
        stav — ne důvod štítek roztáhnout.
      </>,
    ],
    en: [
      <>
        The text arrives from the caller already translated — Ingot has no i18n
        namespace of its own.
      </>,
      <>
        Upper case is done by CSS, not <IngotCode>toUpperCase()</IngotCode>.
        Capitalisation works differently in some languages, and a string rewritten in
        code would carry that everywhere, including where the badge is not drawn at all.
      </>,
      <>
        A state is one word. A translation that grows into a sentence is a sign it is
        not a state — not a reason to widen the badge.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Žádný <IngotCode>className</IngotCode>. Dnešní ruční štítky ho berou a jejich{" "}
        <IngotCode>bg-…</IngotCode> s tónem tiše prohrává — volající si myslí, že barvu
        přepsal, a ona zůstane. Tón jde jen přes <IngotCode>tone</IngotCode>, takže ta
        dvojznačnost tu nejde vyrobit.
      </>,
      <>
        Žádný piktogram. Ikona vedle jednoho slova soutěží s tečkou o totéž místo a
        přibude, až si o ni řekne konkrétní obrazovka.
      </>,
    ],
    en: [
      <>
        No <IngotCode>className</IngotCode>. Today&apos;s hand-rolled badges accept one,
        and its <IngotCode>bg-…</IngotCode> silently loses to the tone — the caller
        thinks they overrode the colour and it stays. The tone goes through{" "}
        <IngotCode>tone</IngotCode> only, so that ambiguity cannot be built here.
      </>,
      <>
        No icon. An icon next to a single word competes with the dot for the same spot;
        it arrives when a concrete screen asks for it.
      </>,
    ],
  },
};
