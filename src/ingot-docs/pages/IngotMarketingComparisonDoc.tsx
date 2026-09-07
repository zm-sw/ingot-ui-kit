import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingComparisonDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingComparisonDemo?raw");

export const IngotMarketingComparisonDoc: IngotDocMeta = {
  name: "IngotMarketingComparison",
  status: "beta",
  // 1.1 — header row set with the shared eyebrow type.
  version: "1.1",
  tag: ".cmp",
  tokens: [
    "--border",
    "--surface",
    "--surface-2",
    "--accent-bg",
    "--accent-ink",
    "--ink",
    "--ink-3",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Řádkové srovnání „dnes / s platformou“. Dvojice patří k jednomu úkolu, takže ji nejde napsat rozpojenou.",
    en: "A row-wise “today / with the platform” comparison. The pair belongs to one task, so it cannot be written apart.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Stránka staví „jak to je“ proti „jak to bude“ a k jednomu úkolu patří právě
        jedna dvojice.
      </>,
      <>
        Na srovnání záleží natolik, že se nesmí rozejít: řádky drží dvojici pohromadě,
        takže se jeden sloupec nemůže o položku posunout a začít tiše lhát.
      </>,
    ],
    en: [
      <>
        The page sets “how it is” against “how it will be” and exactly one pair belongs
        to one task.
      </>,
      <>
        The comparison matters enough that it must not drift: rows hold the pair
        together, so one column cannot slide by an item and start lying quietly.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingComparisonDoc.body"),
};
