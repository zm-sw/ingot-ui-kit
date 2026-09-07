import type { IngotGuideMeta } from "@/ingot-docs/types";

export const AuthorsGuide: IngotGuideMeta = {
  slug: "pro-autory",
  group: "authors",
  title: { cs: "Pro autory kitu", en: "For kit authors" },
  summary: {
    cs: "Co platí pro toho, kdo kit mění: tvar API, jak primitivum přibývá a odchází, a co drží systém pohromadě.",
    en: "What binds whoever changes the kit: the shape of an API, how a primitive arrives and leaves, and what holds the system together.",
  },
  sections: [
    {
      id: "nove-primitivum",
      title: {
        cs: "Jak se přidává nové primitivum",
        en: "How a new primitive is added",
      },
    },
    {
      id: "api-pravidla",
      title: {
        cs: "Pravidla API komponent",
        en: "The API rules of a component",
      },
    },
    {
      id: "slovnik-props",
      title: {
        cs: "Slovník props: size a tone",
        en: "The props vocabulary: size and tone",
      },
    },
    {
      id: "zivotni-cyklus",
      title: {
        cs: "Jak komponenta odchází a jak dospívá",
        en: "How a component leaves, and how it grows up",
      },
    },
    {
      id: "udrzba",
      title: { cs: "Údržba", en: "Maintenance" },
    },
  ],
  body: () => import("@/ingot-docs/guides/AuthorsGuide.body"),
};
