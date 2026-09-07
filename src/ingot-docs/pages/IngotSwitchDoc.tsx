import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSwitchDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSwitchDemo?raw");

export const IngotSwitchDoc: IngotDocMeta = {
  name: "IngotSwitch",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.2 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.2",
  tag: ".switch",
  tokens: [
    "--accent",
    "--border-strong",
    "--surface",
    "--ink-2",
    "--ink-3",
    "--ink-4",
    "--accent-bg",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení řádku — odsazení a zarovnání. Podobu přepínače drží primitivum.",
    en: "Takes `className`, but for the row's layout only — margins and alignment. The switch's own shape stays with the primitive.",
  },
  summary: {
    cs: "Nastavení, které platí hned po přepnutí. Ne zaškrtávátko: to čeká na uložení formuláře.",
    en: "A setting that takes effect the moment it is flipped. Not a checkbox: that one waits for the form to be saved.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Volba se ukládá okamžitě — přepínač v nastavení účtu, zapnutí modulu,
        viditelnost sloupce.
      </>,
      <>Stav je binární a čte se jako zapnuto/vypnuto, ne jako vybráno.</>,
      <>Vedle sebe stojí víc takových voleb pod sebou a mají vypadat stejně.</>,
    ],
    en: [
      <>
        The choice is saved immediately — a toggle in account settings, switching a
        module on, showing a column.
      </>,
      <>The state is binary and reads as on/off, not as selected.</>,
      <>Several such choices stand under each other and should look the same.</>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSwitchDoc.body"),
};
