import type { IngotGuideMeta } from "@/ingot-docs/types";

export const IntroGuide: IngotGuideMeta = {
  slug: "uvod",
  group: "system",
  title: { cs: "Úvod", en: "Introduction" },
  summary: {
    cs: "Ingot je designový systém Forgmaticu — sada rozhodnutí o barvě, typografii, prostoru a chování. Není to galerie komponent.",
    en: "Ingot is the Forgmatic design system — a set of decisions about colour, typography, space and behaviour. It is not a component gallery.",
  },
  sections: [
    {
      id: "co-to-je",
      title: { cs: "Co to je", en: "What it is" },
    },
    {
      id: "principy",
      title: { cs: "Principy", en: "Principles" },
    },
    {
      id: "z-ceho-se-sklada",
      title: {
        cs: "Z čeho se systém skládá",
        en: "What the system is made of",
      },
    },
    {
      id: "jak-zacit",
      title: { cs: "Jak začít", en: "How to start" },
    },
    {
      id: "jak-se-pouziva",
      title: { cs: "Jak se používá", en: "How to use it" },
    },
    {
      id: "jak-pridat",
      title: {
        cs: "Jak se přidává nové primitivum",
        en: "How a new primitive is added",
      },
    },
    {
      id: "co-tu-najdes",
      title: { cs: "Co tu najdeš", en: "What you will find here" },
    },
    {
      id: "pravidlo-palce",
      title: { cs: "Pravidlo palce", en: "Rule of thumb" },
    },
  ],
  body: () => import("@/ingot-docs/guides/IntroGuide.body"),
};
