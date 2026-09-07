import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotFieldDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotFieldDemo?raw");

export const IngotFieldDoc: IngotDocMeta = {
  name: "IngotField",
  status: "stable",
  // 1.1 — the frame comes from the kit's shared input chrome: `--surface`
  // instead of `--bg`, `--border-strong`, `--r-md`, same height as Button md.
  // 1.2 (KAN-848) — `type` (text, number, password, e-mail, url,
  // tel) and `textarea` with `rows`. The value stays a string: an empty
  // numeric box is ambiguous and only the screen knows what it means.
  // 1.3 (KAN-942) — the handoff's `.textarea` sizing (min-height, reading
  // line-height) and an optional soft character count under the field.
  // Several lines stay a `type`, not a component of their own: the
  // accessible wiring is the same and two copies of it would drift.
  // 1.4 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.5 (KAN-956) - optional `labelPlacement="side"`: the label sits
  // in a column to the left, which is the shape a settings page wants.
  // 1.6 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.6",
  tag: ".field",
  tokens: [
    "--surface",
    "--surface-2",
    "--border-strong",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--accent-bg",
    "--danger",
    "--font-mono",
    "--r-md",
    "--shadow-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Popsané textové pole: popisek, nápověda, chyba, jednotka. Pro ruční formuláře, které pole nemají odkud odvodit.",
    en: "A labelled text field: label, hint, error, unit. For hand-written forms whose fields cannot be derived from anything.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Formulář se píše rukou a má pár daných polí — název tokenu, počet kusů, e-mail.
        Přesně tam, kde by jinak vznikl další ruční pár{" "}
        <IngotCode>&lt;label&gt;</IngotCode> + <IngotCode>&lt;input&gt;</IngotCode>.
      </>,
      <>
        K hodnotě patří jednotka nebo měna. Ta jde do <IngotCode>affix</IngotCode>,
        nikdy do <IngotCode>placeholder</IngotCode> — placeholder zmizí, jakmile
        uživatel začne psát, a s ním i to, v čem se ta hodnota měří.
      </>,
      <>
        Pole má validaci, kterou uživatel uvidí. <IngotCode>error</IngotCode> zapne
        error stav i <IngotCode>aria-invalid</IngotCode> jedním textem, takže se nedá
        udělat červené pole bez vysvětlení.
      </>,
      <>
        Hodnota se čte po sloupcích nebo je to kód — <IngotCode>mono</IngotCode> přepne
        na mono a <IngotCode>tabular-nums</IngotCode>.
      </>,
    ],
    en: [
      <>
        The form is written by hand and has a handful of fixed fields — token name,
        quantity, e-mail. Exactly where another hand-rolled{" "}
        <IngotCode>&lt;label&gt;</IngotCode> + <IngotCode>&lt;input&gt;</IngotCode> pair
        would otherwise appear.
      </>,
      <>
        The value comes with a unit or a currency. That goes into{" "}
        <IngotCode>affix</IngotCode>, never into <IngotCode>placeholder</IngotCode> — a
        placeholder disappears the moment the user starts typing, and takes the unit
        with it.
      </>,
      <>
        The field has validation the user will see. <IngotCode>error</IngotCode> turns
        on the error state and <IngotCode>aria-invalid</IngotCode> from a single text,
        so a red field without an explanation cannot happen.
      </>,
      <>
        The value is read down a column, or it is a code — <IngotCode>mono</IngotCode>{" "}
        switches to mono and <IngotCode>tabular-nums</IngotCode>.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotFieldDoc.body"),
};
