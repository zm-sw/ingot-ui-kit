import type { IngotGuideMeta } from "@/ingot-docs/types";

export const ShellGuide: IngotGuideMeta = {
  slug: "shell-a-patterny",
  group: "app",
  title: { cs: "Shell a patterny", en: "Shell and patterns" },
  summary: {
    cs: "Rám, který obrazovky sdílejí — horní lišta, menu sekce a účtu, hlavička s čísly — a bloky, ze kterých se skládají konfigurační obrazovky i seznamy.",
    en: "The frame screens share — the top bar, the section and account menus, the header with its numbers — and the blocks that settings screens and lists are assembled from.",
  },
  sections: [
    {
      id: "cela-obrazovka",
      title: { cs: "Celá obrazovka", en: "A whole screen" },
    },
    {
      id: "ram",
      title: { cs: "Rám aplikace", en: "The application frame" },
    },
    {
      id: "mobilni-viewport",
      title: { cs: "Mobilní viewport", en: "The mobile viewport" },
    },
    {
      id: "menu-sekce",
      title: { cs: "Menu sekce", en: "The section menu" },
    },
    {
      id: "menu-uctu",
      title: { cs: "Menu účtu", en: "The account menu" },
    },
    {
      id: "hlavicka",
      title: { cs: "Hlavička stránky", en: "The page header" },
    },
    {
      id: "patterny-nastaveni",
      title: { cs: "Patterny nastavení", en: "Settings patterns" },
    },
    {
      id: "skupinova-karta",
      title: { cs: "Skupinová karta", en: "The group card" },
    },
    {
      id: "pattern-seznamu",
      title: { cs: "Pattern seznamu", en: "The list pattern" },
    },
  ],
  body: () => import("@/ingot-docs/guides/ShellGuide.body"),
};
