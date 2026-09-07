import type { IngotGuideMeta } from "@/ingot-docs/types";

export const IconsGuide: IngotGuideMeta = {
  slug: "ikony",
  group: "system",
  title: { cs: "Ikony", en: "Icons" },
  summary: {
    cs: "Dvě sady čárových ikon na jedné kostře — rozhraní a výrobní operace. Přehled glyfů, stupnice velikostí a pravidla, kdy ikonu popsat a kdy nechat dekorativní.",
    en: "Two sets of stroke icons on one skeleton — interface and manufacturing operations. The glyph overview, the size scale, and the rules for when to label an icon and when to leave it decorative.",
  },
  sections: [
    {
      id: "sada",
      title: { cs: "Sada", en: "The set" },
    },
    {
      id: "ke-stazeni",
      title: { cs: "Ke stažení", en: "Files" },
    },
    {
      id: "velikosti",
      title: { cs: "Velikosti", en: "Sizes" },
    },
    {
      id: "operace",
      title: { cs: "Operace", en: "Operations" },
    },
    {
      id: "pravidla-ikon",
      title: { cs: "Pravidla", en: "Rules" },
    },
  ],
  body: () => import("@/ingot-docs/guides/IconsGuide.body"),
};
