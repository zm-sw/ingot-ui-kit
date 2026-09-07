import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Krátký formulář, který se vejde na obrazovku. Přilepená lišta pod ním je rám
        kolem tlačítka, které bylo vidět celou dobu.
      </>,
      <>
        Akce nad seznamem — filtry, hromadné operace, „Nový záznam“. To je{" "}
        <IngotCode>IngotToolbar</IngotCode> a stojí nad daty, ne pod nimi.
      </>,
      <>
        Potvrzení v modálním okně. To má vlastní patičku a vlastní pravidla fokusu —{" "}
        <IngotCode>IngotModal</IngotCode>, <IngotCode>IngotConfirm</IngotCode>.
      </>,
    ],
    en: [
      <>
        A short form that fits on the screen. A sticky bar under it is a frame around a
        button that was visible the whole time.
      </>,
      <>
        Actions above a list — filters, bulk operations, "New record". That is{" "}
        <IngotCode>IngotToolbar</IngotCode> and it stands above the data, not below it.
      </>,
      <>
        A confirmation in a dialog. That has its own footer and its own focus rules —{" "}
        <IngotCode>IngotModal</IngotCode>, <IngotCode>IngotConfirm</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "primary",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Akce, kvůli které obrazovka je. Vpravo, kde skončí ruka po posledním poli.",
        en: "The action the screen exists for. On the right, where the hand ends up after the last field.",
      },
    },
    {
      name: "secondary",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Zrušit, zpět, „uložit jako koncept“. Vlevo, daleko od primární — dvě akce vedle sebe se zmáčknou špatně.",
        en: 'Cancel, back, "save as draft". On the left, away from the primary — two actions side by side get pressed wrong.',
      },
    },
    {
      name: "status",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Jedna krátká věta vedle akcí („Neuložené změny“, „Uloženo“), už přeložená. Kit neví, jestli se něco změnilo.",
        en: 'One short line beside the actions ("Unsaved changes", "Saved"), already translated. The kit does not know whether anything changed.',
      },
    },
    {
      name: "dirty",
      type: "boolean",
      required: false,
      note: {
        cs: "Jsou neuložené změny. Kreslí tečku před `status`, aby stav nenesla jen slova — kdo přebíhá očima, uvidí značku dřív, než větu přečte.",
        en: "There are unsaved changes. Draws a dot before `status`, so the state is not carried by wording alone — a reader skimming sees the mark before they read the sentence.",
      },
    },
    {
      name: "onSave",
      type: "() => void",
      required: false,
      note: {
        cs: "Ctrl/Cmd+S uloží. Vypnuté, dokud si o to obrazovka neřekne: zkratka patří obrazovce, která JE formulář, a pod seznamem by ukradla prohlížeči Uložit čtenáři, který chtěl stránku.",
        en: "Ctrl/Cmd+S saves. Off unless the screen asks for it: the shortcut belongs to a screen that IS a form, and under a list it would steal the browser's Save from a reader who wanted the page.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen umístění. Vzhled lišty se nemění.",
        en: "Placement only. The bar's look does not change.",
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
        Lišta nezakrývá nic, protože je <IngotCode>sticky</IngotCode>, ne{" "}
        <IngotCode>fixed</IngotCode>: zůstává v toku dokumentu, takže si na konci obsahu
        vezme vlastní výšku a při rolování jede po spodní hraně. Plovoucí lišta by
        potřebovala změřit svou výšku, přidat ji kontejneru jako odsazení a hlídat
        `resize` — tři věci, z nichž jedna je vždycky špatně na obrazovce, kterou nikdo
        nezkoušel.
      </>,
      <>
        Stav nenese jen barva: tečka je dekorace (<IngotCode>aria-hidden</IngotCode>) a
        to, co znamená, stojí vedle ní slovem. Odečítač přečte větu, ne „tečka“.
      </>,
      <>
        Lišta si nebere fokus a nemá past. Je to poslední blok obsahu, takže ji
        klávesnice potká na konci — tam, kde ji potká i oko.
      </>,
    ],
    en: [
      <>
        The bar covers nothing because it is <IngotCode>sticky</IngotCode>, not{" "}
        <IngotCode>fixed</IngotCode>: it stays in the document's flow, so it takes its
        own height at the end of the content and rides the bottom edge while there is
        more to scroll. A floating bar would need its height measured, that height added
        to the container as padding, and a watch on `resize` — three things, one of
        which is always wrong on the screen nobody tested.
      </>,
      <>
        The state is not carried by colour: the dot is decoration (
        <IngotCode>aria-hidden</IngotCode>) and what it means stands beside it in words.
        A screen reader reads the sentence, not "dot".
      </>,
      <>
        The bar takes no focus and traps none. It is the last block of the content, so
        the keyboard meets it at the end — where the eye meets it too.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>status</IngotCode> i obě akce dodává volající už přeložené — kit
        vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Lišta se láme do dvou řádků, když se akce a stav vedle sebe nevejdou. Delší
        překlad tedy nic neuřízne; jen si vezme o řádek víc.
      </>,
    ],
    en: [
      <>
        <IngotCode>status</IngotCode> and both actions arrive from the caller already
        translated — the kit has no i18n namespace of its own.
      </>,
      <>
        The bar wraps to two lines when the actions and the status do not fit beside
        each other. A longer translation therefore cuts nothing off; it takes one more
        line.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Lišta nehlídá odchod ze stránky s neuloženými změnami. To je věc routeru
        aplikace, ne pruhu na jejím konci — a varování, které kit vyvolá sám, by
        vyskočilo i tam, kde má aplikace vlastní.
      </>,
      <>
        Esc nedělá nic. Zrušení dlouhého formuláře je rozhodnutí, ne úhoz: Esc zavírá
        věci, které někdo právě otevřel, a tohle není jedna z nich.
      </>,
    ],
    en: [
      <>
        The bar does not guard against leaving the page with unsaved changes. That
        belongs to the application's router, not to a strip at the end of it — and a
        warning the kit raised by itself would fire where the application already has
        its own.
      </>,
      <>
        Esc does nothing. Abandoning a long form is a decision, not a keystroke: Esc
        closes things somebody has just opened, and this is not one of them.
      </>,
    ],
  },
};

export default body;
