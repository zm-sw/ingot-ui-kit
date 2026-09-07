import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotFormDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotFormDemo?raw");

export const IngotFormDoc: IngotDocMeta = {
  name: "IngotForm",
  status: "stable",
  // 1.1 — a boolean field renders IngotCheckbox instead of a hand-drawn label wrapper.
  // 2.0 (KAN-845) — useIngotForm no longer resets on a new `initial`
  // object; it takes a `resetKey` instead. A caller that relied on the old
  // identity reset passes the record id it already has.
  // 2.2 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "2.2",
  tag: ".form",
  tokens: ["--ink-2", "--ink-3", "--ink-4", "--accent"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Deklarativní formulář: dostane pole a hodnoty, vrací změny přes onChange. Tvar formuláře jsou data, ne JSX.",
    en: "Declarative form: it takes fields and values and reports changes through onChange. The shape of the form is data, not JSX.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Pole přicházejí za běhu — ze schématu modulu nebo z manifestu integrace.{" "}
        <IngotCode>fieldsFromConfigSchema</IngotCode> a{" "}
        <IngotCode>fieldsFromIntegrationManifest</IngotCode> je převedou na{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>.
      </>,
      <>
        Tvar formuláře jsou data: přidat pole znamená přidat řádek do pole, ne napsat
        další <IngotCode>&lt;label&gt;</IngotCode> a vlastní{" "}
        <IngotCode>onChange</IngotCode>.
      </>,
      <>
        Chceš, aby se převod hodnoty na typ (<IngotCode>integer</IngotCode>,{" "}
        <IngotCode>number</IngotCode>, <IngotCode>boolean</IngotCode>,{" "}
        <IngotCode>secret</IngotCode>) choval na všech obrazovkách stejně.
      </>,
    ],
    en: [
      <>
        The fields arrive at runtime — from a module schema or an integration manifest.{" "}
        <IngotCode>fieldsFromConfigSchema</IngotCode> and{" "}
        <IngotCode>fieldsFromIntegrationManifest</IngotCode> turn them into{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>.
      </>,
      <>
        The shape of the form is data: adding a field means adding an entry to an array,
        not writing another <IngotCode>&lt;label&gt;</IngotCode> and its own{" "}
        <IngotCode>onChange</IngotCode>.
      </>,
      <>
        You want value coercion (<IngotCode>integer</IngotCode>,{" "}
        <IngotCode>number</IngotCode>, <IngotCode>boolean</IngotCode>,{" "}
        <IngotCode>secret</IngotCode>) to behave the same on every screen.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotFormDoc.body"),
};
