import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMegaMenuDemo";
import demoSource from "@/ingot-docs/demos/IngotMegaMenuDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotMegaMenuDoc: IngotDocPage = {
  name: "IngotMegaMenu",
  status: "beta",
  version: "1.0",
  tag: ".megamenu",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--accent-ink",
    "--font-mono",
    "--r-sm",
    "--r-lg",
    "--shadow-lg",
  ],
  summary: {
    cs: "Rozbalené menu sekce z horní lišty — tři sloupce odkazů a čtvrtý náhledový sloupec. Tvar je pevný: sekce, která se do tří sloupců nevejde, nejsou jedna sekce, ale dvě.",
    en: "The opened section menu from the top bar — three columns of links plus a fourth preview column. The shape is fixed: a section that does not fit into three columns is not one section but two.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce horní lišty, která má víc obrazovek. Tlačítko sekce rozbaluje
        tohle menu a teprve v něm jsou odkazy.
      </>,
      <>
        Odkazy, které se dají poskládat do tří pojmenovaných skupin. Nadpis
        sloupce je pracovní rozdělení, ne dekorace — čtenář podle něj hledá.
      </>,
      <>
        Sekce, u které se hodí jedna věta kontextu navíc. Čtvrtý sloupec
        o šířce 300 px popisuje, k čemu ta sekce je.
      </>,
      <>
        Platforma i zákaznická část. Obě sdílejí tutéž lištu i totéž menu,
        liší se jen obsahem sloupců.
      </>,
    ],
    en: [
      <>
        A top-bar section with more than one screen. The section button opens
        this menu, and only inside it are the links.
      </>,
      <>
        Links that can be grouped into three named groups. A column heading is
        a working division, not decoration — readers navigate by it.
      </>,
      <>
        A section that benefits from one extra sentence of context. The fourth
        column, 300 px wide, explains what the section is for.
      </>,
      <>
        Both the platform side and the customer side. They share the same bar
        and the same menu, and differ only in the contents of the columns.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Sekce, která má jedinou obrazovku. Menu s jednou položkou je krok
        navíc — z takové sekce udělej rovnou odkaz v liště.
      </>,
      <>
        Sekce, jejíž odkazy se do tří sloupců nevejdou. Nezvětšuj mřížku:
        takové sekce jsou ve skutečnosti dvě a patří do lišty zvlášť.
      </>,
      <>
        Nabídka akcí nad vybraným záznamem — smazat, duplikovat, exportovat.
        Tohle menu obsahuje odkazy na obrazovky, ne příkazy.
      </>,
      <>
        Rejstřík stránek uvnitř obsahu, třeba v dlouhém nastavení. Na to je{" "}
        <IngotCode>IngotSideNav</IngotCode> — je to obsah stránky, ne rám
        aplikace.
      </>,
    ],
    en: [
      <>
        A section with a single screen. A menu holding one item is a step too
        many — make that section a plain link in the bar.
      </>,
      <>
        A section whose links do not fit into three columns. Do not grow the
        grid: such a section is really two, and they belong in the bar
        separately.
      </>,
      <>
        A list of actions on a selected record — delete, duplicate, export.
        This menu holds links to screens, not commands.
      </>,
      <>
        An index of pages inside the content, for example in a long settings
        flow. That is <IngotCode>IngotSideNav</IngotCode> — it is page content,
        not the application frame.
      </>,
    ],
  },
  props: [
    {
      name: "columns",
      type: "readonly IngotMegaMenuColumn[]",
      required: true,
      note: {
        cs: "Sloupce odkazů. Tři je cíl; víc se do mřížky nevejde.",
        en: "The columns of links. Three is the target; more do not fit the grid.",
      },
    },
    {
      name: "preview",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Náhledový sloupec vpravo, 300 px. Popisuje první položku sekce, ne tu pod kurzorem.",
        en: "The preview column on the right, 300 px. It describes the section's first item, not the one under the cursor.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label menu. Bez něj je to pro odečítač jen další navigace bez jména.",
        en: "A translated aria-label for the menu. Without it a screen reader hears just another unnamed navigation.",
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
      name: "IngotMegaMenuColumn",
      note: {
        cs: "Jeden sloupec, předává se ve vlastnosti columns.",
        en: "A single column, passed in the columns property.",
      },
      props: [
        {
          name: "title",
          type: "string",
          required: true,
          note: {
            cs: "Nadpis sloupce, mono verzálkami. Přeložený text dodává volající.",
            en: "The column heading, in mono uppercase. The translated text comes from the caller.",
          },
        },
        {
          name: "items",
          type: "readonly IngotMegaMenuItem[]",
          required: true,
          note: {
            cs: "Odkazy sloupce v pořadí, ve kterém je má čtenář číst.",
            en: "The column's links, in the order the reader should read them.",
          },
        },
      ],
    },
    {
      name: "IngotMegaMenuItem",
      note: {
        cs: "Jeden odkaz ve sloupci, předává se v items.",
        en: "A single link inside a column, passed in items.",
      },
      props: [
        {
          name: "href",
          type: "string",
          required: true,
          note: {
            cs: "Cíl odkazu. Položka je vždy odkaz — vede na obrazovku, nespouští akci.",
            en: "The link target. An item is always a link — it leads to a screen, it does not run an action.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Popisek nese význam položky; ikona je jen doprovod.",
            en: "The label carries the item's meaning; the icon is only an accompaniment.",
          },
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Ikona před popiskem. Dekorativní — položka bez ní dává stejný smysl.",
            en: "An icon before the label. Decorative — the item makes the same sense without it.",
          },
        },
        {
          name: "count",
          type: "number",
          required: false,
          note: {
            cs: "Počet záznamů vpravo. Sází se v mono, protože je to číslo k porovnání mezi řádky.",
            en: "The record count on the right. Set in mono, because it is a number meant to be compared across rows.",
          },
        },
        {
          name: "current",
          type: "boolean",
          required: false,
          note: {
            cs: "Právě otevřená položka. Nasadí aria-current a plochu --surface-3.",
            en: "The currently open item. Sets aria-current and the --surface-3 surface.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Náhled popisuje <strong>první</strong> položku sekce, ne poslední, na
        které byla myš. Náhled měnící se pod kurzorem je náhodný ve chvíli,
        kdy čtenář dojede k pravému okraji, a pro ovládání klávesnicí
        nefunguje vůbec.
      </>,
      <>
        Otevřená sekce se v liště značí plochou{" "}
        <IngotCode>--surface-3</IngotCode>, ne akcentem. Akcent v téhle
        aplikaci znamená akci, a rozbalené menu žádná akce není.
      </>,
      <>
        Menu je <IngotCode>nav</IngotCode> s vlastním jménem z{" "}
        <IngotCode>label</IngotCode>. Odečítač tak umí seznam navigací
        rozlišit od horní lišty.
      </>,
      <>
        Otevřenou položku značí <IngotCode>aria-current</IngotCode>, ne pouhá
        barva. Kdo barvu nevidí, se jinak nedozví, kde v aplikaci právě je.
      </>,
    ],
    en: [
      <>
        The preview describes the section's <strong>first</strong> item, not
        the last one the mouse happened to pass over. A preview that changes
        under the cursor is arbitrary by the time the reader reaches the right
        edge, and for keyboard operation it does not work at all.
      </>,
      <>
        An open section is marked in the bar with the{" "}
        <IngotCode>--surface-3</IngotCode> surface, not with the accent. The
        accent means an action in this application, and an open menu is not an
        action.
      </>,
      <>
        The menu is a <IngotCode>nav</IngotCode> with its own name from{" "}
        <IngotCode>label</IngotCode>. That lets a screen reader tell it apart
        from the top bar in the list of navigations.
      </>,
      <>
        The open item is marked with <IngotCode>aria-current</IngotCode>, not
        by colour alone. Someone who does not see the colour would otherwise
        never learn where in the application they are.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Nadpisy sloupců i popisky položek dodává volající už přeložené — kit
        vlastní jmenný prostor překladů nemá.
      </>,
      <>
        <IngotCode>label</IngotCode> je text pro odečítač, a překládá se
        stejně jako všechno viditelné.
      </>,
      <>
        Sloupec má pevnou minimální šířku, ale roste podle nejdelšího popisku.
        Dlouhé překlady tedy menu rozšíří — drž popisky na jednom až dvou
        slovech.
      </>,
      <>
        Text v náhledovém sloupci je vázaný na první položku sekce. Když se
        pořadí položek v překladu změní, musí se přepsat i náhled.
      </>,
    ],
    en: [
      <>
        Column headings and item labels arrive already translated from the
        caller — the kit has no translation namespace of its own.
      </>,
      <>
        <IngotCode>label</IngotCode> is text for a screen reader, and it is
        translated just like everything visible.
      </>,
      <>
        A column has a fixed minimum width but grows with its longest label.
        Long translations therefore widen the menu — keep labels to one or two
        words.
      </>,
      <>
        The text in the preview column is tied to the section's first item. If
        the item order changes in a translation, the preview has to be
        rewritten with it.
      </>,
    ],
  },
};
