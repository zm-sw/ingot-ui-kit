import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotTabsDemo";
import demoSource from "@/ingot-docs/demos/IngotTabsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// Vzorové napojení hodnoty na URL. Kit je schválně bez routeru, takže
// tohle je věc volajícího — snippet je tu proto, aby si ho každý
// konzument nevymýšlel po svém.
const URL_SNIPPET = `const [params, setParams] = useSearchParams();
const view = params.get("view") ?? "overview";

<IngotTabs
  items={ITEMS}
  value={view}
  onChange={(key) => setParams({ view: key }, { replace: true })}
>`;

export const IngotTabsDoc: IngotDocPage = {
  name: "IngotTabs",
  status: "beta",
  version: "1.0",
  tag: ".tabs",
  tokens: ["--border", "--ink", "--ink-3", "--font-mono"],
  summary: {
    cs: "Přepínání pohledů na tentýž záznam: řízené value/onChange, role tablist a šipky mezi taby.",
    en: "Switching views of the same record: controlled value/onChange, the tablist role and arrow keys between tabs.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Víc pohledů na TENTÝŽ záznam — detail objednávky s Přehledem,
        Položkami a Historií.
      </>,
      <>
        Aktivní pohled má přežít obnovení stránky: <IngotCode>value</IngotCode> je
        řízené zvenčí, takže ho volající drží v URL. Vzor:
        <IngotCode block>{URL_SNIPPET}</IngotCode>
      </>,
      <>
        Nejvýš 6 pohledů s popisky na 1–2 slova. Víc pohledů nebo delší
        popisky znamenají, že to nejsou taby, ale navigace.
      </>,
    ],
    en: [
      <>
        Several views of the SAME record — an order detail with Overview,
        Items and History.
      </>,
      <>
        The active view should survive a page reload: <IngotCode>value</IngotCode>{" "}
        is controlled from outside, so the caller keeps it in the URL. The
        pattern:
        <IngotCode block>{URL_SNIPPET}</IngotCode>
      </>,
      <>
        At most 6 views with 1–2 word labels. More views or longer labels
        mean it is navigation, not tabs.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Kroky procesu, které mají pořadí a dokončení — to je steps pattern,
        ne taby.
      </>,
      <>
        Filtrování téhož seznamu („Vše / Aktivní / Archiv“) — to jsou chipy;
        tab slibuje jiný pohled, ne jiný výřez.
      </>,
      <>
        Navigace mezi různými záznamy nebo stránkami — na to je menu, ne
        taby.
      </>,
    ],
    en: [
      <>
        Process steps with an order and completion — that is a steps
        pattern, not tabs.
      </>,
      <>
        Filtering the same list ("All / Active / Archived") — those are
        chips; a tab promises a different view, not a different slice.
      </>,
      <>
        Navigation between different records or pages — that is a menu, not
        tabs.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "IngotTabItem[]",
      required: true,
      note: {
        cs: "Pohledy: klíč, přeložený popisek a nepovinný počet záznamů.",
        en: "The views: a key, a translated label and an optional record count.",
      },
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Klíč aktivního pohledu. Řízené zvenčí — typicky z URL volajícího.",
        en: "Key of the active view. Controlled from outside — typically the caller's URL.",
      },
    },
    {
      name: "onChange",
      type: "(key: string) => void",
      required: true,
      note: {
        cs: "Přepnutí pohledu. Nemění scroll pozici stránky.",
        en: "Switches the view. Does not change the page's scroll position.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Obsah aktivního pohledu — vykreslí se jako tabpanel svázaný s aktivním tabem.",
        en: "Content of the active view — rendered as a tabpanel tied to the active tab.",
      },
    },
    {
      name: "label",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený aria-label seznamu tabů.",
        en: "Translated aria-label of the tab list.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid tablistu; tab dostane `${testId}-tab-${key}`.",
        en: "data-testid of the tablist; a tab gets `${testId}-tab-${key}`.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotTabItem",
      note: {
        cs: (
          <>
            Prvek pole <IngotCode>items</IngotCode>.
          </>
        ),
        en: (
          <>
            An element of the <IngotCode>items</IngotCode> array.
          </>
        ),
      },
      props: [
        {
          name: "key",
          type: "string",
          required: true,
          note: {
            cs: "Klíč pohledu — hodnota pro value/onChange a URL volajícího.",
            en: "Key of the view — the value for value/onChange and the caller's URL.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Popisek na 1–2 slova, dodaný přeložený.",
            en: "A 1–2 word label, supplied translated.",
          },
        },
        {
          name: "count",
          type: "number",
          required: false,
          note: {
            cs: "Počet záznamů v pohledu — vykreslí se mono vedle popisku.",
            en: "Record count of the view — rendered in mono next to the label.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Role drží komponenta sama: <IngotCode>role=&quot;tablist&quot;</IngotCode>,{" "}
        <IngotCode>role=&quot;tab&quot;</IngotCode> s{" "}
        <IngotCode>aria-selected</IngotCode> a <IngotCode>role=&quot;tabpanel&quot;</IngotCode>{" "}
        svázaný s aktivním tabem.
      </>,
      <>
        Roving tabindex: Tab zastaví jen na aktivním tabu, šipky (a
        Home/End) přepínají mezi pohledy — fokus se přesouvá bez posunu
        stránky.
      </>,
      <>
        Aktivní tab je poznat i bez barvy: podtržení a tučnost.
      </>,
    ],
    en: [
      <>
        The component holds the roles itself:{" "}
        <IngotCode>role=&quot;tablist&quot;</IngotCode>, <IngotCode>role=&quot;tab&quot;</IngotCode>{" "}
        with <IngotCode>aria-selected</IngotCode> and{" "}
        <IngotCode>role=&quot;tabpanel&quot;</IngotCode> tied to the active tab.
      </>,
      <>
        A roving tabindex: Tab stops only on the active tab, arrow keys (and
        Home/End) switch views — focus moves without scrolling the page.
      </>,
      <>
        The active tab is recognizable without color: underline and bold.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky v <IngotCode>items</IngotCode> a <IngotCode>label</IngotCode> dodává
        volající už přeložené — Ingot překlady nemá.
      </>,
    ],
    en: [
      <>
        The labels in <IngotCode>items</IngotCode> and <IngotCode>label</IngotCode>{" "}
        arrive from the caller already translated — the Ingot has no
        translations of its own.
      </>,
    ],
  },
};
