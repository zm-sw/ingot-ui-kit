import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotToolbarDemo";
import demoSource from "@/ingot-docs/demos/IngotToolbarDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotToolbarDoc: IngotDocPage = {
  name: "IngotToolbar",
  status: "beta",
  version: "1.0",
  tag: ".toolbar",
  tokens: ["--ink-2", "--ink-3"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Filtr bar nad seznamem. Drží mezery, zalamování a pravý konec; čím se filtruje, dodává volající.",
    en: "A filter bar above a list. It owns spacing, wrapping and the right end; what filters, the caller supplies.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad tabulkou nebo seznamem stojí vyhledávání, selecty či přepínače,
        které zužují, co je vidět. Pořadí bloků list obrazovky je: filtr bar,
        pruh hromadných akcí, tabulka, pager.
      </>,
      <>
        Vpravo od filtrů patří primární akce obrazovky („Přidat“) — na to je
        slot <IngotCode>end</IngotCode>, aby konec neukradl poslední filtr.
      </>,
    ],
    en: [
      <>
        A search box, selects or toggles narrowing what is visible sit above
        a table or list. The block order of a list screen is: filter bar,
        bulk-action bar, table, pager.
      </>,
      <>
        The screen's primary action ("Add") belongs to the right of the
        filters — that is the <IngotCode>end</IngotCode> slot, so the last
        filter cannot steal the right end.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Pruh hromadných akcí nad vybranými řádky — ten kreslí tabulka sama,
        protože visí na jejím výběru.
      </>,
      <>
        Formulář s odesláním. Filtr bar je skupina prvků s okamžitým
        účinkem; co má tlačítko „Uložit“ a validaci, patří do formuláře.
      </>,
    ],
    en: [
      <>
        The bulk-action bar above selected rows — the table draws that one
        itself, because it hangs off the table's selection.
      </>,
      <>
        A form with a submit. A filter bar is a group of controls with
        immediate effect; anything with a "Save" button and validation
        belongs in a form.
      </>,
    ],
  },
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Filtry zleva: vyhledávání, selecty, přepínače — už přeložené.",
        en: "The filters, left to right: search, selects, toggles — already translated.",
      },
    },
    {
      name: "end",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Pravý konec baru — typicky primární akce obrazovky.",
        en: "The right end of the bar — typically the screen's primary action.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída obalu (výjimečně — mezery drží primitivum).",
        en: "Pass-through class on the wrapper (rare — the primitive owns spacing).",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid baru.", en: "data-testid of the bar." },
    },
  ],
  a11y: {
    cs: [
      <>
        Každý prvek uvnitř potřebuje vlastní popisek —{" "}
        <IngotCode>aria-label</IngotCode> nebo <IngotCode>label</IngotCode>.
        Bar je jen rozvržení a jména za volajícího nedoplní.
      </>,
      <>
        Žádné <IngotCode>role=&quot;toolbar&quot;</IngotCode>: ta role slibuje
        šipkovou navigaci, kterou by pak musel někdo doopravdy napsat. Filtr
        bar je obyčejná skupina formulářových prvků s tabováním.
      </>,
      <>
        Bar se zalamuje (<IngotCode>flex-wrap</IngotCode>) — na úzkém okně ani
        při 200% zvětšení se filtry neoříznou, jen přeskládají.
      </>,
    ],
    en: [
      <>
        Every control inside needs its own label —{" "}
        <IngotCode>aria-label</IngotCode> or a <IngotCode>label</IngotCode>.
        The bar is layout only and will not name things for the caller.
      </>,
      <>
        No <IngotCode>role=&quot;toolbar&quot;</IngotCode>: that role promises
        arrow-key navigation someone would then have to actually write. A
        filter bar is an ordinary group of form controls, tabbed through.
      </>,
      <>
        The bar wraps (<IngotCode>flex-wrap</IngotCode>) — on a narrow window
        or at 200% zoom the filters reflow instead of clipping.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Bar sám žádný text nevykresluje — popisky filtrů i akcí dodává
        volající uvnitř <IngotCode>children</IngotCode> a{" "}
        <IngotCode>end</IngotCode>, už přeložené.
      </>,
    ],
    en: [
      <>
        The bar renders no text of its own — the labels of filters and
        actions come from the caller inside <IngotCode>children</IngotCode>{" "}
        and <IngotCode>end</IngotCode>, already translated.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        <strong>Hotové filtry.</strong> Vyhledávací pole ani selecty
        primitivum nedodává — zatím drží jen rozvržení. Sdílené pole
        vyhledávání přibude, až se jeho tvar ustálí.
      </>,
    ],
    en: [
      <>
        <strong>Ready-made filters.</strong> The primitive ships no search box
        or selects — for now it owns layout only. A shared search field
        arrives once its shape settles.
      </>,
    ],
  },
};
