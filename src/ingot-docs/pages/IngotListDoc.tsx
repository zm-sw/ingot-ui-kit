import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotListDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotListDemo?raw");

export const IngotListDoc: IngotDocMeta = {
  name: "IngotList",
  status: "stable",
  // 1.1 — class composition via cx(); no visible change.
  version: "1.1",
  tag: ".list",
  tokens: ["--ink-2"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Výčet: odrážky, čísla, nebo holý seznam bez značek. Značka i odsazení patří k sobě a rozhoduje se o nich na jednom místě.",
    en: "A list: bullets, numbers, or no markers at all. The marker and the indent belong together, and one place decides both.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Několik rovnocenných položek, které nejsou tabulka. Odečítač u seznamu ohlásí,
        kolik jich je — u odstavců za sebou ne.
      </>,
      <>
        Na pořadí záleží (postup, kroky migrace) →{" "}
        <IngotCode>variant=&quot;ordered&quot;</IngotCode>. Číslo pak není napsané v
        textu a nerozejde se, když někdo krok přidá doprostřed.
      </>,
      <>
        Seznam odkazů — navigace, obsah stránky. Na to je{" "}
        <IngotCode>variant=&quot;plain&quot;</IngotCode>: značka je tam šum, ale počet
        položek se hlásit má.
      </>,
    ],
    en: [
      <>
        Several peer items that are not a table. On a list a screen reader announces how
        many there are — on consecutive paragraphs it does not.
      </>,
      <>
        Order matters (a procedure, migration steps) →{" "}
        <IngotCode>variant=&quot;ordered&quot;</IngotCode>. The number is then not
        written into the text and cannot drift when someone inserts a step in the
        middle.
      </>,
      <>
        A list of links — navigation, a table of contents. That is{" "}
        <IngotCode>variant=&quot;plain&quot;</IngotCode>: the marker is noise there, but
        the item count should still be announced.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotListDoc.body"),
};
