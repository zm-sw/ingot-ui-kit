import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotFieldInputDemo";
import demoSource from "@/ingot-docs/demos/IngotFieldInputDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// 2.1 (KAN-853): the component is untouched — the schema adapters left the field module; the spec itself did not move.
// Nothing a caller passes or sees changed; the version moves because
// the module underneath it did.
export const IngotFieldInputDoc: IngotDocPage = {
  name: "IngotFieldInput",
  status: "stable",
  // 1.1 — the frame comes from the kit's shared input chrome (focus ring,
  // `--r-md`, Button-md height) instead of its own smaller box.
  // 1.2 — boolean is the shared checkbox control; options without renderOptions is a disabled IngotSelect, not a text input.
  // 2.0 (KAN-841) — the SECRET_PLACEHOLDER_* exports are gone; the secret
  // placeholders come from IngotProvider (English without one). A caller
  // that imported the constants reads INGOT_LABELS instead.
  version: "2.1",
  tag: ".input",
  tokens: [
    "--surface",
    "--surface-2",
    "--border-strong",
    "--ink",
    "--ink-4",
    "--accent",
    "--accent-bg",
    "--r-md",
    "--shadow-sm",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Jedno pole podle svého kind. Nezná žádnou doménu — množinu voleb i překlady dodává volající.",
    en: "A single field driven by its kind. It knows no domain — the option set and the translations both come from the caller.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>Potřebuješ jedno pole na místě, kde si rozvržení i popisek řídíš sám.</>,
      <>
        Skládáš netriviální formulář (sekce, sloupce vedle sebe) a chceš aspoň jednotné
        chování vstupů.
      </>,
      <>
        Pole má <IngotCode>kind: &quot;options&quot;</IngotCode> a množinu voleb zná jen
        ta obrazovka — dodá se přes <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
    en: [
      <>You need one field somewhere you control the layout and the label yourself.</>,
      <>
        You are composing a non-trivial form (sections, side-by-side columns) and want
        at least consistent input behaviour.
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
        Stavíš obyčejný svislý formulář z více polí. <IngotCode>IngotForm</IngotCode> k
        tomu přidá popisky i nápovědy a ušetří ti je opisovat.
      </>,
      <>
        Chceš pole, které Ingot nezná (datum, soubor, barva).{" "}
        <IngotCode>IngotFieldSpec</IngotCode> má pevný výčet <IngotCode>kind</IngotCode>
        ; nový se přidává k němu, ne obcházením primitiva.
      </>,
      <>
        Formulář se píše rukou a pole nemají odkud vzniknout — jsou tři a jsou dané. Tam
        patří <IngotCode>IngotField</IngotCode>, které si popisek, nápovědu i chybu nese
        s sebou. Tohle primitivum je schválně bez popisku, protože ho nad ním skládá{" "}
        <IngotCode>IngotForm</IngotCode>.
      </>,
    ],
    en: [
      <>
        You are building an ordinary vertical form out of several fields.{" "}
        <IngotCode>IngotForm</IngotCode> adds the labels and hints and saves you copying
        them.
      </>,
      <>
        You want a field the Ingot does not know (date, file, colour).{" "}
        <IngotCode>IngotFieldSpec</IngotCode> has a closed set of{" "}
        <IngotCode>kind</IngotCode> values; a new one is added there, not by working
        around the primitive.
      </>,
      <>
        The form is written by hand and the fields have nowhere to come from — there are
        three of them and they are fixed. That is <IngotCode>IngotField</IngotCode>,
        which carries its own label, hint and error. This primitive is deliberately
        label-less, because <IngotCode>IngotForm</IngotCode> composes the label above
        it.
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
        cs: "Výběr z pojmenované množiny. Bez něj se kind options vykreslí jako vypnutý select jen s aktuální hodnotou.",
        en: "Picker over a named set. Without it an options field renders as a disabled select holding only the current value.",
      },
    },
    {
      name: "secretPlaceholder",
      type: "(field: IngotFieldSpec) => string",
      required: false,
      note: {
        cs: "Vlastní text tajného pole místo slovníku IngotProvider.",
        en: "Custom secret-field text instead of the IngotProvider dictionary.",
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
        <IngotCode>kind</IngotCode> rozhoduje o typu vstupu:{" "}
        <IngotCode>boolean</IngotCode> → <IngotCode>checkbox</IngotCode>,{" "}
        <IngotCode>secret</IngotCode> → <IngotCode>password</IngotCode>,{" "}
        <IngotCode>integer</IngotCode> a <IngotCode>number</IngotCode> →{" "}
        <IngotCode>number</IngotCode> se <IngotCode>step</IngotCode> 1, resp.{" "}
        <IngotCode>any</IngotCode>.
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
        <IngotCode>kind</IngotCode> decides the input type:{" "}
        <IngotCode>boolean</IngotCode> → <IngotCode>checkbox</IngotCode>,{" "}
        <IngotCode>secret</IngotCode> → <IngotCode>password</IngotCode>,{" "}
        <IngotCode>integer</IngotCode> and <IngotCode>number</IngotCode> →{" "}
        <IngotCode>number</IngotCode> with <IngotCode>step</IngotCode> 1 and{" "}
        <IngotCode>any</IngotCode> respectively.
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
        <IngotCode>field.label</IngotCode> a <IngotCode>field.description</IngotCode>{" "}
        primitivum jen předává dál — vykresluje je až <IngotCode>IngotForm</IngotCode>.
      </>,
      <>
        Placeholder tajného pole („nastaveno“ / „nenastaveno“) bere pole ze slovníku{" "}
        <IngotCode>IngotProvider</IngotCode> — bez providera je anglický.{" "}
        <IngotCode>secretPlaceholder(field)</IngotCode> ho přebíjí pro jedno pole.
      </>,
      <>
        Popisky voleb u <IngotCode>kind: &quot;options&quot;</IngotCode> dodává{" "}
        <IngotCode>renderOptions</IngotCode> celé.
      </>,
    ],
    en: [
      <>
        <IngotCode>field.label</IngotCode> and <IngotCode>field.description</IngotCode>{" "}
        are only passed through — <IngotCode>IngotForm</IngotCode> is what renders them.
      </>,
      <>
        The secret-field placeholder (“set” / “not set”) comes from the{" "}
        <IngotCode>IngotProvider</IngotCode> dictionary — English without a provider.{" "}
        <IngotCode>secretPlaceholder(field)</IngotCode> overrides it for a single field.
      </>,
      <>
        Option labels for <IngotCode>kind: &quot;options&quot;</IngotCode> are supplied
        entirely by <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
  },
};
