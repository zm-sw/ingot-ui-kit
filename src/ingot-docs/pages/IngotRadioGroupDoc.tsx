import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotRadioGroupDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotRadioGroupDemo?raw");

export const IngotRadioGroupDoc: IngotDocMeta = {
  name: "IngotRadioGroup",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.2",
  tag: ".radiogroup",
  tokens: ["--accent", "--ink", "--ink-2", "--ink-3", "--ink-4", "--danger"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku a odsazení skupiny. Podobu voleb drží primitivum.",
    en: "Takes `className`, but for layout only — the group's width and margins. The options' shape stays with the primitive.",
  },
  summary: {
    cs: "Jedna volba z několika, všechny vidět naráz. Nativní skupina, takže šipky i odesílání formuláře jedou samy.",
    en: "One choice out of several, all visible at once. A native group, so the arrows and form submission work by themselves.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Voleb jsou tři až šest a mají se přečíst a porovnat — režim naceňování, způsob
        dopravy.
      </>,
      <>Ke každé volbě patří věta vysvětlení, ale ne tolik, aby si zasloužila kartu.</>,
      <>Volba je součástí formuláře a ukládá se s ním.</>,
    ],
    en: [
      <>
        There are three to six options and they should be read and compared — a pricing
        mode, a delivery method.
      </>,
      <>
        Each option needs a sentence of explanation, but not enough to deserve a card.
      </>,
      <>The choice is part of a form and is saved with it.</>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotRadioGroupDoc.body"),
};
