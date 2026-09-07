import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMenuDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMenuDemo?raw");

export const IngotMenuDoc: IngotDocMeta = {
  name: "IngotMenu",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 2.0 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: an item's tone was renamed: `default` is now `neutral`.
  version: "2.0",
  tag: ".menu",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--danger",
    "--danger-bg",
    "--r-lg",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — typicky šířku menu. Řádky, tóny a mezery drží primitivum.",
    en: "Takes `className`, but for layout only — typically the menu's width. The rows, tones and spacing stay with the primitive.",
  },
  summary: {
    cs: "Seznam akcí v popoveru: role menu, šipky, Home/End, psaní podle prvních písmen, oddělovače a tón danger.",
    en: "A list of actions in a popover: the menu roles, arrows, Home/End, type-ahead, separators and the danger tone.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Akcí je víc, než se vejde do řádku — víc než tři řádkové akce patří do menu, ne
        vedle sebe.
      </>,
      <>
        Akce patří k jednomu záznamu nebo k jedné obrazovce a mají se nabídnout naráz,
        aby šly porovnat.
      </>,
      <>
        Mezi nimi je jedna nevratná: dostane <IngotCode>tone</IngotCode> danger a
        oddělovač nad sebou, aby se do ní nekliklo omylem.
      </>,
    ],
    en: [
      <>
        There are more actions than fit in a row — more than three row actions belong in
        a menu, not side by side.
      </>,
      <>
        The actions belong to one record or one screen and should be offered together,
        so they can be compared.
      </>,
      <>
        One of them is irreversible: it gets the danger <IngotCode>tone</IngotCode> and
        a separator above it, so nobody clicks it by accident.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMenuDoc.body"),
};
