import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Položky mají víc než jeden rozměr (jméno + stav + datum). To je tabulka —{" "}
        <IngotCode>IngotTable</IngotCode>.
      </>,
      <>
        Je to jedna položka. Seznam o jednom prvku odečítač ohlásí jako seznam, což
        čtenáře upozorní na strukturu, která tam není.
      </>,
      <>
        Dvojice „popisek — hodnota" u jednoho záznamu. To je definiční seznam, ne výčet;
        význam je jiný a odečítač ho čte jinak.
      </>,
    ],
    en: [
      <>
        The items have more than one dimension (name + state + date). That is a table —{" "}
        <IngotCode>IngotTable</IngotCode>.
      </>,
      <>
        There is one item. A one-item list is still announced as a list, which points
        the reader at a structure that is not there.
      </>,
      <>
        Label–value pairs for a single record. That is a description list, not a bullet
        list; the meaning differs and a screen reader reads it differently.
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
        <IngotCode>&lt;ol&gt;</IngotCode> s <IngotCode>&lt;li&gt;</IngotCode>. To je
        celý důvod, proč tohle není <IngotCode>&lt;div&gt;</IngotCode> s odrážkami
        nakreslenými v CSS: počet položek a jejich hranice zná odečítač jen ze značek.
      </>,
      <>
        <IngotCode>variant=&quot;plain&quot;</IngotCode> schovává jen značku, ne
        strukturu. Seznam odkazů proto zůstane seznamem, i když puntíky nevidíš.
      </>,
      <>
        <IngotCode>ordered</IngotCode> nechává čísla na prohlížeči. Ručně napsané „1.",
        „2." odečítač přečte jako text a při vložení kroku doprostřed se rozejdou.
      </>,
    ],
    en: [
      <>
        It always produces a real <IngotCode>&lt;ul&gt;</IngotCode> or{" "}
        <IngotCode>&lt;ol&gt;</IngotCode> with <IngotCode>&lt;li&gt;</IngotCode>{" "}
        children. That is the whole reason this is not a{" "}
        <IngotCode>&lt;div&gt;</IngotCode> with bullets drawn in CSS: item count and
        item boundaries are known to a screen reader only from the markup.
      </>,
      <>
        <IngotCode>variant=&quot;plain&quot;</IngotCode> hides the marker, not the
        structure. A list of links stays a list even when you see no bullets.
      </>,
      <>
        <IngotCode>ordered</IngotCode> leaves the numbering to the browser. Hand-written
        "1.", "2." is read as text and drifts the moment a step is inserted in the
        middle.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Položky dodává volající už přeložené — seznam si žádný text nedrží.</>,
      <>
        U <IngotCode>ordered</IngotCode> nepiš čísla do textu; vykresluje je prohlížeč
        podle jazyka a stylu.
      </>,
    ],
    en: [
      <>
        The items arrive from the caller already translated — the list holds no text of
        its own.
      </>,
      <>
        With <IngotCode>ordered</IngotCode>, do not write the numbers into the text; the
        browser renders them according to language and style.
      </>,
    ],
  },
};

export default body;
