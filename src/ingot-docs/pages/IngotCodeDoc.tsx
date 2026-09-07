import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotCodeDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotCodeDemo?raw");

export const IngotCodeDoc: IngotDocMeta = {
  name: "IngotCode",
  status: "stable",
  version: "1.1",
  tag: ".code",
  tokens: [
    "--surface",
    "--border",
    "--font-mono",
    "--r-sm",
    "--code-comment",
    "--code-keyword",
    "--code-string",
    "--code-tag",
    "--code-attr",
    "--code-number",
    "--code-punct",
  ],
  classNameNote: {
    cs: "`className` nebere. Výpis i kód ve větě mají jednu sazbu, aby se kód všude četl stejně.",
    en: "Does not take `className`. A listing and inline code share one typesetting so code reads the same everywhere.",
  },
  summary: {
    cs: "Kód v textu, nebo výpis přes celou šířku. Výpis se umí posunout do strany — což je ta jediná věc, na které ruční výpisy padají.",
    en: "Code inside a sentence, or a listing across the full width. The listing scrolls sideways — the one thing hand-rolled listings get wrong.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Ve větě je jméno vlastnosti, klíč, cesta k modulu nebo hodnota, kterou uživatel
        opravdu napíše. Odlišit ji od prózy má význam: čtenář pozná, co má opsat
        doslova.
      </>,
      <>
        Ukazuješ víc řádků kódu — <IngotCode>block</IngotCode>. Když je to TSX, přidej{" "}
        <IngotCode>lang</IngotCode>: barva rozliší řetězec od klíčového slova a atribut
        od značky, což je u delší ukázky rozdíl mezi „přečtu" a „luštím".
      </>,
    ],
    en: [
      <>
        A sentence contains a property name, a key, a module path or a value the user
        will really type. Setting it apart from prose carries meaning: the reader can
        tell what to copy verbatim.
      </>,
      <>
        You are showing several lines of code — <IngotCode>block</IngotCode>. When it is
        TSX, add <IngotCode>lang</IngotCode>: colour tells a string from a keyword and
        an attribute from a tag, which on a longer sample is the difference between
        reading and decoding.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotCodeDoc.body"),
};
