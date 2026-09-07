import type { IngotGuideMeta } from "@/ingot-docs/types";

export const DesignersGuide: IngotGuideMeta = {
  slug: "pro-designery",
  group: "system",
  title: { cs: "Pro designéry", en: "For designers" },
  summary: {
    cs: "Co je zdroj pravdy, jak se co jmenuje na obou stranách, které soubory si vzít do návrhového nástroje a co odznak slibuje obrazovce.",
    en: "What the source of truth is, what a thing is called on each side, which files to take into a design tool, and what the badge promises a screen.",
  },
  sections: [
    {
      id: "zdroj-pravdy",
      title: { cs: "Zdroj pravdy", en: "The source of truth" },
    },
    {
      id: "pojmenovani",
      title: { cs: "Pojmenování", en: "Naming" },
    },
    {
      id: "soubory",
      title: { cs: "Ke stažení", en: "Files" },
    },
    {
      id: "stav-a-verze",
      title: { cs: "Stav a verze", en: "Status and version" },
    },
    {
      id: "rozpor",
      title: { cs: "Když se to rozejde", en: "When they disagree" },
    },
  ],
  body: () => import("@/ingot-docs/guides/DesignersGuide.body"),
};
