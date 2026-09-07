import type { IngotGuideMeta } from "@/ingot-docs/types";

export const FormatsGuide: IngotGuideMeta = {
  slug: "jazyky-a-formaty",
  group: "rules",
  title: { cs: "Jazyky a formáty", en: "Languages and formats" },
  summary: {
    cs: "Delší překlady, tři tvary množného čísla, česká a anglická podoba dat a čísel, kódy bez překladu a společný slovník pojmů.",
    en: "Longer translations, three plural forms, the Czech and English shape of dates and numbers, codes that are never translated, and the shared term dictionary.",
  },
  sections: [
    {
      id: "delka-a-plural",
      title: { cs: "Délka a množné číslo", en: "Length and plurals" },
    },
    {
      id: "formaty",
      title: { cs: "Formáty", en: "Formats" },
    },
    {
      id: "cisla-a-kody",
      title: { cs: "Čísla a kódy", en: "Numbers and codes" },
    },
    {
      id: "slovnik",
      title: { cs: "Slovník", en: "The dictionary" },
    },
  ],
  body: () => import("@/ingot-docs/guides/FormatsGuide.body"),
};
