import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSkeletonDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSkeletonDemo?raw");

export const IngotSkeletonDoc: IngotDocPage = {
  name: "IngotSkeleton",
  status: "beta",
  version: "1.0",
  tag: ".skeleton",
  tokens: ["--surface", "--surface-2", "--surface-3", "--border", "--r-sm", "--r-md"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění a šířku bloku. Barvy ani rytmus pulzu ne — kostra, která na každé obrazovce bliká jinak, přestane být poznávacím znamením načítání.",
    en: "Takes `className`, but only for the block's placement and width. Not the colours or the rhythm of the pulse — a skeleton that blinks differently on every screen stops being recognisable as loading.",
  },
  summary: {
    cs: "Tvar toho, co se načítá, dokud se to načítá. Drží místo, takže po dojití dat nic neposkočí.",
    en: "The shape of what is coming, while it is still coming. It holds the room, so nothing jumps when the data lands.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Víš, jaký tvar dorazí — odstavec, karty, tabulka, řada metrik. Kostra to řekne a
        zabere přesně to místo, které obsah vezme.
      </>,
      <>
        Načítání trvá déle než okamžik. Prázdná plocha se od rozbité obrazovky nepozná a
        skok obsahu čtenáře připraví o řádek, na který se díval.
      </>,
    ],
    en: [
      <>
        You know the shape that is coming — a paragraph, cards, a table, a row of
        metrics. The skeleton says so and takes exactly the room the content will.
      </>,
      <>
        The wait is longer than an instant. A blank area is indistinguishable from a
        broken screen, and the jump costs the reader the line they were looking at.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Tvar výsledku neznáš. Pak je to <IngotCode>IngotSpinner</IngotCode> — kostra,
        která drží místo pro něco jiného, než co přijde, poskočí stejně jako prázdno.
      </>,
      <>
        Načtení je hotové v jednom snímku. Kostra, která blikne a zmizí, čte se jako
        závada.
      </>,
      <>
        Nic nedorazí, protože tam nic není. To je <IngotCode>IngotEmptyState</IngotCode>
        : prázdný stav je odpověď, ne čekání.
      </>,
    ],
    en: [
      <>
        You do not know the shape of the answer. Then it is{" "}
        <IngotCode>IngotSpinner</IngotCode> — a skeleton holding room for something
        other than what arrives jumps exactly as the blank did.
      </>,
      <>
        The load is done within a frame. A skeleton that flashes and vanishes reads as a
        fault.
      </>,
      <>
        Nothing is coming, because there is nothing there. That is{" "}
        <IngotCode>IngotEmptyState</IngotCode>: an empty state is an answer, not a wait.
      </>,
    ],
  },
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Co se načítá, už přeložené („Načítají se zakázky“). Odečítač přečte tohle a nic jiného — proužky jsou před ním schované.",
        en: 'What is loading, already translated ("Loading the orders"). A screen reader announces this and nothing else — the bars are hidden from it.',
      },
    },
    {
      name: "shape",
      type: '"text" | "card" | "table" | "metrics"',
      required: false,
      note: {
        cs: "Tvar toho, co dorazí. Výchozí `text`. Tvar musí vypadat jako to, co ho nahradí — jinak drží místo pro něco jiného a obsah stejně poskočí.",
        en: "The shape of what will arrive. Defaults to `text`. It has to look like what replaces it — otherwise it holds room for something else and the content jumps anyway.",
      },
    },
    {
      name: "rows",
      type: "number",
      required: false,
      note: {
        cs: "Kolik řádků, řádek tabulky nebo karet. Výchozí 3. `metrics` ho ignoruje — je to řada čtyř dlaždic z definice.",
        en: "How many lines, table rows or cards. Defaults to 3. `metrics` ignores it — it is a row of four tiles by definition.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Umístění a šířka bloku. Barvy ani animace sem nepatří.",
        en: "The block's placement and width. Colours and animation do not belong here.",
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
        Blok je <IngotCode>role=&quot;status&quot;</IngotCode> s{" "}
        <IngotCode>aria-busy</IngotCode> a se jménem od volajícího. Proužky jsou{" "}
        <IngotCode>aria-hidden</IngotCode>: bez toho by odečítač prošel třicet šedých
        obdélníků a třicetkrát neřekl nic.
      </>,
      <>
        Pulz se pod <IngotCode>prefers-reduced-motion</IngotCode> zastaví. Kostra
        zůstane — je to informace o tvaru, ne animace; vypnutý pohyb neznamená vypnutou
        zprávu.
      </>,
      <>
        Kostra nenese kontrast textu, protože žádný text nemá.{" "}
        <IngotCode>--surface-3</IngotCode> je záměrně tichý: je to podklad, který za
        chvíli zmizí, ne obsah, který se má číst.
      </>,
    ],
    en: [
      <>
        The block is a <IngotCode>role=&quot;status&quot;</IngotCode> with{" "}
        <IngotCode>aria-busy</IngotCode> and the caller's name on it. The bars are{" "}
        <IngotCode>aria-hidden</IngotCode>: without that a screen reader would walk
        thirty grey rectangles and announce nothing thirty times.
      </>,
      <>
        The pulse stops under <IngotCode>prefers-reduced-motion</IngotCode>. The
        skeleton stays — it is information about shape, not an animation; movement
        switched off does not mean the message switched off.
      </>,
      <>
        A skeleton carries no text contrast, because it has no text.{" "}
        <IngotCode>--surface-3</IngotCode> is deliberately quiet: it is a placeholder
        about to disappear, not content to be read.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> dodává volající už přeložený — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        Proužky mají pevné šířky, ne šířky podle textu: kostra nemá co překládat a
        neměla by předstírat, že zná délku věty, která teprve přijde.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> arrives translated from the caller — the kit has no
        i18n namespace of its own.
      </>,
      <>
        The bars have fixed widths rather than text-derived ones: a skeleton has nothing
        to translate and should not pretend to know the length of a sentence that has
        not arrived.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Čtyři tvary, ne libovolná skládačka. Kostra, která umí nakreslit cokoli, je
        druhý layoutový jazyk vedle toho skutečného — a rozejde se s ním hned, jak se
        obrazovka změní a kostru nikdo neupraví.
      </>,
      <>
        Kostra nemá zpoždění. Jestli se má objevit až po chvíli, aby při rychlé odpovědi
        neblikla, je to rozhodnutí obrazovky o jejích datech — kit neví, co je tu
        rychlé.
      </>,
    ],
    en: [
      <>
        Four shapes, not an arbitrary construction kit. A skeleton that can draw
        anything is a second layout language beside the real one — and it parts company
        with it the moment the screen changes and nobody updates the skeleton.
      </>,
      <>
        There is no delay before it appears. Whether it should wait a moment so a fast
        answer does not make it flash is a decision about the screen's own data — the
        kit does not know what counts as fast here.
      </>,
    ],
  },
};
