import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPageHeaderDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPageHeaderDemo?raw");

export const IngotPageHeaderDoc: IngotDocMeta = {
  name: "IngotPageHeader",
  status: "stable",
  version: "1.0",
  tag: ".pagehead",
  tokens: ["--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Sazba nadpisu stránky patří systému, ne obrazovce — mezery pod ním řeší rám stránky.",
    en: "Does not take `className`. The page heading's typesetting belongs to the system, not to a screen — the page frame holds the spacing below it.",
  },
  summary: {
    cs: "Hlavička obrazovky: nadpis, věta pod ním, akce vpravo. Typografický spec má jedno místo a nenese s sebou router.",
    en: "The screen header: a title, a sentence under it, actions on the right. One home for the type spec, and it drags no router along.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka má nadpis. To je prakticky každá — proto tohle primitivum drží spec,
        který by se jinak opisoval.
      </>,
      <>
        K nadpisu patří akce (přidat, exportovat, filtr). <IngotCode>actions</IngotCode>{" "}
        je zarovná doprava a nechá je zalomit, když se nevejdou.
      </>,
      <>
        Ke jménu patří stav — odznak, počet, štítek. To je{" "}
        <IngotCode>titleAdornment</IngotCode>, ne text vlepený do nadpisu.
      </>,
    ],
    en: [
      <>
        The screen has a title. That is nearly every screen — which is why this
        primitive owns a spec that would otherwise be copied around.
      </>,
      <>
        The title comes with actions (add, export, filter).{" "}
        <IngotCode>actions</IngotCode> aligns them right and lets them wrap when they do
        not fit.
      </>,
      <>
        The name comes with a state — a badge, a count, a label. That is{" "}
        <IngotCode>titleAdornment</IngotCode>, not text glued into the title.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotPageHeaderDoc.body"),
};
