import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotConfirmDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotConfirmDemo?raw");

export const IngotConfirmDoc: IngotDocMeta = {
  name: "IngotConfirm",
  status: "stable",
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.3 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.4 (KAN-966) - the overlay captures the opener in an effect rather than while
  // rendering; focus returns to the same element.
  version: "1.4",
  tag: ".confirm",
  tokens: ["--bg", "--border", "--ink-2", "--warn", "--r-md"],
  classNameNote: {
    cs: "`className` nebere — dialog jede přes `IngotModal` a přebírá jeho geometrii i laťku.",
    en: "Does not take `className` — the dialog runs through `IngotModal` and inherits its geometry and its bar.",
  },
  summary: {
    cs: "Potvrzovací dialog nad IngotModal. Spočítaný dopad smí přes useConfirmVeto potvrzení odvolat.",
    en: "Confirmation dialog built on IngotModal. The computed impact may withdraw the confirmation through useConfirmVeto.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Krok je destruktivní nebo nevratný a operátor si ho má přečíst, ne odklepnout.
      </>,
      <>
        K rozhodnutí patří spočítaný dopad („smaže se 12 objednávek“). Jde do slotu{" "}
        <IngotCode>impact</IngotCode>, takže se počítá až ve chvíli, kdy je dialog
        otevřený.
      </>,
      <>
        Dopad může krok zakázat: <IngotCode>useConfirmVeto</IngotCode> uvnitř{" "}
        <IngotCode>impact</IngotCode> potvrzovací tlačítko odstraní.
      </>,
    ],
    en: [
      <>
        The step is destructive or irreversible and the operator is meant to read it,
        not click through it.
      </>,
      <>
        The decision needs a computed impact ("12 orders will be deleted"). That goes
        into the <IngotCode>impact</IngotCode> slot, so it is computed only once the
        dialog is open.
      </>,
      <>
        The impact may forbid the step: <IngotCode>useConfirmVeto</IngotCode> inside{" "}
        <IngotCode>impact</IngotCode> removes the confirm button.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotConfirmDoc.body"),
};
