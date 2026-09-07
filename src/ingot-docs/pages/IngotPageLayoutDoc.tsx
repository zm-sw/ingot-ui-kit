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
  // 2.1 (KAN-977) — `width` gains `wide` and `card`. Nothing to edit: the
  // two names that existed keep their meaning and their measurements.
  //
  // 2.0 (KAN-955) — the side index is a collapsed block below `md` instead
  // of a 224px column standing beside a squeezed content; `asideLabel` is
  // required with `aside`, so existing call sites have to be edited.
  version: "2.1",
  tag: ".page",
  tokens: ["--s-5", "--s-6", "--aside", "--page-card", "--page-reading", "--page-wide"],
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
        Obrazovka, která se čte nebo vyplňuje — dlouhé nastavení, formulář, právní text:{" "}
        <IngotCode>width="reading"</IngotCode>. Řádek přes celý monitor se nečte, ale
        přelétá.
      </>,
      <>
        Detail záznamu: čte se, ale formulář to není —{" "}
        <IngotCode>width="wide"</IngotCode>. Širší než sloupec na čtení, užší než rám:
        blok roztažený na 1 440 px přestává být jeden předmět.
      </>,
      <>
        Celá obrazovka je jedna malá krabička — přihlášení, potvrzení, modul, ve kterém
        ještě nic není: <IngotCode>width="card"</IngotCode>. Jediná šířka, která se sama
        vystředí.
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
        A screen that is read or filled in — a long settings flow, a form, legal text:{" "}
        <IngotCode>width="reading"</IngotCode>. A line across a whole monitor is
        skimmed, not read.
      </>,
      <>
        A record's detail: read, but not a form — <IngotCode>width="wide"</IngotCode>.
        Wider than a reading column, narrower than the frame: a block stretched to 1,440
        px stops reading as one object.
      </>,
      <>
        The whole screen is one small box — signing in, confirming, a module with
        nothing in it yet: <IngotCode>width="card"</IngotCode>. The one width that also
        centres itself.
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
