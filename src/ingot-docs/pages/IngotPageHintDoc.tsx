import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPageHintDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPageHintDemo?raw");

export const IngotPageHintDoc: IngotDocMeta = {
  name: "IngotPageHint",
  status: "beta",
  // 1.1 — bulb and dismiss are the kit's shared icon button.
  // 1.2 (KAN-841) — bulb and dismiss labels default to the IngotProvider
  // dictionary (English without a provider) instead of Czech constants.
  // 1.3 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.4 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.5",
  tag: ".pagehint",
  tokens: [
    "--ink",
    "--ink-2",
    "--ink-3",
    "--surface-2",
    "--accent",
    "--accent-ink",
    "--accent-bg",
    "--accent-border",
    "--r-sm",
    "--r-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Nápověda stránky se žárovkou: klik jednorázově zvýrazní prvky, kterých se nápověda týká.",
    en: "A page hint with a bulb: a click highlights the elements the hint talks about, once.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obrazovka, kde si nový uživatel neví rady — pruh v 2–3 větách v druhé osobě
        řekne, co tady udělá, a žárovka mu ukáže čím. <IngotCode>title</IngotCode> je
        název obrazovky nebo úkolu, ne „Nápověda“.
      </>,
      <>
        Cílové prvky nesou <IngotCode>data-hint-target</IngotCode> a{" "}
        <IngotCode>targets</IngotCode> na ně míří selektory. Klik na žárovku jim na ~2,4
        s přidá třídu <IngotCode>is-hinted</IngotCode> — rámeček v barvě akcentu, který
        plynule zmizí. Je to jednorázová akce, ne přepínač.
      </>,
      <>
        Viditelnost řídí volající: <IngotCode>visible</IngotCode> je napojené na
        přepínač „Nápověda na stránkách“ v menu účtu a <IngotCode>onDismiss</IngotCode>{" "}
        ukládá skrytí pro daného uživatele a stránku na účet. Komponenta se sama
        nerozhoduje.
      </>,
    ],
    en: [
      <>
        A screen where a new user is lost — the strip says in 2–3 sentences, in the
        second person, what to do here, and the bulb shows with what.{" "}
        <IngotCode>title</IngotCode> is the name of the screen or task, not “Help”.
      </>,
      <>
        Target elements carry <IngotCode>data-hint-target</IngotCode> and{" "}
        <IngotCode>targets</IngotCode> points at them with selectors. A bulb click gives
        them the <IngotCode>is-hinted</IngotCode> class for ~2.4 s — an accent-colored
        outline that fades away. It is a one-shot action, not a toggle.
      </>,
      <>
        Visibility is the caller's: <IngotCode>visible</IngotCode> is wired to the
        “Hints on pages” switch in the account menu and <IngotCode>onDismiss</IngotCode>{" "}
        stores the per-user, per-page dismissal on the account. The component does not
        decide on its own.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotPageHintDoc.body"),
};
