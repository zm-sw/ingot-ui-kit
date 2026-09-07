import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotBreadcrumbsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotBreadcrumbsDemo?raw");

export const IngotBreadcrumbsDoc: IngotDocMeta = {
  name: "IngotBreadcrumbs",
  status: "stable",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.2",
  tag: ".crumbs",
  tokens: ["--ink", "--ink-3", "--ink-4", "--font-mono"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Drobečky nad hlavičkou stránky — kde jsem a jak zpátky. V aplikaci bez bočního menu nesou celou orientaci do hloubky.",
    en: "Breadcrumbs above the page header — where I am and how to get back. In an application without a side menu they carry all the orientation in depth.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Detail, ke kterému se dá dojít jen přes seznam. Horní lišta říká, ve které sekci
        jsi, drobečky říkají, jak hluboko — a bez bočního menu tuhle druhou informaci
        nemá kdo jiný nést.
      </>,
      <>
        Cesta hlubší než dva články. Sekce, seznam, položka: teprve tady má čtenář co
        ztratit a drobečky mu to vrátí.
      </>,
      <>
        Návrat o úroveň výš, který není „zpátky v prohlížeči“. Kdo přišel z odkazu,
        historii nemá — cestu vzhůru mu ukážou jen drobečky.
      </>,
    ],
    en: [
      <>
        A detail you can only reach through a list. The top bar says which section you
        are in, the breadcrumbs say how deep — and without a side menu there is nobody
        else to carry that second piece.
      </>,
      <>
        A path deeper than two crumbs. Section, list, item: only here does the reader
        have something to lose, and the breadcrumbs give it back.
      </>,
      <>
        Going one level up in a way that is not the browser's back button. Someone who
        arrived from a link has no history — only the breadcrumbs show them the way
        upwards.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotBreadcrumbsDoc.body"),
};
