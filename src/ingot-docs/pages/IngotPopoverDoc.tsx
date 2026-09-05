import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotPopoverDemo";
import demoSource from "@/ingot-docs/demos/IngotPopoverDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-847. The gap that showed everywhere: TopNav owned a close delay, a
// click-outside listener and a roving focus; MegaMenu and UserMenu could
// not position themselves. One answer instead of four.
export const IngotPopoverDoc: IngotDocPage = {
  name: "IngotPopover",
  status: "beta",
  version: "1.0",
  tag: ".popover",
  tokens: ["--surface", "--border", "--r-lg", "--shadow-lg"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení panelu — šířku a vnitřní odsazení. Rám, stín a vrstvu drží primitivum.",
    en: "Takes `className`, but for the panel's layout only — width and inner padding. The frame, the shadow and the layer stay with the primitive.",
  },
  summary: {
    cs: "Panel ukotvený k prvku, který ho otevřel: pozice, klik mimo, Escape a návrat fokusu na jednom místě.",
    en: "A panel anchored to what opened it: position, click outside, Escape and focus return, all in one place.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad prvkem se má otevřít malý panel — filtry seznamu, výběr, kus detailu, který
        by jako dialog byl zbytečně těžký.
      </>,
      <>
        Stavíš vlastní menu nebo výběr a nechceš znovu psát pozicování a zavírání.{" "}
        <IngotCode>IngotMenu</IngotCode> stojí přesně na tomhle.
      </>,
      <>
        Panel se má otevřít i zevnitř dialogu — vrstva <IngotCode>MENU_LAYER</IngotCode>{" "}
        ho drží nad ním, ne pod ním.
      </>,
    ],
    en: [
      <>
        A small panel should open over an element — list filters, a picker, a piece of
        detail that would be too heavy as a dialog.
      </>,
      <>
        You are building your own menu or picker and do not want to write positioning
        and dismissal again. <IngotCode>IngotMenu</IngotCode> stands on exactly this.
      </>,
      <>
        The panel must also open from inside a dialog — the{" "}
        <IngotCode>MENU_LAYER</IngotCode> layer keeps it above, not under.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Obsah vyžaduje soustředění na jednu věc a potvrzení — to je{" "}
        <IngotCode>IngotModal</IngotCode>. Popover fokus schválně nezavírá dovnitř,
        takže se z něj Tabem odejde.
      </>,
      <>
        Editace, u které se pracuje se seznamem za ní — to je{" "}
        <IngotCode>IngotDrawer</IngotCode>.
      </>,
      <>
        Krátký popisek ovládacího prvku. Na to je <IngotCode>IngotTooltip</IngotCode>;
        popover je pro obsah, se kterým se pracuje.
      </>,
    ],
    en: [
      <>
        The content needs focus on one thing and a confirmation — that is{" "}
        <IngotCode>IngotModal</IngotCode>. A popover deliberately does not trap focus,
        so Tab leaves it.
      </>,
      <>
        An edit made while working with the list behind it — that is{" "}
        <IngotCode>IngotDrawer</IngotCode>.
      </>,
      <>
        A short description of a control. That is <IngotCode>IngotTooltip</IngotCode>; a
        popover is for content you work with.
      </>,
    ],
  },
  props: [
    {
      name: "open",
      type: "boolean",
      required: true,
      note: {
        cs: "Řízené — stav drží volající, jako u všech překryvů kitu.",
        en: "Controlled — the caller owns the state, as with every overlay in the kit.",
      },
    },
    {
      name: "anchorRef",
      type: "RefObject<HTMLElement | null>",
      required: true,
      note: {
        cs: "Prvek, na kterém panel visí. Klik na něj panel nezavírá — je to přepínač.",
        en: "The element the panel hangs from. A click on it does not close the panel — it is a toggle.",
      },
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      note: {
        cs: "Volá Escape a klik mimo. Escape navíc vrací fokus na kotvu.",
        en: "Called by Escape and by a click outside. Escape also returns focus to the anchor.",
      },
    },
    {
      name: "placement",
      type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"',
      required: false,
      note: {
        cs: "Preferovaná strana. Když se pod kotvu panel nevejde a nad ni ano, překlopí se.",
        en: "The preferred side. When there is no room below the anchor and there is above, it flips.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložené jméno panelu. Povinné: nepojmenovaný panel odečítač ohlásí jen jako skupinu.",
        en: "Translated name of the panel. Required: an unnamed panel is announced as just a group.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení panelu — šířka, odsazení.",
        en: "The panel's layout only — width, padding.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  a11y: {
    cs: [
      <>
        Panel je pojmenovaná skupina (<IngotCode>role=&quot;group&quot;</IngotCode> +{" "}
        <IngotCode>aria-label</IngotCode>). Kotva má nést{" "}
        <IngotCode>aria-expanded</IngotCode> — ta patří jí, ne panelu.
      </>,
      <>
        <strong>Fokus se schválně nezavírá dovnitř.</strong> Popover není dialog: Tab z
        něj má vést dál po stránce. Past fokusu v panelu s filtry je nejrychlejší
        způsob, jak uživatele klávesnice uvěznit.
      </>,
      <>
        Escape zavře a vrátí fokus na kotvu. Bez návratu se čtenář probere na začátku
        stránky.
      </>,
    ],
    en: [
      <>
        The panel is a named group (<IngotCode>role=&quot;group&quot;</IngotCode> +{" "}
        <IngotCode>aria-label</IngotCode>). The anchor carries{" "}
        <IngotCode>aria-expanded</IngotCode> — that belongs to it, not to the panel.
      </>,
      <>
        <strong>Focus is deliberately not trapped.</strong> A popover is not a dialog:
        Tab is meant to leave it and carry on through the page. Trapping focus in a
        filter panel is the fastest way to strand a keyboard user.
      </>,
      <>
        Escape closes it and returns focus to the anchor. Without the return the reader
        wakes up at the top of the page.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> i obsah dodává volající přeložené — kit vlastní
        překlady nemá.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode> and the content arrive translated from the caller —
        the kit has no translations of its own.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Bez šipky ukazující na kotvu a bez animace otevření. Obojí čeká na obrazovku,
        která je vyžádá.
      </>,
      <>
        Pozicování zná okno, ne rolovací kontejner s vlastním ořezem: panel se překlápí
        a posouvá podle výřezu prohlížeče.
      </>,
    ],
    en: [
      <>
        No arrow pointing at the anchor and no opening animation. Both wait for a screen
        that asks for them.
      </>,
      <>
        The positioning knows the window, not a scrolling container with its own
        clipping: the panel flips and shifts against the browser viewport.
      </>,
    ],
  },
};
