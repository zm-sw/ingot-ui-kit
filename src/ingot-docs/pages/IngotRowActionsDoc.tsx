import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotRowActionsDemo";
import demoSource from "@/ingot-docs/demos/IngotRowActionsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotRowActionsDoc: IngotDocPage = {
  name: "IngotRowActions",
  status: "stable",
  // 1.1 — actions are the kit's shared icon button (accent focus ring).
  version: "1.1",
  tag: ".rowactions",
  tokens: ["--surface-2", "--ink", "--ink-3", "--danger", "--danger-bg", "--accent-bg", "--r-sm"],
  summary: {
    cs: "Akce jednoho řádku tabulky — ikonová tlačítka 28×28 px na konci řádku, bez rámečku a bez viditelného popisku.",
    en: "The actions of a single table row — 28×28 px icon buttons at the end of the row, with no frame and no visible label.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Poslední sloupec tabulky. Akce jsou <strong>vždy</strong> na konci
        řádku a v témže pořadí — kdo je jednou najde, hledá je na dalších
        stránkách na stejném místě.
      </>,
      <>
        Jedna až tři akce nad jedním záznamem — upravit, duplikovat,
        smazat. Víc než tři už patří do menu.
      </>,
      <>
        Hustota, kterou běžné tlačítko neumí a nemá umět: 28×28 px, bez
        rámečku, bez popisku. Tlačítko v hlavičce a tlačítko ve dvacátém
        řádku tabulky nejsou totéž, a proto je tohle vlastní primitivum.
      </>,
    ],
    en: [
      <>
        The last column of a table. The actions are <strong>always</strong>{" "}
        at the end of the row and always in the same order — whoever finds
        them once looks for them in the same place on every later page.
      </>,
      <>
        One to three actions on a single record — edit, duplicate, delete.
        More than three belong in a menu.
      </>,
      <>
        A density an ordinary button cannot and should not offer: 28×28 px,
        no frame, no label. A button in a header and a button in the
        twentieth row of a table are not the same thing, which is why this
        is its own primitive.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Hlavní akce obrazovky. „Nová objednávka“ v hlavičce je{" "}
        <IngotCode>IngotButton</IngotCode> s popiskem — tenhle rozpočet
        platí jen v řádku, kde se opakuje dvacetkrát.
      </>,
      <>
        Čtyři a víc akcí. Řada ikon bez popisků se přestane číst a jediné
        rozlišení je tvar piktogramu; přesuň je do menu.
      </>,
      <>
        Samotné mazání. Nevratná akce má tón <IngotCode>danger</IngotCode>,
        ale sama nemaže — potvrzení řeší <IngotCode>IngotConfirm</IngotCode>{" "}
        u volajícího. Tón mění jen to, jak tlačítko vypadá při najetí.
      </>,
    ],
    en: [
      <>
        The primary action of a screen. “New order” in a header is an{" "}
        <IngotCode>IngotButton</IngotCode> with a label — this budget only
        applies in a row, where it repeats twenty times.
      </>,
      <>
        Four or more actions. A row of unlabelled icons stops being read and
        the only distinction left is the shape of the glyph; move them into
        a menu.
      </>,
      <>
        Deleting on its own. An irreversible action carries the{" "}
        <IngotCode>danger</IngotCode> tone, but it does not delete by
        itself — confirmation is handled by{" "}
        <IngotCode>IngotConfirm</IngotCode> at the caller. The tone only
        changes how the button looks on hover.
      </>,
    ],
  },
  props: [
    {
      name: "actions",
      type: "readonly IngotRowAction[]",
      required: true,
      note: {
        cs: "Akce v pevném pořadí, stejném na každém řádku i na každé stránce. Víc než tři už patří do menu.",
        en: "The actions in a fixed order, the same on every row and every page. More than three belong in a menu.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro test na celé skupině. Jednotlivá tlačítka mají vlastní testId.",
        en: "A test anchor on the whole group. Individual buttons have their own testId.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotRowAction",
      note: {
        cs: "Jedna akce, předává se vlastností actions.",
        en: "One action, passed through the actions prop.",
      },
      props: [
        {
          name: "icon",
          type: "IngotIconName",
          required: true,
          note: {
            cs: "Piktogram ze sady kitu. Je to jediné, co je na tlačítku vidět.",
            en: "A glyph from the kit's set. It is the only thing visible on the button.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený popisek začínající slovesem: „Smazat objednávku“, ne „Koš“. Slouží zároveň jako klíč, takže musí být v seznamu jedinečný.",
            en: "A translated label starting with a verb: “Delete order”, not “Trash”. It doubles as the key, so it must be unique within the list.",
          },
        },
        {
          name: "onClick",
          type: "() => void",
          required: true,
          note: {
            cs: "Co se stane po kliknutí. U nevratné akce sem patří otevření potvrzení, ne samotné smazání.",
            en: "What happens on click. For an irreversible action this is where the confirmation opens, not the deletion itself.",
          },
        },
        {
          name: "tone",
          type: '"default" | "danger"',
          required: false,
          note: {
            cs: "Nevratná akce zčervená při najetí. Výchozí je default.",
            en: "An irreversible action turns red on hover. The default is default.",
          },
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          note: {
            cs: "Akce, kterou tenhle řádek nedovoluje. Zůstane na místě, jen ztlumená — mizející tlačítko přehází pořadí zbylých.",
            en: "An action this row does not allow. It stays in place, only dimmed — a vanishing button reshuffles the order of the rest.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva pro test na jednom tlačítku.",
            en: "A test anchor on a single button.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Popisek je <strong>povinný a začíná slovesem</strong>. Bez něj
        odečítač přečte jen „tlačítko“, dvacetkrát pod sebou — proto
        „Smazat objednávku“, ne „Koš“.
      </>,
      <>
        Týž popisek jde do <IngotCode>aria-label</IngotCode> i do{" "}
        <IngotCode>title</IngotCode>, takže se stejná věta ukáže v bublině
        i ohlásí odečítači. Jedna pravda, dvě cesty k ní.
      </>,
      <>
        Pevné pořadí je přístupnost, ne estetika. Přeházené pořadí je
        nejrychlejší cesta ke smazání špatného řádku — pro myš i pro
        klávesnici.
      </>,
      <>
        Zakázané tlačítko zůstává v pořadí i ve výpisu odečítače, jen
        ztlumené a nepoužitelné; kurzor nad ním hlásí, že akci tenhle řádek
        nedovoluje.
      </>,
    ],
    en: [
      <>
        The label is <strong>required and starts with a verb</strong>.
        Without it a screen reader announces just “button”, twenty times in
        a row — so “Delete order”, not “Trash”.
      </>,
      <>
        The same label goes into <IngotCode>aria-label</IngotCode> and{" "}
        <IngotCode>title</IngotCode>, so the same sentence appears in the
        tooltip and is announced to a screen reader. One truth, two routes
        to it.
      </>,
      <>
        The fixed order is accessibility, not aesthetics. A reshuffled order
        is the fastest route to deleting the wrong row — for the mouse and
        for the keyboard alike.
      </>,
      <>
        A disabled button keeps its place in the order and in the screen
        reader's listing, only dimmed and inert; the cursor over it says
        this row does not allow the action.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky dodává volající už přeložené — kit vlastní jmenný prostor
        překladů nemá.
      </>,
      <>
        Popisek začíná slovesem v každém jazyce. Překlad, který sloveso
        vypustí, ruší to jediné, co odečítači o akci něco říká.
      </>,
      <>
        Na délce popisku nezáleží — je jen v bublině a v odečítači, ne
        v rozvržení. Tlačítko má 28×28 px bez ohledu na jazyk, takže se
        vyplatí popsat akci celou větou.
      </>,
    ],
    en: [
      <>
        Labels are supplied by the caller already translated — the kit has
        no translation namespace of its own.
      </>,
      <>
        The label starts with a verb in every language. A translation that
        drops the verb removes the only thing that tells a screen reader
        what the action does.
      </>,
      <>
        The label's length does not matter — it lives in the tooltip and in
        the screen reader, not in the layout. The button is 28×28 px in any
        language, so it pays to describe the action in a full phrase.
      </>,
    ],
  },
};
