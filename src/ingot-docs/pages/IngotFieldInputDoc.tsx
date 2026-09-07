import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotFieldInputDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotFieldInputDemo?raw");

export const IngotFieldInputDoc: IngotDocMeta = {
  name: "IngotFieldInput",
  status: "stable",
  // 1.1 — the frame comes from the kit's shared input chrome (focus ring,
  // `--r-md`, Button-md height) instead of its own smaller box.
  // 1.2 — boolean is the shared checkbox control; options without renderOptions is a disabled IngotSelect, not a text input.
  // 2.0 (KAN-841) — the SECRET_PLACEHOLDER_* exports are gone; the secret
  // placeholders come from IngotProvider (English without one). A caller
  // that imported the constants reads INGOT_LABELS instead.
  // 2.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 2.3 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "2.3",
  tag: ".input",
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
    cs: "Jedno pole podle svého kind. Nezná žádnou doménu — množinu voleb i překlady dodává volající.",
    en: "A single field driven by its kind. It knows no domain — the option set and the translations both come from the caller.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Potřebuješ jedno pole na místě, kde si rozvržení i popisek řídíš sám.</>,
      <>
        Skládáš netriviální formulář (sekce, sloupce vedle sebe) a chceš aspoň jednotné
        chování vstupů.
      </>,
      <>
        Pole má <IngotCode>kind: &quot;options&quot;</IngotCode> a množinu voleb zná jen
        ta obrazovka — dodá se přes <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
    en: [
      <>You need one field somewhere you control the layout and the label yourself.</>,
      <>
        You are composing a non-trivial form (sections, side-by-side columns) and want
        at least consistent input behaviour.
      </>,
      <>
        The field is <IngotCode>kind: &quot;options&quot;</IngotCode> and only that
        screen knows the option set — supply it through{" "}
        <IngotCode>renderOptions</IngotCode>.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotFieldInputDoc.body"),
};
