import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotSideNavDemo";
import demoSource from "@/ingot-docs/demos/IngotSideNavDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotSideNavDoc: IngotDocPage = {
  name: "IngotSideNav",
  status: "stable",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  version: "1.1",
  tag: ".sidenav",
  tokens: ["--surface", "--surface-2", "--border", "--ink", "--ink-2", "--ink-3", "--ink-4", "--font-mono", "--r-sm", "--shadow-sm"],
  summary: {
    cs: "Pojmenovaná skupina odkazů, jeden z nich aktivní. Popisek navigace a aria-current drží primitivum, ne domluva.",
    en: "A named group of links with one of them active. The primitive owns the navigation label and aria-current — not an agreement to remember them.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Boční menu, které přepíná obsah vedle sebe a jedna položka je právě
        zobrazená.
      </>,
      <>
        Na stránce je navigací víc (průvodci a komponenty, sekce a
        podsekce). Každá dostane vlastní <IngotCode>label</IngotCode>, takže je
        odečítač od sebe rozezná.
      </>,
    ],
    en: [
      <>
        A side menu that switches the content beside it, with one item
        currently shown.
      </>,
      <>
        The page has more than one navigation (guides and components,
        sections and subsections). Each gets its own <IngotCode>label</IngotCode>, so a
        screen reader can tell them apart.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Položky nic nepřepínají, jen se vypisují. Pak je to seznam —{" "}
        <IngotCode>IngotList</IngotCode> s <IngotCode>variant=&quot;plain&quot;</IngotCode>.
      </>,
      <>
        Menu má vlastní chování navíc: skládání skupin, ikony, přetečení do
        „další". Tohle primitivum je záměrně holé; složitější menu ať si
        drží obrazovka, dokud se pro ně nenajde druhý žadatel.
      </>,
      <>
        Položka spouští akci, ne navigaci. Odkaz, který nikam nevede, je
        tlačítko — <IngotCode>Button</IngotCode>.
      </>,
    ],
    en: [
      <>
        The items switch nothing and are only listed. Then it is a list —{" "}
        <IngotCode>IngotList</IngotCode> with <IngotCode>variant=&quot;plain&quot;</IngotCode>.
      </>,
      <>
        The menu needs extra behaviour: collapsible groups, icons, overflow
        into a "more" control. This primitive is deliberately bare; a richer
        menu should stay with the screen until a second caller asks for it.
      </>,
      <>
        The item triggers an action, not navigation. A link that goes nowhere
        is a button — <IngotCode>Button</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "aria-label navigace i viditelný nadpis skupiny. Povinný.",
        en: "The navigation's aria-label and the visible group heading. Required.",
      },
    },
    {
      name: "items",
      type: "readonly IngotNavItem[]",
      required: true,
      note: {
        cs: "Položky menu. Vlastnosti položky viz tabulka níž.",
        en: "The menu items. Item properties are in the table below.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid navigace.", en: "data-testid of the nav." },
    },
  ],
  extraProps: [
    {
      name: "IngotNavItem",
      note: {
        cs: (
          <>
            Jeden prvek pole <IngotCode>items</IngotCode>. Adresu si skládá volající —
            primitivum router nezná a nesmí ho přitáhnout do bundlu.
          </>
        ),
        en: (
          <>
            One entry of the <IngotCode>items</IngotCode> array. The caller builds the
            address — the primitive knows no router and must not pull one into
            the bundle.
          </>
        ),
      },
      props: [
        {
          name: "href",
          type: "string",
          required: true,
          note: {
            cs: "Hotová adresa. Primitivum ji nesestavuje ani nevaliduje.",
            en: "A finished address. The primitive neither builds nor validates it.",
          },
        },
        {
          name: "label",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Popisek položky — už přeložený.",
            en: "The item label — already translated.",
          },
        },
        {
          name: "current",
          type: "boolean",
          required: false,
          note: {
            cs: "Právě zobrazená položka. Dostane aria-current=“page”.",
            en: 'The item currently shown. Gets aria-current="page".',
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: { cs: "data-testid odkazu.", en: "data-testid of the link." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>label</IngotCode> je povinný schválně. Na stránce s víc navigacemi
        je <IngotCode>aria-label</IngotCode> to jediné, čím je odečítač rozezná —
        jinak uživatel slyší „navigace" dvakrát a neví, která je která.
      </>,
      <>
        Aktivní položka nese <IngotCode>aria-current=&quot;page&quot;</IngotCode>, ne
        jen jinou barvu. Zvýraznění barvou je informace, kterou odečítač
        nevidí.
      </>,
      <>
        Odkaz je <IngotCode>&lt;a href&gt;</IngotCode>, ne <IngotCode>&lt;div onClick&gt;</IngotCode>.
        Klávesnice, prostřední tlačítko myši i „otevřít v novém panelu" pak
        fungují samy a nikdo je nemusí dodělávat.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> is required on purpose. On a page with several
        navigations, <IngotCode>aria-label</IngotCode> is the only thing that tells them
        apart — otherwise the user hears "navigation" twice and cannot tell
        which is which.
      </>,
      <>
        The active item carries <IngotCode>aria-current=&quot;page&quot;</IngotCode>,
        not just a different colour. Colour is information a screen reader
        cannot see.
      </>,
      <>
        A link is an <IngotCode>&lt;a href&gt;</IngotCode>, not a{" "}
        <IngotCode>&lt;div onClick&gt;</IngotCode>. Keyboard, middle-click and "open in
        a new tab" then work by themselves and nobody has to add them.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> navigace i popisky položek dodává volající už
        přeložené.
      </>,
      <>
        <IngotCode>href</IngotCode> se <strong>nepřekládá</strong>. Přeložená adresa
        rozbije každý sdílený odkaz.
      </>,
    ],
    en: [
      <>
        The navigation <IngotCode>label</IngotCode> and the item labels arrive from the
        caller already translated.
      </>,
      <>
        <IngotCode>href</IngotCode> is <strong>not</strong> translated. A translated
        address breaks every shared link.
      </>,
    ],
  },
};
