import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Validace formuláře. Chyba pole patří k poli (<IngotCode>IngotField</IngotCode>{" "}
        má <IngotCode>error</IngotCode>), ne do toastu, který za 4 sekundy zmizí.
      </>,
      <>
        Sdělení, které vyžaduje rozhodnutí. Toast nejde „potvrdit“ — na to je{" "}
        <IngotCode>IngotModal</IngotCode> nebo <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        Trvalý stav („3 položky čekají na schválení“). Toast je pomíjivý; trvalé hlášení
        patří do stránky.
      </>,
    ],
    en: [
      <>
        Form validation. A field error belongs to the field (
        <IngotCode>IngotField</IngotCode> has <IngotCode>error</IngotCode>), not to a
        toast that disappears in 4 seconds.
      </>,
      <>
        A message that demands a decision. A toast cannot be "confirmed" — that is{" "}
        <IngotCode>IngotModal</IngotCode> or <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        A persistent state ("3 items awaiting approval"). A toast is ephemeral; a
        persistent message belongs in the page.
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
          type: 'Extract<IngotTone, "neutral" | "danger">',
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
            cs: 'Popisek zpětné akce. Výchozí ze slovníku IngotProvider („Undo“, s lang="cs" „Zpět“).',
            en: 'Label of the undo action. Defaults to the IngotProvider dictionary ("Undo"; "Zpět" with lang="cs").',
          },
        },
        {
          name: "duration",
          type: "number",
          required: false,
          note: {
            cs: "Jak dlouho toast žije v ms. Výchozí 4000; se zpětnou akcí 8000. null = zůstane, dokud ho někdo nezavře.",
            en: "How long the toast lives in ms. Defaults to 4000; with undo 8000. null keeps it until somebody closes it.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Region je <IngotCode>aria-live=&quot;polite&quot;</IngotCode> — odečítač toast
        přečte, až domluví. Chyba operace (
        <IngotCode>tone=&quot;danger&quot;</IngotCode>) se hlásí{" "}
        <IngotCode>assertive</IngotCode>.
      </>,
      <>Toast stojí vlevo dole, aby nepřekryl primární akci stránky.</>,
      <>
        Toast se zpětnou akcí žije 8 sekund místo 4 — operátor musí stihnout přečíst,
        pochopit a kliknout.
      </>,
      <>
        V tmavém motivu dostává toast border, aby se inverzní plocha neztratila na
        tmavém pozadí.
      </>,
    ],
    en: [
      <>
        The region is <IngotCode>aria-live=&quot;polite&quot;</IngotCode> — a screen
        reader announces the toast once it finishes speaking. An operation error (
        <IngotCode>tone=&quot;danger&quot;</IngotCode>) is announced{" "}
        <IngotCode>assertive</IngotCode>.
      </>,
      <>The toast sits bottom-left so it never covers the page's primary action.</>,
      <>
        A toast with an undo lives 8 seconds instead of 4 — the operator has to read,
        understand and click in time.
      </>,
      <>
        In the dark theme the toast gets a border so its inverted surface does not sink
        into the dark background.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>text</IngotCode> dodává volající už přeložený — Ingot nemá vlastní
        překlady.
      </>,
      <>
        Popisek zpětné akce bere toast ze slovníku <IngotCode>IngotProvider</IngotCode>{" "}
        — bez providera „Undo“, s <IngotCode>lang=&quot;cs&quot;</IngotCode> „Zpět“.{" "}
        <IngotCode>undoLabel</IngotCode> ho přebíjí pro jeden toast.
      </>,
    ],
    en: [
      <>
        <IngotCode>text</IngotCode> arrives from the caller already translated — the
        Ingot has no translations of its own.
      </>,
      <>
        The undo label comes from the <IngotCode>IngotProvider</IngotCode> dictionary —
        “Undo” without a provider, “Zpět” with{" "}
        <IngotCode>lang=&quot;cs&quot;</IngotCode>. <IngotCode>undoLabel</IngotCode>{" "}
        overrides it for a single toast.
      </>,
    ],
  },
};

export default body;
