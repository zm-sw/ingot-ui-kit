import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSectionDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSectionDemo?raw");

export const IngotSectionDoc: IngotDocMeta = {
  name: "IngotSection",
  status: "stable",
  version: "1.0",
  tag: ".section",
  tokens: ["--ink"],
  classNameNote: {
    cs: "`className` nebere. Sekce drží osnovu stránky; odsazení mezi sekcemi patří rámu stránky.",
    en: "Does not take `className`. The section holds the page outline; spacing between sections belongs to the page frame.",
  },
  summary: {
    cs: "Sekce obrazovky: nadpis správné úrovně a kotva, která sedí na sekci, ne na nadpisu.",
    en: "A screen section: a heading at the right level and an anchor that sits on the section, not on the heading.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka má víc částí a čtenář mezi nimi má umět skákat. Nadpis sekce je to,
        podle čeho se odečítač orientuje.
      </>,
      <>
        Na sekci se dá odkázat z obsahu stránky. <IngotCode>id</IngotCode> je na sekci,
        takže kotva skočí nad nadpis a ne doprostřed textu.
      </>,
    ],
    en: [
      <>
        The screen has several parts and the reader should be able to jump between them.
        The section heading is what a screen reader navigates by.
      </>,
      <>
        Something links to the section from a table of contents.{" "}
        <IngotCode>id</IngotCode> is on the section, so the anchor lands above the
        heading rather than in the middle of the text.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSectionDoc.body"),
};
