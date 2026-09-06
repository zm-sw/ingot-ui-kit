import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAppFrameDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAppFrameDemo?raw");

export const IngotAppFrameDoc: IngotDocPage = {
  name: "IngotAppFrame",
  status: "beta",
  version: "1.0",
  tag: ".appframe",
  tokens: ["--bg", "--frame", "--s-4", "--s-5"],
  classNameNote: {
    cs: "Bere `className`, ale jen na svislý rytmus — odsazení shora a zdola. Šířku ne: ta je celý smysl tohoto primitiva, a kdyby ji brala zvenčí, vrátí se stav, kvůli kterému vzniklo.",
    en: "Takes `className`, but only for vertical rhythm — padding above and below. Not width: width is the whole point of this primitive, and taking it from outside would restore the state it was made to end.",
  },
  summary: {
    cs: "Rám celé obrazovky: lišta nahoře, šířka, kam obsah smí, a okraje vedle něj. Šířka je token, ne číslo v každé aplikaci.",
    en: "The frame of a whole screen: the bar at the top, the width the content may reach, and the margins beside it. The width is a token, not a number each application repeats.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nejvyšší prvek obrazovky — pod ním teprve <IngotCode>IngotPageLayout</IngotCode>
        . Rám drží šířku a okraje, layout svislý rytmus bloků uvnitř.
      </>,
      <>
        Aplikace má lištu nahoře. Rám ji přilepí k oknu a nechá ji přes celou jeho
        šířku, zatímco její řádek zůstane zarovnaný s obsahem pod ní.
      </>,
      <>
        Obrazovka, která JE data — široká tabulka, plán, nástěnka — dostane{" "}
        <IngotCode>width=&quot;full&quot;</IngotCode>. Limit tam čtenáře nechrání,
        schová mu sloupce.
      </>,
    ],
    en: [
      <>
        The outermost element of a screen — <IngotCode>IngotPageLayout</IngotCode> goes
        inside it. The frame holds the width and the margins, the layout the vertical
        rhythm of the blocks within.
      </>,
      <>
        The application has a bar at the top. The frame sticks it to the window and lets
        it span the full width, while its row stays aligned with the content below.
      </>,
      <>
        A screen that IS the data — a wide table, a plan, a board — takes{" "}
        <IngotCode>width=&quot;full&quot;</IngotCode>. A limit there does not protect
        the reader, it hides columns from them.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Uvnitř jiného rámu. Dva rámy nad sebou znamenají dvoje okraje a obsah, který
        začíná jinde, než čtenář čeká podle lišty.
      </>,
      <>
        Šířka jednoho bloku uvnitř stránky. Čtecí šířka dlouhého textu je{" "}
        <IngotCode>IngotPageLayout</IngotCode> s{" "}
        <IngotCode>width=&quot;reading&quot;</IngotCode>.
      </>,
      <>
        Modální okno nebo boční panel. Ty mají vlastní šířku a stojí nad rámem, ne v
        něm.
      </>,
    ],
    en: [
      <>
        Inside another frame. Two frames stacked mean two sets of margins and content
        that starts somewhere other than the bar led the reader to expect.
      </>,
      <>
        The width of one block inside a page. The reading width of long prose is{" "}
        <IngotCode>IngotPageLayout</IngotCode> with{" "}
        <IngotCode>width=&quot;reading&quot;</IngotCode>.
      </>,
      <>
        A modal or a side panel. Those carry their own width and stand above the frame,
        not inside it.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Obsah obrazovky — typicky `IngotPageLayout`.",
        en: "The screen's content — typically `IngotPageLayout`.",
      },
    },
    {
      name: "width",
      type: '"app" | "full"',
      required: false,
      note: {
        cs: "`app` (výchozí) končí na `--frame`; `full` pustí obsah k oběma okrajům. Výchozí je `app`, protože obrazovek, které jsou širokou tabulkou, je pár, a ostatní by na velkém monitoru neměl kdo přečíst.",
        en: "`app` (the default) stops at `--frame`; `full` lets the content reach both edges. `app` is the default because screens that ARE a wide table are the few, and the rest would be unreadable across a large monitor.",
      },
    },
    {
      name: "bar",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Lišta nahoře, typicky `IngotTopNav`. Lepí se k oknu a jde přes celou jeho šířku; jejímu `contentClassName` předej `INGOT_FRAME_ROW`, ať její řádek sedí na obsah pod ní.",
        en: "The bar at the top, typically `IngotTopNav`. It sticks to the window and spans its full width; pass `INGOT_FRAME_ROW` to its `contentClassName` so its row lines up with the content below.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen svislý rytmus — odsazení shora a zdola. Šířka sem nepatří.",
        en: "Vertical rhythm only — padding above and below. Width does not belong here.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  extraProps: [
    {
      name: "INGOT_FRAME_ROW",
      note: {
        cs: "Konstanta, ne typ: šířka rámu a jeho okraje jako třída. Předává se do `contentClassName` lišty.",
        en: "A constant, not a type: the frame's width and margins as a class. It goes into a bar's `contentClassName`.",
      },
      props: [
        {
          name: "INGOT_FRAME_ROW",
          type: "string",
          required: false,
          note: {
            cs: "Pro řádek, který má sedět na obsah, zatímco jeho vlastní prvek jde přes celé okno — lišta nahoře, přilepená lišta akcí dole. Bez ní by logo v liště začínalo jinde než nadpis pod ní.",
            en: "For a row that has to line up with the content while its own element spans the window — the bar at the top, a sticky action bar at the bottom. Without it the logo in the bar starts somewhere other than the heading below it.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Rám nekreslí orientační bod. Lišta si svůj <IngotCode>nav</IngotCode> nese sama
        a <IngotCode>main</IngotCode> patří obrazovce — rám neví, který z jeho potomků
        je hlavní obsah, a hádat by znamenalo dát odečítači špatnou mapu stránky.
      </>,
      <>
        Přilepená lišta má <IngotCode>z-30</IngotCode>: pod překryvy (modál, panel,
        toast) a nad vším, co kreslí stránka. Lišta, za kterou zmizí otevřený popover,
        je horší než lišta, která se nelepí vůbec.
      </>,
    ],
    en: [
      <>
        The frame draws no landmark. The bar carries its own <IngotCode>nav</IngotCode>{" "}
        and <IngotCode>main</IngotCode> belongs to the screen — the frame does not know
        which of its children is the main content, and guessing would hand a screen
        reader the wrong map of the page.
      </>,
      <>
        The sticky bar sits at <IngotCode>z-30</IngotCode>: below the overlays (modal,
        drawer, toast) and above everything a page draws. A bar an open popover
        disappears behind is worse than one that does not stick at all.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Rám neříká nic — nemá jediný vlastní text. Vše, co je v něm vidět, dodává
        volající už přeložené.
      </>,
    ],
    en: [
      <>
        The frame says nothing — it carries no text of its own. Everything visible
        inside it arrives from the caller already translated.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Šířka je <IngotCode>1440px</IngotCode> podle handoffu. Doc web do teď končil na
        1280 — ne proto, že by to někdo rozhodl, ale protože{" "}
        <IngotCode>max-w-7xl</IngotCode> je třída nejblíž po ruce. Rozhodnutí je teď
        jedno a je v tokenu <IngotCode>--frame</IngotCode>.
      </>,
      <>
        Rám nekreslí patičku a nemá slot pro postranní panel na celou výšku. Až
        obrazovka s trvalým bočním panelem opravdu vznikne, přibude i s pravidlem, kdy
        se používá — slot, který nikdo neplní, je jen další způsob, jak se dvě aplikace
        rozejdou.
      </>,
    ],
    en: [
      <>
        The width is <IngotCode>1440px</IngotCode>, from the handoff. The doc web
        stopped at 1280 until now — not because anyone decided so, but because{" "}
        <IngotCode>max-w-7xl</IngotCode> is the class nearest to hand. The decision is
        one decision now, and it lives in the <IngotCode>--frame</IngotCode> token.
      </>,
      <>
        The frame draws no footer and has no slot for a full-height side panel. When a
        screen with a permanent side panel actually exists, that slot arrives with the
        rule for when it applies — a slot nobody fills is one more way for two
        applications to drift apart.
      </>,
    ],
  },
};
