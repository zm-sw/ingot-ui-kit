import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotOpIconDemo";
import demoSource from "@/ingot-docs/demos/IngotOpIconDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotOpIconDoc: IngotDocPage = {
  name: "IngotOpIcon",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Ikona výrobní operace. Kresbu bere z knihovny operací, barvu z kategorie procesu a klíč z databáze — sama si nevymýšlí nic.",
    en: "A manufacturing-operation icon. It takes the drawing from the operation library, the ink from the process category and the key from the database — it invents nothing.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Ukazuješ operaci, kterou má proces uloženou v{" "}
        <IngotCode>icon_key</IngotCode> — v koši, na kartě procesu,
        v přehledu technologií.
      </>,
      <>
        Ikona stojí <strong>vedle názvu operace</strong>. To je její
        normální tvar; sama je zkratka, ne popisek.
      </>,
    ],
    en: [
      <>
        You are showing an operation the process has stored in{" "}
        <IngotCode>icon_key</IngotCode> — in the cart, on a process card,
        in a technology overview.
      </>,
      <>
        The icon sits <strong>next to the operation name</strong>. That is
        its normal shape; on its own it is shorthand, not a label.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to ikona rozhraní — nahrání, hledání, koš.{" "}
        <IngotCode>IngotIcon</IngotCode>.
      </>,
      <>
        Vedle už svítí <IngotCode>opdot</IngotCode>, barevná tečka
        kategorie. Tečka a ikona říkají totéž a vedle sebe si protiřečí —
        vyber jedno.
      </>,
      <>
        Klíč bys skládal z názvu operace nebo ze slugu. Ikonu vybírá admin
        ručně; žádné párování slug→ikona v repu není a dohadovat ho
        znamená ukázat cizí technologii.
      </>,
      <>
        Chybí ti technologie. Přidej <strong>ikonu</strong> do knihovny
        operací — <strong>nikdy emoji</strong>.
      </>,
    ],
    en: [
      <>
        It is an interface icon — upload, search, trash.{" "}
        <IngotCode>IngotIcon</IngotCode>.
      </>,
      <>
        An <IngotCode>opdot</IngotCode>, the category colour dot, is already
        showing next to it. The dot and the icon say the same thing and
        contradict each other side by side — pick one.
      </>,
      <>
        You would build the key from the operation name or slug. The admin
        picks the icon by hand; there is no slug→icon matching in this repo
        and guessing one shows the wrong technology.
      </>,
      <>
        Your technology is missing. Add an <strong>icon</strong> to the
        operation library — <strong>never an emoji</strong>.
      </>,
    ],
  },
  props: [
    {
      name: "token",
      type: "string | null | undefined",
      required: true,
      note: {
        cs: "Uložený icon_key ve tvaru <klíč>, <klíč>:black nebo <klíč>:white. Pro backend je neprůhledný — nepřekládej ho ani nesestavuj. Neznámý token vykreslí null, ať volající může spadnout na vlastní náhradu.",
        en: "The stored icon_key, shaped <key>, <key>:black or <key>:white. Opaque to the backend — do not translate or compose it. An unknown token renders null so the caller can fall back.",
      },
    },
    {
      name: "size",
      type: "number",
      required: false,
      note: {
        cs: "Hrana čtverce v px, výchozí 20. Sada operací se sází 18–22 — je hustší než sada rozhraní a menší se rozpadá.",
        en: "Square edge in px, default 20. The operation set is set at 18–22 — it is denser than the interface set and falls apart smaller.",
      },
    },
    {
      name: "categoryColor",
      type: "string | null",
      required: false,
      note: {
        cs: "operation_category_color procesu. Uplatní se jen u varianty bez přípony; :black a :white si barvu nesou samy.",
        en: "The process's operation_category_color. Applies only to the suffix-less variant; :black and :white carry their own ink.",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      note: {
        cs: "Název operace pro odečítač. Jen pro šířkově kritický řádek, kde ikona stojí bez viditelného popisku.",
        en: "The operation name for a screen reader. Only for a width-critical row where the icon has no visible label.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Doplňkové třídy obálky. Rámeček ani dlaždice sem nepatří — chrome je věc volajícího.",
        en: "Extra classes on the wrapper. No border or tile here — chrome belongs to the caller.",
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
        Výchozí stav je dekorativní. Vedle názvu operace je to správně —
        název už ten význam nese.
      </>,
      <>
        Bez viditelného názvu MUSÍ přijít <IngotCode>title</IngotCode>;
        komponenta z něj udělá <IngotCode>role=&quot;img&quot;</IngotCode>{" "}
        a <IngotCode>aria-label</IngotCode>. Ikona operace bez jména je
        jinak nečitelná i pro vidícího.
      </>,
      <>
        Varianta <IngotCode>:white</IngotCode> je bílá čára — potřebuje pod
        sebou tmavou plochu od volajícího, jinak zmizí. Kontrast tady kit
        neuhlídá, protože pozadí nezná.
      </>,
    ],
    en: [
      <>
        The default is decorative. Next to the operation name that is
        correct — the name already carries the meaning.
      </>,
      <>
        Without a visible name a <IngotCode>title</IngotCode> is REQUIRED;
        the component turns it into{" "}
        <IngotCode>role=&quot;img&quot;</IngotCode> and{" "}
        <IngotCode>aria-label</IngotCode>. An unnamed operation icon is
        unreadable even to a sighted user.
      </>,
      <>
        The <IngotCode>:white</IngotCode> variant is white line art — it
        needs a dark surface from the caller or it disappears. The kit
        cannot police that contrast because it does not know the background.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Název operace dodává volající přeložený, stejně jako u ostatních
        primitiv.
      </>,
      <>
        <IngotCode>icon_key</IngotCode> je identifikátor a{" "}
        <strong>nepřekládá se</strong>. Přeložený klíč by ukazoval jinou
        operaci nebo nic.
      </>,
    ],
    en: [
      <>
        The caller supplies the operation name already translated, as with
        every other primitive.
      </>,
      <>
        <IngotCode>icon_key</IngotCode> is an identifier and is{" "}
        <strong>not translated</strong>. A translated key would show a
        different operation, or none.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Kresby tady nebydlí — komponenta je obálka nad knihovnou operací.
        Nová technologie se přidává tam, ne sem.
      </>,
      <>
        Barvu volí token a kategorie procesu. Libovolnou barvu zvenčí
        komponenta schválně nebere: barva operace něco znamená.
      </>,
    ],
    en: [
      <>
        The drawings do not live here — the component wraps the operation
        library. A new technology is added there, not here.
      </>,
      <>
        The ink is chosen by the token and the process category. The
        component deliberately takes no arbitrary colour from outside: an
        operation's colour means something.
      </>,
    ],
  },
};
