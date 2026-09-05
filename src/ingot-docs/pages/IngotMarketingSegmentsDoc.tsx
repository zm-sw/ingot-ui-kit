import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingSegmentsDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingSegmentsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. Štítek je hranatý mono minuskami — technický údaj o provozu,
// ne stav entity. Kulatá pilulka s verzálkami je IngotBadge.
export const IngotMarketingSegmentsDoc: IngotDocPage = {
  name: "IngotMarketingSegments",
  status: "beta",
  version: "1.0",
  tag: ".seg-card",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-3"],
  summary: {
    cs: "Karty „pro koho“ — titulek, věta a štítky provozu. Žádný štítek nenese akcent; ten patří hlavičce sekce.",
    en: "The “who it is for” cards — a title, a sentence and shop-floor tags. No tag carries the accent; that belongs to the section head.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Stránka odpovídá na „je to pro mě?“ a odpověď se dá rozdělit na
        několik typů provozu.
      </>,
      <>
        Ke každému segmentu patří pár technických štítků, podle kterých
        se čtenář pozná rychleji než podle věty.
      </>,
    ],
    en: [
      <>
        The page answers “is this for me?” and the answer splits into a
        few kinds of operation.
      </>,
      <>
        Each segment comes with a couple of technical tags a reader
        recognises themselves by faster than by a sentence.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Štítek má hlásit stav entity (aktivní, čeká, zrušeno). Na to je{" "}
        <IngotCode>IngotBadge</IngotCode> — kulatá pilulka s verzálkami.
        Tenhle štítek je technický údaj, ne stav.
      </>,
      <>
        Segmenty se mají porovnat mezi sebou položku po položce. Na to
        je <IngotCode>IngotMarketingComparison</IngotCode>: karty vedle
        sebe se párovat nedají.
      </>,
    ],
    en: [
      <>
        The tag should announce entity state (active, pending,
        cancelled). That is <IngotCode>IngotBadge</IngotCode> — a round
        pill in capitals. This tag is a technical fact, not a state.
      </>,
      <>
        The segments are to be compared item by item. That is{" "}
        <IngotCode>IngotMarketingComparison</IngotCode>: cards side by
        side cannot be paired up.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotMarketingSegmentItem[]",
      required: true,
      note: {
        cs: "Segmenty. Trojsloupcová mřížka je výchozí tvar veřejných stránek.",
        en: "The segments. Three columns is the default shape of public pages.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy — na mřížce.", en: "An anchor for tests — on the grid." },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingSegmentItem",
      note: {
        cs: "Jeden segment. Předává se polem items.",
        en: "One segment. Passed through the items array.",
      },
      props: [
        {
          name: "title",
          type: "string",
          required: true,
          note: { cs: "Jméno segmentu. Sází se jako h3.", en: "The segment name. Set as an h3." },
        },
        {
          name: "text",
          type: "string",
          required: true,
          note: { cs: "Jedna věta o tom provozu.", en: "One sentence about that operation." },
        },
        {
          name: "tags",
          type: "readonly string[]",
          required: true,
          note: {
            cs: "Krátké technické štítky, dodané přeložené. Sází se minuskami.",
            en: "Short technical tags, supplied translated. Set in lower case.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Titulky jsou <IngotCode>h3</IngotCode>, takže se segmenty dají
        procházet po nadpisech stejně jako zbytek stránky.
      </>,
      <>
        Štítky jsou text, ne ikony ani barevné plochy — čtou se nahlas
        i tehdy, když se rozdíl mezi kartami nedá vidět.
      </>,
    ],
    en: [
      <>
        The titles are <IngotCode>h3</IngotCode>, so the segments can be
        walked by heading like the rest of the page.
      </>,
      <>
        The tags are text, not icons or colour fields — they are read
        aloud even when the difference between cards cannot be seen.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Štítky jsou obsah, ne výčtový typ: překládají se a dodává je
        volající. Kit jejich seznam nezná.
      </>,
      <>
        Minusky drží sazba, ne data —{" "}
        <IngotCode>lowercase</IngotCode> je vzhled štítku, takže se
        v datech nemusí psát malými.
      </>,
    ],
    en: [
      <>
        The tags are content, not an enum: they are translated and
        supplied by the caller. The kit does not know their list.
      </>,
      <>
        Lower case is typography, not data —{" "}
        <IngotCode>lowercase</IngotCode> is the tag's look, so the data
        need not be written in lower case.
      </>,
    ],
  },
};
