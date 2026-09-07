import type { IngotGuideMeta } from "@/ingot-docs/types";

export const TokensGuide: IngotGuideMeta = {
  slug: "tokeny",
  group: "system",
  title: { cs: "Tokeny", en: "Tokens" },
  summary: {
    cs: "Všechny tokeny na jednom místě — hodnota ve světlém i tmavém motivu a spočítaný kontrast.",
    en: "Every token in one place — its value in both themes and its computed contrast.",
  },
  sections: [
    {
      id: "prehled",
      title: { cs: "Přehled", en: "The table" },
    },
  ],
  body: () => import("@/ingot-docs/guides/TokensGuide.body"),
};
