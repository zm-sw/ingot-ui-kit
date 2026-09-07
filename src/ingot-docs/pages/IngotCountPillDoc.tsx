import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotCountPillDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotCountPillDemo?raw");

export const IngotCountPillDoc: IngotDocMeta = {
  name: "IngotCountPill",
  status: "beta",
  version: "1.0",
  tag: ".countpill",
  tokens: ["--surface", "--surface-2", "--ink-3", "--font-mono"],
  classNameNote: {
    cs: "`className` nebere. Je to jeden tvar na celý produkt — kdyby brala rozvržení, pilulka u nadpisu a pilulka v tabu se rozejdou, a přesně proto vznikla.",
    en: "Does not take `className`. It is one shape for the whole product — take layout here and the pill by a heading drifts from the pill in a tab, which is exactly what it was made to stop.",
  },
  summary: {
    cs: "Kulatá pilulka s číslem: kolik záznamů je za tím, vedle čeho stojí. Nula se kreslí.",
    en: "A round pill with a number in it: how many records are behind the thing it stands next to. Zero is drawn.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nadpis sekce nebo tab má nést počet — „Struktura článku 10“. Čtenář se podle něj
        rozhoduje, jestli tam vůbec chodit.
      </>,
      <>
        Číslo je krátké. Pilulka je kulatá a čtyřciferný počet z ní udělá ovál, který
        vedle nadpisu ruší.
      </>,
    ],
    en: [
      <>
        A section heading or a tab is to carry a count — “Article structure 10”. The
        reader decides by it whether to go there at all.
      </>,
      <>
        The number is short. The pill is round, and a four-digit count turns it into an
        oval that fights the heading next to it.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotCountPillDoc.body"),
};
