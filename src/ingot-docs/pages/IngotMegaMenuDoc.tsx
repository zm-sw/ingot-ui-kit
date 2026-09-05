import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMegaMenuDemo";
import demoSource from "@/ingot-docs/demos/IngotMegaMenuDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// 2.0 (rozhodnutí vlastníka 2026-09-02, body 01–03): tvar přebírá
// nasazenou administraci. Pevné tři sloupce nahradily skupiny tekoucí
// do 1–2 sloupců, náhled sleduje položku pod kurzorem i fokusem a
// odečítač čte popis z odkazu (aria-describedby) — kapitola Přístupnost
// dřív tvrdila, že sledující náhled „pro klávesnici nefunguje vůbec",
// což o implementaci s onFocus nebyla pravda.
// 2.1: zamčené položky (locked + onLockedItemClick) — modul, který si
// tenant nezapnul, je v menu vidět se zámkem a klik otevírá vysvětlení
// místo navigace. Parita s nasazenou administrací. 2.2: testId na
// položce (e2e kliká na konkrétní odkaz) a kotvení left-0 pod sekcí.
export const IngotMegaMenuDoc: IngotDocPage = {
  name: "IngotMegaMenu",
  status: "beta",
  // 2.3: muted + marker na položce — ztlumený odkaz s jiskrou, který
  // NAVIGUJE (bránu kreslí cílová stránka); menu nezamyká.
  // 2.4 — caption set by IngotEyebrow, the kit's shared mono label.
  version: "2.4",
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
    cs: "Rozbalené menu sekce z horní lišty — skupiny odkazů v jednom nebo dvou sloupcích a náhledový sloupec, který popisuje položku pod kurzorem i pod fokusem.",
    en: "The opened section menu from the top bar — groups of links in one or two columns, plus a preview column describing the item under the cursor and under focus alike.",
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
        Odkazy, které se dají poskládat do pojmenovaných skupin. Nadpis
        skupiny je pracovní rozdělení, ne dekorace — čtenář podle něj hledá.
      </>,
      <>
        Obrazovky, ke kterým se hodí jedna věta kontextu. Náhledový sloupec
        ji ukazuje pro položku, na které čtenář stojí, a odečítač ji slyší
        přímo z odkazu.
      </>,
      <>
        Platforma i zákaznická část. Obě sdílejí tutéž lištu i totéž menu,
        liší se jen obsahem skupin.
      </>,
    ],
    en: [
      <>
        A top-bar section with more than one screen. The section button opens
        this menu, and only inside it are the links.
      </>,
      <>
        Links that can be arranged into named groups. A group heading is a
        working division, not decoration — readers navigate by it.
      </>,
      <>
        Screens that benefit from one sentence of context. The preview column
        shows it for the item the reader is on, and a screen reader hears it
        from the link itself.
      </>,
      <>
        Both the platform side and the customer side. They share the same bar
        and the same menu, and differ only in the contents of the groups.
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
        Sekce s víc než dvěma tucty odkazů. Menu si sloupce rozdělí samo,
        ale seznam všeho, co kdy vzniklo, nezachrání — taková sekce je ve
        skutečnosti dvě a patří do lišty zvlášť.
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
        A section with more than two dozen links. The menu splits its columns
        by itself, but it cannot save a list of everything that ever existed —
        such a section is really two, and they belong in the bar separately.
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
      name: "groups",
      type: "readonly IngotMegaMenuGroup[]",
      required: true,
      note: {
        cs: "Skupiny odkazů. Sloupce si menu rozdělí samo: do sedmi položek jeden, nad sedm dva; skupina se uprostřed nezlomí.",
        en: "The groups of links. The menu splits columns by itself: one up to seven items, two above that; a group never breaks mid-way.",
      },
    },
    {
      name: "art",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Schematická kresba sekce nad textem náhledu. Dekorativní — orientační kotva, ne informace.",
        en: "A schematic drawing of the section above the preview text. Decorative — an orientation anchor, not information.",
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
      name: "onLockedItemClick",
      type: "(item) => void",
      required: false,
      note: {
        cs: "Klik na zamčenou položku (locked) — typicky otevře modal s vysvětlením, co modul umí a jak se zapíná.",
        en: "Click on a locked item — typically opens a modal explaining what the module does and how to enable it.",
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
      name: "IngotMegaMenuGroup",
      note: {
        cs: "Jedna skupina, předává se ve vlastnosti groups.",
        en: "A single group, passed in the groups property.",
      },
      props: [
        {
          name: "title",
          type: "string",
          required: false,
          note: {
            cs: "Nadpis skupiny, mono verzálkami. Bez něj se skupina kreslí bez hlavičky. Přeložený text dodává volající.",
            en: "The group heading, in mono uppercase. Without it the group renders headless. The translated text comes from the caller.",
          },
        },
        {
          name: "items",
          type: "readonly IngotMegaMenuItem[]",
          required: true,
          note: {
            cs: "Odkazy skupiny v pořadí, ve kterém je má čtenář číst.",
            en: "The group's links, in the order the reader should read them.",
          },
        },
      ],
    },
    {
      name: "IngotMegaMenuItem",
      note: {
        cs: "Jeden odkaz ve skupině, předává se v items.",
        en: "A single link inside a group, passed in items.",
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
          name: "description",
          type: "string",
          required: false,
          note: {
            cs: "Jedna věta o obrazovce. Kreslí se v náhledu, když čtenář na položce stojí, a čte ji odečítač z odkazu.",
            en: "One sentence about the screen. Drawn in the preview while the reader is on the item, and read by a screen reader from the link.",
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
        {
          name: "onClick",
          type: "(event) => void",
          required: false,
          note: {
            cs: "Klik na odkaz — SPA tady volá router a preventDefault. href zůstává, aby fungoval střední klik a otevření v novém panelu.",
            en: "Click on the link — an SPA calls its router here with preventDefault. href stays, so middle-click and open-in-new-tab keep working.",
          },
        },
        {
          name: "locked",
          type: "boolean",
          required: false,
          note: {
            cs: "Zamčená položka: viditelná, ztlumená, se zámkem — není to odkaz, klik volá onLockedItemClick. Náhled funguje dál.",
            en: "A locked item: visible, dimmed, with a padlock — not a link; a click calls onLockedItemClick. The preview still works.",
          },
        },
        {
          name: "muted",
          type: "boolean",
          required: false,
          note: {
            cs: "Ztlumená položka — naviguje normálně, jen je jemně odlišená. Bránu kreslí cílová stránka; tvrdé zamčení bez navigace je locked.",
            en: "A muted item — navigates normally, just softly set apart. The gate is drawn by the target page; a hard lock without navigation is locked.",
          },
        },
        {
          name: "marker",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Značka za popiskem vpravo (kde jinak stojí count) — třeba jiskra „tady je co objevit“. Dekorativní.",
            en: "A mark after the label, on the right (where count otherwise sits) — a spark saying “something to discover”. Decorative.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva testu položky — e2e kliká na konkrétní odkaz, ne na menu.",
            en: "The item's test anchor — e2e clicks a specific link, not the menu.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Náhled sleduje položku pod kurzorem <strong>i pod fokusem</strong> —
        procházení Tabem přepíná popis stejně jako myš, klávesnice není druhá
        kategorie. Dokud čtenář na žádné položce nestojí, náhled popisuje
        první.
      </>,
      <>
        Popis položky čte odečítač <strong>z odkazu samotného</strong>{" "}
        (<IngotCode>aria-describedby</IngotCode>); náhledový sloupec je jeho
        vizuální kopie a je <IngotCode>aria-hidden</IngotCode>, aby nic
        neznělo dvakrát.
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
        The preview follows the item under the cursor <strong>and under
        focus</strong> — tabbing switches the description just like the mouse
        does; the keyboard is not a second-class citizen. Until the reader is
        on an item, the preview describes the first one.
      </>,
      <>
        A screen reader hears an item's description <strong>from the link
        itself</strong> (<IngotCode>aria-describedby</IngotCode>); the preview
        column is its visual copy and is <IngotCode>aria-hidden</IngotCode>,
        so nothing sounds twice.
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
        Nadpisy skupin, popisky položek i jejich popisy dodává volající už
        přeložené — kit vlastní jmenný prostor překladů nemá.
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
        <IngotCode>description</IngotCode> je jedna věta. Delší překlad
        náhledový sloupec nerozšíří, jen zvýší — přesto ho drž krátký, čte se
        koutkem oka.
      </>,
    ],
    en: [
      <>
        Group headings, item labels and their descriptions arrive already
        translated from the caller — the kit has no translation namespace of
        its own.
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
        <IngotCode>description</IngotCode> is one sentence. A longer
        translation does not widen the preview column, only makes it taller —
        keep it short anyway; it is read from the corner of the eye.
      </>,
    ],
  },
};
