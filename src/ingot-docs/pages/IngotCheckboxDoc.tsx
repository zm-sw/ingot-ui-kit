import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotCheckboxDemo";
import demoSource from "@/ingot-docs/demos/IngotCheckboxDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotCheckboxDoc: IngotDocPage = {
  name: "IngotCheckbox",
  status: "beta",
  // 1.1 — the box is the kit's single checkbox control, shared with IngotTable and IngotFieldInput.
  // 1.2 (KAN-842) — forwardRef to the <input>; callers touch nothing.
  version: "1.2",
  tag: ".check",
  tokens: ["--accent", "--ink-2", "--ink-4"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Zaškrtávátko s popiskem — filtr, souhlas, přepínač chování. Popisek je součást primitiva: klik na text zaškrtává a jméno pro odečítač jede zadarmo.",
    en: "A checkbox with a label — a filter, a consent, a behaviour toggle. The label is part of the primitive: clicking the text toggles, and the accessible name comes for free.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Filtr typu ano/ne nad seznamem — „jen vyžadující zásah“, „včetně zkušebních“.
        Vedle selectů v <IngotCode>IngotToolbar</IngotCode>.
      </>,
      <>
        Nezávislé volby, kterých smí platit víc najednou. Řada zaškrtávátek je množina,
        select je právě jedna.
      </>,
      <>
        Souhlas nebo potvrzení ve formuláři — stav se použije, až se formulář odešle.
      </>,
    ],
    en: [
      <>
        A yes/no filter above a list — “needs attention only”, “including sandboxes”.
        Next to selects in <IngotCode>IngotToolbar</IngotCode>.
      </>,
      <>
        Independent choices where several may hold at once. A row of checkboxes is a
        set; a select is exactly one.
      </>,
      <>
        A consent or confirmation in a form — the state takes effect when the form is
        submitted.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Přepínač s okamžitým účinkem („zapnout modul“). To je switch — slibuje, že se
        věc stala hned, a bude to vlastní primitivum, až si o něj obrazovka řekne.
      </>,
      <>
        Výběr právě jedné z variant. To je <IngotCode>IngotSelect</IngotCode> nebo{" "}
        <IngotCode>IngotOptionCard</IngotCode>, ne skupina zaškrtávátek, která se
        navzájem vypínají.
      </>,
      <>
        Hromadný výběr řádků tabulky — ten kreslí <IngotCode>IngotTable</IngotCode> sama
        a drží k němu bulk bar.
      </>,
    ],
    en: [
      <>
        A toggle with immediate effect (“enable module”). That is a switch — it promises
        the thing already happened, and it will be its own primitive once a screen asks
        for it.
      </>,
      <>
        Picking exactly one variant. That is <IngotCode>IngotSelect</IngotCode> or{" "}
        <IngotCode>IngotOptionCard</IngotCode>, not a group of checkboxes unchecking
        each other.
      </>,
      <>
        Bulk row selection in a table — <IngotCode>IngotTable</IngotCode> draws that
        itself and owns the bulk bar.
      </>,
    ],
  },
  props: [
    {
      name: "checked",
      type: "boolean",
      required: true,
      note: {
        cs: "Aktuální stav. Řízené zvenčí.",
        en: "The current state. Controlled from outside.",
      },
    },
    {
      name: "onChange",
      type: "(next: boolean) => void",
      required: true,
      note: {
        cs: "Nový stav při každé změně.",
        en: "The new state on every change.",
      },
    },
    {
      name: "label",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Přeložený viditelný popisek. Nese jméno prvku a klik na něj zaškrtává — proto povinný.",
        en: "The translated visible label. It carries the element's name and clicking it toggles — hence required.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypnutá volba — třeba uzamčená plánem. Výchozí false.",
        en: "A disabled choice — locked by the plan, say. Defaults to false.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída obalu.",
        en: "A pass-through class on the wrapper.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na inputu, ne na obalu.",
        en: "An anchor for tests — on the input, not the wrapper.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Popisek je <IngotCode>label</IngotCode> obalující input: jméno pro odečítač a
        klikací plocha přes celý text, žádné <IngotCode>htmlFor</IngotCode> na hlídání.
      </>,
      <>
        Zaškrtávátko bez viditelného popisku neexistuje schválně — čtvereček 16 × 16 px
        beze jména je past pro myš i odečítač.
      </>,
    ],
    en: [
      <>
        The label is a <IngotCode>label</IngotCode> wrapping the input: an accessible
        name and a click target spanning the whole text, no{" "}
        <IngotCode>htmlFor</IngotCode> to keep in sync.
      </>,
      <>
        A checkbox without a visible label does not exist on purpose — a nameless 16 ×
        16 px square is a trap for mouse and screen reader alike.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisek dodává volající už přeložený — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Popisek se zalamuje pod sebe, dlouhý překlad tedy volbu zvýší, ne rozšíří.
        Přesto ho drž na několika slovech — je to volba, ne věta.
      </>,
    ],
    en: [
      <>
        The label arrives already translated from the caller — the kit has no
        translation namespace of its own.
      </>,
      <>
        The label wraps, so a long translation makes the choice taller, not wider. Keep
        it to a few words anyway — it is a choice, not a sentence.
      </>,
    ],
  },
};
