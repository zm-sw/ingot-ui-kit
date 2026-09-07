import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotCheckboxDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotCheckboxDemo?raw");

export const IngotCheckboxDoc: IngotDocMeta = {
  name: "IngotCheckbox",
  status: "beta",
  // 1.1 — the box is the kit's single checkbox control, shared with IngotTable and IngotFieldInput.
  // 1.2 (KAN-842) — forwardRef to the <input>; callers touch nothing.
  // 1.3 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.3",
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
  demo,
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
  body: () => import("@/ingot-docs/pages/IngotCheckboxDoc.body"),
};
