import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMetricsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMetricsDemo?raw");

export const IngotMetricsDoc: IngotDocMeta = {
  name: "IngotMetrics",
  status: "beta",
  // 1.1: a strip cell can carry an optional trend curve — owner decision
  // of 2026-09-02, item 07. 1.2: testId on the cell. 1.3: a window with no
  // movement is drawn dashed — a solid line would claim a stable value.
  // 1.4 — caption set by IngotEyebrow, the kit's shared mono label.
  // 1.5 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.5",
  tag: ".metricstrip",
  tokens: [
    "--surface",
    "--border",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--warn",
    "--danger",
    "--accent",
    "--font-mono",
    "--r-md",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Čísla, podle kterých se obrazovka čte na první pohled. Dvě hustoty jedné komponenty: pruh pod hlavičkou a kompaktní shluk do hlavičky.",
    en: "The numbers by which a screen is read at a glance. Two densities of one component: a strip below the header and a compact cluster inside it.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Pruh pod hlavičkou seznamu — varianta <IngotCode>strip</IngotCode>. Čtyři až
        šest čísel, která popisují celou obrazovku, ne jeden vybraný řádek.
      </>,
      <>
        Kompaktní shluk vedle akcí v hlavičce — varianta <IngotCode>inline</IngotCode>.
        Dvě až tři čísla, na která se nevyplatí obětovat celý pruh.
      </>,
      <>
        Číslo, které má vedle sebe potřebovat větu. Ve variantě{" "}
        <IngotCode>strip</IngotCode> ji nese <IngotCode>note</IngotCode> — „po termínu:
        2“ a hned pod tím které dvě to jsou.
      </>,
    ],
    en: [
      <>
        A strip below a list header — the <IngotCode>strip</IngotCode> variant. Four to
        six numbers that describe the whole screen, not one selected row.
      </>,
      <>
        A compact cluster next to the actions in a header — the{" "}
        <IngotCode>inline</IngotCode> variant. Two or three numbers not worth a whole
        strip.
      </>,
      <>
        A number that needs a sentence beside it. In the <IngotCode>strip</IngotCode>{" "}
        variant <IngotCode>note</IngotCode> carries it — “overdue: 2”, and right below
        it which two.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMetricsDoc.body"),
};
