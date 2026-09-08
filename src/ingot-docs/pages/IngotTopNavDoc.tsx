import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotTopNavDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotTopNavDemo?raw");

// 2.10 (KAN-859): the brand sits at 600 rather than 700. The doc web
// loaded a whole font face for that one weight, and 40 kB on a phone
// for a difference nobody can point at is not a trade worth making.

export const IngotTopNavDoc: IngotDocMeta = {
  name: "IngotTopNav",
  status: "beta",
  // 2.4: ``current`` highlights a menu section too (the group with the
  // active route). 2.5: a section can carry its own ``testId`` — the
  // conversion does not rename the anchors of existing tests and e2e.
  // 2.6: ``muted`` on a link section. 2.7: keyboard in the open panel —
  // arrows walk the items, Tab does not fall out of the panel and Escape
  // returns focus to the section button. This page had promised the focus
  // return since 2.0, but the code did not do it.
  // 2.8 — row states (current, open, muted, locked, hover) come from the kit's shared menu row.
  // 2.9 (KAN-845) — a click on an OPEN section closes it. Hover has no
  // meaning on a touch screen, where a tap somewhere else used to be the
  // only way out.
  // 2.11 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 2.12 (KAN-960) - the account's circle is `IngotAvatar` rather than a
  // span drawn here; it renders the same and is now one shape kit-wide.
  version: "2.13",
  tag: ".topnav",
  tokens: [
    "--surface",
    "--surface-2",
    "--surface-3",
    "--border",
    "--ink",
    "--ink-2",
    "--r-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Horní lišta aplikace — brand, sekce a účet v jednom řádku. Administrace nemá boční menu; obsah pod lištou jde na plnou šířku.",
    en: "The application's top bar — brand, sections and account in one row. The admin has no side menu; content below the bar runs full width.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Rám administrace. Je to jediná navigace, kterou obrazovka má — sekce nahoře,
        obsah pod nimi přes celou šířku.
      </>,
      <>
        Sekce, která má víc než jednu obrazovku. Tlačítko sekce rozbaluje{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, kde teprve jsou odkazy.
      </>,
      <>
        Odlišení režimu produktu — odznak vedle brandu řekne, že jsi v administraci
        platformy, ne u zákazníka.
      </>,
    ],
    en: [
      <>
        The frame of the admin. It is the only navigation a screen has — sections on
        top, content below them at full width.
      </>,
      <>
        A section with more than one screen. The section button opens an{" "}
        <IngotCode>IngotMegaMenu</IngotCode>, which is where the links are.
      </>,
      <>
        Telling the two products apart — a badge next to the brand says you are in the
        platform admin, not in a customer account.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotTopNavDoc.body"),
};
