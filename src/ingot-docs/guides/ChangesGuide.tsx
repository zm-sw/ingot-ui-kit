import type { IngotGuideMeta } from "@/ingot-docs/types";

export const ChangesGuide: IngotGuideMeta = {
  slug: "zmeny",
  group: "rules",
  title: { cs: "Změny", en: "Changes" },
  summary: {
    cs: "Co v které verzi vyšlo — sestavené z tagů, ne psané rukou.",
    en: "What shipped in which version — assembled from the tags, not written by hand.",
  },
  sections: [
    {
      id: "pin",
      title: { cs: "Verze a pin", en: "Versions and the pin" },
    },
    {
      id: "vydani",
      title: { cs: "Vydání", en: "Releases" },
    },
    {
      id: "od-verze",
      title: { cs: "Odznak „od verze“", en: "The “since” badge" },
    },
  ],
  body: () => import("@/ingot-docs/guides/ChangesGuide.body"),
};
