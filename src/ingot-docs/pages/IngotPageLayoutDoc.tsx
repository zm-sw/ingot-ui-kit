import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPageLayoutDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPageLayoutDemo?raw");

export const IngotPageLayoutDoc: IngotDocPage = {
  name: "IngotPageLayout",
  status: "beta",
  version: "1.0",
  tag: ".page",
  tokens: ["--s-5", "--s-6"],
  classNameNote: {
    cs: "`className` nebere. Rozvržení JE jeho obsahem — sloupce a jejich prahy drží primitivum.",
    en: "Does not take `className`. Layout IS its content — the primitive holds the columns and their thresholds.",
  },
  summary: {
    cs: "Rytmus obsahu jedné stránky — mezera mezi bloky, šířka čtení a volitelný postranní rejstřík. Co si dřív každá obrazovka skládala sama.",
    en: "The rhythm of a page's content — the gap between blocks, a reading width, and an optional side index. What every screen used to assemble by hand.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Každá obrazovka administrace. Pořadí bloků je závazné: hlavička → metriky →
        toolbar → obsah; mezery mezi nimi drží tohle primitivum, ne třídy na místě.
      </>,
      <>
        Obrazovka, která se čte — dlouhé nastavení, právní text, detail bez tabulek:{" "}
        <IngotCode>width="reading"</IngotCode>. Řádek přes celý monitor se nečte, ale
        přelétá.
      </>,
      <>
        Obrazovka s vlastním rejstříkem (<IngotCode>aside</IngotCode> +{" "}
        <IngotCode>IngotSideNav</IngotCode>): rejstřík stojí, obsah roluje.
      </>,
    ],
    en: [
      <>
        Every admin screen. The block order is binding: header → metrics → toolbar →
        content; the gaps between them are held by this primitive, not by classes
        written in place.
      </>,
      <>
        A screen that is read — a long settings flow, legal text, a detail with no
        tables: <IngotCode>width="reading"</IngotCode>. A line across a whole monitor is
        skimmed, not read.
      </>,
      <>
        A screen with its own index (<IngotCode>aside</IngotCode> +{" "}
        <IngotCode>IngotSideNav</IngotCode>): the index stands still, the content
        scrolls.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Vnější rám aplikace — šířku 1440 px a odsazení od okrajů drží shell pod horní
        lištou, ne stránka.
      </>,
      <>
        Mřížka karet nebo dvousloupcový blok uvnitř obsahu. To je vnitřek bloku (grid na
        místě), ne rám stránky — rám nemá vědět, co v něm je.
      </>,
      <>
        Boční <em>navigace aplikace</em>. Administrace ji nemá;{" "}
        <IngotCode>aside</IngotCode> je rejstřík obsahu jedné stránky.
      </>,
    ],
    en: [
      <>
        The application's outer frame — the 1440 px width and the edge padding are held
        by the shell under the top bar, not by the page.
      </>,
      <>
        A card grid or a two-column block inside the content. That is the inside of a
        block (a grid written in place), not the page frame — the frame must not know
        what is in it.
      </>,
      <>
        Application-level side <em>navigation</em>. The admin has none;{" "}
        <IngotCode>aside</IngotCode> is the index of one page's content.
      </>,
    ],
  },
  props: [
    {
      name: "width",
      type: '"full" | "reading"',
      required: false,
      note: {
        cs: "full (výchozí) pro tabulky a seznamy · reading pro obrazovky, které se čtou.",
        en: "full (default) for tables and lists · reading for screens that are read.",
      },
    },
    {
      name: "aside",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Postranní rejstřík vlevo, typicky IngotSideNav. Sloupec je sticky.",
        en: "The side index on the left, typically IngotSideNav. The column is sticky.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Bloky stránky v závazném pořadí. Mezery mezi nimi kreslí layout.",
        en: "The page's blocks in the binding order. The gaps between them are drawn by the layout.",
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
  a11y: {
    cs: [
      <>
        Layout nekreslí žádné role — orientační body dodávají bloky uvnitř (hlavička,
        sekce, rejstřík). Rám, který by je zdvojoval, by je znehodnotil.
      </>,
      <>
        Rejstřík v <IngotCode>aside</IngotCode> stojí PŘED obsahem i v DOM, takže
        klávesnice ho potká první — stejně jako oko.
      </>,
    ],
    en: [
      <>
        The layout draws no roles — the landmarks come from the blocks inside (header,
        sections, index). A frame duplicating them would devalue them.
      </>,
      <>
        The index in <IngotCode>aside</IngotCode> comes before the content in the DOM
        too, so the keyboard meets it first — same as the eye.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Layout žádný text nekreslí — všechno přeložené dodávají bloky uvnitř.</>,
      <>
        Šířka <IngotCode>reading</IngotCode> je stejná pro všechny jazyky: měří se
        čitelností řádku, ne délkou konkrétního překladu.
      </>,
    ],
    en: [
      <>
        The layout draws no text — everything translated comes from the blocks inside.
      </>,
      <>
        The <IngotCode>reading</IngotCode> width is the same in every language: it is
        measured by line readability, not by the length of a particular translation.
      </>,
    ],
  },
};
