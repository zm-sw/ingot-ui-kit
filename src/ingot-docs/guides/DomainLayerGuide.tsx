import type { IngotGuideMeta } from "@/ingot-docs/types";

export const DomainLayerGuide: IngotGuideMeta = {
  slug: "domenova-vrstva",
  group: "rules",
  title: { cs: "Doménová vrstva", en: "The domain layer" },
  summary: {
    cs: "Co v kitu není kit: ikony operací, převod schémat a pravidla produktu mají vlastní vstup balíčku.",
    en: "What in the kit is not the kit: operation icons, schema adapters and product rules have their own package entry.",
  },
  sections: [
    {
      id: "otazka",
      title: { cs: "Jedna otázka, ne seznam", en: "One question, not a list" },
    },
    {
      id: "kdo-co-bere",
      title: { cs: "Kdo si co bere", en: "Who takes what" },
    },
  ],
  body: () => import("@/ingot-docs/guides/DomainLayerGuide.body"),
};
