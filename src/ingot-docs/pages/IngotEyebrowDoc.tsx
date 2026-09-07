import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotEyebrowDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotEyebrowDemo?raw");

export const IngotEyebrowDoc: IngotDocMeta = {
  name: "IngotEyebrow",
  status: "beta",
  // 1.1 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.2 (KAN-969) - `size="md"` is the preset's `text-eyebrow`, and that
  // step is read from the token source now instead of being declared in
  // the preset. Nothing this primitive renders changed - the values are
  // the same eleven pixels - but the scale is versioned and exported like
  // every other token, and this is the page it is documented on.
  version: "1.2",
  tag: ".eyebrow",
  tokens: ["--font-mono", "--ink-3", "--ink-4", "--accent-ink", "--ok"],
  classNameNote: {
    cs: "Bere `className` na rozvržení — odsazení a flex. Barvu a písmo určují `size` a `tone`.",
    en: "Takes `className` for layout — margins and flex. `size` and `tone` decide colour and type.",
  },
  summary: {
    cs: "Malý mono popisek verzálkami nad věcí, kterou pojmenovává — skupina v menu, metrika, krok. Jeden zápis pro idiom, který se dřív kreslil deseti způsoby.",
    en: "The small uppercase mono caption above the thing it names — a nav group, a metric, a step. One drawing for an idiom that used to be hand-drawn ten ways.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad hodnotou nebo blokem stojí krátké jméno toho, co to je: „Sklad“ nad cestou,
        „Ve výrobě“ nad číslem, „Krok 2“ nad nadpisem karty.
      </>,
      <>
        Popisek skupiny v menu nebo v bočním rejstříku — text, který se čte jako
        orientace, ne jako obsah.
      </>,
      <>
        Kicker nad odstavcem v průvodci nebo na veřejné stránce (
        <IngotCode>size=&quot;md&quot;</IngotCode>).
      </>,
    ],
    en: [
      <>
        A short name of what the thing is, set above a value or a block: “Warehouse”
        above a path, “In production” above a number, “Step 2” above a card title.
      </>,
      <>
        A group caption in a menu or a side index — text read as orientation, not as
        content.
      </>,
      <>
        A kicker above a paragraph in a guide or on a public page (
        <IngotCode>size=&quot;md&quot;</IngotCode>).
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotEyebrowDoc.body"),
};
