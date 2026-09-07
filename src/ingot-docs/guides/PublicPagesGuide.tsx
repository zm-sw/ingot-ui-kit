import type { IngotGuideMeta } from "@/ingot-docs/types";

export const PublicPagesGuide: IngotGuideMeta = {
  slug: "verejne-stranky",
  group: "app",
  title: { cs: "Veřejné stránky", en: "Public pages" },
  summary: {
    cs: "Marketingové bloky veřejného webu: hlavička sekce, featury, kroky, segmenty, srovnání, ceník, časté dotazy a závěrečná výzva.",
    en: "The marketing blocks of the public site: section head, features, steps, segments, comparison, pricing, FAQ and the closing call to action.",
  },
  sections: [
    {
      id: "zasady",
      title: { cs: "Zásady", en: "Principles" },
    },
    {
      id: "hlavicka-sekce",
      title: {
        cs: "Hlavička sekce a trojice featur",
        en: "Section head and feature trio",
      },
    },
    {
      id: "kroky",
      title: { cs: "Kroky", en: "Steps" },
    },
    {
      id: "segmenty",
      title: { cs: "Segmenty", en: "Segments" },
    },
    {
      id: "srovnani",
      title: { cs: "Srovnání", en: "Comparison" },
    },
    {
      id: "cenik",
      title: { cs: "Ceník", en: "Pricing" },
    },
    {
      id: "faq",
      title: { cs: "Časté dotazy", en: "FAQ" },
    },
    {
      id: "cta",
      title: { cs: "Závěrečná výzva", en: "Closing call to action" },
    },
  ],
  body: () => import("@/ingot-docs/guides/PublicPagesGuide.body"),
};
