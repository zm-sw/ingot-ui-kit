import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotToastDemo";
import demoSource from "@/ingot-docs/demos/IngotToastDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotToastDoc: IngotDocPage = {
  name: "IngotToast",
  status: "beta",
  // 1.1 — class composition via cx(); no visible change.
  version: "1.1",
  tag: ".toast",
  tokens: ["--bg", "--border-strong", "--ink", "--danger", "--r-lg", "--shadow-lg"],
  summary: {
    cs: "Imperativní toast pro výsledek akce: toast({ text, undo }) ohlásí, co se stalo, a nezastaví práci.",
    en: "An imperative toast for the result of an action: toast({ text, undo }) announces what happened without stopping the work.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Akce doběhla a operátor to má vědět, aniž by přestal pracovat —
        „Objednávka uložena.“
      </>,
      <>
        Výsledek uložení se zpětnou akcí: toast s „Zpět“ místo modalu
        „Hotovo“. Dělba překryvů: editace → drawer, potvrzení → dialog,
        výsledek → toast.
      </>,
      <>
        Chyba operace, kterou nejde opravit v místě děje —{" "}
        <IngotCode>tone=&quot;danger&quot;</IngotCode>.
      </>,
    ],
    en: [
      <>
        An action finished and the operator should know without stopping
        their work — "Order saved."
      </>,
      <>
        The result of a save with an undo: a toast with "Undo" instead of a
        "Done" modal. Overlay roles: editing → drawer, confirmation →
        dialog, result → toast.
      </>,
      <>
        An operation error that cannot be fixed where it happened —{" "}
        <IngotCode>tone=&quot;danger&quot;</IngotCode>.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Validace formuláře. Chyba pole patří k poli (
        <IngotCode>IngotField</IngotCode> má <IngotCode>error</IngotCode>), ne do
        toastu, který za 4 sekundy zmizí.
      </>,
      <>
        Sdělení, které vyžaduje rozhodnutí. Toast nejde „potvrdit“ — na to
        je <IngotCode>IngotModal</IngotCode> nebo <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        Trvalý stav („3 položky čekají na schválení“). Toast je pomíjivý;
        trvalé hlášení patří do stránky.
      </>,
    ],
    en: [
      <>
        Form validation. A field error belongs to the field (
        <IngotCode>IngotField</IngotCode> has <IngotCode>error</IngotCode>), not to a
        toast that disappears in 4 seconds.
      </>,
      <>
        A message that demands a decision. A toast cannot be "confirmed" —
        that is <IngotCode>IngotModal</IngotCode> or <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        A persistent state ("3 items awaiting approval"). A toast is
        ephemeral; a persistent message belongs in the page.
      </>,
    ],
  },
  props: [
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid regionu s toasty.",
        en: "data-testid of the toast region.",
      },
    },
  ],
  extraProps: [
    {
      name: "toast(options)",
      note: {
        cs: (
          <>
            Toast se nevkládá do JSX — volá se funkce{" "}
            <IngotCode>toast(&#123;…&#125;)</IngotCode> z kódu, který akci provedl.
            Zobrazí ho jednou namountovaný <IngotCode>&lt;IngotToast /&gt;</IngotCode>;
            do aplikace patří právě jeden.
          </>
        ),
        en: (
          <>
            A toast is not written in JSX — the{" "}
            <IngotCode>toast(&#123;…&#125;)</IngotCode> function is called from the code
            that performed the action. It is rendered by a single mounted{" "}
            <IngotCode>&lt;IngotToast /&gt;</IngotCode>; an application mounts exactly
            one.
          </>
        ),
      },
      props: [
        {
          name: "text",
          type: "string",
          required: true,
          note: {
            cs: "Jedna věta v minulém čase — „Objednávka uložena.“",
            en: 'One sentence in the past tense — "Order saved."',
          },
        },
        {
          name: "tone",
          type: '"default" | "danger"',
          required: false,
          note: {
            cs: "danger = chyba operace, hlásí se asertivně. NE validace formuláře.",
            en: "danger = an operation error, announced assertively. NOT form validation.",
          },
        },
        {
          name: "undo",
          type: "() => void",
          required: false,
          note: {
            cs: "Zpětná akce. Přidá tlačítko a prodlouží život toastu na 8 s.",
            en: "The undo action. Adds a button and extends the toast's life to 8 s.",
          },
        },
        {
          name: "undoLabel",
          type: "string",
          required: false,
          note: {
            cs: "Přeložený popisek zpětné akce. Výchozí „Zpět“.",
            en: 'Translated label of the undo action. Defaults to "Zpět".',
          },
        },
        {
          name: "duration",
          type: "number",
          required: false,
          note: {
            cs: "Jak dlouho toast žije v ms. Výchozí 4000; se zpětnou akcí 8000.",
            en: "How long the toast lives in ms. Defaults to 4000; with undo 8000.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Region je <IngotCode>aria-live=&quot;polite&quot;</IngotCode> — odečítač
        toast přečte, až domluví. Chyba operace (
        <IngotCode>tone=&quot;danger&quot;</IngotCode>) se hlásí{" "}
        <IngotCode>assertive</IngotCode>.
      </>,
      <>
        Toast stojí vlevo dole, aby nepřekryl primární akci stránky.
      </>,
      <>
        Toast se zpětnou akcí žije 8 sekund místo 4 — operátor musí stihnout
        přečíst, pochopit a kliknout.
      </>,
      <>
        V tmavém motivu dostává toast border, aby se inverzní plocha
        neztratila na tmavém pozadí.
      </>,
    ],
    en: [
      <>
        The region is <IngotCode>aria-live=&quot;polite&quot;</IngotCode> — a screen
        reader announces the toast once it finishes speaking. An operation
        error (<IngotCode>tone=&quot;danger&quot;</IngotCode>) is announced{" "}
        <IngotCode>assertive</IngotCode>.
      </>,
      <>
        The toast sits bottom-left so it never covers the page's primary
        action.
      </>,
      <>
        A toast with an undo lives 8 seconds instead of 4 — the operator has
        to read, understand and click in time.
      </>,
      <>
        In the dark theme the toast gets a border so its inverted surface
        does not sink into the dark background.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>text</IngotCode> dodává volající už přeložený — Ingot nemá
        vlastní překlady.
      </>,
      <>
        <IngotCode>undoLabel</IngotCode> přebíjí výchozí „Zpět“ pro aplikace v
        jiném jazyce.
      </>,
    ],
    en: [
      <>
        <IngotCode>text</IngotCode> arrives from the caller already translated —
        the Ingot has no translations of its own.
      </>,
      <>
        <IngotCode>undoLabel</IngotCode> overrides the default "Zpět" for
        applications in another language.
      </>,
    ],
  },
};
