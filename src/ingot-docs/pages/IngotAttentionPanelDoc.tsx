import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAttentionPanelDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAttentionPanelDemo?raw");

export const IngotAttentionPanelDoc: IngotDocMeta = {
  name: "IngotAttentionPanel",
  status: "beta",
  // 1.1: the aside column grows (flex-1, basis-80) — the signal grid of
  // the overview needs the rest of the panel width.
  version: "1.1",
  tag: ".attention",
  tokens: ["--ink", "--bg", "--warn", "--r-lg", "--shadow-md"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Tmavý panel „co po tobě obrazovka chce teď“ v hlavě přehledu. Jediné místo, kde je karta tmavší než pozadí — signál, který drží, jen dokud je vzácný.",
    en: "The dark “what this screen wants from you now” panel at the head of an overview. The one place where a card is darker than the page — a signal that holds only while it stays rare.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Hlava přehledové obrazovky: co dnes čeká na zásah, s cestou rovnou k tomu —
        signální počty, jedna akce.
      </>,
      <>
        Nejvýš <strong>jeden na stránce</strong>. Panel je výjimka z pravidla, že pozadí
        je vždy tmavší než karta, a výjimka signalizuje, jen dokud je jedna.
      </>,
    ],
    en: [
      <>
        The head of an overview screen: what waits for action today, with a path
        straight to it — signal counts, one action.
      </>,
      <>
        At most <strong>one per page</strong>. The panel is the exception to “the page
        is always darker than the card”, and an exception signals only while there is
        one.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotAttentionPanelDoc.body"),
};
