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
  // 2.0 (KAN-955) — the side index is a collapsed block below `md` instead
  // of a 224px column standing beside a squeezed content; `asideLabel` is
  // required with `aside`, so existing call sites have to be edited.
  version: "2.0",
  tag: ".page",
  tokens: ["--s-5", "--s-6", "--aside"],
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
        cs: "Postranní rejstřík vlevo, typicky IngotSideNav. Od `md` sticky sloupec široký `--aside`; pod `md` sbalený blok nad obsahem. Chodí ve dvojici s `asideLabel` — typ nedovolí jedno bez druhého.",
        en: "The side index on the left, typically IngotSideNav. From `md` a sticky column `--aside` wide; below `md` a collapsed block above the content. It travels with `asideLabel` — the type does not allow one without the other.",
      },
    },
    {
      name: "asideLabel",
      type: "string",
      required: false,
      note: {
        cs: "Jak se sbalený rejstřík jmenuje na úzké obrazovce („Obsah“), už přeložené. S `aside` povinné: pod `md` je rejstřík blok, který čtenář otevírá, a nepojmenovaný blok neotevře nikdo.",
        en: "What the collapsed index is called on a narrow screen (“Contents”), already translated. Required with `aside`: below `md` the index is a block the reader opens, and an unnamed block is one nobody opens.",
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
      <>
        Na úzké obrazovce je rejstřík v DOM právě jednou. Vykreslit obě podoby a jednu
        schovat breakpointem by znamenalo každý odkaz v dokumentu dvakrát: odečítač
        přečte oba a každé <IngotCode>id</IngotCode> uvnitř se srazí samo se sebou.
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
      <>
        On a narrow screen the index is in the DOM exactly once. Rendering both shapes
        and hiding one with a breakpoint would put every link in the document twice: a
        screen reader reads both, and every <IngotCode>id</IngotCode> inside them
        collides with itself.
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
  limits: {
    cs: [
      <>
        Rejstřík se pod <IngotCode>md</IngotCode> sbaluje do bloku, ne do tabů. Rejstřík
        je seznam odkazů neznámé délky; taby jsou pro pevnou hrstku rovnocenných věcí a
        deset sekcí v liště tabů se posouvá do strany — což je tentýž problém v jiném
        tvaru.
      </>,
      <>
        O tom, která podoba se vykreslí, rozhoduje <IngotCode>matchMedia</IngotCode>, ne
        breakpoint v CSS: obě podoby najednou by znamenaly každý odkaz v dokumentu
        dvakrát. Kde <IngotCode>matchMedia</IngotCode> není (velmi starý prohlížeč),
        zůstane úzká podoba — ta se vejde všude, široká ne.
      </>,
    ],
    en: [
      <>
        Below <IngotCode>md</IngotCode> the index collapses into a block, not into tabs.
        An index is a list of links of unknown length; tabs are for a fixed handful of
        peers, and ten sections in a tab bar scroll sideways — which is the same problem
        in a different shape.
      </>,
      <>
        Which shape renders is decided by <IngotCode>matchMedia</IngotCode> rather than
        by a CSS breakpoint: both shapes at once would put every link in the document
        twice. Where <IngotCode>matchMedia</IngotCode> is missing (a very old browser)
        the narrow shape stays — it fits everywhere, the wide one does not.
      </>,
    ],
  },
};
