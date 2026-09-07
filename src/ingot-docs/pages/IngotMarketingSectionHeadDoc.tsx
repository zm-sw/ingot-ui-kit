import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingSectionHeadDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingSectionHeadDemo?raw");

export const IngotMarketingSectionHeadDoc: IngotDocMeta = {
  name: "IngotMarketingSectionHead",
  status: "beta",
  // 1.1 — eyebrow set by IngotEyebrow (size md, accent tone).
  version: "1.1",
  tag: ".section-head",
  tokens: ["--accent", "--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Hlavička marketingové sekce — nadpis vlevo, uvozující odstavec vpravo. Akcent nese jediný prvek: eyebrow.",
    en: "A marketing section head — the heading on the left, the lede on the right. One element carries the accent: the eyebrow.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce veřejné stránky začíná a potřebuje nadpis s uvozujícím odstavcem.
        Dvousloupec drží pravidlo handoffu: nadpis nese levý sloupec, kontext pravý.
      </>,
      <>
        Sekce potřebuje krátký štítek nad nadpisem — <IngotCode>eyebrow</IngotCode> je
        JEDINÝ akcentový prvek sekce a tím určuje, kam padne oko první.
      </>,
    ],
    en: [
      <>
        A section of a public page opens and needs a heading with a lede. The two-column
        split holds the handoff rule: the heading carries the left column, the context
        the right one.
      </>,
      <>
        The section needs a short label above the heading —{" "}
        <IngotCode>eyebrow</IngotCode> is the ONLY accented element of the section and
        so decides where the eye lands first.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingSectionHeadDoc.body"),
};
