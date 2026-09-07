import type { IngotGuideMeta } from "@/ingot-docs/types";

export const TranslationsGuide: IngotGuideMeta = {
  slug: "preklady",
  group: "rules",
  title: { cs: "Překlady", en: "Translations" },
  summary: {
    cs: "Ingot nemá vlastní jazykové soubory. Každý viditelný text je vlastnost, kterou dodává volající už přeloženou.",
    en: "The Ingot has no language files of its own. Every visible string is a property the caller passes in already translated.",
  },
  sections: [
    {
      id: "pravidlo",
      title: { cs: "Pravidlo", en: "The rule" },
    },
    {
      id: "co-to-znamena",
      title: {
        cs: "Co to znamená prakticky",
        en: "What that means in practice",
      },
    },
    {
      id: "neviditelne-popisky",
      title: {
        cs: "Nezapomeň na popisky, které nejsou vidět",
        en: "Do not forget the labels nobody sees",
      },
    },
    {
      id: "slovnik",
      title: {
        cs: "Slovník: Jednoduše / Expert",
        en: "Dictionary: Simple / Expert",
      },
    },
    {
      id: "jak-pridat-termin",
      title: {
        cs: "Jak přidat termín",
        en: "How to add a term",
      },
    },
    {
      id: "ukazky",
      title: {
        cs: "Jak se píše ukázka",
        en: "How a demo is written",
      },
    },
    {
      id: "kde-hledat",
      title: {
        cs: "Kde hledat konkrétní popisky",
        en: "Where to find the specific labels",
      },
    },
  ],
  body: () => import("@/ingot-docs/guides/TranslationsGuide.body"),
};
