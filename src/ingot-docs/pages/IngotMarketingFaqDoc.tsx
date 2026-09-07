import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingFaqDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingFaqDemo?raw");

export const IngotMarketingFaqDoc: IngotDocMeta = {
  name: "IngotMarketingFaq",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.1",
  tag: ".faq-item",
  tokens: ["--border", "--surface", "--surface-2", "--ink", "--ink-2", "--ink-3"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Časté dotazy — otázka je ovládací prvek hlásící svůj stav, odpověď pojmenovaná oblast. Odpověď je povinná.",
    en: "A FAQ — the question is a control announcing its state, the answer a named region. The answer is required.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Veřejná stránka odpovídá na námitky před registrací a odpovědi se vejdou na pár
        vět.
      </>,
      <>
        Otázek je tolik, že vypsané pod sebou by zabraly víc místa, než kolik jim v
        sekci patří.
      </>,
    ],
    en: [
      <>
        A public page answers objections before sign-up and the answers fit in a few
        sentences.
      </>,
      <>
        There are enough questions that spelling them all out would take more room than
        the section can give.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotMarketingFaqDoc.body"),
};
