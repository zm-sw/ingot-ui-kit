import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPopoverDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPopoverDemo?raw");

export const IngotPopoverDoc: IngotDocMeta = {
  name: "IngotPopover",
  status: "beta",
  // 1.1 (KAN-849) — the panel fades in, from the kit's motion tokens; motion-reduce turns the movement off.
  // 1.2 (KAN-966) - the panel's position is no longer cleared on close - it is
  // measured before paint on every open, so a stale one never reaches the screen.
  version: "1.2",
  tag: ".popover",
  tokens: ["--surface", "--border", "--r-lg", "--shadow-lg"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení panelu — šířku a vnitřní odsazení. Rám, stín a vrstvu drží primitivum.",
    en: "Takes `className`, but for the panel's layout only — width and inner padding. The frame, the shadow and the layer stay with the primitive.",
  },
  summary: {
    cs: "Panel ukotvený k prvku, který ho otevřel: pozice, klik mimo, Escape a návrat fokusu na jednom místě.",
    en: "A panel anchored to what opened it: position, click outside, Escape and focus return, all in one place.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Nad prvkem se má otevřít malý panel — filtry seznamu, výběr, kus detailu, který
        by jako dialog byl zbytečně těžký.
      </>,
      <>
        Stavíš vlastní menu nebo výběr a nechceš znovu psát pozicování a zavírání.{" "}
        <IngotCode>IngotMenu</IngotCode> stojí přesně na tomhle.
      </>,
      <>
        Panel se má otevřít i zevnitř dialogu — vrstva <IngotCode>MENU_LAYER</IngotCode>{" "}
        ho drží nad ním, ne pod ním.
      </>,
    ],
    en: [
      <>
        A small panel should open over an element — list filters, a picker, a piece of
        detail that would be too heavy as a dialog.
      </>,
      <>
        You are building your own menu or picker and do not want to write positioning
        and dismissal again. <IngotCode>IngotMenu</IngotCode> stands on exactly this.
      </>,
      <>
        The panel must also open from inside a dialog — the{" "}
        <IngotCode>MENU_LAYER</IngotCode> layer keeps it above, not under.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotPopoverDoc.body"),
};
