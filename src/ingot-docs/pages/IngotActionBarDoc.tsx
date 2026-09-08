import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotActionBarDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotActionBarDemo?raw");

export const IngotActionBarDoc: IngotDocMeta = {
  name: "IngotActionBar",
  status: "beta",
  version: "1.1",
  tag: ".actionbar",
  tokens: ["--surface", "--border", "--ink-3", "--warn", "--s-3", "--s-4"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění — kde v obsahu stojí. Ne na vzhled: lišta akcí, která vypadá na každé obrazovce jinak, přestane být tím místem, kde uživatel akce hledá.",
    en: "Takes `className`, but only for placement — where in the content it stands. Not for the look: an action bar that looks different on every screen stops being the place a user goes to look for actions.",
  },
  summary: {
    cs: "Lišta pod dlouhým formulářem: to, kvůli čemu čtenář přišel, je v dosahu i po devátém poli. Přilepená, ne plovoucí — nic nezakrývá.",
    en: "The bar under a long form: what the reader came to do, still in reach after the ninth field. Sticky, not floating — it covers nothing.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Formulář delší než obrazovka. Uložit na konci stránky, ke kterému se nikdo
        nedoroluje, je totéž jako žádné Uložit.
      </>,
      <>
        Obrazovka, kde se dá něco rozdělat a nedokončit. Stav „Neuložené změny“ vedle
        akce říká, proč tam ta akce ještě je.
      </>,
    ],
    en: [
      <>
        A form longer than the screen. A Save at the bottom of a page nobody scrolls to
        is the same as no Save.
      </>,
      <>
        A screen where something can be left half-done. "Unsaved changes" beside the
        action says why the action is still there.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotActionBarDoc.body"),
};
