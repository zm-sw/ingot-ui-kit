import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

// The dots do not know their colours: each carries ``data-accent`` and is
// painted with ``var(--accent)``, so a swatch is drawn by the block it
// advertises. A list of hexes would be a second truth about what emerald
// looks like.
//
// 1.1 (KAN-852): the picker no longer needs a host that knows how to
// remember or apply the choice — reading it, writing it and putting it on
// <html> ship with the kit as @forgmatic/ingot/theme. The component is
// unchanged; what changed is that a consumer can now wire it up without
// rewriting the plumbing, which is exactly the sort of change that must
// move a version even though no markup moved.
const demo = () =>
  import("@/ingot-docs/demos/IngotAccentSwatchesDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAccentSwatchesDemo?raw");

export const IngotAccentSwatchesDoc: IngotDocPage = {
  name: "IngotAccentSwatches",
  status: "beta",
  version: "1.1",
  tag: ".swatches",
  tokens: ["--accent", "--ink", "--border-strong"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Volba akcentové rodiny — pět puntíků, každý obarvený tokenem, který nabízí. Žádný hex v kódu.",
    en: "The accent-family picker — five dots, each painted by the token it offers. No hex in the code.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Uživatel si volí akcentovou rodinu — v nastavení aplikace nebo v liště doc webu.
      </>,
      <>
        Volba se má ukázat jako barva, ne jako název. Jméno „smaragdová“ nikomu neřekne,
        jak bude obrazovka vypadat.
      </>,
    ],
    en: [
      <>
        The user picks an accent family — in app settings or in the doc web's top bar.
      </>,
      <>
        The choice should be shown as a colour, not a name. “Emerald” tells nobody how
        the screen will look.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Vybírá se z pojmenovaných možností, které nejsou barvy. Na to je{" "}
        <IngotCode>IngotSegmented</IngotCode> nebo <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        Má se ukázat, JAK rodina vypadá napříč tokeny. To je ukázka palety v průvodci
        Základy, ne přepínač.
      </>,
    ],
    en: [
      <>
        The options are named things that are not colours. That is{" "}
        <IngotCode>IngotSegmented</IngotCode> or <IngotCode>IngotSelect</IngotCode>.
      </>,
      <>
        The point is to show HOW a family looks across tokens. That is the palette demo
        in the Basics guide, not a picker.
      </>,
    ],
  },
  props: [
    {
      name: "value",
      type: "AccentChoice",
      required: true,
      note: { cs: "Vybraná rodina.", en: "The selected family." },
    },
    {
      name: "onChange",
      type: "(choice: AccentChoice) => void",
      required: true,
      note: {
        cs: "Volba se předává ven — komponenta si ji nepamatuje ani neukládá.",
        en: "The choice is handed out — the component neither remembers nor stores it.",
      },
    },
    {
      name: "groupLabel",
      type: "string",
      required: true,
      note: {
        cs: "Pojmenuje skupinu pro odečítač („Akcent“). Povinný: skupina bez jména se čte jako pět nepojmenovaných voleb.",
        en: "Names the group for a screen reader (“Accent”). Required: an unnamed group reads as five unnamed choices.",
      },
    },
    {
      name: "optionLabel",
      type: "(choice: AccentChoice) => string",
      required: true,
      note: {
        cs: "Jméno jedné rodiny. Funkce, ne slovník — texty zná volající, kit ne.",
        en: "The name of one family. A function, not a dictionary — the caller owns the copy, the kit does not.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Zamkne volbu, dokud se neuloží ta předchozí.",
        en: "Locks the choice until the previous one is saved.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída — okraje a zarovnání určuje lišta, vzhled primitivum.",
        en: "A pass-through class — the bar sets margins and alignment, the primitive the look.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Puntíky jsou přepínače v pojmenované skupině, takže se mezi nimi chodí šipkami a
        odečítač hlásí, který je vybraný.
      </>,
      <>
        Terč je 28×28, i když tečka zůstává 18×18 — sáhnout se musí dát prstem. Zvětšit
        kolečko by rozbilo lištu, proto roste plocha kolem něj.
      </>,
      <>
        Vybraný puntík má prstenec v barvě inkoustu, ne v barvě rodiny: prstenec ve
        vlastní barvě není proti tečce, kterou obkružuje, vidět.
      </>,
    ],
    en: [
      <>
        The dots are radios in a named group, so arrow keys move between them and a
        screen reader announces which is selected.
      </>,
      <>
        The target is 28×28 even though the dot stays 18×18 — it has to be reachable
        with a finger. Growing the circle would break the bar, so the area around it
        grows instead.
      </>,
      <>
        The selected dot has an ink-coloured ring, not a family-coloured one: a ring in
        its own colour is invisible against the dot it circles.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Jména rodin dodává volající přes <IngotCode>optionLabel</IngotCode>. Kit je
        nezná — ví jen, kolik rodin existuje, protože jejich tokeny jsou jeho.
      </>,
      <>
        <IngotCode>groupLabel</IngotCode> je jméno celé volby a je povinné; bez něj
        odečítač neřekne, čeho se pět puntíků týká.
      </>,
    ],
    en: [
      <>
        The family names come from the caller through <IngotCode>optionLabel</IngotCode>
        . The kit does not know them — only how many families exist, because their
        tokens are its own.
      </>,
      <>
        <IngotCode>groupLabel</IngotCode> names the whole choice and is required;
        without it a screen reader cannot say what the five dots are about.
      </>,
    ],
  },
};
