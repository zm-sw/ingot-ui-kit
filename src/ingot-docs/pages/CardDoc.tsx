import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/CardDemo").then((module) => ({ default: module.Demo }));
const demoSource = () => import("@/ingot-docs/demos/CardDemo?raw");

export const CardDoc: IngotDocMeta = {
  name: "Card",
  status: "stable",
  // 2.0 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: a tone was renamed: `default` is now `neutral`.
  // 2.1 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "2.1",
  tag: ".card",
  tokens: [
    "--bg",
    "--surface",
    "--surface-2",
    "--border",
    "--border-strong",
    "--ink",
    "--r-md",
    "--shadow-sm",
    "--shadow-lg",
  ],
  classNameNote: {
    cs: "Bere `className` na rozvržení — mezery a umístění karty. Rám, rádius a stín drží primitivum.",
    en: "Takes `className` for layout — spacing and placement of the card. The frame, radius and shadow stay with the primitive.",
  },
  summary: {
    cs: "Plocha, na které obsah stojí — ne rámeček, který se kreslí kolem něj. Umí se zvednout při najetí a jednou za obrazovku se obrátit do tmavé.",
    en: "The surface content sits on — not a border drawn around it. It can lift on hover, and once per screen it can invert to dark.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obsah patří k sobě a má se vizuálně oddělit od zbytku obrazovky — panel
        nastavení, shrnutí, dlaždice v přehledu.
      </>,
      <>
        Potřebuješ hlavičku s nadpisem: <IngotCode>CardHeader</IngotCode> a{" "}
        <IngotCode>CardTitle</IngotCode> jedou s ní a drží stejné odsazení.
      </>,
      <>
        Dlaždice, která někam vede — <IngotCode>hover</IngotCode> ji při najetí zvedne.
        Samotná karta klikatelná není: obal ji <IngotCode>&lt;a&gt;</IngotCode>, nebo{" "}
        <IngotCode>&lt;button&gt;</IngotCode>.
      </>,
      <>
        Sdělení platformy, které má přebít okolí —{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode>. Obrátí plochu, takže druhá taková
        karta vedle už nepřebije nic.
      </>,
    ],
    en: [
      <>
        The content belongs together and should be visually separated from the rest of
        the screen — a settings panel, a summary, a tile in an overview.
      </>,
      <>
        You need a header with a title: <IngotCode>CardHeader</IngotCode> and{" "}
        <IngotCode>CardTitle</IngotCode> come with it and keep the same padding.
      </>,
      <>
        A tile that leads somewhere — <IngotCode>hover</IngotCode> lifts it on
        pointer-over. The card itself is not clickable: wrap it in an{" "}
        <IngotCode>&lt;a&gt;</IngotCode> or a <IngotCode>&lt;button&gt;</IngotCode>.
      </>,
      <>
        A platform message that has to out-shout its surroundings —{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode>. It inverts the surface, so a
        second one next to it out-shouts nothing.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/CardDoc.body"),
};
