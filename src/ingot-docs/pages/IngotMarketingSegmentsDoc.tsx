import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingSegmentsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingSegmentsDemo?raw");

export const IngotMarketingSegmentsDoc: IngotDocMeta = {
  name: "IngotMarketingSegments",
  status: "beta",
  version: "1.0",
  tag: ".seg-card",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Karty „pro koho“ — titulek, věta a štítky provozu. Žádný štítek nenese akcent; ten patří hlavičce sekce.",
    en: "The “who it is for” cards — a title, a sentence and shop-floor tags. No tag carries the accent; that belongs to the section head.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Stránka odpovídá na „je to pro mě?“ a odpověď se dá rozdělit na několik typů
        provozu.
      </>,
      <>
        Ke každému segmentu patří pár technických štítků, podle kterých se čtenář pozná
        rychleji než podle věty.
      </>,
    ],
    en: [
      <>
        The page answers “is this for me?” and the answer splits into a few kinds of
        operation.
      </>,
      <>
        Each segment comes with a couple of technical tags a reader recognises
        themselves by faster than by a sentence.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingSegmentsDoc.body"),
};
