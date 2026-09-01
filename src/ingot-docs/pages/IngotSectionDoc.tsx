import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotSectionDemo";
import demoSource from "@/ingot-docs/demos/IngotSectionDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotSectionDoc: IngotDocPage = {
  name: "IngotSection",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Sekce obrazovky: nadpis správné úrovně a kotva, která sedí na sekci, ne na nadpisu.",
    en: "A screen section: a heading at the right level and an anchor that sits on the section, not on the heading.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka má víc částí a čtenář mezi nimi má umět skákat. Nadpis
        sekce je to, podle čeho se odečítač orientuje.
      </>,
      <>
        Na sekci se dá odkázat z obsahu stránky. <IngotCode>id</IngotCode> je na
        sekci, takže kotva skočí nad nadpis a ne doprostřed textu.
      </>,
    ],
    en: [
      <>
        The screen has several parts and the reader should be able to jump
        between them. The section heading is what a screen reader navigates
        by.
      </>,
      <>
        Something links to the section from a table of contents.{" "}
        <IngotCode>id</IngotCode> is on the section, so the anchor lands above the
        heading rather than in the middle of the text.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Chceš jen tučný řádek nad odstavcem. Nadpis, který nic nestrukturuje,
        odečítači lže o osnově stránky — a osnova je jedna z mála věcí, které
        se čtou naslepo.
      </>,
      <>
        Je to nadpis celé obrazovky. Na to je <IngotCode>IngotPageHeader</IngotCode>{" "}
        s <IngotCode>&lt;h1&gt;</IngotCode>.
      </>,
    ],
    en: [
      <>
        You only want a bold line above a paragraph. A heading that structures
        nothing lies to a screen reader about the page outline — and the
        outline is one of the few things read blind.
      </>,
      <>
        It is the title of the whole screen. That is{" "}
        <IngotCode>IngotPageHeader</IngotCode>, with an <IngotCode>&lt;h1&gt;</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Nadpis sekce — už přeložený.",
        en: "The section heading — already translated.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: { cs: "Obsah sekce.", en: "The section body." },
    },
    {
      name: "id",
      type: "string",
      required: false,
      note: {
        cs: "Kotva. Bez ní na sekci nejde odkázat z obsahu stránky.",
        en: "The anchor. Without it nothing can link to the section.",
      },
    },
    {
      name: "level",
      type: "2 | 3",
      required: false,
      note: {
        cs: "MUSÍ odpovídat zanoření, ne velikosti písma. Výchozí 2.",
        en: "MUST match how deeply the section sits, not font size. Defaults to 2.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid sekce.", en: "data-testid of the section." },
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>level</IngotCode> je o osnově, ne o vzhledu. Přeskočená úroveň
        (z <IngotCode>h1</IngotCode> rovnou na <IngotCode>h3</IngotCode>) rozbije seznam nadpisů,
        podle kterého se po stránce pohybuje kdokoli, kdo ji nevidí.
      </>,
      <>
        Vykresluje se <IngotCode>&lt;section&gt;</IngotCode>, takže je to skutečná část
        dokumentu — ne <IngotCode>&lt;div&gt;</IngotCode>, který jen vypadá odděleně.
      </>,
      <>
        <IngotCode>id</IngotCode> patří na sekci. Kotva na nadpisu odroluje tak, že
        nadpis zmizí nad okrajem okna a čtenář začne uprostřed odstavce.
      </>,
    ],
    en: [
      <>
        <IngotCode>level</IngotCode> is about the outline, not the look. A skipped level
        (<IngotCode>h1</IngotCode> straight to <IngotCode>h3</IngotCode>) breaks the heading list
        anyone who cannot see the page moves through it by.
      </>,
      <>
        It renders a <IngotCode>&lt;section&gt;</IngotCode>, so it really is a part of
        the document — not a <IngotCode>&lt;div&gt;</IngotCode> that merely looks
        separate.
      </>,
      <>
        <IngotCode>id</IngotCode> belongs on the section. An anchor on the heading
        scrolls so that the heading disappears past the top of the window and
        the reader starts mid-paragraph.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> dodává volající už přeložený.
      </>,
      <>
        <IngotCode>id</IngotCode> se <strong>nepřekládá</strong> — je to cíl odkazu.
        Přeložená kotva rozbije každý sdílený odkaz na tu sekci.
      </>,
    ],
    en: [
      <>
        <IngotCode>title</IngotCode> arrives from the caller already translated.
      </>,
      <>
        <IngotCode>id</IngotCode> is <strong>not</strong> translated — it is a link
        target. A translated anchor breaks every shared link to that section.
      </>,
    ],
  },
};
