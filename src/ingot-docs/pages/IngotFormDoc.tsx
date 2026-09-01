import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotFormDemo";
import demoSource from "@/ingot-docs/demos/IngotFormDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotFormDoc: IngotDocPage = {
  name: "IngotForm",
  summary: {
    cs: "Deklarativní formulář: dostane pole a hodnoty, vrací změny přes onChange. Tvar formuláře jsou data, ne JSX.",
    en: "Declarative form: it takes fields and values and reports changes through onChange. The shape of the form is data, not JSX.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Pole přicházejí za běhu — ze schématu modulu nebo z manifestu
        integrace. <IngotCode>fieldsFromConfigSchema</IngotCode> a{" "}
        <IngotCode>fieldsFromIntegrationManifest</IngotCode> je převedou na{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>.
      </>,
      <>
        Tvar formuláře jsou data: přidat pole znamená přidat řádek do pole,
        ne napsat další <IngotCode>&lt;label&gt;</IngotCode> a vlastní{" "}
        <IngotCode>onChange</IngotCode>.
      </>,
      <>
        Chceš, aby se převod hodnoty na typ (<IngotCode>integer</IngotCode>,{" "}
        <IngotCode>number</IngotCode>, <IngotCode>boolean</IngotCode>, <IngotCode>secret</IngotCode>)
        choval na všech obrazovkách stejně.
      </>,
    ],
    en: [
      <>
        The fields arrive at runtime — from a module schema or an integration
        manifest. <IngotCode>fieldsFromConfigSchema</IngotCode> and{" "}
        <IngotCode>fieldsFromIntegrationManifest</IngotCode> turn them into{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>.
      </>,
      <>
        The shape of the form is data: adding a field means adding an entry
        to an array, not writing another <IngotCode>&lt;label&gt;</IngotCode> and its
        own <IngotCode>onChange</IngotCode>.
      </>,
      <>
        You want value coercion (<IngotCode>integer</IngotCode>, <IngotCode>number</IngotCode>,{" "}
        <IngotCode>boolean</IngotCode>, <IngotCode>secret</IngotCode>) to behave the same on
        every screen.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Rozvržení není svislý seznam — dvousloupcové sekce, pole vedle sebe,
        taby. Formulář umí jen <IngotCode>space-y</IngotCode>; poskládej si{" "}
        <IngotCode>IngotFieldInput</IngotCode> sám.
      </>,
      <>
        Potřebuješ validaci a chybové hlášky u jednotlivých polí. První verze
        je nemá — hlášku vykresluje volající nad formulářem. Rukou psaný
        formulář, který chybu u pole potřebuje, si ho složí z{" "}
        <IngotCode>IngotField</IngotCode>.
      </>,
      <>
        Je to jediné pole. Pak je <IngotCode>IngotFieldInput</IngotCode> přímo levnější
        a nemusíš vymýšlet <IngotCode>testIdPrefix</IngotCode>.
      </>,
    ],
    en: [
      <>
        The layout is not a vertical list — two-column sections, fields side
        by side, tabs. The form only does <IngotCode>space-y</IngotCode>; compose{" "}
        <IngotCode>IngotFieldInput</IngotCode> yourself.
      </>,
      <>
        You need per-field validation and error messages. The first version
        has none — the caller renders the message above the form. A
        hand-written form that needs a per-field error composes itself out of{" "}
        <IngotCode>IngotField</IngotCode>.
      </>,
      <>
        It is a single field. Then <IngotCode>IngotFieldInput</IngotCode> is cheaper
        outright and you do not have to invent a <IngotCode>testIdPrefix</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "fields",
      type: "readonly IngotFieldSpec[]",
      required: true,
      note: {
        cs: "Popis polí. Pořadí v poli je pořadí na obrazovce.",
        en: "The field descriptors. Array order is on-screen order.",
      },
    },
    {
      name: "values",
      type: "Record<string, unknown>",
      required: true,
      note: {
        cs: "Aktuální hodnoty klíčované podle field.key.",
        en: "Current values keyed by field.key.",
      },
    },
    {
      name: "onChange",
      type: "(key: string, next: unknown) => void",
      required: true,
      note: {
        cs: "Formulář je řízený — stav drží volající.",
        en: "The form is controlled — the caller owns the state.",
      },
    },
    {
      name: "testIdPrefix",
      type: "string",
      required: true,
      note: {
        cs: "data-testid vstupu je `${testIdPrefix}-${key}`.",
        en: "An input's data-testid is `${testIdPrefix}-${key}`.",
      },
    },
    {
      name: "renderOptions",
      type: "IngotFieldInput['renderOptions']",
      required: false,
      note: {
        cs: "Výběr pro pole typu options. Bez něj se pole chová jako text.",
        en: "The picker for options fields. Without it such a field behaves as text.",
      },
    },
    {
      name: "secretPlaceholder",
      type: "(field: IngotFieldSpec) => string",
      required: false,
      note: {
        cs: "Přeložený placeholder tajného pole — Ingot překlady nemá.",
        en: "Translated placeholder for a secret field — the Ingot has no translations.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Obal formuláře. Výchozí space-y-4.",
        en: "The form wrapper. Defaults to space-y-4.",
      },
    },
    {
      name: "inputClassName",
      type: "string",
      required: false,
      note: {
        cs: "Obrazovky se liší šířkou pole, ne tvarem formuláře.",
        en: "Screens differ in field width, not in form shape.",
      },
    },
    {
      name: "labelClassName",
      type: "string",
      required: false,
      note: {
        cs: "Popisek pole. Výchozí block text-sm.",
        en: "The field label. Defaults to block text-sm.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Popisek je <IngotCode>&lt;label&gt;</IngotCode> obalující vstup, takže vazba
        drží bez <IngotCode>htmlFor</IngotCode> a <IngotCode>id</IngotCode> a klik na text
        zaostří pole.
      </>,
      <>
        Zaškrtávátko (<IngotCode>kind: &quot;boolean&quot;</IngotCode>) má popisek
        vpravo od sebe. Je to jediná odchylka a drží ji formulář, aby ji
        konzumenti neopisovali.
      </>,
      <>
        <IngotCode>field.description</IngotCode> se vypisuje pod vstupem uvnitř téhož{" "}
        <IngotCode>&lt;label&gt;</IngotCode>, takže se čte spolu s popiskem.
      </>,
      <>
        <IngotCode>testIdPrefix</IngotCode> je povinný: <IngotCode>data-testid</IngotCode> vstupu
        se skládá z něj a z <IngotCode>field.key</IngotCode>, a E2E na tom visí.
      </>,
    ],
    en: [
      <>
        The label is a <IngotCode>&lt;label&gt;</IngotCode> wrapping the input, so the
        association holds without <IngotCode>htmlFor</IngotCode> and <IngotCode>id</IngotCode>,
        and clicking the text focuses the field.
      </>,
      <>
        A checkbox (<IngotCode>kind: &quot;boolean&quot;</IngotCode>) carries its label
        to its right. It is the only deviation, and the form owns it so
        consumers do not copy it.
      </>,
      <>
        <IngotCode>field.description</IngotCode> is rendered below the input inside the
        same <IngotCode>&lt;label&gt;</IngotCode>, so it is read together with the
        label.
      </>,
      <>
        <IngotCode>testIdPrefix</IngotCode> is required: an input's{" "}
        <IngotCode>data-testid</IngotCode> is built from it and <IngotCode>field.key</IngotCode>,
        and the end-to-end tests hang off that.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>field.label</IngotCode> a <IngotCode>field.description</IngotCode> — formulář
        je vypisuje tak, jak přijdou.
      </>,
      <>
        <IngotCode>secretPlaceholder(field)</IngotCode>. Bez něj se u tajného pole
        vypíše český výchozí text.
      </>,
      <>
        <IngotCode>renderOptions</IngotCode> si popisky voleb dodává celé samo.
      </>,
    ],
    en: [
      <>
        <IngotCode>field.label</IngotCode> and <IngotCode>field.description</IngotCode> — the
        form prints them exactly as they arrive.
      </>,
      <>
        <IngotCode>secretPlaceholder(field)</IngotCode>. Without it a secret field
        falls back to the built-in Czech text.
      </>,
      <>
        <IngotCode>renderOptions</IngotCode> supplies its option labels entirely on its
        own.
      </>,
    ],
  },
};
