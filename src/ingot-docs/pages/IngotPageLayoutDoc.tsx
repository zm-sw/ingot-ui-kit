import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPageLayoutDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPageLayoutDemo?raw");

export const IngotPageLayoutDoc: IngotDocMeta = {
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
  body: () => import("@/ingot-docs/pages/IngotPageLayoutDoc.body"),
};
