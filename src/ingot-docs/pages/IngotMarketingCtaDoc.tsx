import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingCtaDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingCtaDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. The actions are links, not buttons: a marketing CTA navigates,
// it triggers nothing. The look is not copied from Button, it is taken from
// it — ``as="a"`` was added to Button precisely for this block, and with it
// the ``inverse`` variant for the secondary action on an inverted surface.
export const IngotMarketingCtaDoc: IngotDocPage = {
  name: "IngotMarketingCta",
  status: "beta",
  version: "1.0",
  tag: ".cta",
  tokens: ["--ink", "--bg", "--accent", "--accent-ink"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Závěrečná výzva — tmavý blok se dvěma akcemi. Hlavní akce je akcentová a je jediným barevným prvkem bloku.",
    en: "The closing call to action — a dark block with two actions. The primary one is accented and the block's only colour.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>Stránka končí a čtenáři se má nabídnout jeden zjevný další krok.</>,
      <>
        Vedle hlavní akce dává smysl měkčí varianta (ukázka, kontakt) pro toho, kdo se
        ještě nechce registrovat.
      </>,
    ],
    en: [
      <>The page ends and the reader is to be offered one obvious next step.</>,
      <>
        Beside the primary action a softer one (a demo, a contact) makes sense for
        someone not ready to sign up.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Akce něco spouští v aplikaci. Pak je to tlačítko — <IngotCode>Button</IngotCode>
        ; tenhle blok naviguje odkazy.
      </>,
      <>
        Na stránce už jsou dva tmavé bloky. Handoff jich připouští nejvýš dva (tohle CTA
        a patičku) a třetí z tmavé plochy udělá vzor, ne důraz.
      </>,
    ],
    en: [
      <>
        The action starts something in the app. Then it is a button —{" "}
        <IngotCode>Button</IngotCode>; this block navigates with links.
      </>,
      <>
        The page already has two dark blocks. The handoff allows at most two (this CTA
        and the footer) and a third turns a dark field into a pattern rather than
        emphasis.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "string",
      required: true,
      note: { cs: "Výzva. Sází se jako h2.", en: "The call. Set as an h2." },
    },
    {
      name: "text",
      type: "string",
      required: false,
      note: {
        cs: "Věta pod výzvou, když samotný nadpis nestačí.",
        en: "A sentence under the call when the heading alone is not enough.",
      },
    },
    {
      name: "primary",
      type: "IngotMarketingCtaAction",
      required: true,
      note: {
        cs: "Hlavní akce — akcentové vyplněné tlačítko. Povinná: výzva bez akce není výzva.",
        en: "The primary action — a filled accent button. Required: a call with no action is not a call.",
      },
    },
    {
      name: "secondary",
      type: "IngotMarketingCtaAction",
      required: false,
      note: {
        cs: "Vedlejší akce — obrysový odkaz na tmavé ploše.",
        en: "The secondary action — an outlined link on the dark field.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na bloku.",
        en: "An anchor for tests — on the block.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingCtaAction",
      note: {
        cs: "Jedna akce. Předává se vlastnostmi primary a secondary.",
        en: "One action. Passed through the primary and secondary props.",
      },
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Text odkazu — sloveso, ne „sem“. Dodaný přeložený.",
            en: "The link text — a verb, not “here”. Supplied translated.",
          },
        },
        {
          name: "href",
          type: "string",
          required: true,
          note: { cs: "Kam odkaz vede.", en: "Where the link goes." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Akce jsou odkazy, ne tlačítka. Odečítač je hlásí jako odkazy, dají se otevřít v
        novém panelu a fungují bez JavaScriptu — tlačítko by o všech třech věcech lhalo.
      </>,
      <>
        Hlavní akce je akcentová schválně. Na tmavé ploše je světlé neutrální tlačítko k
        nerozeznání od vedlejšího a závěrečná výzva pak nemá kam poslat oko.
      </>,
      <>
        Obě akce jsou <IngotCode>Button</IngotCode> s{" "}
        <IngotCode>as=&quot;a&quot;</IngotCode>, ne ručně psané odkazy. Rozhodnutí o
        kontrastu akcentu v tmavém motivu tak zůstává na jednom místě — opsané třídy by
        ho zdvojily a druhá kopie by zestárla potichu.
      </>,
    ],
    en: [
      <>
        The actions are links, not buttons. A screen reader announces them as links,
        they open in a new tab and they work without JavaScript — a button would lie
        about all three.
      </>,
      <>
        The primary action is accented on purpose. On a dark field a light neutral
        button is indistinguishable from the secondary one and the closing call then has
        nowhere to send the eye.
      </>,
      <>
        Both actions are <IngotCode>Button</IngotCode> with{" "}
        <IngotCode>as=&quot;a&quot;</IngotCode>, not hand-written links. The dark-mode
        accent contrast decision therefore stays in one place — copied classes would
        duplicate it, and the second copy would go stale quietly.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Nadpis, text i popisky akcí jsou obsah a dodává je volající přeložené.</>,
      <>
        Akce se zalamují do druhého řádku, takže delší překlad popisku blok nerozšíří
        ani neuřízne.
      </>,
    ],
    en: [
      <>
        The heading, the text and both action labels are content and arrive translated
        from the caller.
      </>,
      <>
        The actions wrap to a second line, so a longer label translation neither widens
        nor clips the block.
      </>,
    ],
  },
};
