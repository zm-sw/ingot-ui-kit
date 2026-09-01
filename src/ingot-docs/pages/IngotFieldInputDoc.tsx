import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotFieldInputDemo";
import demoSource from "@/ingot-docs/demos/IngotFieldInputDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotFieldInputDoc: IngotDocPage = {
  name: "IngotFieldInput",
  summary: {
    cs: "Jedno pole podle svého kind. Nezná žádnou doménu — množinu voleb i překlady dodává volající.",
    en: "A single field driven by its kind. It knows no domain — the option set and the translations both come from the caller.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Potřebuješ jedno pole na místě, kde si rozvržení i popisek řídíš sám.
      </>,
      <>
        Skládáš netriviální formulář (sekce, sloupce vedle sebe) a chceš
        aspoň jednotné chování vstupů.
      </>,
      <>
        Pole má <IngotCode>kind: &quot;options&quot;</IngotCode> a množinu voleb zná
        jen ta obrazovka — dodá se přes <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
    en: [
      <>
        You need one field somewhere you control the layout and the label
        yourself.
      </>,
      <>
        You are composing a non-trivial form (sections, side-by-side columns)
        and want at least consistent input behaviour.
      </>,
      <>
        The field is <IngotCode>kind: &quot;options&quot;</IngotCode> and only that
        screen knows the option set — supply it through{" "}
        <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Stavíš obyčejný svislý formulář z více polí. <IngotCode>IngotForm</IngotCode>{" "}
        k tomu přidá popisky i nápovědy a ušetří ti je opisovat.
      </>,
      <>
        Chceš pole, které Ingot nezná (datum, soubor, barva).{" "}
        <IngotCode>IngotFieldSpec</IngotCode> má pevný výčet <IngotCode>kind</IngotCode>; nový se
        přidává k němu, ne obcházením primitiva.
      </>,
      <>
        Formulář se píše rukou a pole nemají odkud vzniknout — jsou tři a jsou
        dané. Tam patří <IngotCode>IngotField</IngotCode>, které si popisek,
        nápovědu i chybu nese s sebou. Tohle primitivum je schválně bez
        popisku, protože ho nad ním skládá <IngotCode>IngotForm</IngotCode>.
      </>,
    ],
    en: [
      <>
        You are building an ordinary vertical form out of several fields.{" "}
        <IngotCode>IngotForm</IngotCode> adds the labels and hints and saves you
        copying them.
      </>,
      <>
        You want a field the Ingot does not know (date, file, colour).{" "}
        <IngotCode>IngotFieldSpec</IngotCode> has a closed set of <IngotCode>kind</IngotCode> values;
        a new one is added there, not by working around the primitive.
      </>,
      <>
        The form is written by hand and the fields have nowhere to come from —
        there are three of them and they are fixed. That is{" "}
        <IngotCode>IngotField</IngotCode>, which carries its own label, hint
        and error. This primitive is deliberately label-less, because{" "}
        <IngotCode>IngotForm</IngotCode> composes the label above it.
      </>,
    ],
  },
  props: [
    {
      name: "field",
      type: "IngotFieldSpec",
      required: true,
      note: {
        cs: "Popis pole; kind rozhoduje, co se vykreslí.",
        en: "The field descriptor; kind decides what is rendered.",
      },
    },
    {
      name: "value",
      type: "unknown",
      required: true,
      note: {
        cs: "Aktuální hodnota. Pole je řízené.",
        en: "The current value. The field is controlled.",
      },
    },
    {
      name: "onChange",
      type: "(next: unknown) => void",
      required: true,
      note: {
        cs: "Nová hodnota už převedená na typ podle kind.",
        en: "The new value, already coerced according to kind.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: true,
      note: {
        cs: "data-testid vstupu. Povinné — E2E na něm visí.",
        en: "data-testid of the input. Required — the end-to-end tests hang off it.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Zamkne vstup, typicky po dobu mutace.",
        en: "Locks the input, typically while a mutation is in flight.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: { cs: "Třída vstupu.", en: "Class applied to the input." },
    },
    {
      name: "renderOptions",
      type: "(args) => ReactNode",
      required: false,
      note: {
        cs: "Výběr z pojmenované množiny. Bez něj spadne kind options na text.",
        en: "Picker over a named set. Without it an options field falls back to text.",
      },
    },
    {
      name: "secretPlaceholder",
      type: "(field: IngotFieldSpec) => string",
      required: false,
      note: {
        cs: "Přeložený text tajného pole místo českého výchozího.",
        en: "Translated secret-field text instead of the built-in Czech default.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        🚨 Samotné pole <IngotCode>&lt;label&gt;</IngotCode>{" "}
        <strong>nevykresluje</strong>. Popisek i jeho vazbu (
        <IngotCode>htmlFor</IngotCode> + <IngotCode>id</IngotCode>, nebo obalující{" "}
        <IngotCode>&lt;label&gt;</IngotCode>) dodává volající — jak to dělá ukázka výše.
      </>,
      <>
        <IngotCode>kind</IngotCode> rozhoduje o typu vstupu: <IngotCode>boolean</IngotCode> →{" "}
        <IngotCode>checkbox</IngotCode>, <IngotCode>secret</IngotCode> → <IngotCode>password</IngotCode>,{" "}
        <IngotCode>integer</IngotCode> a <IngotCode>number</IngotCode> → <IngotCode>number</IngotCode> se{" "}
        <IngotCode>step</IngotCode> 1, resp. <IngotCode>any</IngotCode>.
      </>,
      <>
        <IngotCode>testId</IngotCode> je povinný. Bez popisku uvnitř primitiva je{" "}
        <IngotCode>data-testid</IngotCode> jediný stabilní úchyt, který E2E má.
      </>,
    ],
    en: [
      <>
        🚨 The field itself does <strong>not</strong> render a{" "}
        <IngotCode>&lt;label&gt;</IngotCode>. The label and its association (
        <IngotCode>htmlFor</IngotCode> + <IngotCode>id</IngotCode>, or a wrapping{" "}
        <IngotCode>&lt;label&gt;</IngotCode>) come from the caller — as the demo above
        does.
      </>,
      <>
        <IngotCode>kind</IngotCode> decides the input type: <IngotCode>boolean</IngotCode> →{" "}
        <IngotCode>checkbox</IngotCode>, <IngotCode>secret</IngotCode> → <IngotCode>password</IngotCode>,{" "}
        <IngotCode>integer</IngotCode> and <IngotCode>number</IngotCode> → <IngotCode>number</IngotCode>{" "}
        with <IngotCode>step</IngotCode> 1 and <IngotCode>any</IngotCode> respectively.
      </>,
      <>
        <IngotCode>testId</IngotCode> is required. With no label inside the primitive,{" "}
        <IngotCode>data-testid</IngotCode> is the only stable handle the end-to-end
        tests have.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>field.label</IngotCode> a <IngotCode>field.description</IngotCode> primitivum
        jen předává dál — vykresluje je až <IngotCode>IngotForm</IngotCode>.
      </>,
      <>
        <IngotCode>secretPlaceholder(field)</IngotCode> nahrazuje český výchozí text.
        Konstanty <IngotCode>SECRET_PLACEHOLDER_SET</IngotCode> a{" "}
        <IngotCode>SECRET_PLACEHOLDER_UNSET</IngotCode> jsou exportované, aby se test
        i volající shodli na jeho tvaru.
      </>,
      <>
        Popisky voleb u <IngotCode>kind: &quot;options&quot;</IngotCode> dodává{" "}
        <IngotCode>renderOptions</IngotCode> celé.
      </>,
    ],
    en: [
      <>
        <IngotCode>field.label</IngotCode> and <IngotCode>field.description</IngotCode> are only
        passed through — <IngotCode>IngotForm</IngotCode> is what renders them.
      </>,
      <>
        <IngotCode>secretPlaceholder(field)</IngotCode> replaces the built-in Czech
        text. The constants <IngotCode>SECRET_PLACEHOLDER_SET</IngotCode> and{" "}
        <IngotCode>SECRET_PLACEHOLDER_UNSET</IngotCode> are exported so tests and
        callers agree on its shape.
      </>,
      <>
        Option labels for <IngotCode>kind: &quot;options&quot;</IngotCode> are supplied
        entirely by <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
  },
};
