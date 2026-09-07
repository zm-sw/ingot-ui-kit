import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
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

export default body;
