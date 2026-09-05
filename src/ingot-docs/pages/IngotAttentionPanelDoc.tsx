import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotAttentionPanelDemo";
import demoSource from "@/ingot-docs/demos/IngotAttentionPanelDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotAttentionPanelDoc: IngotDocPage = {
  name: "IngotAttentionPanel",
  status: "beta",
  // 1.1: the aside column grows (flex-1, basis-80) — the signal grid of
  // the overview needs the rest of the panel width.
  version: "1.1",
  tag: ".attention",
  tokens: ["--ink", "--bg", "--warn", "--r-lg", "--shadow-md"],
  summary: {
    cs: "Tmavý panel „co po tobě obrazovka chce teď“ v hlavě přehledu. Jediné místo, kde je karta tmavší než pozadí — signál, který drží, jen dokud je vzácný.",
    en: "The dark “what this screen wants from you now” panel at the head of an overview. The one place where a card is darker than the page — a signal that holds only while it stays rare.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Hlava přehledové obrazovky: co dnes čeká na zásah, s cestou rovnou
        k tomu — signální počty, jedna akce.
      </>,
      <>
        Nejvýš <strong>jeden na stránce</strong>. Panel je výjimka
        z pravidla, že pozadí je vždy tmavší než karta, a výjimka
        signalizuje, jen dokud je jedna.
      </>,
    ],
    en: [
      <>
        The head of an overview screen: what waits for action today, with a
        path straight to it — signal counts, one action.
      </>,
      <>
        At most <strong>one per page</strong>. The panel is the exception to
        “the page is always darker than the card”, and an exception signals
        only while there is one.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Druhý tmavý blok na téže stránce — dva panely nejsou dva signály,
        ale druhé pozadí. Další sdělení patří do{" "}
        <IngotCode>Card</IngotCode> nebo metrik.
      </>,
      <>
        Chybová nebo výstražná hláška k akci, která právě proběhla — na to
        je toast a inline text, ne plocha přes půl obrazovky.
      </>,
      <>
        Marketingové zvýraznění („novinka!“). Panel znamená práci, která
        čeká; cokoli jiného ho ředí.
      </>,
    ],
    en: [
      <>
        A second dark block on the same page — two panels are not two
        signals but a second background. Further messages belong in{" "}
        <IngotCode>Card</IngotCode> or the metrics.
      </>,
      <>
        An error or warning for an action that just ran — that is a toast
        and inline text, not half a screen of surface.
      </>,
      <>
        Marketing emphasis (“new!”). The panel means work that waits;
        anything else dilutes it.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený nadpis — „Co řešit teď“. Je i aria-label sekce.",
        en: "The translated heading — “What to handle now”. Doubles as the section's aria-label.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Tělo: věta souhrnu, signální pilulky, akce. Čím se signalizuje, dodává obrazovka.",
        en: "The body: a summary sentence, signal pills, an action. What signals, the screen supplies.",
      },
    },
    {
      name: "aside",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Pravý sloupec — chipy dotčených záznamů, odkaz „+2 další“.",
        en: "The right column — chips of affected records, a “+2 more” link.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy. Do vzhledu nezasahuje.",
        en: "An anchor for tests. It does not affect the appearance.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Panel je <IngotCode>section</IngotCode> pojmenovaná nadpisem — pro
        odečítač orientační bod, ne jen tmavý div.
      </>,
      <>
        Kreslí se tokeny <IngotCode>--ink</IngotCode>/<IngotCode>--bg</IngotCode>,
        takže v tmavém režimu se obrátí a kontrast textu drží v obou
        motivech sám od sebe.
      </>,
      <>
        Naléhavost nese text a počty, ne barva sama — panel je signál
        polohou a plochou i pro toho, kdo barvy nevidí.
      </>,
    ],
    en: [
      <>
        The panel is a <IngotCode>section</IngotCode> named by its heading —
        a landmark for a screen reader, not just a dark div.
      </>,
      <>
        It is drawn with the <IngotCode>--ink</IngotCode>/<IngotCode>--bg</IngotCode>{" "}
        tokens, so it inverts in dark mode and text contrast holds in both
        themes by itself.
      </>,
      <>
        Urgency is carried by text and counts, not by colour alone — the
        panel signals by position and surface even to someone who does not
        see colour.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Nadpis i obsah dodává volající už přeložené — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        Věta souhrnu skloňuje počty („5 položek vyžaduje pozornost“) —
        plurály řeší překladový systém volajícího, ne panel.
      </>,
    ],
    en: [
      <>
        The heading and the content arrive already translated from the
        caller — the kit has no translation namespace of its own.
      </>,
      <>
        The summary sentence inflects counts (“5 items need attention”) —
        plurals are the caller's translation system's job, not the panel's.
      </>,
    ],
  },
};
