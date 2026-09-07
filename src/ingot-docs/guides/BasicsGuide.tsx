import type { IngotGuideMeta } from "@/ingot-docs/types";

export const BasicsGuide: IngotGuideMeta = {
  slug: "zaklady",
  group: "system",
  title: { cs: "Základy", en: "Basics" },
  summary: {
    cs: "Tokeny, ze kterých je postavené všechno ostatní: barevná škála, typografický systém a mřížka prostoru.",
    en: "The tokens everything else is built from: the colour scale, the type system and the grid of space.",
  },
  sections: [
    {
      id: "barevne-role",
      title: { cs: "Barevné role", en: "Colour roles" },
    },
    {
      id: "akcentove-rodiny",
      title: { cs: "Akcentové rodiny", en: "Accent families" },
    },
    {
      id: "sw-neutral",
      title: {
        cs: "Neutrální, akcentové a stavové barvy",
        en: "Neutral, accent and state colours",
      },
    },
    {
      id: "typografie",
      title: { cs: "Typografická škála", en: "Type scale" },
    },
    {
      id: "spaces",
      title: { cs: "Prostor, rádiusy, vrstvy", en: "Space, radii, layers" },
    },
    {
      id: "motion",
      title: { cs: "Pohyb", en: "Motion" },
    },
  ],
  body: () => import("@/ingot-docs/guides/BasicsGuide.body"),
};
