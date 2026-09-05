import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotTopNavDemo";
import demoSource from "@/ingot-docs/demos/IngotTopNavDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// 2.0 (owner decision of 2026-09-02, items 02 and 04): a section opens on
// hover and on click (click only opens; the bar measures the close delay),
// ``onToggleSection`` was replaced by ``onOpenSection``/``onCloseSection``
// and the "at most six sections" limit by the 1280 px yardstick.
// 2.2 (parity with the deployed admin for the shell conversion): a section
// can be a link (href — a single screen) or locked (locked), the panel
// anchors under its section via renderMenu, menuButton arrived for the
// mobile hamburger and a click outside the bar closes. 2.3: the row frame
// (contentClassName) belongs to the shell, sections are a named <nav>
// (sectionsLabel) with a responsive class (sectionsClassName) and a
// sectionsEnd slot.
export const IngotTopNavDoc: IngotDocPage = {
  name: "IngotTopNav",
  status: "beta",
  // 2.4: ``current`` highlights a menu section too (the group with the
  // active route). 2.5: a section can carry its own ``testId`` — the
  // conversion does not rename the anchors of existing tests and e2e.
  // 2.6: ``muted`` on a link section. 2.7: keyboard in the open panel —
  // arrows walk the items, Tab does not fall out of the panel and Escape
  // returns focus to the section button. This page had promised the focus
  // return since 2.0, but the code did not do it.
  // 2.8 — row states (current, open, muted, locked, hover) come from the kit's shared menu row.
  version: "2.8",
  tag: ".topnav",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--ink",
    "--ink-2",
    "--r-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Horní lišta aplikace — brand, sekce a účet v jednom řádku. Administrace nemá boční menu; obsah pod lištou jde na plnou šířku.",
    en: "The application's top bar — brand, sections and account in one row. The admin has no side menu; content below the bar runs full width.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Rám administrace. Je to jediná navigace, kterou obrazovka má — sekce nahoře,
        obsah pod nimi přes celou šířku.
      </>,
      <>
        Sekce, která má víc než jednu obrazovku. Tlačítko sekce rozbaluje{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, kde teprve jsou odkazy.
      </>,
      <>
        Odlišení režimu produktu — odznak vedle brandu řekne, že jsi v administraci
        platformy, ne u zákazníka.
      </>,
    ],
    en: [
      <>
        The frame of the admin. It is the only navigation a screen has — sections on
        top, content below them at full width.
      </>,
      <>
        A section with more than one screen. The section button opens an{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, which is where the links are.
      </>,
      <>
        Telling the two products apart — a badge next to the brand says you are in the
        platform admin, not in a customer account.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Rejstřík stránek uvnitř obsahu — dokumentace, nápověda, dlouhé nastavení. Na to
        je <IngotCode>IngotSideNav</IngotCode>: je to obsah stránky, ne rám aplikace.
      </>,
      <>
        Sekce, která má jedinou obrazovku. Tlačítko, které rozbalí menu s jednou
        položkou, je krok navíc — udělej z ní odkaz.
      </>,
      <>
        Sada sekcí, která se i s popisky nevejde na 1280 px. Lišta se nezalamuje a co
        přeteče, zmizí za okrajem — měřítkem je nejužší podporovaná šířka, ne pevný
        počet. Když se lišta láme, zkracuj popisky nebo spoj dvě sekce.
      </>,
    ],
    en: [
      <>
        An index of pages inside the content — documentation, help, a long settings
        flow. That is <IngotCode>IngotSideNav</IngotCode>: it is page content, not the
        application frame.
      </>,
      <>
        A section with a single screen. A button that opens a menu with one item is a
        step too many — make it a link.
      </>,
      <>
        A set of sections that will not fit at 1280 px with their labels. The bar does
        not wrap and whatever overflows falls off the edge — the measure is the
        narrowest supported width, not a fixed count. When the bar breaks, shorten
        labels or merge two sections.
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
        cs: "Sekce aplikace. Všechny se svými popisky se musí vejít na 1280 px — lišta se nezalamuje.",
        en: "The application's sections. All of them, labels included, must fit at 1280 px — the bar does not wrap.",
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
      name: "onOpenSection",
      type: "(key: string) => void",
      required: false,
      note: {
        cs: "Otevři sekci. Volá se z najetí myší, kliku i klávesnice (ArrowDown, Enter). Klik nikdy nezavírá — hover otevřel panel dřív, než klik dopadl, a toggle by ho hned zhasnul.",
        en: "Open a section. Called on hover, click and keyboard (ArrowDown, Enter). A click never closes — hover opened the panel before the click landed, and a toggle would put it right out.",
      },
    },
    {
      name: "onCloseSection",
      type: "() => void",
      required: false,
      note: {
        cs: "Zavři otevřenou sekci. Lišta ho volá po odjezdu myší (se 120ms prodlevou, aby cesta do panelu nezhasla), po kliku mimo lištu a na Escape; po prokliku položky ho volá volající.",
        en: "Close the open section. The bar calls it after the pointer leaves (with a 120 ms delay so the path into the panel does not go dark), on a click outside the bar and on Escape; after a link click the caller calls it.",
      },
    },
    {
      name: "renderMenu",
      type: "(key: string) => ReactNode",
      required: false,
      note: {
        cs: "Menu otevřené sekce — typicky IngotMegaMenu. Kreslí se do relativního obalu té sekce, takže panel stojí pod svým tlačítkem.",
        en: "The open section's menu — typically IngotMegaMenu. Rendered into that section's relative wrapper, so the panel stands under its button.",
      },
    },
    {
      name: "menuButton",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Tlačítko mobilního menu — kreslí se úplně vlevo, před brandem.",
        en: "The mobile menu button — drawn leftmost, before the brand.",
      },
    },
    {
      name: "contentClassName",
      type: "string",
      required: false,
      note: {
        cs: "Třída vnitřního řádku — sem patří rám shellu (mx-auto max-w, výška, odsazení). Ohraničení a plocha lišty zůstávají na kitu.",
        en: "The inner row's class — the shell's frame goes here (mx-auto max-w, height, padding). The bar's border and surface stay with the kit.",
      },
    },
    {
      name: "sectionsLabel",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený aria-label bloku sekcí — z lišty dělá pojmenovanou navigaci.",
        en: "A translated aria-label for the sections block — makes the bar a named navigation.",
      },
    },
    {
      name: "sectionsClassName",
      type: "string",
      required: false,
      note: {
        cs: "Třída obalu sekcí — typicky responsivní schování na mobilu (hidden lg:flex), kde navigaci nese hamburger.",
        en: "The sections wrapper's class — typically responsive hiding on mobile (hidden lg:flex), where the hamburger carries navigation.",
      },
    },
    {
      name: "sectionsEnd",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Za poslední sekcí, uvnitř navigace — např. „Odemknout vše“ day-1 režimu.",
        en: "After the last section, inside the navigation — e.g. a day-one “Unlock all”.",
      },
    },
    {
      name: "actions",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Ikonové akce vpravo před účtem — zprávy, notifikace.",
        en: "Icon actions on the right, before the account — messages, notifications.",
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
    {
      name: "IngotTopNavSection",
      note: {
        cs: "Jedna sekce lišty, předává se v sections. Tři tvary: menu (jen key+label), odkaz (href) a zamčená (locked).",
        en: "One bar section, passed in sections. Three shapes: a menu (key+label only), a link (href) and a locked one (locked).",
      },
      props: [
        {
          name: "key",
          type: "string",
          required: true,
          note: {
            cs: "Klíč sekce — hodnota pro openSection/onOpenSection.",
            en: "The section key — the value for openSection/onOpenSection.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Popisek sekce, 1–3 slova. Přeložený dodává volající.",
            en: "The section label, 1–3 words. Arrives translated from the caller.",
          },
        },
        {
          name: "href",
          type: "string",
          required: false,
          note: {
            cs: "Sekce s jedinou obrazovkou: rovnou odkaz, žádné menu. SPA naviguje v onNavigate s preventDefault; href zůstává kvůli střednímu kliku.",
            en: "A single-screen section: a plain link, no menu. An SPA navigates in onNavigate with preventDefault; href stays for middle-click.",
          },
        },
        {
          name: "onNavigate",
          type: "(event) => void",
          required: false,
          note: {
            cs: "Klik na odkazovou sekci.",
            en: "Click on a link section.",
          },
        },
        {
          name: "current",
          type: "boolean",
          required: false,
          note: {
            cs: "Sekce drží právě otevřenou obrazovku. Odkaz dostane aria-current; menu tlačítko jen zvýraznění — aria-current nese až položka uvnitř.",
            en: "The section holds the open screen. A link gets aria-current; a menu button only the highlight — aria-current is carried by the item inside.",
          },
        },
        {
          name: "locked",
          type: "boolean",
          required: false,
          note: {
            cs: "Zamčená sekce: ztlumené tlačítko se zámkem, klik volá onLockedClick místo menu či navigace.",
            en: "A locked section: a dimmed button with a padlock; a click calls onLockedClick instead of a menu or navigation.",
          },
        },
        {
          name: "onLockedClick",
          type: "() => void",
          required: false,
          note: {
            cs: "Klik na zamčenou sekci — typicky modal s vysvětlením.",
            en: "Click on a locked section — typically an explaining modal.",
          },
        },
        {
          name: "badge",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Odznak za popiskem — počet čekající práce u odkazové sekce.",
            en: "A badge after the label — pending-work count on a link section.",
          },
        },
        {
          name: "muted",
          type: "boolean",
          required: false,
          note: {
            cs: "Ztlumená odkazová sekce — naviguje normálně, jen je jemně odlišená (bránu kreslí cílová stránka).",
            en: "A muted link section — navigates normally, just softly set apart (the gate is drawn by the target page).",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Vlastní kotva testu sekce. Bez ní se odvodí z kotvy lišty a klíče.",
            en: "The section's own test anchor. Without it, derived from the bar's anchor and the key.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Sekce je <strong>tlačítko</strong>, ne odkaz — sama nikam nevede, jen rozbaluje
        menu. Nese proto <IngotCode>aria-expanded</IngotCode>, ne{" "}
        <IngotCode>aria-current</IngotCode>; ta patří až odkazu uvnitř menu.
      </>,
      <>
        Otevřenou sekci značí plocha <IngotCode>--surface-3</IngotCode>, ne akcent.
        Akcent v téhle aplikaci znamená akci, a rozbalené menu žádná akce není.
      </>,
      <>
        Ikonové akce vpravo potřebují <IngotCode>aria-label</IngotCode> — lupa bez
        popisku je pro odečítač jen „tlačítko“.
      </>,
      <>
        <IngotCode>Esc</IngotCode> zavírá menu a vrací fokus na tlačítko sekce. Zavírání
        drží volající, protože jen on ví, jestli se má menu zavřít i po prokliku. Návrat
        fokusu drží lišta — zmizelý panel by ho jinak zahodil na začátek stránky.
      </>,
      <>
        <IngotCode>ArrowDown</IngotCode> a <IngotCode>ArrowUp</IngotCode> na tlačítku
        sekci otevřou a skočí na první, resp. poslední položku; uvnitř panelu procházejí
        položky dokola. Menu, které se otevírá najetím myší, je bez toho z klávesnice
        past: panel je vidět, ale fokus zůstal na tlačítku.
      </>,
      <>
        <IngotCode>Tab</IngotCode> z otevřeného panelu <strong>nevypadne</strong> —
        obchází jeho položky. Odejít doprostřed lišty a nechat si panel viset za zády je
        stav, ze kterého se čtenář nedostane zpátky; ven vede <IngotCode>Esc</IngotCode>
        .
      </>,
    ],
    en: [
      <>
        A section is a <strong>button</strong>, not a link — it goes nowhere on its own,
        it opens a menu. So it carries <IngotCode>aria-expanded</IngotCode>, not{" "}
        <IngotCode>aria-current</IngotCode>; that belongs to the link inside the menu.
      </>,
      <>
        An open section is marked with the <IngotCode>--surface-3</IngotCode> surface,
        not the accent. The accent means an action in this application, and an open menu
        is not an action.
      </>,
      <>
        The icon actions on the right need an <IngotCode>aria-label</IngotCode> — a
        magnifier without one is just “button” to a screen reader.
      </>,
      <>
        <IngotCode>Esc</IngotCode> closes the menu and returns focus to the section
        button. Closing is the caller's, because only they know whether the menu should
        also close after a click-through. The focus return is the bar's — a vanished
        panel would otherwise drop focus at the top of the page.
      </>,
      <>
        <IngotCode>ArrowDown</IngotCode> and <IngotCode>ArrowUp</IngotCode> on the
        button open the section and jump to its first or last item; inside the panel
        they walk the items and wrap around. Without that, a menu that opens on hover is
        a keyboard trap: the panel is visible, but focus stayed on the button.
      </>,
      <>
        <IngotCode>Tab</IngotCode> does <strong>not</strong> fall out of an open panel —
        it cycles through its items. Walking off into the middle of the bar with the
        panel left hanging behind you is a state there is no way back from;{" "}
        <IngotCode>Esc</IngotCode> is the way out.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky sekcí dodává volající přeložené — kit vlastní jmenný prostor překladů
        nemá.
      </>,
      <>
        Sekce mají v překladu delší jména. Lišta se nezalamuje, takže popisky drž na
        jednom až dvou slovech i v nejdelším jazyce.
      </>,
    ],
    en: [
      <>
        Section labels are passed in already translated — the kit has no translation
        namespace of its own.
      </>,
      <>
        Section names get longer in translation. The bar does not wrap, so keep labels
        to one or two words even in the longest language.
      </>,
    ],
  },
};
