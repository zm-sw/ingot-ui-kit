import { Demo } from "@/ingot-docs/demos/IngotSwitchDemo";
import demoSource from "@/ingot-docs/demos/IngotSwitchDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotSwitchDoc: IngotDocPage = {
  name: "IngotSwitch",
  status: "beta",
  version: "1.0",
  tag: ".switch",
  tokens: [
    "--accent",
    "--border-strong",
    "--surface",
    "--ink-2",
    "--ink-3",
    "--ink-4",
    "--accent-bg",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení řádku — odsazení a zarovnání. Podobu přepínače drží primitivum.",
    en: "Takes `className`, but for the row's layout only — margins and alignment. The switch's own shape stays with the primitive.",
  },
  summary: {
    cs: "Nastavení, které platí hned po přepnutí. Ne zaškrtávátko: to čeká na uložení formuláře.",
    en: "A setting that takes effect the moment it is flipped. Not a checkbox: that one waits for the form to be saved.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Volba se ukládá okamžitě — přepínač v nastavení účtu, zapnutí modulu,
        viditelnost sloupce.
      </>,
      <>Stav je binární a čte se jako zapnuto/vypnuto, ne jako vybráno.</>,
      <>Vedle sebe stojí víc takových voleb pod sebou a mají vypadat stejně.</>,
    ],
    en: [
      <>
        The choice is saved immediately — a toggle in account settings, switching a
        module on, showing a column.
      </>,
      <>The state is binary and reads as on/off, not as selected.</>,
      <>Several such choices stand under each other and should look the same.</>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Volba se projeví až po uložení formuláře. To je IngotCheckbox — přepínač by
        sliboval okamžitý účinek, který nenastal.
      </>,
      <>
        Vybírá se jedna možnost z několika. To je IngotRadioGroup nebo IngotSegmented.
      </>,
      <>
        Volba je nevratná nebo drahá. Přepínač na ni nepatří: patří tam tlačítko s
        potvrzením.
      </>,
    ],
    en: [
      <>
        The choice takes effect when the form is saved. That is IngotCheckbox — a switch
        would promise an immediate effect that did not happen.
      </>,
      <>
        One option out of several is being chosen. That is IngotRadioGroup or
        IngotSegmented.
      </>,
      <>
        The change is irreversible or expensive. A switch does not carry that; a button
        with a confirmation does.
      </>,
    ],
  },
  props: [
    {
      name: "checked",
      type: "boolean",
      required: true,
      note: {
        cs: "Stav. Řízené — hodnotu drží volající.",
        en: "The state. Controlled — the caller owns the value.",
      },
    },
    {
      name: "onChange",
      type: "(next: boolean) => void",
      required: true,
      note: {
        cs: "Volá se hned po přepnutí. Uložení je na volajícím a má být okamžité.",
        en: "Called right after the flip. Saving is the caller's job and should be immediate.",
      },
    },
    {
      name: "label",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Přeložený viditelný popisek. Nese jméno prvku, proto je povinný.",
        en: "Translated visible label. It carries the control's name, hence required.",
      },
    },
    {
      name: "hint",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Věta pod popiskem — co se stane, když je zapnuto. Váže se přes aria-describedby.",
        en: "A sentence under the label — what happens when it is on. Bound with aria-describedby.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Nedostupná volba, typicky kvůli tarifu nebo právům.",
        en: "An unavailable choice, typically because of a plan or permissions.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení řádku.",
        en: "The row's layout only.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy; nápověda dostane `${testId}-hint`.",
        en: "An anchor for tests; the hint gets `${testId}-hint`.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        role="switch" a aria-checked, takže odečítač hlásí zapnuto/vypnuto, ne
        zaškrtnuto.
      </>,
      <>
        Popisek obaluje ovládací prvek, takže klik na text přepíná a jméno jde zadarmo.
      </>,
      <>Stav není jen barva: knoflík se posune, což se pozná i v šedotónu.</>,
    ],
    en: [
      <>
        role="switch" and aria-checked, so a screen reader says on or off rather than
        checked.
      </>,
      <>
        The label wraps the control, so clicking the text flips it and the name comes
        for free.
      </>,
      <>
        The state is not only a colour: the knob moves, which reads in greyscale too.
      </>,
    ],
  },
  i18n: {
    cs: [<>label i hint dodává volající přeložené — kit vlastní překlady nemá.</>],
    en: [
      <>
        label and hint arrive translated from the caller — the kit has no translations
        of its own.
      </>,
    ],
  },
};
