import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotListDemo";
import demoSource from "@/ingot-docs/demos/IngotListDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotListDoc: IngotDocPage = {
  name: "IngotList",
  status: "stable",
  version: "1.0",
  tag: ".list",
  tokens: ["--ink-2"],
  summary: {
    cs: "Výčet: odrážky, čísla, nebo holý seznam bez značek. Značka i odsazení patří k sobě a rozhoduje se o nich na jednom místě.",
    en: "A list: bullets, numbers, or no markers at all. The marker and the indent belong together, and one place decides both.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Několik rovnocenných položek, které nejsou tabulka. Odečítač u
        seznamu ohlásí, kolik jich je — u odstavců za sebou ne.
      </>,
      <>
        Na pořadí záleží (postup, kroky migrace) →{" "}
        <IngotCode>variant=&quot;ordered&quot;</IngotCode>. Číslo pak není napsané
        v textu a nerozejde se, když někdo krok přidá doprostřed.
      </>,
      <>
        Seznam odkazů — navigace, obsah stránky. Na to je{" "}
        <IngotCode>variant=&quot;plain&quot;</IngotCode>: značka je tam šum, ale počet
        položek se hlásit má.
      </>,
    ],
    en: [
      <>
        Several peer items that are not a table. On a list a screen reader
        announces how many there are — on consecutive paragraphs it does not.
      </>,
      <>
        Order matters (a procedure, migration steps) →{" "}
        <IngotCode>variant=&quot;ordered&quot;</IngotCode>. The number is then not
        written into the text and cannot drift when someone inserts a step in
        the middle.
      </>,
      <>
        A list of links — navigation, a table of contents. That is{" "}
        <IngotCode>variant=&quot;plain&quot;</IngotCode>: the marker is noise there, but
        the item count should still be announced.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Položky mají víc než jeden rozměr (jméno + stav + datum). To je
        tabulka — <IngotCode>IngotTable</IngotCode>.
      </>,
      <>
        Je to jedna položka. Seznam o jednom prvku odečítač ohlásí jako
        seznam, což čtenáře upozorní na strukturu, která tam není.
      </>,
      <>
        Dvojice „popisek — hodnota" u jednoho záznamu. To je definiční
        seznam, ne výčet; význam je jiný a odečítač ho čte jinak.
      </>,
    ],
    en: [
      <>
        The items have more than one dimension (name + state + date). That is
        a table — <IngotCode>IngotTable</IngotCode>.
      </>,
      <>
        There is one item. A one-item list is still announced as a list, which
        points the reader at a structure that is not there.
      </>,
      <>
        Label–value pairs for a single record. That is a description list, not
        a bullet list; the meaning differs and a screen reader reads it
        differently.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly ReactNode[]",
      required: true,
      note: {
        cs: "Položky. Celé uzly, takže smí obsahovat odkaz i zvýraznění.",
        en: "The items. Whole nodes, so they may contain links and emphasis.",
      },
    },
    {
      name: "variant",
      type: '"bullet" | "ordered" | "plain"',
      required: false,
      note: {
        cs: "bullet odrážky · ordered čísla · plain bez značek. Výchozí bullet.",
        en: "bullet · ordered numbers · plain no markers. Defaults to bullet.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid seznamu.", en: "data-testid of the list." },
    },
  ],
  a11y: {
    cs: [
      <>
        Vždycky vzniká skutečný <IngotCode>&lt;ul&gt;</IngotCode> nebo{" "}
        <IngotCode>&lt;ol&gt;</IngotCode> s <IngotCode>&lt;li&gt;</IngotCode>. To je celý důvod,
        proč tohle není <IngotCode>&lt;div&gt;</IngotCode> s odrážkami nakreslenými
        v CSS: počet položek a jejich hranice zná odečítač jen ze značek.
      </>,
      <>
        <IngotCode>variant=&quot;plain&quot;</IngotCode> schovává jen značku, ne
        strukturu. Seznam odkazů proto zůstane seznamem, i když puntíky
        nevidíš.
      </>,
      <>
        <IngotCode>ordered</IngotCode> nechává čísla na prohlížeči. Ručně napsané
        „1.", „2." odečítač přečte jako text a při vložení kroku doprostřed
        se rozejdou.
      </>,
    ],
    en: [
      <>
        It always produces a real <IngotCode>&lt;ul&gt;</IngotCode> or{" "}
        <IngotCode>&lt;ol&gt;</IngotCode> with <IngotCode>&lt;li&gt;</IngotCode> children. That is
        the whole reason this is not a <IngotCode>&lt;div&gt;</IngotCode> with bullets
        drawn in CSS: item count and item boundaries are known to a screen
        reader only from the markup.
      </>,
      <>
        <IngotCode>variant=&quot;plain&quot;</IngotCode> hides the marker, not the
        structure. A list of links stays a list even when you see no bullets.
      </>,
      <>
        <IngotCode>ordered</IngotCode> leaves the numbering to the browser. Hand-written
        "1.", "2." is read as text and drifts the moment a step is inserted in
        the middle.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Položky dodává volající už přeložené — seznam si žádný text nedrží.
      </>,
      <>
        U <IngotCode>ordered</IngotCode> nepiš čísla do textu; vykresluje je prohlížeč
        podle jazyka a stylu.
      </>,
    ],
    en: [
      <>
        The items arrive from the caller already translated — the list holds
        no text of its own.
      </>,
      <>
        With <IngotCode>ordered</IngotCode>, do not write the numbers into the text; the
        browser renders them according to language and style.
      </>,
    ],
  },
};
