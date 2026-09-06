import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

// The ``.top .seg`` pattern from the handoff (theme and language switches in the bar).
const demo = () =>
  import("@/ingot-docs/demos/IngotSegmentedDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSegmentedDemo?raw");

export const IngotSegmentedDoc: IngotDocPage = {
  name: "IngotSegmented",
  status: "beta",
  version: "1.0",
  tag: ".seg",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Přepínač lišty — dvě až tři krátké volby vedle sebe, vybraná vystoupí na plochu. Volba se projeví hned.",
    en: "A top-bar switch — two or three short choices side by side, the selected one lifted onto the surface. The choice applies at once.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Voleb je málo, jsou krátké a vejdou se vedle sebe — motiv, jazyk, hustota.</>,
      <>
        Volba se projeví okamžitě a nepotvrzuje se. Přepínač, po kterém se ještě někam
        ukládá, je formulář, ne lišta.
      </>,
    ],
    en: [
      <>
        There are few choices, they are short and they fit side by side — theme,
        language, density.
      </>,
      <>
        The choice applies immediately and is not confirmed. A switch that still has to
        be saved somewhere is a form, not a bar.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Přepínají se pohledy na obsah stránky. To jsou záložky —{" "}
        <IngotCode>IngotTabs</IngotCode>; ty patří k obsahu pod nimi, tenhle přepínač k
        liště nad ním.
      </>,
      <>
        Voleb je víc než tři nebo jsou dlouhé. Pak je to{" "}
        <IngotCode>IngotSelect</IngotCode> — přepínač se jinak roztáhne přes půl lišty.
      </>,
      <>
        Volí se barva. Na to je <IngotCode>IngotAccentSwatches</IngotCode> — název
        rodiny neřekne, jak bude obrazovka vypadat.
      </>,
    ],
    en: [
      <>
        Views of the page content are being switched. Those are tabs —{" "}
        <IngotCode>IngotTabs</IngotCode>; they belong to the content below them, this
        switch to the bar above it.
      </>,
      <>
        There are more than three choices, or they are long. Then it is{" "}
        <IngotCode>IngotSelect</IngotCode> — otherwise the switch spreads across half
        the bar.
      </>,
      <>
        A colour is being chosen. That is <IngotCode>IngotAccentSwatches</IngotCode> — a
        family name does not say how the screen will look.
      </>,
    ],
  },
  props: [
    {
      name: "options",
      type: "readonly IngotSegmentedOption[]",
      required: true,
      note: {
        cs: "Volby v pořadí, ve kterém se kreslí. Dvě až tři; víc patří do výběru.",
        en: "The choices in render order. Two or three; more belongs in a select.",
      },
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: { cs: "Vybraná volba.", en: "The selected choice." },
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      note: {
        cs: "Volba se předává ven — komponenta si ji nepamatuje.",
        en: "The choice is handed out — the component does not remember it.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Pojmenuje skupinu pro odečítač („Motiv“). Povinný ze stejného důvodu jako u puntíků.",
        en: "Names the group for a screen reader (“Theme”). Required for the same reason as on the swatches.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na skupině; každá volba si od ní odvodí vlastní.",
        en: "An anchor for tests — on the group; each option derives its own from it.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotSegmentedOption",
      note: {
        cs: "Jedna volba. Předává se polem options.",
        en: "One choice. Passed through the options array.",
      },
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          note: {
            cs: "Hodnota, která se vrátí v onChange. Nepřekládá se — je to klíč.",
            en: "The value returned by onChange. Not translated — it is a key.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Popisek volby, dodaný přeložený.",
            en: "The choice's label, supplied translated.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Volby jsou přepínače v pojmenované skupině, ne tlačítka: odečítač hlásí
        „vybráno“ a šipky mezi nimi chodí bez naší pomoci.
      </>,
      <>
        Vybraná volba se nepozná jen barvou textu — vystoupí na plochu se stínem, takže
        rozdíl drží i bez vnímání barvy.
      </>,
    ],
    en: [
      <>
        The choices are radios in a named group, not buttons: a screen reader announces
        “selected” and arrow keys move between them without our help.
      </>,
      <>
        The selected choice is not marked by text colour alone — it lifts onto the
        surface with a shadow, so the difference holds without colour perception.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> volby i <IngotCode>label</IngotCode> skupiny dodává
        volající přeložené.
      </>,
      <>
        <IngotCode>value</IngotCode> se nepřekládá — je to klíč, který se vrací v{" "}
        <IngotCode>onChange</IngotCode>. Přeložená hodnota by volbu rozbila při přepnutí
        jazyka.
      </>,
    ],
    en: [
      <>
        Both the option's <IngotCode>label</IngotCode> and the group's{" "}
        <IngotCode>label</IngotCode> arrive translated from the caller.
      </>,
      <>
        <IngotCode>value</IngotCode> is not translated — it is the key returned in{" "}
        <IngotCode>onChange</IngotCode>. A translated value would break the choice on a
        language switch.
      </>,
    ],
  },
};
