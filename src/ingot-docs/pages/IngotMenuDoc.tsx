import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-847. Stands on IngotPopover and adds what the menu ROLES promise:
// arrows walk, Tab leaves, type-ahead finds, a disabled item stays.
const demo = () =>
  import("@/ingot-docs/demos/IngotMenuDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMenuDemo?raw");

export const IngotMenuDoc: IngotDocPage = {
  name: "IngotMenu",
  status: "beta",
  version: "1.0",
  tag: ".menu",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--danger",
    "--danger-bg",
    "--r-lg",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — typicky šířku menu. Řádky, tóny a mezery drží primitivum.",
    en: "Takes `className`, but for layout only — typically the menu's width. The rows, tones and spacing stay with the primitive.",
  },
  summary: {
    cs: "Seznam akcí v popoveru: role menu, šipky, Home/End, psaní podle prvních písmen, oddělovače a tón danger.",
    en: "A list of actions in a popover: the menu roles, arrows, Home/End, type-ahead, separators and the danger tone.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Akcí je víc, než se vejde do řádku — víc než tři řádkové akce patří do menu, ne
        vedle sebe.
      </>,
      <>
        Akce patří k jednomu záznamu nebo k jedné obrazovce a mají se nabídnout naráz,
        aby šly porovnat.
      </>,
      <>
        Mezi nimi je jedna nevratná: dostane <IngotCode>tone</IngotCode> danger a
        oddělovač nad sebou, aby se do ní nekliklo omylem.
      </>,
    ],
    en: [
      <>
        There are more actions than fit in a row — more than three row actions belong in
        a menu, not side by side.
      </>,
      <>
        The actions belong to one record or one screen and should be offered together,
        so they can be compared.
      </>,
      <>
        One of them is irreversible: it gets the danger <IngotCode>tone</IngotCode> and
        a separator above it, so nobody clicks it by accident.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Vybírá se HODNOTA, ne akce — to je <IngotCode>IngotSelect</IngotCode> nebo{" "}
        <IngotCode>IngotSegmented</IngotCode>. Menu spouští, nevybírá.
      </>,
      <>
        Navigace mezi sekcemi aplikace — to je <IngotCode>IngotMegaMenu</IngotCode> v
        horní liště.
      </>,
      <>
        Dvě tři akce, které se vejdou vedle sebe. Menu, které se musí otevřít, aby
        ukázalo dvě položky, je krok navíc.
      </>,
    ],
    en: [
      <>
        A VALUE is being chosen, not an action — that is{" "}
        <IngotCode>IngotSelect</IngotCode> or <IngotCode>IngotSegmented</IngotCode>. A
        menu triggers, it does not select.
      </>,
      <>
        Navigation between the application's sections — that is{" "}
        <IngotCode>IngotMegaMenu</IngotCode> in the top bar.
      </>,
      <>
        Two or three actions that fit side by side. A menu that has to be opened to show
        two items is one step too many.
      </>,
    ],
  },
  props: [
    {
      name: "open",
      type: "boolean",
      required: true,
      note: {
        cs: "Řízené, stejně jako popover pod ním.",
        en: "Controlled, like the popover underneath.",
      },
    },
    {
      name: "anchorRef",
      type: "RefObject<HTMLElement | null>",
      required: true,
      note: {
        cs: "Tlačítko, které menu otevírá. Po výběru se na něj vrací fokus.",
        en: "The button that opens the menu. Focus returns to it after a selection.",
      },
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      note: {
        cs: "Volá výběr položky, Escape, Tab i klik mimo.",
        en: "Called by a selection, by Escape, by Tab and by a click outside.",
      },
    },
    {
      name: "items",
      type: "readonly IngotMenuItem[]",
      required: true,
      note: {
        cs: "Položky v pořadí, v jakém se čtou.",
        en: "The items in the order they are read.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložené jméno menu — to ohlásí odečítač po otevření.",
        en: "Translated name of the menu — what a screen reader announces on open.",
      },
    },
    {
      name: "placement",
      type: "IngotPlacement",
      required: false,
      note: {
        cs: "Výchozí bottom-end: menu obvykle visí u pravého kraje svého tlačítka.",
        en: "Defaults to bottom-end: a menu usually hangs from the right edge of its button.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení — typicky šířka.",
        en: "Layout only — typically the width.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  extraProps: [
    {
      name: "IngotMenuItem",
      note: {
        cs: "Jedna položka menu — předává se v poli items.",
        en: "One menu item — passed in the items array.",
      },
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený popisek začínající slovesem: „Smazat objednávku“, ne „Koš“.",
            en: "Translated label starting with a verb: “Delete order”, not “Bin”.",
          },
        },
        {
          name: "onSelect",
          type: "() => void",
          required: true,
          note: {
            cs: "Akce. Menu se po ní zavře samo a vrátí fokus na tlačítko.",
            en: "The action. The menu closes itself afterwards and returns focus to the button.",
          },
        },
        {
          name: "icon",
          type: "IngotIconName",
          required: false,
          note: {
            cs: "Ikona před popiskem. Dekorace, ne jméno.",
            en: "An icon before the label. Decoration, not a name.",
          },
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          note: {
            cs: "Zůstane vidět a nese aria-disabled — skrytá položka by přerovnala menu.",
            en: "Stays visible and carries aria-disabled — hiding it would reshuffle the menu.",
          },
        },
        {
          name: "tone",
          type: '"default" | "danger"',
          required: false,
          note: {
            cs: "Nevratná akce. Potvrzení dělá IngotConfirm u volajícího.",
            en: "An irreversible action. The confirmation is IngotConfirm at the caller.",
          },
        },
        {
          name: "separatorBefore",
          type: "boolean",
          required: false,
          note: {
            cs: "Čára nad položkou — hranice skupiny, ne ozdoba.",
            en: "A rule above the item — a group boundary, not decoration.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>role=&quot;menu&quot;</IngotCode> a{" "}
        <IngotCode>role=&quot;menuitem&quot;</IngotCode>; tlačítko, které menu otevírá,
        nese <IngotCode>aria-haspopup</IngotCode> a <IngotCode>aria-expanded</IngotCode>
        .
      </>,
      <>
        Fokus vstoupí do menu po otevření. Šipky procházejí položky, Home a End skáčou
        na kraje, psaní hledá podle prvních písmen.
      </>,
      <>
        <strong>Tab menu opouští, neroluje v něm.</strong> Menu je jedna zastávka na
        cestě stránkou — tak to říká ARIA a jen tak z něj uživatel klávesnice odejde bez
        triku.
      </>,
      <>
        Vypnutá položka zůstává vidět a hlásí se jako nedostupná. Zmizet by znamenalo
        přerovnat menu pod rukama.
      </>,
    ],
    en: [
      <>
        <IngotCode>role=&quot;menu&quot;</IngotCode> and{" "}
        <IngotCode>role=&quot;menuitem&quot;</IngotCode>; the button that opens it
        carries <IngotCode>aria-haspopup</IngotCode> and{" "}
        <IngotCode>aria-expanded</IngotCode>.
      </>,
      <>
        Focus enters the menu on open. Arrows walk the items, Home and End jump to the
        ends, typing finds by the first letters.
      </>,
      <>
        <strong>Tab leaves the menu, it does not cycle inside.</strong> A menu is one
        stop on the way through the page — that is what ARIA says, and the only version
        a keyboard user escapes without a trick.
      </>,
      <>
        A disabled item stays visible and announces itself as unavailable. Disappearing
        would reshuffle the menu under the reader's hands.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> menu i popisky položek dodává volající přeložené.
      </>,
    ],
    en: [
      <>
        The menu's <IngotCode>label</IngotCode> and the items' labels arrive translated
        from the caller.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Bez vnořených podmenu a bez zaškrtávacích položek. Obojí je vlastní vzor s
        vlastními pravidly klávesnice; přijde, až si o něj obrazovka řekne.
      </>,
    ],
    en: [
      <>
        No nested submenus and no checkable items. Both are patterns of their own with
        their own keyboard rules; they arrive when a screen asks for them.
      </>,
    ],
  },
};
