import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotModalDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotModalDemo?raw");

export const IngotModalDoc: IngotDocMeta = {
  name: "IngotModal",
  status: "stable",
  // 1.1 — header markup shared with IngotDrawer (internal OverlayHeader); no visible change.
  // 1.2 — close button is the kit's shared icon button (28px, rounded, hover surface).
  // 1.3 (KAN-849) — the backdrop fades and the panel scales in, from the kit's motion tokens; motion-reduce turns the movement off, not the dialog.
  // 1.5 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.6 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.7 (KAN-966) - the overlay captures the opener in an effect rather than while
  // rendering; focus returns to the same element.
  version: "1.9",
  tag: ".modal",
  tokens: [
    "--surface",
    "--surface-2",
    "--border",
    "--ink",
    "--ink-3",
    "--accent-bg",
    "--r-sm",
    "--r-lg",
    "--shadow-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Geometrie překryvu je součástí přístupnostní laťky (past fokusu, zámek rolování) — šířku řídí `size`.",
    en: "Does not take `className`. The overlay's geometry is part of the accessibility bar (focus trap, scroll lock) — `size` drives the width.",
  },
  summary: {
    cs: "Skořápka dialogu s a11y laťkou: focus trap, ESC, scroll lock, aria-modal a návrat fokusu na spouštěč.",
    en: "Dialog shell with the accessibility floor built in: focus trap, ESC, scroll lock, aria-modal and focus returned to the trigger.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Obsah má překrýt obrazovku a vyžádat si rozhodnutí, než se dá pokračovat.</>,
      <>
        Delší editace záznamu — tam, kde je co vysvětlovat, dává dialog místo i
        soustředění na jednu věc. Rychlá úprava pár polí vedle seznamu zůstává v{" "}
        <IngotCode>IngotDrawer</IngotCode>.
      </>,
      <>Dialog není jen „potvrď / zruš“ — je v něm formulář, náhled nebo výběr.</>,
      <>
        Vždycky, když bys jinak psal{" "}
        <IngotCode>&lt;div className=&quot;fixed inset-0 …&quot;&gt;</IngotCode> znovu.
        Dialog má být právě jeden způsob, ne tolik způsobů, kolik je obrazovek — a tohle
        primitivum je ten způsob.
      </>,
    ],
    en: [
      <>
        The content has to cover the screen and demand a decision before anything else
        can happen.
      </>,
      <>
        A longer edit of a record — where there is explaining to do, the dialog gives
        both room and focus. A quick edit of a few fields next to a list stays in{" "}
        <IngotCode>IngotDrawer</IngotCode>.
      </>,
      <>
        The dialog is more than "confirm / cancel" — it holds a form, a preview or a
        selection.
      </>,
      <>
        Any time you would otherwise write{" "}
        <IngotCode>&lt;div className=&quot;fixed inset-0 …&quot;&gt;</IngotCode> again.
        A dialog should be exactly one thing, not as many things as there are screens —
        and this primitive is that one thing.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotModalDoc.body"),
};
