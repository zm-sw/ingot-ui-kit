import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotToastDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotToastDemo?raw");

export const IngotToastDoc: IngotDocMeta = {
  name: "IngotToast",
  status: "beta",
  // 1.1 — class composition via cx(); no visible change.
  // 1.2 — queue moved to the kit's shared store; no visible change.
  // 1.3 (KAN-841) — the undo label defaults to the IngotProvider
  // dictionary (English without a provider) instead of a Czech constant.
  // 1.4 (KAN-845) — a close button, the countdown pauses under the pointer
  // or focus, and duration: null keeps the toast until it is closed.
  // 1.5 (KAN-849) — the toast rises into place, from the kit's motion tokens; motion-reduce turns the movement off.
  // 1.6 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 2.0 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: a tone was renamed: `default` is now `neutral`.
  // 2.1 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "2.1",
  tag: ".toast",
  tokens: ["--bg", "--border-strong", "--ink", "--danger", "--r-lg", "--shadow-lg"],
  classNameNote: {
    cs: "`className` nebere. Místo i vrstva jsou pevné, aby výsledek akce nikdy nezakryl hlavní akci stránky.",
    en: "Does not take `className`. Position and layer are fixed so an action's result never covers the page's primary action.",
  },
  summary: {
    cs: "Imperativní toast pro výsledek akce: toast({ text, undo }) ohlásí, co se stalo, a nezastaví práci.",
    en: "An imperative toast for the result of an action: toast({ text, undo }) announces what happened without stopping the work.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Akce doběhla a operátor to má vědět, aniž by přestal pracovat — „Objednávka
        uložena.“
      </>,
      <>
        Výsledek uložení se zpětnou akcí: toast s „Zpět“ místo modalu „Hotovo“. Dělba
        překryvů: editace → drawer, potvrzení → dialog, výsledek → toast.
      </>,
      <>
        Chyba operace, kterou nejde opravit v místě děje —{" "}
        <IngotCode>tone=&quot;danger&quot;</IngotCode>.
      </>,
    ],
    en: [
      <>
        An action finished and the operator should know without stopping their work —
        "Order saved."
      </>,
      <>
        The result of a save with an undo: a toast with "Undo" instead of a "Done"
        modal. Overlay roles: editing → drawer, confirmation → dialog, result → toast.
      </>,
      <>
        An operation error that cannot be fixed where it happened —{" "}
        <IngotCode>tone=&quot;danger&quot;</IngotCode>.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotToastDoc.body"),
};
