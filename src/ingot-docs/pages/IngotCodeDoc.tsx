import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotCodeDemo";
import demoSource from "@/ingot-docs/demos/IngotCodeDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotCodeDoc: IngotDocPage = {
  name: "IngotCode",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Kód v textu, nebo výpis přes celou šířku. Výpis se umí posunout do strany — což je ta jediná věc, na které ruční výpisy padají.",
    en: "Code inside a sentence, or a listing across the full width. The listing scrolls sideways — the one thing hand-rolled listings get wrong.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Ve větě je jméno vlastnosti, klíč, cesta k modulu nebo hodnota, kterou
        uživatel opravdu napíše. Odlišit ji od prózy má význam: čtenář pozná,
        co má opsat doslova.
      </>,
      <>
        Ukazuješ víc řádků kódu — <IngotCode>block</IngotCode>. Když je to
        TSX, přidej <IngotCode>lang</IngotCode>: barva rozliší řetězec od
        klíčového slova a atribut od značky, což je u delší ukázky rozdíl
        mezi „přečtu" a „luštím".
      </>,
    ],
    en: [
      <>
        A sentence contains a property name, a key, a module path or a value
        the user will really type. Setting it apart from prose carries
        meaning: the reader can tell what to copy verbatim.
      </>,
      <>
        You are showing several lines of code — <IngotCode>block</IngotCode>.
        When it is TSX, add <IngotCode>lang</IngotCode>: colour tells a string
        from a keyword and an attribute from a tag, which on a longer sample
        is the difference between reading and decoding.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Chceš jen jiné písmo nebo zvýraznění. Na důraz je{" "}
        <IngotCode>&lt;strong&gt;</IngotCode>; <IngotCode>&lt;code&gt;</IngotCode> říká „tohle je
        kód", a když to kód není, je to lež o významu.
      </>,
      <>
        Je to identifikátor z našich vnitřností, který uživatel nikdy
        neuvidí ani nenapíše — název sloupce, klíč tabulky. Takový text do
        rozhraní pro zákazníka nepatří vůbec, ani v kódovém písmu.
      </>,
    ],
    en: [
      <>
        You only want a different typeface or emphasis. For emphasis there is{" "}
        <IngotCode>&lt;strong&gt;</IngotCode>; <IngotCode>&lt;code&gt;</IngotCode> says "this is
        code", and when it is not, that is a lie about meaning.
      </>,
      <>
        It is an internal identifier the user will never see or type — a
        column name, a table key. That text does not belong in a
        customer-facing interface at all, monospace or otherwise.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Kód. Nepřekládá se.",
        en: "The code. Not translated.",
      },
    },
    {
      name: "block",
      type: "boolean",
      required: false,
      note: {
        cs: "Výpis přes celou šířku místo kódu uvnitř věty.",
        en: "A full-width listing instead of code inside a sentence.",
      },
    },
    {
      name: "lang",
      type: '"tsx"',
      required: false,
      note: {
        cs: "Obarví syntaxi výpisu. Jen s block a jen když je obsah text — jinak se výpis vykreslí, jak přišel.",
        en: "Colours the listing's syntax. Only with block, and only when the content is text — otherwise the listing renders as it came.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid prvku.", en: "data-testid of the element." },
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>block</IngotCode> má <IngotCode>overflow-x-auto</IngotCode>, a je to ta
        podstatná vlastnost: kód se nezalamuje, takže bez posunu buď přeteče
        mimo stránku, nebo ho někdo „opraví" zalomením a rozbije odsazení,
        podle kterého se v něm čte.
      </>,
      <>
        Vykresluje se skutečný <IngotCode>&lt;code&gt;</IngotCode>, u výpisu uvnitř{" "}
        <IngotCode>&lt;pre&gt;</IngotCode>. Odečítač podle toho pozná, že text nemá
        číst jako větu.
      </>,
      <>
        Bílé znaky uvnitř <IngotCode>&lt;pre&gt;</IngotCode> zůstávají — odsazení je
        u kódu obsah, ne formátování.
      </>,
      <>
        Zvýraznění je jen barva navíc, nikdy jediný nositel významu:
        obarvený výpis má týž text i pořadí jako neobarvený, takže
        odečítač i kopírování dostanou totéž. Světlý a tmavý motiv mají
        vlastní sadu barev a každá role drží kontrast 4,5:1 proti ploše
        výpisu.
      </>,
    ],
    en: [
      <>
        <IngotCode>block</IngotCode> carries <IngotCode>overflow-x-auto</IngotCode>, and that is
        the substantive part: code does not wrap, so without scrolling it
        either overflows the page or someone "fixes" it by wrapping and
        destroys the indentation the code is read by.
      </>,
      <>
        It renders a real <IngotCode>&lt;code&gt;</IngotCode>, inside a{" "}
        <IngotCode>&lt;pre&gt;</IngotCode> for a listing. That is how a screen reader
        knows not to read the text as a sentence.
      </>,
      <>
        Whitespace inside <IngotCode>&lt;pre&gt;</IngotCode> is preserved — in code,
        indentation is content, not formatting.
      </>,
      <>
        Highlighting is colour on top, never the only carrier of meaning: a
        highlighted listing has the same text in the same order as a plain
        one, so a screen reader and a copy both get the same thing. Light and
        dark each have their own set of colours, and every role clears 4.5:1
        against the listing's surface.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Obsah se <strong>nepřekládá</strong>. Přeložený identifikátor přestane
        fungovat a čtenář to zjistí, až ho zkusí použít.
      </>,
      <>
        Věta kolem kódu se překládá normálně — proto je{" "}
        <IngotCode>IngotCode</IngotCode> vložka do textu, ne obal celého odstavce.
      </>,
    ],
    en: [
      <>
        The content is <strong>not</strong> translated. A translated
        identifier stops working, and the reader finds out when they try to
        use it.
      </>,
      <>
        The sentence around the code is translated as usual — which is why{" "}
        <IngotCode>IngotCode</IngotCode> is an inline insert, not a wrapper around the
        whole paragraph.
      </>,
    ],
  },
};
