import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSpinnerDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSpinnerDemo?raw");

export const IngotSpinnerDoc: IngotDocMeta = {
  name: "IngotSpinner",
  status: "beta",
  // 1.1 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.1",
  tag: ".spinner",
  tokens: ["--accent", "--dur", "--ease"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění — okraje, zarovnání. Velikost je `size`, barva je akcent: prstenec v barvě obrazovky přestane být tím, co člověk pozná jako „pracuje se“.",
    en: "Takes `className`, but only for placement — margins, alignment. The size is `size` and the colour is the accent: a ring in a screen's own colour stops being the thing people recognise as work in progress.",
  },
  summary: {
    cs: "Něco se děje a není co držet za tvar. Druhá volba po kostře — a jméno je povinné.",
    en: "Something is happening and there is no shape to hold. The second choice after a skeleton — and the name is required.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Tlačítko odesílá. <IngotCode>Button</IngotCode> má{" "}
        <IngotCode>loading</IngotCode> a kreslí si ho samo — tohle je pro místa, kde
        tlačítko není.
      </>,
      <>
        Panel čeká na odpověď, jejíž velikost nikdo předem nezná. Kostra by držela místo
        pro něco jiného, než co přijde.
      </>,
    ],
    en: [
      <>
        A button is submitting. <IngotCode>Button</IngotCode> has{" "}
        <IngotCode>loading</IngotCode> and draws its own — this is for the places where
        there is no button.
      </>,
      <>
        A panel waiting on an answer whose size nobody can predict. A skeleton would
        hold room for something other than what arrives.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSpinnerDoc.body"),
};
