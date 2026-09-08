import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotStepCardDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotStepCardDemo?raw");

export const IngotStepCardDoc: IngotDocMeta = {
  name: "IngotStepCard",
  status: "beta",
  // 1.2 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.3 — collapse toggle is the kit's shared icon button.
  // 1.4 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.5 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.6 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.7",
  tag: ".stepcard",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--border-strong",
    "--ink",
    "--ink-3",
    "--ok",
    "--ok-bg",
    "--ok-border",
    "--font-mono",
    "--r-md",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Karta jednoho kroku vícekrokového nastavení. Nese svůj stav natrvalo — hotový krok zůstane hotový a je vidět i po návratu na obrazovku.",
    en: "A card for one step of a multi-step setup. It carries its state permanently — a finished step stays finished and is still visible when you come back to the screen.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nastavení, které se nedělá jedním dlouhým formulářem, ale kroky. Jednotlivé
        kroky se dokončují v různé dny a různými lidmi, takže každý z nich potřebuje
        vlastní rám a vlastní stav.
      </>,
      <>
        Krok, jehož obsahem je seznam nebo vnořená tabulka toho, co v něm vzniklo — země
        a měny, skupiny vlastností. Do těla karty patří právě tenhle výčet, ne pole
        formuláře jedno pod druhým.
      </>,
      <>
        Přehled, ve kterém má být na první pohled vidět, co už je hotové. Hotový krok má
        zelené záhlaví a fajfku místo čísla, takže se stav čte z odstupu.
      </>,
      <>
        Krok, do kterého se průběžně přidávají další položky. Na to je patička — jedna
        akce typu „Přidat…“ pod obsahem karty.
      </>,
      <>
        Nastavení o mnoha krocích, kde by hotové kroky odsunuly ten rozdělaný pod okraj
        obrazovky. <IngotCode>collapsible</IngotCode> nechá z hotového kroku jen
        záhlaví, takže přehled zůstane přehled.
      </>,
    ],
    en: [
      <>
        A setup that is not done through one long form but in steps. Individual steps
        get finished on different days by different people, so each one needs its own
        frame and its own state.
      </>,
      <>
        A step whose content is a list or a nested table of what it produced — countries
        and currencies, attribute groups. That listing is what belongs in the card body,
        not form fields stacked one below the other.
      </>,
      <>
        An overview where it must be obvious at a glance what is already done. A
        finished step has a green header and a check mark instead of the number, so the
        state reads from a distance.
      </>,
      <>
        A step that keeps gathering more items over time. That is what the footer is for
        — a single “Add…” action below the card content.
      </>,
      <>
        A setup with many steps, where the finished ones would push the unfinished one
        below the fold. <IngotCode>collapsible</IngotCode> leaves a finished step as
        just its header, so the overview stays an overview.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotStepCardDoc.body"),
};
