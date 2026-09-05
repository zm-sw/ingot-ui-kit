import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotDrawerDemo";
import demoSource from "@/ingot-docs/demos/IngotDrawerDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotDrawerDoc: IngotDocPage = {
  name: "IngotDrawer",
  status: "beta",
  // 1.1 — header markup shared with IngotModal (internal OverlayHeader); no visible change.
  // 1.2 — close button is the kit's shared icon button (28px, rounded, hover surface).
  // 1.3 (KAN-849) — the panel slides in from its own edge, from the kit's motion tokens; motion-reduce turns the movement off.
  version: "1.3",
  tag: ".drawer",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--accent-bg",
    "--r-sm",
    "--shadow-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Šířku řídí `width` s tvrdým stropem ze specifikace, hranu `side`.",
    en: "Does not take `className`. `width` drives the width with the spec's hard cap, `side` the edge.",
  },
  summary: {
    cs: "Boční panel pro editaci se stejnou a11y laťkou jako dialog: focus trap, ESC, scroll lock a návrat fokusu na spouštěč.",
    en: "A side panel for editing with the same accessibility floor as the dialog: focus trap, ESC, scroll lock and focus returned to the trigger.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Editace, u které operátor potřebuje vidět seznam za ní — panel překryje jen část
        obrazovky.
      </>,
      <>
        Rychlá úprava několika polí, u které se dál pracuje se seznamem. Delší editace s
        vysvětlováním patří do <IngotCode>IngotModal</IngotCode> — tam je místo i
        soustředění.
      </>,
      <>
        Úprava záznamu z řádku tabulky: drawer se otevře vedle, kontext řádku zůstává na
        očích.
      </>,
    ],
    en: [
      <>
        Editing where the operator needs to keep seeing the list behind it — the panel
        covers only part of the screen.
      </>,
      <>
        A quick edit of a few fields while the list stays in play. A longer edit that
        needs explaining belongs in <IngotCode>IngotModal</IngotCode> — that is where
        the room and the focus are.
      </>,
      <>
        Editing a record from a table row: the drawer opens beside it and the row's
        context stays in sight.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Obsah je delší než zhruba dvě obrazovky. Pak je to samostatná stránka, ne boční
        panel.
      </>,
      <>
        Jde o rozhodnutí, které musí padnout hned („potvrď / zruš“) — na to je{" "}
        <IngotCode>IngotModal</IngotCode>, případně <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        Nad otevřeným drawerem nikdy neotvírej další překryv. Jeden překryv v jednu
        chvíli; výsledek akce ohlas toastem.
      </>,
    ],
    en: [
      <>
        The content runs longer than roughly two screens. Then it is a page of its own,
        not a side panel.
      </>,
      <>
        The user must decide right now ("confirm / cancel") — that is{" "}
        <IngotCode>IngotModal</IngotCode>, or <IngotCode>IngotConfirm</IngotCode>.
      </>,
      <>
        Never open another overlay on top of an open drawer. One overlay at a time;
        announce the result of an action with a toast.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Vykreslí se do nadpisu h2, na který ukazuje aria-labelledby.",
        en: "Rendered into the h2 heading that aria-labelledby points at.",
      },
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      note: {
        cs: "Volá ESC, zavírací tlačítko a při dismissable i klik do pozadí.",
        en: "Called by ESC, the close button and — with dismissable — a backdrop click.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Tělo panelu. Scroluje samo; hlavička a patka zůstávají na místě.",
        en: "The panel body. It scrolls on its own; the header and footer stay put.",
      },
    },
    {
      name: "closeLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label křížku — Ingot překlady nemá.",
        en: "Translated aria-label for the close icon — the Ingot has no translations of its own.",
      },
    },
    {
      name: "subtitle",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Kontext editovaného záznamu pod titulkem; nese aria-describedby.",
        en: "Context of the edited record under the title; carried by aria-describedby.",
      },
    },
    {
      name: "footer",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Lišta akcí. Je vždy viditelná — netlačí se pod scroll těla.",
        en: "The action bar. Always visible — it never scrolls out with the body.",
      },
    },
    {
      name: "side",
      type: '"right" | "left"',
      required: false,
      note: {
        cs: "Ze které strany panel vyjíždí. Výchozí right.",
        en: "Which side the panel slides from. Defaults to right.",
      },
    },
    {
      name: "width",
      type: "number",
      required: false,
      note: {
        cs: "Šířka panelu v px. Výchozí 400, tvrdý strop 560.",
        en: "Panel width in px. Defaults to 400, hard cap at 560.",
      },
    },
    {
      name: "dismissable",
      type: "boolean",
      required: false,
      note: {
        cs: "Jestli klik do pozadí zavírá (výchozí ano). U rozepsaného formuláře vypnout.",
        en: "Whether a backdrop click closes (default yes). Turn it off for a form in progress.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid overlaye; panel dostane `${testId}-panel`.",
        en: "data-testid of the overlay; the panel gets `${testId}-panel`.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Stejná laťka jako u dialogu: <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
        <IngotCode>aria-modal=&quot;true&quot;</IngotCode> a{" "}
        <IngotCode>aria-labelledby</IngotCode> mířící na titulek.
      </>,
      <>
        Focus trap na Tab i Shift+Tab, ESC zavírá vždy (i při{" "}
        <IngotCode>dismissable=&#123;false&#125;</IngotCode>) a po zavření se fokus
        vrací na spouštěč.
      </>,
      <>
        Scroll lock pozadí sdílí čítač s dialogem: drawer otevřený nad dialogem (nebo
        obráceně) ho při zavření neuvolní předčasně.
      </>,
      <>
        Patka s akcemi je vždy viditelná — „Uložit“ se nikdy neschová pod scroll těla.
      </>,
    ],
    en: [
      <>
        The same floor as the dialog: <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
        <IngotCode>aria-modal=&quot;true&quot;</IngotCode> and{" "}
        <IngotCode>aria-labelledby</IngotCode> pointing at the title.
      </>,
      <>
        A focus trap on both Tab and Shift+Tab, ESC always closes (even with{" "}
        <IngotCode>dismissable=&#123;false&#125;</IngotCode>) and on close the focus
        returns to the trigger.
      </>,
      <>
        The background scroll lock shares its counter with the dialog: a drawer open
        above a dialog (or the other way round) does not release it early on close.
      </>,
      <>
        The action footer is always visible — "Save" never hides below the body's
        scroll.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>closeLabel</IngotCode> je povinný. Je to{" "}
        <IngotCode>aria-label</IngotCode> křížku a bez něj by ho odečítač přečetl jako
        „button“.
      </>,
      <>
        <IngotCode>title</IngotCode>, <IngotCode>subtitle</IngotCode> a obsah dodává
        volající už přeložené.
      </>,
    ],
    en: [
      <>
        <IngotCode>closeLabel</IngotCode> is required. It is the{" "}
        <IngotCode>aria-label</IngotCode> of the close icon, and without it a screen
        reader announces just "button".
      </>,
      <>
        <IngotCode>title</IngotCode>, <IngotCode>subtitle</IngotCode> and the content
        arrive from the caller already translated.
      </>,
    ],
  },
};
