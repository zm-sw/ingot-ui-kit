import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotRadioGroupDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotRadioGroupDemo?raw");

export const IngotRadioGroupDoc: IngotDocPage = {
  name: "IngotRadioGroup",
  status: "beta",
  version: "1.0",
  tag: ".radiogroup",
  tokens: ["--accent", "--ink", "--ink-2", "--ink-3", "--ink-4", "--danger"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku a odsazení skupiny. Podobu voleb drží primitivum.",
    en: "Takes `className`, but for layout only — the group's width and margins. The options' shape stays with the primitive.",
  },
  summary: {
    cs: "Jedna volba z několika, všechny vidět naráz. Nativní skupina, takže šipky i odesílání formuláře jedou samy.",
    en: "One choice out of several, all visible at once. A native group, so the arrows and form submission work by themselves.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Voleb jsou tři až šest a mají se přečíst a porovnat — režim naceňování, způsob
        dopravy.
      </>,
      <>Ke každé volbě patří věta vysvětlení, ale ne tolik, aby si zasloužila kartu.</>,
      <>Volba je součástí formuláře a ukládá se s ním.</>,
    ],
    en: [
      <>
        There are three to six options and they should be read and compared — a pricing
        mode, a delivery method.
      </>,
      <>
        Each option needs a sentence of explanation, but not enough to deserve a card.
      </>,
      <>The choice is part of a form and is saved with it.</>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Voleb je hodně nebo se mění za běhu — to je IngotSelect; rozbalený seznam
        dvaceti přepínačů je stěna.
      </>,
      <>Volby jsou dvě tři krátká slova a mají stát v liště — to je IngotSegmented.</>,
      <>Každá volba potřebuje odstavec, obrázek nebo cenu — to je IngotOptionCard.</>,
    ],
    en: [
      <>
        There are many options or they change at runtime — that is IngotSelect; twenty
        radios laid out is a wall.
      </>,
      <>
        The options are two or three short words meant to sit in a bar — that is
        IngotSegmented.
      </>,
      <>
        Each option needs a paragraph, an image or a price — that is IngotOptionCard.
      </>,
    ],
  },
  props: [
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Vybraná hodnota. Řízené.",
        en: "The selected value. Controlled.",
      },
    },
    {
      name: "onChange",
      type: "(next: string) => void",
      required: true,
      note: {
        cs: "Nová hodnota. Skupina si nic nepamatuje.",
        en: "The new value. The group remembers nothing.",
      },
    },
    {
      name: "options",
      type: "readonly IngotRadioOption[]",
      required: true,
      note: {
        cs: "Volby v pořadí, v jakém se čtou.",
        en: "The options in the order they are read.",
      },
    },
    {
      name: "label",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Jméno celé volby (legenda). Povinné: bez něj odečítač neřekne, čeho se volby týkají.",
        en: "The name of the whole choice (the legend). Required: without it a screen reader cannot say what the options are of.",
      },
    },
    {
      name: "hint",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Věta pod jménem skupiny.",
        en: "A sentence under the group's name.",
      },
    },
    {
      name: "error",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Chybový text; jeho přítomnost označí skupinu za neplatnou.",
        en: "Error text; its presence marks the group invalid.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypne celou skupinu.",
        en: "Disables the whole group.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení skupiny.",
        en: "The group's layout only.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy.",
        en: "An anchor for tests.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotRadioOption",
      note: {
        cs: "Jedna volba — předává se v poli options.",
        en: "One option — passed in the options array.",
      },
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          note: {
            cs: "Hodnota, kterou dostane onChange.",
            en: "The value onChange receives.",
          },
        },
        {
          name: "label",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Přeložený popisek volby.",
            en: "Translated label of the option.",
          },
        },
        {
          name: "hint",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Věta pod popiskem — proč zrovna tuhle volbu.",
            en: "A sentence under the label — why this option.",
          },
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          note: {
            cs: "Volba, která zatím není k dispozici. Zůstává vidět.",
            en: "An option not available yet. It stays visible.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: {
            cs: "Kotva pro testy na konkrétní volbu.",
            en: "An anchor for tests on one option.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Skupina je fieldset s legendou, takže její jméno patří ke skupině i ve stromu
        přístupnosti, ne jen opticky nad ní.
      </>,
      <>
        Nativní radia: šipky se pohybují a rovnou vybírají, skupina je jedna zastávka
        Tabu.
      </>,
      <>
        Nápověda volby se váže přes aria-describedby, takže se čte s ní, ne někde vedle.
      </>,
    ],
    en: [
      <>
        The group is a fieldset with a legend, so its name belongs to the group in the
        accessibility tree, not merely above it on screen.
      </>,
      <>
        Native radios: arrows move and select as they go, and the group is one tab stop.
      </>,
      <>
        An option's hint is bound with aria-describedby, so it is read with the option
        rather than somewhere beside it.
      </>,
    ],
  },
  i18n: {
    cs: [<>Jméno skupiny, popisky voleb i nápovědy dodává volající přeložené.</>],
    en: [
      <>
        The group's name, the option labels and the hints all arrive translated from the
        caller.
      </>,
    ],
  },
};
