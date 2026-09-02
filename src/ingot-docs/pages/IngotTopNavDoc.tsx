import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotTopNavDemo";
import demoSource from "@/ingot-docs/demos/IngotTopNavDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotTopNavDoc: IngotDocPage = {
  name: "IngotTopNav",
  status: "beta",
  version: "1.0",
  tag: ".topnav",
  tokens: ["--surface", "--surface-2", "--surface-3", "--border", "--ink", "--ink-2", "--r-sm"],
  summary: {
    cs: "Horní lišta aplikace — brand, sekce a účet v jednom řádku. Administrace nemá boční menu; obsah pod lištou jde na plnou šířku.",
    en: "The application's top bar — brand, sections and account in one row. The admin has no side menu; content below the bar runs full width.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Rám administrace. Je to jediná navigace, kterou obrazovka má —
        sekce nahoře, obsah pod nimi přes celou šířku.
      </>,
      <>
        Sekce, která má víc než jednu obrazovku. Tlačítko sekce rozbaluje{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, kde teprve jsou odkazy.
      </>,
      <>
        Odlišení režimu produktu — odznak vedle brandu řekne, že jsi
        v administraci platformy, ne u zákazníka.
      </>,
    ],
    en: [
      <>
        The frame of the admin. It is the only navigation a screen has —
        sections on top, content below them at full width.
      </>,
      <>
        A section with more than one screen. The section button opens an{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, which is where the links are.
      </>,
      <>
        Telling the two products apart — a badge next to the brand says you
        are in the platform admin, not in a customer account.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Rejstřík stránek uvnitř obsahu — dokumentace, nápověda, dlouhé
        nastavení. Na to je <IngotCode>IngotSideNav</IngotCode>: je to
        obsah stránky, ne rám aplikace.
      </>,
      <>
        Sekce, která má jedinou obrazovku. Tlačítko, které rozbalí menu
        s jednou položkou, je krok navíc — udělej z ní odkaz.
      </>,
      <>
        Víc než šest sekcí. Lišta se nezalamuje a sedmá sekce zmizí za
        okrajem; víc sekcí znamená, že se dvě z nich dají spojit.
      </>,
    ],
    en: [
      <>
        An index of pages inside the content — documentation, help, a long
        settings flow. That is <IngotCode>IngotSideNav</IngotCode>: it is
        page content, not the application frame.
      </>,
      <>
        A section with a single screen. A button that opens a menu with one
        item is a step too many — make it a link.
      </>,
      <>
        More than six sections. The bar does not wrap and the seventh falls
        off the edge; more sections means two of them can be merged.
      </>,
    ],
  },
  props: [
    {
      name: "brand",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Značka vlevo. Odznak režimu patří sem, ne vedle sekcí.",
        en: "The brand on the left. A mode badge belongs here, not next to the sections.",
      },
    },
    {
      name: "sections",
      type: "readonly IngotTopNavSection[]",
      required: false,
      note: {
        cs: "Sekce aplikace. Nejvýš šest — víc se do řádku nevejde čitelně.",
        en: "The application's sections. Six at most — more do not fit the row legibly.",
      },
    },
    {
      name: "openSection",
      type: "string | null",
      required: false,
      note: {
        cs: "Klíč rozbalené sekce. Řízené zvenčí: kdy se menu zavírá, ví volající.",
        en: "The key of the open section. Controlled from outside: the caller knows when the menu closes.",
      },
    },
    {
      name: "onToggleSection",
      type: "(key: string) => void",
      required: false,
      note: {
        cs: "Klik na sekci. Přijde i při zavírání — komponenta si stav nedrží.",
        en: "A click on a section. Fires on closing too — the component keeps no state.",
      },
    },
    {
      name: "actions",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Ikonové akce vpravo před účtem — hledání, zprávy.",
        en: "Icon actions on the right, before the account — search, messages.",
      },
    },
    {
      name: "account",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Účet úplně vpravo, typicky IngotTopNavAccount.",
        en: "The account at the far right, typically IngotTopNavAccount.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Mega menu rozbalené pod lištou — pozicuje se vůči ní.",
        en: "The mega menu opened below the bar — it positions against it.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotTopNavAccount",
      note: {
        cs: "Účet v pravém rohu. Iniciály, ne fotka — provozní účty avatar většinou nemají a prázdné kolečko vypadá jako chyba načtení.",
        en: "The account in the right corner. Initials, not a photo — shop-floor accounts usually have no avatar, and an empty circle looks like a failed load.",
      },
      props: [
        {
          name: "initials",
          type: "string",
          required: true,
          note: {
            cs: "Dvě písmena. Delší se do kolečka nevejde.",
            en: "Two letters. Anything longer does not fit the circle.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený aria-label. Bez něj odečítač přečte jen iniciály.",
            en: "A translated aria-label. Without it a screen reader announces just the initials.",
          },
        },
        {
          name: "expanded",
          type: "boolean",
          required: false,
          note: {
            cs: "Je menu účtu otevřené? Nasadí aria-expanded.",
            en: "Is the account menu open? Sets aria-expanded.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Sekce je <strong>tlačítko</strong>, ne odkaz — sama nikam nevede,
        jen rozbaluje menu. Nese proto <IngotCode>aria-expanded</IngotCode>,
        ne <IngotCode>aria-current</IngotCode>; ta patří až odkazu uvnitř
        menu.
      </>,
      <>
        Otevřenou sekci značí plocha <IngotCode>--surface-3</IngotCode>, ne
        akcent. Akcent v téhle aplikaci znamená akci, a rozbalené menu
        žádná akce není.
      </>,
      <>
        Ikonové akce vpravo potřebují <IngotCode>aria-label</IngotCode> —
        lupa bez popisku je pro odečítač jen „tlačítko“.
      </>,
      <>
        <IngotCode>Esc</IngotCode> zavírá menu a vrací fokus na tlačítko
        sekce. Zavírání drží volající, protože jen on ví, jestli se má
        menu zavřít i po prokliku.
      </>,
    ],
    en: [
      <>
        A section is a <strong>button</strong>, not a link — it goes nowhere
        on its own, it opens a menu. So it carries{" "}
        <IngotCode>aria-expanded</IngotCode>, not{" "}
        <IngotCode>aria-current</IngotCode>; that belongs to the link inside
        the menu.
      </>,
      <>
        An open section is marked with the <IngotCode>--surface-3</IngotCode>{" "}
        surface, not the accent. The accent means an action in this
        application, and an open menu is not an action.
      </>,
      <>
        The icon actions on the right need an <IngotCode>aria-label</IngotCode>{" "}
        — a magnifier without one is just “button” to a screen reader.
      </>,
      <>
        <IngotCode>Esc</IngotCode> closes the menu and returns focus to the
        section button. Closing is the caller's, because only they know
        whether the menu should also close after a click-through.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky sekcí dodává volající přeložené — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        Sekce mají v překladu delší jména. Lišta se nezalamuje, takže
        popisky drž na jednom až dvou slovech i v nejdelším jazyce.
      </>,
    ],
    en: [
      <>
        Section labels are passed in already translated — the kit has no
        translation namespace of its own.
      </>,
      <>
        Section names get longer in translation. The bar does not wrap, so
        keep labels to one or two words even in the longest language.
      </>,
    ],
  },
};
