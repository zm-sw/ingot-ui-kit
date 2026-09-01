import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotEmptyStateDemo";
import demoSource from "@/ingot-docs/demos/IngotEmptyStateDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotEmptyStateDoc: IngotDocPage = {
  name: "IngotEmptyState",
  summary: {
    cs: "Prázdný stav: jedna věta, co tu není, volitelně proč a volitelně afordance, jak to změnit.",
    en: "Empty state: one sentence saying what is missing, optionally why, and optionally the affordance that changes it.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Seznam, tabulka nebo panel nemá co ukázat a ticho by čtenář přečetl
        jako chybu načítání.
      </>,
      <>
        Prázdno je legitimní počáteční stav a existuje jeden krok, kterým se
        dá změnit. Ten krok patří do <IngotCode>action</IngotCode>.
      </>,
      <>
        Jako <IngotCode>empty</IngotCode> pro <IngotCode>IngotTable</IngotCode>. Ty dvě se
        dodávaly spolu právě proto, že tabulka bez prázdného stavu není
        hotová.
      </>,
    ],
    en: [
      <>
        A list, table or panel has nothing to show, and silence would read as
        a loading failure.
      </>,
      <>
        Empty is a legitimate starting state and there is one step that
        changes it. That step belongs in <IngotCode>action</IngotCode>.
      </>,
      <>
        As <IngotCode>empty</IngotCode> for <IngotCode>IngotTable</IngotCode>. The two shipped
        together precisely because a table without an empty state is not
        finished.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Data se ještě načítají. Na to má <IngotCode>IngotTable</IngotCode> vlastní{" "}
        <IngotCode>loading</IngotCode> s <IngotCode>aria-busy</IngotCode>; prázdný stav by tvrdil
        „nic tu není“, zatímco odpověď je na cestě.
      </>,
      <>
        Dotaz selhal. Chyba a prázdno jsou dvě různá sdělení a čtenář podle
        nich dělá dvě různé věci — u chyby chce vědět, co se stalo, ne že tu
        nic není.
      </>,
      <>
        Prázdno je důsledek filtru. Věta pak má mluvit o filtru („nic
        neodpovídá výběru“), ne o tom, že je zdroj prázdný.
      </>,
    ],
    en: [
      <>
        The data is still loading. <IngotCode>IngotTable</IngotCode> has its own{" "}
        <IngotCode>loading</IngotCode> with <IngotCode>aria-busy</IngotCode> for that; an empty
        state would claim "there is nothing here" while the answer is still
        on its way.
      </>,
      <>
        The request failed. An error and an empty result are two different
        messages and the reader acts on them differently — on an error they
        want to know what happened, not that there is nothing.
      </>,
      <>
        The emptiness is the result of a filter. Then the sentence should
        talk about the filter ("nothing matches your selection"), not about
        the source being empty.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Jedna věta, co tu není.",
        en: "One sentence: what is not here.",
      },
    },
    {
      name: "description",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Volitelně proč, nebo co s tím.",
        en: "Optionally why, or what to do about it.",
      },
    },
    {
      name: "action",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Volitelná afordance („Přidat první položku“).",
        en: 'Optional affordance ("Add the first item").',
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid prázdného stavu.",
        en: "data-testid of the empty state.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Je to obyčejný text uvnitř toku stránky, ne{" "}
        <IngotCode>role=&quot;status&quot;</IngotCode>. Prázdno není událost, kterou by
        měl odečítač hlásit — čte se v pořadí, v jakém na něj přijde.
      </>,
      <>
        Uvnitř <IngotCode>IngotTable</IngotCode> sedí v buňce, jejíž <IngotCode>colSpan</IngotCode>{" "}
        se počítá ze sloupců. Ruční tabulky mají tohle číslo natvrdo a přidání
        sloupce jim ho tiše rozejde.
      </>,
      <>
        <IngotCode>action</IngotCode> je slot, ne popisek: dostane celou afordanci
        i s jejím vlastním fokusem a popiskem.
      </>,
    ],
    en: [
      <>
        It is ordinary text in the page flow, not{" "}
        <IngotCode>role=&quot;status&quot;</IngotCode>. Emptiness is not an event a
        screen reader should announce — it is read in the order it is reached.
      </>,
      <>
        Inside <IngotCode>IngotTable</IngotCode> it sits in a cell whose{" "}
        <IngotCode>colSpan</IngotCode> is computed from the columns. Hand-rolled tables
        hard-code that number, and adding a column breaks it silently.
      </>,
      <>
        <IngotCode>action</IngotCode> is a slot, not a label: it receives the whole
        affordance together with its own focus handling and label.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode>, <IngotCode>description</IngotCode> a obsah{" "}
        <IngotCode>action</IngotCode> dodává volající už přeložené.
      </>,
      <>
        Popisek raději pojmenuj tu doménu („zatím žádné objednávky“) než ať
        zůstane u obecného „nic tu není“ — čtenář se pak nemusí ptát, co
        přesně chybí.
      </>,
    ],
    en: [
      <>
        <IngotCode>title</IngotCode>, <IngotCode>description</IngotCode> and the contents of{" "}
        <IngotCode>action</IngotCode> arrive from the caller already translated.
      </>,
      <>
        Prefer naming the domain ("no orders yet") over a generic "nothing
        here" — then the reader does not have to ask what exactly is missing.
      </>,
    ],
  },
};
