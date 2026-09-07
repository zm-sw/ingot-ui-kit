import type { IngotGuideMeta } from "@/ingot-docs/types";

export const ComponentsGuide: IngotGuideMeta = {
  slug: "komponenty",
  group: "system",
  title: { cs: "Komponenty", en: "Components" },
  summary: {
    cs: "Rozcestník kitu — každé primitivum s jednou větou a stavem, na vlastní stránku se prokliká odsud i z menu.",
    en: "The kit's index — every primitive with one sentence and its status; each page is one click away from here or from the menu.",
  },
  sections: [
    {
      id: "prehled",
      title: { cs: "Přehled", en: "Overview" },
    },
    {
      id: "seznam",
      title: { cs: "Seznam", en: "The list" },
    },
    {
      id: "skladba",
      title: {
        cs: "Skladba stránky komponenty",
        en: "How a component page is built",
      },
    },
  ],
  body: () => import("@/ingot-docs/guides/ComponentsGuide.body"),
};
