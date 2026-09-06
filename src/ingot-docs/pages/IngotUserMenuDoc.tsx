import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotUserMenuDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotUserMenuDemo?raw");

export const IngotUserMenuDoc: IngotDocPage = {
  name: "IngotUserMenu",
  status: "beta",
  version: "1.0",
  tag: ".usermenu",
  tokens: ["--surface", "--border", "--ink", "--ink-2", "--r-lg", "--shadow-lg"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Menu účtu — identita, organizace, předvolby, odhlášení. Primitivum drží strukturu, ne obsah: vrstvy oddělené linkou a řádek „popisek vlevo, ovládací prvek vpravo“.",
    en: "The account menu — identity, organisation, preferences, sign-out. The primitive holds the structure, not the content: layers separated by a rule, and a row of “label on the left, control on the right”.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Menu pod účtem v horní liště. Vrstva identity nahoře, organizace, předvolby a
        odhlášení dole — vždy v tomhle pořadí.
      </>,
      <>
        Předvolby, které patří člověku, ne obrazovce: motiv vzhledu, jazyk, slovník,
        nápověda na stránkách.
      </>,
      <>
        Přepnutí do organizace, pod kterou je člověk přihlášený. Je to odkaz na jiné
        místo produktu, ne volba nastavení.
      </>,
      <>
        Odhlášení. Patří do poslední vrstvy, oddělené linkou od všeho, co se jen
        přepíná.
      </>,
    ],
    en: [
      <>
        The menu under the account in the top bar. The identity layer on top, then the
        organisation, the preferences and sign-out at the bottom — always in that order.
      </>,
      <>
        Preferences that belong to the person, not to a screen: appearance theme,
        language, vocabulary, in-page help.
      </>,
      <>
        Switching into the organisation the person is signed in under. It is a link to
        another place in the product, not a settings choice.
      </>,
      <>
        Signing out. It belongs in the last layer, separated by a rule from everything
        that is merely toggled.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Nastavení, které má víc než jeden ovládací prvek na volbu. Menu má šířku jednoho
        sloupce; delší formulář patří na vlastní obrazovku.
      </>,
      <>
        Předvolby vázané na jednu obrazovku — filtry, řazení, hustota tabulky. Ty patří
        k té obrazovce, ne k účtu.
      </>,
      <>Nabídka akcí nad záznamem. Tohle je menu člověka, ne kontextové menu obsahu.</>,
      <>
        Snaha popsat, které předvolby má produkt mít. Kit zná tvar vrstev a řádků; co je
        uvnitř, ví aplikace.
      </>,
    ],
    en: [
      <>
        Settings that need more than one control per choice. The menu is one column
        wide; a longer form belongs on a screen of its own.
      </>,
      <>
        Preferences bound to a single screen — filters, sorting, table density. Those
        belong to that screen, not to the account.
      </>,
      <>
        A list of actions on a record. This is a person's menu, not a context menu for
        content.
      </>,
      <>
        Any attempt to prescribe which preferences the product should have. The kit
        knows the shape of the layers and rows; what goes inside them is the
        application's business.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Vrstvy menu, typicky IngotUserMenuSection. Pořadí vrstev určuje volající.",
        en: "The menu's layers, typically IngotUserMenuSection. The caller decides their order.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label menu. Skupina bez jména je pro odečítač bezejmenný blok.",
        en: "A translated aria-label for the menu. An unnamed group is just an anonymous block to a screen reader.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy. Do vzhledu nezasahuje.",
        en: "An anchor for tests. It does not affect the appearance.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotUserMenuSection",
      note: {
        cs: "Jedna vrstva menu, předává se jako potomek. Linku mezi vrstvami kreslí vrstva sama; poslední ji nemá.",
        en: "One layer of the menu, passed as a child. Each layer draws the rule between layers itself; the last one has none.",
      },
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Obsah vrstvy — údaje o účtu, odkaz na organizaci, řádky předvoleb nebo odhlášení.",
            en: "The layer's content — the account details, the organisation link, preference rows or sign-out.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva pro testy jedné vrstvy.",
            en: "An anchor for tests on a single layer.",
          },
        },
      ],
    },
    {
      name: "IngotUserMenuRow",
      note: {
        cs: "Řádek předvolby uvnitř vrstvy: popisek vlevo, ovládací prvek vpravo.",
        en: "A preference row inside a layer: the label on the left, the control on the right.",
      },
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Popisek předvolby, už přeložený.",
            en: "The preference's label, already translated.",
          },
        },
        {
          name: "controlId",
          type: "string",
          required: false,
          note: {
            cs: "Id ovládacího prvku vpravo, pokud nějaké má. Teprve s ním je popisek label — jinak by řádek sliboval vazbu, kterou nemá.",
            en: "The id of the control on the right, if it has one. Only then is the label a real label — otherwise the row would promise a binding it does not have.",
          },
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Ovládací prvek vpravo — přepínač, odznak s aktuální hodnotou, tlačítko.",
            en: "The control on the right — a switch, a badge with the current value, a button.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva pro testy jednoho řádku.",
            en: "An anchor for tests on a single row.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        <strong>Vypnutá nápověda na stránkách nesmí změnit rozvržení stránky.</strong>{" "}
        Skrývá se viditelnost, ne prostor — jinak se obsah přeskládá a uživatel přijde o
        místo, kam se právě díval.
      </>,
      <>
        Popisek řádku je <IngotCode>label</IngotCode> jen tehdy, když prvek vpravo
        dostane <IngotCode>controlId</IngotCode>. Kliknutí na popisek pak ovládá prvek a
        odečítač je přečte spolu.
      </>,
      <>
        Menu je skupina s vlastním jménem z <IngotCode>label</IngotCode>. Odečítač tak
        řekne, do čeho uživatel vstoupil, ještě než začne číst položky.
      </>,
      <>
        Odznak s aktuální hodnotou předvolby musí nést text, ne jen barvu. Zapnutá a
        vypnutá nápověda se od sebe nesmí lišit jen odstínem.
      </>,
    ],
    en: [
      <>
        <strong>Turning in-page help off must not change the page's layout.</strong>{" "}
        What is hidden is the visibility, not the space — otherwise the content reflows
        and the user loses the spot they were looking at.
      </>,
      <>
        A row's label is a real <IngotCode>label</IngotCode> only when the control on
        the right is given a <IngotCode>controlId</IngotCode>. Clicking the label then
        operates the control, and a screen reader reads the two together.
      </>,
      <>
        The menu is a group with its own name from <IngotCode>label</IngotCode>. That
        way a screen reader says what the user has entered before it starts reading the
        items.
      </>,
      <>
        A badge showing a preference's current value must carry text, not only colour.
        Help switched on and help switched off must not differ by shade alone.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky vrstev, řádků i <IngotCode>label</IngotCode> menu dodává volající už
        přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Předvolba se ukládá <strong>na účet</strong>, ne do prohlížeče. Motiv, jazyk i
        slovník sledují člověka na druhý počítač; volba uložená jen lokálně vypadá, že
        funguje, dokud si ji někdo nezmění a nezjistí, že se nepřenesla. Dokumentace
        přihlášení nemá, takže tam je prohlížeč výjimka, ne vzor.
      </>,
      <>
        Slovník <strong>Jednoduše / Expert / Obojí</strong> řídí odborné termíny v celém
        produktu, ne jen v tomhle menu. Je to volba jazyka uvnitř jazyka.
      </>,
      <>
        Pokročilé zobrazení se surovým JSON není nikdy zapnuté výchozí. Zapíná si ho
        ten, kdo o něj požádá, a text v něm se nepřekládá — je to data, ne popis.
      </>,
      <>
        Menu má pevnou šířku. Delší překlady popisků se zalomí, takže popisky drž krátké
        i v nejdelším jazyce.
      </>,
    ],
    en: [
      <>
        Layer labels, row labels and the menu's <IngotCode>label</IngotCode> arrive
        already translated from the caller — the kit has no translation namespace of its
        own.
      </>,
      <>
        A preference is stored <strong>on the account</strong>, not in the browser.
        Theme, language and vocabulary follow the person to a second computer; a choice
        kept only locally appears to work until someone changes it and finds it did not
        travel. The documentation site has no sign-in, so the browser is the exception
        there, not the pattern.
      </>,
      <>
        The <strong>Simple / Expert / Both</strong> vocabulary governs technical terms
        across the whole product, not just inside this menu. It is a choice of language
        within a language.
      </>,
      <>
        The advanced view showing raw JSON is never on by default. It is turned on by
        the person who asks for it, and its content is not translated — it is data, not
        description.
      </>,
      <>
        The menu has a fixed width. Longer translated labels wrap, so keep them short
        even in the longest language.
      </>,
    ],
  },
};
