import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSelectDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSelectDemo?raw");

export const IngotSelectDoc: IngotDocMeta = {
  name: "IngotSelect",
  status: "beta",
  // 1.1 — shared input chrome: accent focus ring instead of `focus:border-ink`,
  // Button-md height.
  // 1.2 (KAN-842) — forwardRef to the <select>; callers touch nothing.
  // 1.3 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.4 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.4",
  tag: ".select",
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
    cs: "Výběr jedné hodnoty z krátké množiny — filtr nad seznamem, přepínač varianty v nastavení. Nativní select: klávesnice, odečítač i mobil zadarmo.",
    en: "Picking one value from a short set — a filter above a list, a variant switch in settings. A native select: keyboard, screen reader and mobile behaviour for free.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Filtr nad seznamem s pevnou, krátkou množinou hodnot — stav, tarif, region.
        První volba je „všechny“, protože filtr vždycky v nějakém stavu je.
      </>,
      <>
        Pole nastavení, kde se vybírá jedna z několika pojmenovaných variant a varianty
        se nemění za běhu.
      </>,
      <>
        Vedle dalších filtrů v <IngotCode>IngotToolbar</IngotCode> — tam, kde viditelný
        popisek nahrazuje srozumitelná první volba.
      </>,
    ],
    en: [
      <>
        A filter above a list with a fixed, short set of values — status, plan, region.
        The first option is “all”, because a filter is always in some state.
      </>,
      <>
        A settings field choosing one of a few named variants that do not change at
        runtime.
      </>,
      <>
        Next to other filters in <IngotCode>IngotToolbar</IngotCode> — where an
        intelligible first option stands in for a visible label.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSelectDoc.body"),
};
