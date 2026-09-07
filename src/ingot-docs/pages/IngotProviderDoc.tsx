import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotProviderDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotProviderDemo?raw");

export const IngotProviderDoc: IngotDocMeta = {
  name: "IngotProvider",
  status: "beta",
  // 1.1 (KAN-845) — toastClose, the label of the toast's close button.
  version: "1.1",
  tag: ".provider",
  // Empty on purpose: the provider renders nothing, so no token change
  // reaches it. The doc web prints that as a sentence instead of a list.
  tokens: [],
  classNameNote: {
    cs: "`className` nebere — nic nevykresluje, jen nese slovník popisků.",
    en: "Does not take `className` — it renders nothing, it only carries the label dictionary.",
  },
  summary: {
    cs: 'Slovník několika popisků, které kit říká sám — zpět, žárovka nápovědy, tajné pole. Bez providera anglicky; lang="cs" přepne celou sadu.',
    en: 'The dictionary of the few labels the kit says itself — undo, the hint bulb, the secret field. English without a provider; lang="cs" switches the whole set.',
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Aplikace v češtině: obal celý strom{" "}
        <IngotCode>&lt;IngotProvider lang=&quot;cs&quot;&gt;</IngotCode> a toast,
        nápověda i tajné pole mluví česky bez dalších props.
      </>,
      <>
        Aplikace v jazyce, který kit nezná: <IngotCode>labels</IngotCode> přepíše
        jednotlivé popisky a zbytek doplní zvolený <IngotCode>lang</IngotCode>.
      </>,
      <>
        Vlastní primitivum, které potřebuje popisek říct samo — čte ho z{" "}
        <IngotCode>useIngotLabels()</IngotCode>, ne z konstanty.
      </>,
    ],
    en: [
      <>
        A Czech application: wrap the tree in{" "}
        <IngotCode>&lt;IngotProvider lang=&quot;cs&quot;&gt;</IngotCode> and the toast,
        the hint and the secret field speak Czech with no further props.
      </>,
      <>
        An application in a language the kit does not know:{" "}
        <IngotCode>labels</IngotCode> overrides single labels and the chosen{" "}
        <IngotCode>lang</IngotCode> fills in the rest.
      </>,
      <>
        A primitive of your own that has to say a label itself — read it from{" "}
        <IngotCode>useIngotLabels()</IngotCode>, not from a constant.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotProviderDoc.body"),
};
