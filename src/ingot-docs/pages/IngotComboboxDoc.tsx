import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotComboboxDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotComboboxDemo?raw");

export const IngotComboboxDoc: IngotDocMeta = {
  name: "IngotCombobox",
  status: "beta",
  // 1.0 — the primitive IngotSelect points at: picking one value out of
  // many by typing. Promoted from a copy the product had written outside
  // the kit, so the behaviour arrives measured rather than invented.
  version: "1.0",
  tag: ".combobox",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--border-strong",
    "--accent",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--focus-ring",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku a umístění v mřížce. Vzhled rámu i seznamu drží primitivum.",
    en: "Takes `className`, but for layout only — width and placement in a grid. The look of the frame and of the list stays with the primitive.",
  },
  summary: {
    cs: "Výběr jedné hodnoty z mnoha psaním — země z dvou stovek, místo ve provozu se zónami, člen z celého týmu. Skládá diakritiku, řadí shody a hledá i podle klíčových slov, která nikdy nevykreslí.",
    en: "Picking one value out of many by typing — a country out of two hundred, a place in a plant with zones, a member out of a whole team. It folds diacritics, ranks the matches, and searches keywords it never draws.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Seznam je delší, než kolik někdo přeroluje — země, měny, místa ve skladu,
        členové týmu. Napsat tři písmena je rychlejší než hledat očima.
      </>,
      <>
        Lidé píšou něco jiného, než co je vidět: kód místo názvu, předvolbu místo země,
        přezdívku místo plného jména. To patří do <IngotCode>keywords</IngotCode>, které
        se hledají a nekreslí.
      </>,
      <>
        Volba potřebuje druhý řádek, aby byla rozpoznatelná — klíč za lidským názvem,
        e-mail za jménem člověka. To je <IngotCode>secondary</IngotCode>.
      </>,
    ],
    en: [
      <>
        The list is longer than anybody scrolls through — countries, currencies, storage
        places, team members. Typing three letters beats hunting with the eye.
      </>,
      <>
        People type something other than what is shown: a code instead of a name, a dial
        code instead of a country, a nickname instead of a full name. That is what{" "}
        <IngotCode>keywords</IngotCode> is for — matched, never drawn.
      </>,
      <>
        A choice needs a second line to be told apart — the key behind a human name, the
        e-mail behind a person. That is <IngotCode>secondary</IngotCode>.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotComboboxDoc.body"),
};
