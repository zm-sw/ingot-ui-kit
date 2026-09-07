import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotIconDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotIconDemo?raw");

export const IngotIconDoc: IngotDocMeta = {
  name: "IngotIcon",
  status: "stable",
  // 1.2 — mail arrived (``inbox``, ``send``, ``reply``, ``forward``,
  // ``tag``), plus ``archive``, ``star``, ``user``, ``building`` and
  // ``more``. The set is wider; callers touch nothing.
  //
  // 1.3 (KAN-784) — ``star-filled`` arrived, the first and so far only fill
  // in the set. Owner decision: two SHAPES read in greyscale too, two
  // colours do not, and today a starred thread differs from an unstarred
  // one only by colour. The promise "there is and will be no fill in the
  // set" therefore softened to a narrow exception rather than being dropped
  // — the rewritten Limits section holds it. Callers touch nothing.
  version: "1.4",
  tag: "[data-icon]",
  tokens: ["currentColor"],
  classNameNote: {
    cs: "Bere `className` na umístění a barvu — glyf kreslí `currentColor`, velikost je `size`.",
    en: "Takes `className` for placement and colour — the glyph draws in `currentColor`, the size is `size`.",
  },
  summary: {
    cs: "Ikony rozhraní — jedna sada, jedna technika. Kreslí se čárou v mřížce 24×24, barví se textem rodiče a škáluje se jedním číslem.",
    en: "Interface icons — one set, one technique. Line art on a 24×24 grid, inked by the parent's text colour, scaled by a single number.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Do rozhraní patří symbol — v tlačítku, v navigaci, u prázdného stavu, vedle
        popisku ve výčtu.
      </>,
      <>
        Chystáš se nakreslit <IngotCode>&lt;svg&gt;</IngotCode> přímo do komponenty. To
        je ta chvíle, kdy se sáhne sem: pět nesouvisejících sad v jednom repu vzniklo
        přesně takhle, po jedné ikoně.
      </>,
      <>
        Glyf ti chybí. Přidej ho do sady — jedna ikona navíc je levnější než šestý
        ostrůvek.
      </>,
    ],
    en: [
      <>
        The interface needs a symbol — inside a button, in navigation, next to an empty
        state, beside a label in a list.
      </>,
      <>
        You are about to draw an <IngotCode>&lt;svg&gt;</IngotCode> straight into a
        component. That is the moment to come here: five unrelated sets in one repo grew
        exactly like that, one icon at a time.
      </>,
      <>
        The glyph you need is missing. Add it to the set — one more icon is cheaper than
        a sixth island.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotIconDoc.body"),
};
