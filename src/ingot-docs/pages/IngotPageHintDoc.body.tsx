import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

// IngotPageHint is the kit's only page-level help; earlier help mechanisms
// of the product are not part of the kit. The rendered text must not name
// them (internal names), hence this comment.

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>Potvrzení výsledku operace („Uloženo“) — to je toast, ne nápověda.</>,
      <>
        Varování nebo chyba, na kterou musí uživatel reagovat — nápověda je volitelné
        čtení, které jde vypnout.
      </>,
      <>
        Vícekrokové provedení celým procesem — pruh popisuje jednu obrazovku; průvodce
        je jiný vzor.
      </>,
    ],
    en: [
      <>
        Confirming the result of an operation (“Saved”) — that is a toast, not a hint.
      </>,
      <>
        A warning or an error the user must react to — a hint is optional reading that
        can be switched off.
      </>,
      <>
        A multi-step walkthrough of a whole process — the strip describes one screen; a
        guided tour is a different pattern.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "string",
      required: true,
      note: {
        cs: "Název obrazovky nebo úkolu, o kterém pruh mluví — ne „Nápověda“.",
        en: "Name of the screen or task the strip talks about — not “Help”.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "2–3 věty v druhé osobě: co tady uživatel udělá a čím.",
        en: "2–3 sentences in the second person: what the user does here and with what.",
      },
    },
    {
      name: "targets",
      type: "string[]",
      required: false,
      note: {
        cs: 'Selektory prvků k zvýraznění — typicky [data-hint-target="…"]. Bez cílů je žárovka jen dekorace.',
        en: 'Selectors of the elements to highlight — typically [data-hint-target="…"]. Without targets the bulb is decoration only.',
      },
    },
    {
      name: "level",
      type: '"simple" | "expert" | "both"',
      required: false,
      note: {
        cs: "Komu je nápověda určená podle slovníku uživatele; výchozí both. Dokud režimy slovníku nejsou, ber všechny uživatele jako both.",
        en: "Whom the hint targets by the user's dictionary; both by default. Until dictionary modes exist, treat every user as both.",
      },
    },
    {
      name: "dismissible",
      type: "boolean",
      required: false,
      note: {
        cs: "Ukáže křížek. Skrytí platí pro daného uživatele a stránku.",
        en: "Shows a close button. The dismissal is per user and page.",
      },
    },
    {
      name: "onDismiss",
      type: "() => void",
      required: false,
      note: {
        cs: "Klik na křížek. Perzistence patří na účet uživatele, ne do localStorage.",
        en: "Close-button click. Persistence belongs on the user's account, not in localStorage.",
      },
    },
    {
      name: "visible",
      type: "boolean",
      required: false,
      note: {
        cs: "Řízená viditelnost — přepínač „Nápověda na stránkách“ v menu účtu. false nekreslí nic.",
        en: "Controlled visibility — the “Hints on pages” switch in the account menu. false renders nothing.",
      },
    },
    {
      name: "bulbLabel",
      type: "string",
      required: false,
      note: {
        cs: "aria-label žárovky. Výchozí ze slovníku IngotProvider.",
        en: "aria-label of the bulb. Defaults to the IngotProvider dictionary.",
      },
    },
    {
      name: "dismissLabel",
      type: "string",
      required: false,
      note: {
        cs: "aria-label křížku. Výchozí ze slovníku IngotProvider.",
        en: "aria-label of the close button. Defaults to the IngotProvider dictionary.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid pruhu; žárovka dostane `${testId}-bulb`, křížek `${testId}-dismiss`.",
        en: "data-testid of the strip; the bulb gets `${testId}-bulb`, the close button `${testId}-dismiss`.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Žárovka je obyčejné tlačítko s popisným <IngotCode>aria-label</IngotCode> —
        jednorázová akce, ne přepínač, takže žádné <IngotCode>aria-pressed</IngotCode>.
      </>,
      <>
        Pruh umístěte v pořadí čtení PŘED obsah, o kterém mluví — odečítač ho má potkat
        dřív než obrazovku samotnou.
      </>,
      <>
        Vypnutá nápověda nekreslí nic, takže nemění rozvržení ani pořadí fokusu. Při
        omezení pohybu se probliknutí vypne a po dobu zvýraznění zůstane statický
        rámeček.
      </>,
    ],
    en: [
      <>
        The bulb is a plain button with a descriptive <IngotCode>aria-label</IngotCode>{" "}
        — a one-shot action, not a toggle, so no <IngotCode>aria-pressed</IngotCode>.
      </>,
      <>
        Place the strip BEFORE the content it talks about in reading order — a screen
        reader should meet it before the screen itself.
      </>,
      <>
        A switched-off hint renders nothing, so it changes neither layout nor focus
        order. Under reduced motion the flash is disabled and a static outline stays for
        the duration of the highlight.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> a <IngotCode>children</IngotCode> dodává volající
        už přeložené — Ingot překlady nemá.
      </>,
      <>
        <IngotCode>bulbLabel</IngotCode> a <IngotCode>dismissLabel</IngotCode> mají
        výchozí hodnotu ze slovníku <IngotCode>IngotProvider</IngotCode> (bez providera
        anglicky); vlastní prop ji přebíjí.
      </>,
    ],
    en: [
      <>
        <IngotCode>title</IngotCode> and <IngotCode>children</IngotCode> arrive from the
        caller already translated — the Ingot has no translations of its own.
      </>,
      <>
        <IngotCode>bulbLabel</IngotCode> and <IngotCode>dismissLabel</IngotCode> default
        to the <IngotCode>IngotProvider</IngotCode> dictionary (English without a
        provider); an explicit prop overrides them.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Komponenta podle <IngotCode>level</IngotCode> sama nefiltruje — jen ho propíše
        do <IngotCode>data-hint-level</IngotCode>. Dokud neexistují režimy slovníku,
        chová se každý uživatel jako <IngotCode>both</IngotCode>; filtr je věc
        volajícího.
      </>,
      <>
        Skrytí ani viditelnost si komponenta nepamatuje — obojí drží účet uživatele u
        volajícího.
      </>,
    ],
    en: [
      <>
        The component does not filter by <IngotCode>level</IngotCode> itself — it only
        writes it to <IngotCode>data-hint-level</IngotCode>. Until dictionary modes
        exist, every user behaves as <IngotCode>both</IngotCode>; filtering is the
        caller's job.
      </>,
      <>
        The component remembers neither the dismissal nor the visibility — both live on
        the user's account at the caller.
      </>,
    ],
  },
};

export default body;
