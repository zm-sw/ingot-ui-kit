import type { IngotGuideMeta } from "@/ingot-docs/types";

export const A11yGuide: IngotGuideMeta = {
  slug: "pristupnost",
  group: "rules",
  title: { cs: "Přístupnost", en: "Accessibility" },
  summary: {
    cs: "Pravidla WCAG 2.2 AA, která kit drží za obrazovky, kontrastní tokeny, klávesy platné všude a tři zkoušky před vydáním.",
    en: "The WCAG 2.2 AA rules the kit holds for screens, the contrast tokens, the keys that hold everywhere, and three pre-release checks.",
  },
  sections: [
    {
      id: "pravidla-a11y",
      title: { cs: "Pravidla", en: "Rules" },
    },
    {
      id: "kontrast",
      title: { cs: "Kontrast", en: "Contrast" },
    },
    {
      id: "fokus-a-klavesnice",
      title: { cs: "Fokus a klávesnice", en: "Focus and keyboard" },
    },
    {
      id: "dotykova-plocha",
      title: { cs: "Dotyková plocha", en: "The touch target" },
    },
    {
      id: "semantika",
      title: {
        cs: "Sémantika a asistivní technologie",
        en: "Semantics and assistive technology",
      },
    },
    {
      id: "checklist",
      title: {
        cs: "Kontrola před vydáním",
        en: "The pre-release check",
      },
    },
  ],
  body: () => import("@/ingot-docs/guides/A11yGuide.body"),
};
