import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSpinnerDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSpinnerDemo?raw");

export const IngotSpinnerDoc: IngotDocPage = {
  name: "IngotSpinner",
  status: "beta",
  version: "1.0",
  tag: ".spinner",
  tokens: ["--accent", "--dur", "--ease"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění — okraje, zarovnání. Velikost je `size`, barva je akcent: prstenec v barvě obrazovky přestane být tím, co člověk pozná jako „pracuje se“.",
    en: "Takes `className`, but only for placement — margins, alignment. The size is `size` and the colour is the accent: a ring in a screen's own colour stops being the thing people recognise as work in progress.",
  },
  summary: {
    cs: "Něco se děje a není co držet za tvar. Druhá volba po kostře — a jméno je povinné.",
    en: "Something is happening and there is no shape to hold. The second choice after a skeleton — and the name is required.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Tlačítko odesílá. <IngotCode>Button</IngotCode> má{" "}
        <IngotCode>loading</IngotCode> a kreslí si ho samo — tohle je pro místa, kde
        tlačítko není.
      </>,
      <>
        Panel čeká na odpověď, jejíž velikost nikdo předem nezná. Kostra by držela místo
        pro něco jiného, než co přijde.
      </>,
    ],
    en: [
      <>
        A button is submitting. <IngotCode>Button</IngotCode> has{" "}
        <IngotCode>loading</IngotCode> and draws its own — this is for the places where
        there is no button.
      </>,
      <>
        A panel waiting on an answer whose size nobody can predict. A skeleton would
        hold room for something other than what arrives.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Tvar toho, co přijde, je známý. Pak <IngotCode>IngotSkeleton</IngotCode> říká
        víc a hlavně drží místo, takže po dojití dat nic neposkočí.
      </>,
      <>
        Čekání je delší než pár vteřin. Točící se kolečko po půl minutě neříká „pracuje
        se“, ale „zaseklo se“ — takové čekání potřebuje průběh nebo větu.
      </>,
      <>
        Načtení celé stránky. Prázdná stránka s kolečkem uprostřed je horší než stránka,
        která ukáže svůj tvar a doplní se.
      </>,
    ],
    en: [
      <>
        The shape of what is coming is known. Then <IngotCode>IngotSkeleton</IngotCode>{" "}
        says more and, above all, holds the room — so nothing jumps when the data lands.
      </>,
      <>
        The wait is longer than a few seconds. After half a minute a spinning circle no
        longer says "working" but "stuck" — a wait like that needs progress or a
        sentence.
      </>,
      <>
        A whole page loading. A blank page with a circle in the middle is worse than a
        page that shows its shape and fills in.
      </>,
    ],
  },
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Co se děje, už přeložené („Ukládá se“). Povinné: točící se kolečko bez jména je pro odečítač obrázek ničeho.",
        en: 'What is happening, already translated ("Saving"). Required: a spinning circle with no name is, to a screen reader, a picture of nothing.',
      },
    },
    {
      name: "size",
      type: '"sm" | "md"',
      required: false,
      note: {
        cs: "Výchozí `sm`. Obě sedí na výšku `Button` stejné velikosti, aby kolečko vedle tlačítka stálo na jedné lince.",
        en: "Defaults to `sm`. Both match the height of a `Button` of the same size, so a spinner beside a button sits on one line.",
      },
    },
    {
      name: "block",
      type: "boolean",
      required: false,
      note: {
        cs: "Vystředěné na vlastním řádku — pro panel, který čeká. Tlačítko si nechává tvar v řádku.",
        en: "Centred on its own line — for a panel that is waiting. A button keeps the inline shape.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen umístění — okraje, zarovnání.",
        en: "Placement only — margins, alignment.",
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
        <IngotCode>role=&quot;status&quot;</IngotCode> a{" "}
        <IngotCode>aria-live=&quot;polite&quot;</IngotCode>: odečítač se o tom dozví, až
        domluví, ne uprostřed věty. Kolečko samo je <IngotCode>aria-hidden</IngotCode> —
        jméno nese obal.
      </>,
      <>
        Pod <IngotCode>prefers-reduced-motion</IngotCode> se točení zastaví. Prstenec
        zůstane a jméno taky: kdo si vypnul pohyb, nevypnul si tím informaci.
      </>,
      <>
        <IngotCode>label</IngotCode> je povinný v typu, ne jen v dokumentaci. Volitelné
        jméno je jméno, které v polovině případů chybí — a chybí právě tam, kde nikdo
        netestoval s odečítačem.
      </>,
    ],
    en: [
      <>
        <IngotCode>role=&quot;status&quot;</IngotCode> and{" "}
        <IngotCode>aria-live=&quot;polite&quot;</IngotCode>: a screen reader hears about
        it when it has finished speaking, not mid-sentence. The circle itself is{" "}
        <IngotCode>aria-hidden</IngotCode> — the wrapper carries the name.
      </>,
      <>
        Under <IngotCode>prefers-reduced-motion</IngotCode> the spinning stops. The ring
        stays and so does the name: switching off movement did not switch off the
        information.
      </>,
      <>
        <IngotCode>label</IngotCode> is required in the type, not only in the
        documentation. An optional name is a name that is missing half the time — and
        missing exactly where nobody tested with a screen reader.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> dodává volající už přeložený — kit vlastní jmenný
        prostor překladů nemá.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> arrives translated from the caller — the kit has no
        i18n namespace of its own.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Neumí procenta. Ukazatel průběhu je jiná věc s jiným slibem: říká, kolik zbývá,
        a to kolečko neví. Až bude obrazovka, která to ví, je to vlastní primitivum.
      </>,
      <>
        Nemá zpoždění před zobrazením ani vlastní timeout. Kdy je odpověď pomalá a kdy
        je to porucha, ví obrazovka o svých datech, ne kit.
      </>,
    ],
    en: [
      <>
        It cannot do percentages. A progress indicator is a different thing with a
        different promise: it says how much is left, and a circle does not know. When a
        screen exists that does know, that is its own primitive.
      </>,
      <>
        There is no delay before it appears and no timeout of its own. When an answer is
        slow and when it is a fault is something the screen knows about its data, not
        the kit.
      </>,
    ],
  },
};
