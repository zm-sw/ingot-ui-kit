import type { IngotGuideMeta } from "@/ingot-docs/types";

export const UsageGuide: IngotGuideMeta = {
  slug: "pravidla-pouzivani",
  group: "rules",
  title: { cs: "Pravidla používání", en: "Usage rules" },
  summary: {
    cs: "Rozhodnutí, která nejsou vidět v katalogu, ale drží produkt pohromadě. Když se dva návrhy neshodnou, rozhoduje tato sekce.",
    en: "The decisions that are not visible in the catalogue but hold the product together. When two designs disagree, this section decides.",
  },
  sections: [
    // The four rules used to live nowhere, so every new primitive invented
    // them again: className took layout on some components and looks on
    // others, and only two components forwarded a ref. Written down here
    // and in the repo's contributor notes; each component page states its
    // own className policy above the properties table.
    {
      id: "skladba-obrazovky",
      title: { cs: "Skladba obrazovky", en: "The layout of a screen" },
    },
    {
      id: "ano-ne",
      title: { cs: "Ano a ne", en: "Yes and no" },
    },
    {
      id: "texty",
      title: { cs: "Texty", en: "Text" },
    },
    {
      id: "pinovani",
      title: { cs: "Připojení kitu", en: "Pinning the kit" },
    },
    {
      id: "vstupy-balicku",
      title: { cs: "Co balíček nabízí", en: "What the package offers" },
    },
  ],
  body: () => import("@/ingot-docs/guides/UsageGuide.body"),
};
