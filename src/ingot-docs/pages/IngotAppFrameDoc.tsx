import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAppFrameDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAppFrameDemo?raw");

export const IngotAppFrameDoc: IngotDocMeta = {
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
  body: () => import("@/ingot-docs/pages/IngotAppFrameDoc.body"),
};
