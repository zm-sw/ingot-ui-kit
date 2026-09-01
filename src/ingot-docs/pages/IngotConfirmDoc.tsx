import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotConfirmDemo";
import demoSource from "@/ingot-docs/demos/IngotConfirmDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotConfirmDoc: IngotDocPage = {
  name: "IngotConfirm",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Potvrzovací dialog nad IngotModal. Spočítaný dopad smí přes useConfirmVeto potvrzení odvolat.",
    en: "Confirmation dialog built on IngotModal. The computed impact may withdraw the confirmation through useConfirmVeto.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Krok je destruktivní nebo nevratný a operátor si ho má přečíst, ne
        odklepnout.
      </>,
      <>
        K rozhodnutí patří spočítaný dopad („smaže se 12 objednávek“). Jde do
        slotu <IngotCode>impact</IngotCode>, takže se počítá až ve chvíli, kdy je dialog
        otevřený.
      </>,
      <>
        Dopad může krok zakázat: <IngotCode>useConfirmVeto</IngotCode> uvnitř{" "}
        <IngotCode>impact</IngotCode> potvrzovací tlačítko odstraní.
      </>,
    ],
    en: [
      <>
        The step is destructive or irreversible and the operator is meant to
        read it, not click through it.
      </>,
      <>
        The decision needs a computed impact ("12 orders will be deleted").
        That goes into the <IngotCode>impact</IngotCode> slot, so it is computed only
        once the dialog is open.
      </>,
      <>
        The impact may forbid the step: <IngotCode>useConfirmVeto</IngotCode> inside{" "}
        <IngotCode>impact</IngotCode> removes the confirm button.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Dialog má obsahovat formulář nebo víc než jedno rozhodnutí. Použij{" "}
        <IngotCode>IngotModal</IngotCode> přímo.
      </>,
      <>
        Krok je vratný a levný. Potvrzení, které se odklepává mechanicky,
        chrání jen zdánlivě — a učí operátora klikat naslepo i tam, kde by
        neměl.
      </>,
    ],
    en: [
      <>
        The dialog should hold a form or more than one decision. Use{" "}
        <IngotCode>IngotModal</IngotCode> directly.
      </>,
      <>
        The step is reversible and cheap. A confirmation that gets clicked
        through mechanically only looks like protection — and it teaches the
        operator to click blindly where it does matter.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "string",
      required: true,
      note: {
        cs: "Krátký titulek, na který ukazuje aria-labelledby.",
        en: "Short title that aria-labelledby points at.",
      },
    },
    {
      name: "description",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Co se stane, když uživatel potvrdí.",
        en: "What happens if the user confirms.",
      },
    },
    {
      name: "confirmLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložené sloveso potvrzení.",
        en: "Translated verb for the confirming action.",
      },
    },
    {
      name: "cancelLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený popisek zrušení.",
        en: "Translated label for cancelling.",
      },
    },
    {
      name: "closeLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label křížku v hlavičce.",
        en: "Translated aria-label of the close icon in the header.",
      },
    },
    {
      name: "onConfirm",
      type: "() => void",
      required: true,
      note: { cs: "Potvrzovací akce.", en: "The confirming action." },
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      note: {
        cs: "Zrušit · ESC · křížek · kliknutí do pozadí.",
        en: "Cancel · ESC · close icon · backdrop click.",
      },
    },
    {
      name: "busy",
      type: "boolean",
      required: false,
      note: {
        cs: "Zamkne obě tlačítka, dokud mutace běží.",
        en: "Locks both buttons while the mutation is in flight.",
      },
    },
    {
      name: "impact",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Spočítaný dopad; smí potvrzení odvolat přes useConfirmVeto.",
        en: "The computed impact; may withdraw the confirmation via useConfirmVeto.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Tlačítka dostanou `${testId}-confirm` / `-cancel`.",
        en: "The buttons get `${testId}-confirm` / `-cancel`.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Celou laťku dědí z <IngotCode>IngotModal</IngotCode>: focus trap, ESC,{" "}
        <IngotCode>aria-modal</IngotCode> i návrat fokusu na spouštěč.
      </>,
      <>
        Vetovaný krok tlačítko <strong>nenabídne vůbec</strong>. Zašedlé
        „Smazat trvale“ vedle důvodu čte operátor jako „ještě chvíli“.
      </>,
      <>
        Důvod veta je <IngotCode>role=&quot;alert&quot;</IngotCode>, takže ho odečítač
        ohlásí ve chvíli, kdy se objeví.
      </>,
      <>
        Obě tlačítka jedou přes sdílený <IngotCode>Button</IngotCode> (
        <IngotCode>danger</IngotCode> a <IngotCode>secondary</IngotCode>), ne přes opsané třídy.
        Varianta <IngotCode>danger</IngotCode> nese v tmavém režimu výjimku, bez které
        by bílý text na zesvětleném podkladu klesl pod kontrastní minimum
        WCAG AA.
      </>,
    ],
    en: [
      <>
        It inherits the whole floor from <IngotCode>IngotModal</IngotCode>: focus trap,
        ESC, <IngotCode>aria-modal</IngotCode> and focus returned to the trigger.
      </>,
      <>
        A vetoed step does <strong>not offer the button at all</strong>. A
        greyed-out "Delete permanently" next to the reason reads to the
        operator as "not just yet".
      </>,
      <>
        The veto reason is <IngotCode>role=&quot;alert&quot;</IngotCode>, so a screen
        reader announces it the moment it appears.
      </>,
      <>
        Both buttons go through the shared <IngotCode>Button</IngotCode> (
        <IngotCode>danger</IngotCode> and <IngotCode>secondary</IngotCode>), not through copied
        classes. The <IngotCode>danger</IngotCode> variant carries a dark-mode
        exception without which white text on the lightened surface would
        fall below the WCAG AA contrast minimum.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>confirmLabel</IngotCode>, <IngotCode>cancelLabel</IngotCode> a{" "}
        <IngotCode>closeLabel</IngotCode> — všechna tři povinná a všechna už přeložená.
      </>,
      <>
        <IngotCode>title</IngotCode>, <IngotCode>description</IngotCode> a obsah slotu{" "}
        <IngotCode>impact</IngotCode> dodává volající.
      </>,
    ],
    en: [
      <>
        <IngotCode>confirmLabel</IngotCode>, <IngotCode>cancelLabel</IngotCode> and{" "}
        <IngotCode>closeLabel</IngotCode> — all three required, all three already
        translated.
      </>,
      <>
        <IngotCode>title</IngotCode>, <IngotCode>description</IngotCode> and the contents of the{" "}
        <IngotCode>impact</IngotCode> slot come from the caller.
      </>,
    ],
  },
};
