import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAvatarDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAvatarDemo?raw");

export const IngotAvatarDoc: IngotDocMeta = {
  name: "IngotAvatar",
  status: "beta",
  // 1.1 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.1",
  tag: ".avatar",
  tokens: ["--ink", "--bg", "--font-mono"],
  classNameNote: {
    cs: "Bere `className`, ale jen na okraje a zarovnání. Velikost je `size` a barva je pevná — kolečko, které má na každé obrazovce jinou velikost, přestane být tím, podle čeho čtenář pozná člověka.",
    en: "Takes `className`, but only for margins and alignment. The size is `size` and the colour is fixed — a circle that is a different size on every screen stops being the thing a reader recognises a person by.",
  },
  summary: {
    cs: "Člověk, jak malý člověk bývá: iniciály, nebo jeho obrázek. Iniciály dodává volající.",
    en: "A person, as small as a person gets: initials, or their picture. The initials come from the caller.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Účet v horní liště — <IngotCode>IngotTopNavAccount</IngotCode> ho používá.
      </>,
      <>
        Sloupec „obsluha“ v tabulce, autor komentáře, řádek seznamu lidí. Kolečko s
        iniciálami je rychlejší k přečtení než jméno, když se řádky prohlížejí očima.
      </>,
    ],
    en: [
      <>
        The account in the top bar — <IngotCode>IngotTopNavAccount</IngotCode> uses it.
      </>,
      <>
        An "operator" column in a table, a comment's author, a row in a list of people.
        A circle of initials is quicker to read than a name when rows are being skimmed.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotAvatarDoc.body"),
};
