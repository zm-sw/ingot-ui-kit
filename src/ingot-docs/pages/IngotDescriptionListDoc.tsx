import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotDescriptionListDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotDescriptionListDemo?raw");

export const IngotDescriptionListDoc: IngotDocMeta = {
  name: "IngotDescriptionList",
  status: "beta",
  version: "1.0",
  tag: ".dl",
  tokens: ["--ink", "--ink-4", "--font-mono", "--s-3", "--s-5"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění bloku. Mezery mezi dvojicemi ani sazbu popisku ne — to je rytmus detailu a má být na všech obrazovkách stejný.",
    en: "Takes `className`, but only for placing the block. Not the gaps between pairs or the setting of the label — that is the rhythm of a detail and should be the same on every screen.",
  },
  summary: {
    cs: "Fakta o záznamu: popisek, hodnota, popisek, hodnota. Sémantický `dl`, ne mřížka spanů — a fakta jsou mono.",
    en: "The facts about a record: label, value, label, value. A semantic `dl`, not a grid of spans — and facts are mono.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Hlavička detailu záznamu: číslo, zákazník, stav, termín. Nejčastější blok
        detailové obrazovky vůbec.
      </>,
      <>
        Souhrn nad formulářem nebo v postranním panelu — to, co se nemění a nedá se to
        editovat tady.
      </>,
    ],
    en: [
      <>
        The head of a record's detail: number, customer, state, due date. The commonest
        block on a detail screen there is.
      </>,
      <>
        A summary above a form or in a side panel — what does not change and cannot be
        edited here.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotDescriptionListDoc.body"),
};
