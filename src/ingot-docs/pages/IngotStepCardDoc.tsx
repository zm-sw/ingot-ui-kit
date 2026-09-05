import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotStepCardDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotStepCardDemo?raw");

export const IngotStepCardDoc: IngotDocPage = {
  name: "IngotStepCard",
  status: "beta",
  // 1.2 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.3 — collapse toggle is the kit's shared icon button.
  version: "1.3",
  tag: ".stepcard",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--border-strong",
    "--ink",
    "--ink-3",
    "--ok",
    "--ok-bg",
    "--ok-border",
    "--font-mono",
    "--r-md",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Karta jednoho kroku vícekrokového nastavení. Nese svůj stav natrvalo — hotový krok zůstane hotový a je vidět i po návratu na obrazovku.",
    en: "A card for one step of a multi-step setup. It carries its state permanently — a finished step stays finished and is still visible when you come back to the screen.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nastavení, které se nedělá jedním dlouhým formulářem, ale kroky. Jednotlivé
        kroky se dokončují v různé dny a různými lidmi, takže každý z nich potřebuje
        vlastní rám a vlastní stav.
      </>,
      <>
        Krok, jehož obsahem je seznam nebo vnořená tabulka toho, co v něm vzniklo — země
        a měny, skupiny vlastností. Do těla karty patří právě tenhle výčet, ne pole
        formuláře jedno pod druhým.
      </>,
      <>
        Přehled, ve kterém má být na první pohled vidět, co už je hotové. Hotový krok má
        zelené záhlaví a fajfku místo čísla, takže se stav čte z odstupu.
      </>,
      <>
        Krok, do kterého se průběžně přidávají další položky. Na to je patička — jedna
        akce typu „Přidat…“ pod obsahem karty.
      </>,
      <>
        Nastavení o mnoha krocích, kde by hotové kroky odsunuly ten rozdělaný pod okraj
        obrazovky. <IngotCode>collapsible</IngotCode> nechá z hotového kroku jen
        záhlaví, takže přehled zůstane přehled.
      </>,
    ],
    en: [
      <>
        A setup that is not done through one long form but in steps. Individual steps
        get finished on different days by different people, so each one needs its own
        frame and its own state.
      </>,
      <>
        A step whose content is a list or a nested table of what it produced — countries
        and currencies, attribute groups. That listing is what belongs in the card body,
        not form fields stacked one below the other.
      </>,
      <>
        An overview where it must be obvious at a glance what is already done. A
        finished step has a green header and a check mark instead of the number, so the
        state reads from a distance.
      </>,
      <>
        A step that keeps gathering more items over time. That is what the footer is for
        — a single “Add…” action below the card content.
      </>,
      <>
        A setup with many steps, where the finished ones would push the unfinished one
        below the fold. <IngotCode>collapsible</IngotCode> leaves a finished step as
        just its header, so the overview stays an overview.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Krok, který se potvrzuje tlačítkem. Krok je hotový tehdy, když má, co potřebuje
        — tlačítko „Hotovo“ v patičce by zavedlo druhý stav, který s obsahem karty
        nesouvisí.
      </>,
      <>
        Průvodce, který ukazuje jen jednu obrazovku po druhé a předchozí krok zahodí.
        Tahle karta stojí na tom, že všechny kroky zůstávají vidět vedle sebe.
      </>,
      <>
        Obyčejné seskupení obsahu bez pořadí a bez stavu. Očíslované záhlaví a fajfka
        tam slibují postup, který ve skutečnosti neexistuje.
      </>,
      <>
        Zvýraznění chyby nebo varování. Karta zná jediný stav — hotovo, nebo ne; červené
        a oranžové hlášky patří dovnitř obsahu.
      </>,
    ],
    en: [
      <>
        A step that gets confirmed with a button. A step is done when it has what it
        needs — a “Done” button in the footer would introduce a second state unrelated
        to the card's content.
      </>,
      <>
        A wizard that shows one screen at a time and discards the previous step. This
        card is built on all the steps staying visible side by side.
      </>,
      <>
        Plain grouping of content with no ordering and no state. A numbered header and a
        check mark promise progress that does not actually exist there.
      </>,
      <>
        Highlighting an error or a warning. The card knows a single state — done or not;
        red and amber messages belong inside the content.
      </>,
    ],
  },
  props: [
    {
      name: "step",
      type: "string",
      required: true,
      note: {
        cs: "Pořadí kroku, dvojmístně („02“). Hotový krok ho nahradí fajfkou.",
        en: "The step number, two digits (“02”). A finished step replaces it with a check mark.",
      },
    },
    {
      name: "kicker",
      type: "string",
      required: true,
      note: {
        cs: "Řádek nad nadpisem — mono verzálky, typicky „Krok 02“.",
        en: "The line above the title — mono uppercase, typically “Step 02”.",
      },
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Nadpis kroku. Co se v kroku nastavuje, ne co má uživatel udělat.",
        en: "The step title. What the step configures, not what the user should do.",
      },
    },
    {
      name: "meta",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Shrnutí za nadpisem — počet položek, jednotka („2 / 2 aktivní“). U sbalitelné karty je to jediné, co ze sbaleného kroku zbude.",
        en: "A summary after the title — item count, unit (“2 / 2 active”). On a collapsible card it is the only thing a collapsed step leaves behind.",
      },
    },
    {
      name: "done",
      type: "boolean",
      required: false,
      note: {
        cs: "Hotový krok. Přebarví záhlaví a vymění číslo za fajfku.",
        en: "A finished step. Recolors the header and swaps the number for a check mark.",
      },
    },
    {
      name: "doneLabel",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený popisek stavu pro odečítač („Hotovo“). Bez něj je fajfka němá.",
        en: "A translated status label for screen readers (“Done”). Without it the check mark is silent.",
      },
    },
    {
      name: "collapsible",
      type: "boolean",
      required: false,
      note: {
        cs: "Přidá do záhlaví sbalovací tlačítko. Hotové kroky se sbalují samy — i ten, který se dokončí až na obrazovce.",
        en: "Adds a collapse button to the header. Finished steps collapse on their own — including one that gets finished while you watch.",
      },
    },
    {
      name: "toggleLabel",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený popisek sbalovacího tlačítka („Sbalit krok“). Bez něj je tlačítko pro odečítač bezejmenné.",
        en: "A translated label for the collapse button (“Collapse step”). Without it the button is nameless to a screen reader.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Tělo karty — typicky vnořená tabulka nebo seznam toho, co krok obsahuje.",
        en: "The card body — typically a nested table or a list of what the step contains.",
      },
    },
    {
      name: "footer",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Patička pro přidání další položky, ne pro potvrzení kroku.",
        en: "A footer for adding another item, not for confirming the step.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Značka pro testy na kořeni karty.",
        en: "A test hook on the card root.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Hotový krok je poznat <strong>tvarem</strong>, ne jen barvou: zelené záhlaví
        doprovází fajfka místo čísla. Kdo barvu nerozliší, čte tvar — a tenhle stav je
        jediná informace, kvůli které se člověk na obrazovku vrací.
      </>,
      <>
        Fajfka nese popisek z <IngotCode>doneLabel</IngotCode>. Vynechat ho znamená, že
        odečítač ohlásí kartu bez toho jediného, co ji odlišuje od rozdělané.
      </>,
      <>
        Kicker je mono verzálkami jen opticky — text předávej normálně psaný. Verzálky
        napsané ručně čte odečítač po písmenech.
      </>,
      <>
        Patička obsahuje jednu akci. Víc tlačítek v ní udělá z jednoznačného „přidej
        další položku“ hádanku, kterou u kroku bez potvrzení nemá co rozhodovat.
      </>,
      <>
        Sbalovací tlačítko hlásí stav přes <IngotCode>aria-expanded</IngotCode> a přes{" "}
        <IngotCode>aria-controls</IngotCode> ukazuje na tělo kroku, takže odečítač
        nabídne skok přesně na to, co tlačítko odkrylo. Popisek dodává{" "}
        <IngotCode>toggleLabel</IngotCode> — chevron sám je němý.
      </>,
      <>
        Sbalené tělo zůstává v dokumentu a schová ho <IngotCode>hidden</IngotCode>.
        Odstranit ho z DOM by rozbilo <IngotCode>aria-controls</IngotCode>, které by pak
        mířilo do prázdna — a hledání na stránce by sbalený krok přestalo najít.
      </>,
    ],
    en: [
      <>
        A finished step is recognizable by <strong>shape</strong>, not color alone: the
        green header comes with a check mark instead of the number. Anyone who cannot
        tell the color apart reads the shape — and this state is the one piece of
        information people come back to the screen for.
      </>,
      <>
        The check mark carries the label from <IngotCode>doneLabel</IngotCode>. Leaving
        it out means a screen reader announces the card without the single thing that
        separates it from an unfinished one.
      </>,
      <>
        The kicker is mono uppercase only visually — pass the text written normally.
        Uppercase typed by hand gets read out letter by letter.
      </>,
      <>
        The footer holds one action. More buttons turn an unambiguous “add another item”
        into a puzzle, which a step with no confirmation has no business posing.
      </>,
      <>
        The collapse button reports its state through{" "}
        <IngotCode>aria-expanded</IngotCode> and points at the step body through{" "}
        <IngotCode>aria-controls</IngotCode>, so a screen reader can offer a jump to
        exactly what the button revealed. The label comes from{" "}
        <IngotCode>toggleLabel</IngotCode> — the chevron alone is silent.
      </>,
      <>
        A collapsed body stays in the document and is hidden by{" "}
        <IngotCode>hidden</IngotCode>. Removing it from the DOM would break{" "}
        <IngotCode>aria-controls</IngotCode>, which would then point at nothing — and
        find-on-page would stop finding a collapsed step.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Všechny popisky dodává volající přeložené — kit vlastní jmenný prostor překladů
        nemá. Týká se to i <IngotCode>doneLabel</IngotCode>, které se snadno zapomene,
        protože není vidět.
      </>,
      <>
        Číslo v <IngotCode>step</IngotCode> se nepřekládá, ale slovo v{" "}
        <IngotCode>kicker</IngotCode> ano. Drž ho na jednom slově a čísle — záhlaví má
        na kicker jeden řádek.
      </>,
      <>
        Nadpis a <IngotCode>meta</IngotCode> jsou na jednom řádku a v překladu oba
        rostou. Meta patří počet a jednotka, ne věta.
      </>,
      <>
        <IngotCode>toggleLabel</IngotCode> pojmenuj krokem („Sbalit krok Země a měny“),
        ne jen akcí. Na obrazovce je takových tlačítek tolik, kolik je kroků, a seznam
        pěti stejných „Sbalit“ odečítači nepomůže.
      </>,
    ],
    en: [
      <>
        All labels are passed in already translated — the kit has no translation
        namespace of its own. That includes <IngotCode>doneLabel</IngotCode>, which is
        easy to forget because it is not visible.
      </>,
      <>
        The number in <IngotCode>step</IngotCode> is not translated, but the word in{" "}
        <IngotCode>kicker</IngotCode> is. Keep it to one word and a number — the header
        gives the kicker a single line.
      </>,
      <>
        The title and <IngotCode>meta</IngotCode> share one line and both grow in
        translation. Meta is for a count and a unit, not a sentence.
      </>,
      <>
        Name <IngotCode>toggleLabel</IngotCode> after the step (“Collapse step Countries
        and currencies”), not just the action. A screen holds as many of these buttons
        as it has steps, and a list of five identical “Collapse” entries helps no screen
        reader.
      </>,
    ],
  },
};
