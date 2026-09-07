import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSearchInputDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSearchInputDemo?raw");

export const IngotSearchInputDoc: IngotDocMeta = {
  name: "IngotSearchInput",
  status: "beta",
  // 1.1 — `inputRef` added; callers touch nothing.
  // 1.3 (KAN-842) — the field is a forwardRef, so `ref` reaches the input;
  // `inputRef` stays as a deprecated alias until the next major.
  // 1.2 — shared input chrome: accent focus ring, Button-md height.
  // 1.4 (KAN-952) — optional `combobox`, for a search that drives its own
  // result list. A field without it renders exactly as before.
  // 1.5 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.6 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.6",
  tag: ".search",
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
    cs: "Hledací pole nad seznamem — první prvek filtr baru. Filtruje, nevyhledává: zužuje seznam každým úhozem, žádné tlačítko Hledat.",
    en: "A search field above a list — the first element of the filter bar. It filters, it does not search: it narrows the list on every keystroke, no Search button.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        První prvek <IngotCode>IngotToolbar</IngotCode> nad seznamem, kde se záznam
        hledá podle názvu, kódu nebo slugu.
      </>,
      <>
        Seznamy, kde je záznamů víc, než se vejde na obrazovku — hledání je rychlejší
        než listování pagerem.
      </>,
    ],
    en: [
      <>
        The first element of <IngotCode>IngotToolbar</IngotCode> above a list where
        records are found by name, code or slug.
      </>,
      <>
        Lists with more records than fit the screen — searching beats paging through
        them.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSearchInputDoc.body"),
};
