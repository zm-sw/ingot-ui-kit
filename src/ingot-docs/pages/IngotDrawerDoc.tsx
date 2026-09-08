import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotDrawerDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotDrawerDemo?raw");

export const IngotDrawerDoc: IngotDocMeta = {
  name: "IngotDrawer",
  status: "beta",
  // 1.1 — header markup shared with IngotModal (internal OverlayHeader); no visible change.
  // 1.2 — close button is the kit's shared icon button (28px, rounded, hover surface).
  // 1.3 (KAN-849) — the panel slides in from its own edge, from the kit's motion tokens; motion-reduce turns the movement off.
  // 1.5 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.6 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.7 (KAN-966) - the overlay captures the opener in an effect rather than while
  // rendering; focus returns to the same element.
  version: "1.8",
  tag: ".drawer",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--accent-bg",
    "--r-sm",
    "--shadow-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Šířku řídí `width` s tvrdým stropem ze specifikace, hranu `side`.",
    en: "Does not take `className`. `width` drives the width with the spec's hard cap, `side` the edge.",
  },
  summary: {
    cs: "Boční panel pro editaci se stejnou a11y laťkou jako dialog: focus trap, ESC, scroll lock a návrat fokusu na spouštěč.",
    en: "A side panel for editing with the same accessibility floor as the dialog: focus trap, ESC, scroll lock and focus returned to the trigger.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Editace, u které operátor potřebuje vidět seznam za ní — panel překryje jen část
        obrazovky.
      </>,
      <>
        Rychlá úprava několika polí, u které se dál pracuje se seznamem. Delší editace s
        vysvětlováním patří do <IngotCode>IngotModal</IngotCode> — tam je místo i
        soustředění.
      </>,
      <>
        Úprava záznamu z řádku tabulky: drawer se otevře vedle, kontext řádku zůstává na
        očích.
      </>,
    ],
    en: [
      <>
        Editing where the operator needs to keep seeing the list behind it — the panel
        covers only part of the screen.
      </>,
      <>
        A quick edit of a few fields while the list stays in play. A longer edit that
        needs explaining belongs in <IngotCode>IngotModal</IngotCode> — that is where
        the room and the focus are.
      </>,
      <>
        Editing a record from a table row: the drawer opens beside it and the row's
        context stays in sight.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotDrawerDoc.body"),
};
