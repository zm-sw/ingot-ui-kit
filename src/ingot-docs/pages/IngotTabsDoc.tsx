import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

// Reference wiring of the value to the URL. The kit deliberately has no
// router, so this is the caller's business — the snippet is here so every
// consumer does not invent their own.
const URL_SNIPPET = `const [params, setParams] = useSearchParams();
const view = params.get("view") ?? "overview";

<IngotTabs
  items={ITEMS}
  value={view}
  onChange={(key) => setParams({ view: key }, { replace: true })}
>`;

const demo = () =>
  import("@/ingot-docs/demos/IngotTabsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotTabsDemo?raw");

export const IngotTabsDoc: IngotDocMeta = {
  name: "IngotTabs",
  status: "beta",
  // 1.1 (KAN-945) — the count is drawn by IngotCountPill instead of by a
  // span of this component's own, so a tab's count and a section heading's
  // count are one element with one definition.
  // 1.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.2",
  tag: ".tabs",
  tokens: ["--border", "--ink", "--ink-3", "--surface-2", "--font-mono"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Přepínání pohledů na tentýž záznam: řízené value/onChange, role tablist a šipky mezi taby.",
    en: "Switching views of the same record: controlled value/onChange, the tablist role and arrow keys between tabs.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Víc pohledů na TENTÝŽ záznam — detail objednávky s Přehledem, Položkami a
        Historií.
      </>,
      <>
        Aktivní pohled má přežít obnovení stránky: <IngotCode>value</IngotCode> je
        řízené zvenčí, takže ho volající drží v URL. Vzor:
        <IngotCode block lang="tsx">
          {URL_SNIPPET}
        </IngotCode>
      </>,
      <>
        Nejvýš 6 pohledů s popisky na 1–2 slova. Víc pohledů nebo delší popisky
        znamenají, že to nejsou taby, ale navigace.
      </>,
    ],
    en: [
      <>
        Several views of the SAME record — an order detail with Overview, Items and
        History.
      </>,
      <>
        The active view should survive a page reload: <IngotCode>value</IngotCode> is
        controlled from outside, so the caller keeps it in the URL. The pattern:
        <IngotCode block lang="tsx">
          {URL_SNIPPET}
        </IngotCode>
      </>,
      <>
        At most 6 views with 1–2 word labels. More views or longer labels mean it is
        navigation, not tabs.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotTabsDoc.body"),
};
