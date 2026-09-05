import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotSelectDemo";
import demoSource from "@/ingot-docs/demos/IngotSelectDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotSelectDoc: IngotDocPage = {
  name: "IngotSelect",
  status: "beta",
  // 1.1 — shared input chrome: accent focus ring instead of `focus:border-ink`,
  // Button-md height.
  // 1.2 (KAN-842) — forwardRef to the <select>; callers touch nothing.
  version: "1.2",
  tag: ".select",
  tokens: ["--surface", "--surface-2", "--border-strong", "--ink", "--ink-4", "--accent", "--accent-bg", "--r-md", "--shadow-sm"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Výběr jedné hodnoty z krátké množiny — filtr nad seznamem, přepínač varianty v nastavení. Nativní select: klávesnice, odečítač i mobil zadarmo.",
    en: "Picking one value from a short set — a filter above a list, a variant switch in settings. A native select: keyboard, screen reader and mobile behaviour for free.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Filtr nad seznamem s pevnou, krátkou množinou hodnot — stav, tarif,
        region. První volba je „všechny“, protože filtr vždycky v nějakém
        stavu je.
      </>,
      <>
        Pole nastavení, kde se vybírá jedna z několika pojmenovaných
        variant a varianty se nemění za běhu.
      </>,
      <>
        Vedle dalších filtrů v <IngotCode>IngotToolbar</IngotCode> — tam,
        kde viditelný popisek nahrazuje srozumitelná první volba.
      </>,
    ],
    en: [
      <>
        A filter above a list with a fixed, short set of values — status,
        plan, region. The first option is “all”, because a filter is always
        in some state.
      </>,
      <>
        A settings field choosing one of a few named variants that do not
        change at runtime.
      </>,
      <>
        Next to other filters in <IngotCode>IngotToolbar</IngotCode> — where
        an intelligible first option stands in for a visible label.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Množina, ve které se hledá — desítky materiálů, stovky kontaktů.
        Nativní select se v ní nedá prohledávat; takové pole si řekne
        o vlastní primitivum s hledáním, až bude mít žadatele.
      </>,
      <>
        Výběr více hodnot najednou. Na sadu nezávislých přepínačů je{" "}
        <IngotCode>IngotCheckbox</IngotCode>.
      </>,
      <>
        Přepnutí mezi dvěma až třemi pohledy na tutéž obrazovku — to jsou{" "}
        <IngotCode>IngotTabs</IngotCode>, ne formulářový prvek.
      </>,
    ],
    en: [
      <>
        A set you search in — dozens of materials, hundreds of contacts. A
        native select cannot be searched; such a field asks for its own
        primitive with search, once it has a requester.
      </>,
      <>
        Picking several values at once. A row of independent toggles is{" "}
        <IngotCode>IngotCheckbox</IngotCode>.
      </>,
      <>
        Switching between two or three views of the same screen — that is{" "}
        <IngotCode>IngotTabs</IngotCode>, not a form control.
      </>,
    ],
  },
  props: [
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Aktuální hodnota. Řízené zvenčí — filtr žije ve stavu obrazovky.",
        en: "The current value. Controlled from outside — a filter lives in the screen's state.",
      },
    },
    {
      name: "onChange",
      type: "(next: string) => void",
      required: true,
      note: {
        cs: "Nová hodnota při každé změně.",
        en: "The new value on every change.",
      },
    },
    {
      name: "options",
      type: "readonly IngotSelectOption[]",
      required: true,
      note: {
        cs: "Volby v pořadí, ve kterém je má čtenář číst. U filtru je první „všechny“.",
        en: "The options, in reading order. For a filter the first is “all”.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label. Povinný — filtr bar viditelný popisek nemívá a bez jména odečítač čte jen hodnotu.",
        en: "A translated aria-label. Required — a filter bar rarely shows a visible label, and without a name a screen reader hears only the value.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypnutý výběr. Výchozí false.",
        en: "A disabled select. Defaults to false.",
      },
    },
    {
      name: "id",
      type: "string",
      required: false,
      note: {
        cs: "Pro obrazovky s viditelným <label htmlFor> — pak je label týž text.",
        en: "For screens with a visible <label htmlFor> — the label is then the same text.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída — šířku určuje obrazovka, vzhled primitivum.",
        en: "A pass-through class — the screen sets the width, the primitive the look.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy. Do vzhledu nezasahuje.",
        en: "An anchor for tests. It does not affect the appearance.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotSelectOption",
      note: {
        cs: "Jedna volba, předává se v options.",
        en: "A single option, passed in options.",
      },
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          note: {
            cs: "Hodnota volby — jde do onChange.",
            en: "The option's value — what onChange receives.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený popisek volby.",
            en: "The option's translated label.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Je to nativní <IngotCode>select</IngotCode>: šipky, psaní počátečních
        písmen, odečítač i mobilní kolečko fungují bez jediného řádku navíc —
        a proto se nenahrazuje vlastním rozbalovacím seznamem.
      </>,
      <>
        Jméno nese <IngotCode>label</IngotCode> (aria-label), ne první volba.
        „Všechny stavy“ říká, jaká je hodnota, ne čeho je to filtr.
      </>,
    ],
    en: [
      <>
        It is a native <IngotCode>select</IngotCode>: arrows, type-ahead,
        screen readers and the mobile wheel work without a single extra line —
        which is exactly why it is not replaced by a custom dropdown.
      </>,
      <>
        The name is carried by <IngotCode>label</IngotCode> (aria-label), not
        by the first option. “All statuses” says what the value is, not what
        the filter is of.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky voleb i <IngotCode>label</IngotCode> dodává volající už
        přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Šířku pole neurčuje nejdelší volba, ale obrazovka přes{" "}
        <IngotCode>className</IngotCode> — dlouhý překlad se zkrátí
        trojtečkou prohlížeče, ne rozbitím filtr baru.
      </>,
    ],
    en: [
      <>
        Option labels and <IngotCode>label</IngotCode> arrive already
        translated from the caller — the kit has no translation namespace of
        its own.
      </>,
      <>
        The field's width is set by the screen via{" "}
        <IngotCode>className</IngotCode>, not by the longest option — a long
        translation gets the browser's ellipsis, not a broken filter bar.
      </>,
    ],
  },
};
