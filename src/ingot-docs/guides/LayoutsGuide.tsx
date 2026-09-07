import type { IngotGuideMeta } from "@/ingot-docs/types";

export const LayoutsGuide: IngotGuideMeta = {
  slug: "layouty",
  group: "app",
  title: { cs: "Layouty stránek", en: "Page layouts" },
  summary: {
    cs: "Čtyři tvary, do kterých padne skoro každá obrazovka administrace — jak jsou široké, v jakém pořadí se skládají a co ukazují, dokud data nejsou.",
    en: "The four shapes almost every admin screen falls into — how wide they are, in what order they are assembled, and what they show while the data is not there yet.",
  },
  sections: [
    {
      id: "sirka",
      title: { cs: "Šířka stránky", en: "The width of a page" },
    },
    {
      id: "mrizka",
      title: { cs: "Mřížka uvnitř bloku", en: "The grid inside a block" },
    },
    {
      id: "seznam",
      title: { cs: "Seznam", en: "The list" },
    },
    {
      id: "detail",
      title: { cs: "Detail záznamu", en: "A record's detail" },
    },
    {
      id: "nastaveni",
      title: { cs: "Nastavení", en: "Settings" },
    },
    {
      id: "prazdny-modul",
      title: { cs: "Prázdný modul", en: "A module with nothing in it" },
    },
  ],
  body: () => import("@/ingot-docs/guides/LayoutsGuide.body"),
};
