import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotDisclosureDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotDisclosureDemo?raw");

export const IngotDisclosureDoc: IngotDocMeta = {
  name: "IngotDisclosure",
  status: "beta",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.2",
  tag: ".disclosure",
  tokens: ["--border", "--surface-2", "--ink-2", "--ink-3", "--ink-4", "--font-mono"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Sbalitelná sekce postranního panelu — popisek, počet a obsah, který se schová. Stav drží prohlížeč, ne React.",
    en: "A collapsible section in a side panel — a label, a count and a body that hides. The browser holds the state, not React.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Postranní panel má víc bloků, než se vejde na výšku, a čtenář si vybírá, který
        ho zajímá — osa komunikace, doklady, soubory, poznámky, štítky.
      </>,
      <>
        Blok se dá spočítat a počet stojí za to ukázat i sbalený.{" "}
        <IngotCode>count</IngotCode> je pak to, podle čeho čtenář pozná, že se rozbalení
        vyplatí.
      </>,
      <>
        Sekce mají patřit k sobě tak, že otevřená je vždy nejvýš jedna — na to je{" "}
        <IngotCode>IngotDisclosureGroup</IngotCode>.
      </>,
    ],
    en: [
      <>
        A side panel has more blocks than fit its height and the reader picks the one
        they care about — the conversation timeline, documents, files, notes, labels.
      </>,
      <>
        The block can be counted and the count is worth showing while collapsed.{" "}
        <IngotCode>count</IngotCode> is then what tells the reader whether opening it
        pays off.
      </>,
      <>
        The sections belong together such that at most one is open — that is{" "}
        <IngotCode>IngotDisclosureGroup</IngotCode>.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotDisclosureDoc.body"),
};
