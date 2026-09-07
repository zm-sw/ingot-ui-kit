import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Je to nadpis sekce uvnitř obrazovky, ne nadpis obrazovky. Na to je{" "}
        <IngotCode>IngotSection</IngotCode>; dvě <IngotCode>&lt;h1&gt;</IngotCode> na
        stránce rozbijí osnovu, kterou odečítač čte.
      </>,
      <>
        Potřebuješ drobečkovou navigaci. Tu záměrně neumí: drobečky znají routu, a
        tenhle modul zůstává bez závislosti na routeru. Skládá se o patro výš — drobečky
        nad hlavičkou, hlavička z tohohle primitiva.
      </>,
    ],
    en: [
      <>
        It is a section heading inside a screen, not the screen's title. Use{" "}
        <IngotCode>IngotSection</IngotCode>; two <IngotCode>&lt;h1&gt;</IngotCode>{" "}
        elements break the outline a screen reader reads.
      </>,
      <>
        You need breadcrumbs. It deliberately cannot do them: breadcrumbs know about
        routing, and this module stays free of a router dependency. Compose them one
        level up — the trail above the header, the header from this primitive.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Nadpis obrazovky. Detail sem dává jméno záznamu, ne popisek z menu.",
        en: "The screen title. Detail routes pass the record name, not the nav label.",
      },
    },
    {
      name: "description",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Jedna věta: co tu čtenář najde.",
        en: "One sentence: what the reader finds here.",
      },
    },
    {
      name: "actions",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Shluk akcí zarovnaný doprava.",
        en: "The right-aligned action cluster.",
      },
    },
    {
      name: "titleAdornment",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Odznak vedle nadpisu — stav, počet, štítek.",
        en: "A badge beside the title — state, count, label.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid hlavičky.",
        en: "data-testid of the header.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Nadpis je <IngotCode>&lt;h1&gt;</IngotCode> a na obrazovce má být jediný — je to
        kořen osnovy, podle které se odečítač orientuje.
      </>,
      <>
        <IngotCode>description</IngotCode> je odstavec pod nadpisem, ne{" "}
        <IngotCode>aria-describedby</IngotCode>. Čte ho každý, ne jen odečítač.
      </>,
      <>
        <strong>Modul nemá žádnou závislost, a to je jeho smysl.</strong> Typografický
        spec je tu vyvedený zvlášť (<IngotCode>INGOT_PAGE_TITLE_CLASS</IngotCode>),
        takže se dá použít i tam, kde by se router načítat neměl — třeba na stránce,
        která žádné routy nemá.
      </>,
    ],
    en: [
      <>
        The title is an <IngotCode>&lt;h1&gt;</IngotCode> and there should be exactly
        one per screen — it is the root of the outline a screen reader navigates by.
      </>,
      <>
        <IngotCode>description</IngotCode> is a paragraph under the title, not{" "}
        <IngotCode>aria-describedby</IngotCode>. Everyone reads it, not only a screen
        reader.
      </>,
      <>
        <strong>The module has no dependencies, and that is the point.</strong> The type
        spec is exported separately (<IngotCode>INGOT_PAGE_TITLE_CLASS</IngotCode>), so
        it can be used where a router has no business being loaded — on a page that has
        no routes at all, say.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> a <IngotCode>description</IngotCode> dodává
        volající už přeložené.
      </>,
      <>
        Popisek u obrazovky ber ze stejného zdroje jako popisek v menu, jinak se ta dvě
        místa rozejdou.
      </>,
    ],
    en: [
      <>
        <IngotCode>title</IngotCode> and <IngotCode>description</IngotCode> arrive from
        the caller already translated.
      </>,
      <>
        Take the screen's description from the same source as the menu entry, or the two
        will drift apart.
      </>,
    ],
  },
};

export default body;
