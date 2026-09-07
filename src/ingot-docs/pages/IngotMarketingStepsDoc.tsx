import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingStepsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingStepsDemo?raw");

export const IngotMarketingStepsDoc: IngotDocMeta = {
  name: "IngotMarketingSteps",
  status: "beta",
  version: "1.0",
  tag: ".step",
  tokens: [
    "--border",
    "--surface",
    "--accent-bg",
    "--accent-ink",
    "--ink",
    "--ink-3",
    "--ink-4",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Kroky „jak to funguje“ — karty s pořadovým číslem a šipkou k dalšímu kroku. Číslo se počítá z pořadí, nepíše se.",
    en: "The “how it works” steps — cards with an ordinal and an arrow to the next one. The number comes from the order, it is not typed.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Sekce popisuje postup a na pořadí záleží: druhý krok nedává smysl před prvním.
      </>,
      <>
        Kroků je tři, nebo čtyři u procesu — <IngotCode>columns</IngotCode> nabízí jen
        tyhle dvě hodnoty, protože „kolik chceš“ by z pravidla handoffu udělalo
        doporučení.
      </>,
    ],
    en: [
      <>
        The section describes a procedure and the order matters: step two makes no sense
        before step one.
      </>,
      <>
        There are three steps, or four for a process — <IngotCode>columns</IngotCode>{" "}
        offers only those two values, because “as many as you like” would turn the
        handoff rule into a suggestion.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingStepsDoc.body"),
};
