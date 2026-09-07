import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

// KAN-841. The kit has no translation namespace, yet a handful of labels
// are said by a primitive when the caller stays silent. They used to
// default to Czech — a bug for the public web and for third-party apps.
// The provider holds those defaults (English without one) and the
// no-hardcoded-text guard keeps any other Czech out of src/ingot.

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Text stránky, tlačítek, nadpisů — to je obsah, který dodává volající přeložený.
        Provider nese jen popisky, které by jinak řekl kit.
      </>,
      <>
        Jedna komponenta má mluvit jinak než zbytek stránky: použij její vlastní prop (
        <IngotCode>undoLabel</IngotCode>, <IngotCode>bulbLabel</IngotCode>,{" "}
        <IngotCode>secretPlaceholder</IngotCode>) — ten má před providerem vždy
        přednost.
      </>,
    ],
    en: [
      <>
        Page text, buttons, headings — that is content the caller supplies translated.
        The provider carries only the labels the kit would otherwise say itself.
      </>,
      <>
        One component should speak differently from the rest of the page: use its own
        prop (<IngotCode>undoLabel</IngotCode>, <IngotCode>bulbLabel</IngotCode>,{" "}
        <IngotCode>secretPlaceholder</IngotCode>) — it always wins over the provider.
      </>,
    ],
  },
  props: [
    {
      name: "lang",
      type: '"cs" | "en"',
      required: false,
      note: {
        cs: "Vestavěný slovník, ze kterého se vychází. Výchozí en.",
        en: "The built-in dictionary to start from. Defaults to en.",
      },
    },
    {
      name: "labels",
      type: "Partial<IngotLabels>",
      required: false,
      note: {
        cs: "Přepis jednotlivých popisků; co chybí, doplní lang.",
        en: "Overrides for single labels; whatever is missing comes from lang.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Strom, pro který slovník platí — typicky celá aplikace.",
        en: "The tree the dictionary applies to — typically the whole application.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotLabels",
      note: {
        cs: "Tvar slovníku — totéž vrací useIngotLabels() a totéž je v INGOT_LABELS.cs / .en.",
        en: "The shape of the dictionary — the same thing useIngotLabels() returns and INGOT_LABELS.cs / .en hold.",
      },
      props: [
        {
          name: "toastUndo",
          type: "string",
          required: true,
          note: {
            cs: "Popisek zpětné akce na toastu.",
            en: "Label of the undo action on a toast.",
          },
        },
        {
          name: "toastClose",
          type: "string",
          required: true,
          note: {
            cs: "aria-label křížku, kterým se toast zavírá.",
            en: "aria-label of the button that closes a toast.",
          },
        },
        {
          name: "pageHintBulb",
          type: "string",
          required: true,
          note: {
            cs: "aria-label žárovky nápovědy stránky.",
            en: "aria-label of the page hint bulb.",
          },
        },
        {
          name: "pageHintDismiss",
          type: "string",
          required: true,
          note: {
            cs: "aria-label křížku nápovědy stránky.",
            en: "aria-label of the page hint close button.",
          },
        },
        {
          name: "secretSet",
          type: "string",
          required: true,
          note: {
            cs: "Placeholder tajného pole s uloženou hodnotou.",
            en: "Placeholder of a secret field whose value is stored.",
          },
        },
        {
          name: "secretUnset",
          type: "string",
          required: true,
          note: {
            cs: "Placeholder tajného pole bez uložené hodnoty.",
            en: "Placeholder of a secret field without a stored value.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Většina popisků ve slovníku jsou <IngotCode>aria-label</IngotCode> ikonových
        tlačítek — text, který vidí jen odečítač. Právě proto nesmí zůstat v cizím
        jazyce: nikdo si toho na obrazovce nevšimne.
      </>,
      <>Provider nic nevykresluje a nemění strom — žádná role, žádný obal.</>,
    ],
    en: [
      <>
        Most labels in the dictionary are the <IngotCode>aria-label</IngotCode> of icon
        buttons — text only a screen reader sees. That is exactly why they must not stay
        in a foreign language: nobody notices on screen.
      </>,
      <>The provider renders nothing and changes no tree — no role, no wrapper.</>,
    ],
  },
  i18n: {
    cs: [
      <>
        Bez providera je slovník anglický. Česká sada je{" "}
        <IngotCode>INGOT_LABELS.cs</IngotCode>; další jazyk se dodá přes{" "}
        <IngotCode>labels</IngotCode>, protože kit vlastní překlady nemá.
      </>,
      <>
        Slovník je záměrně malý: jen to, co by primitivum jinak řeklo samo. Vše ostatní
        zůstává obsahem volajícího.
      </>,
    ],
    en: [
      <>
        Without a provider the dictionary is English. The Czech set is{" "}
        <IngotCode>INGOT_LABELS.cs</IngotCode>; another language is supplied through{" "}
        <IngotCode>labels</IngotCode>, because the kit has no translations of its own.
      </>,
      <>
        The dictionary is deliberately small: only what a primitive would otherwise say
        itself. Everything else stays the caller's content.
      </>,
    ],
  },
};

export default body;
