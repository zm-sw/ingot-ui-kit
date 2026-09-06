import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. No amounts in code: pricing is platform data (plans,
// entitlements KAN-499). The component cannot render anything it does not
// receive through ``plans``.
const demo = () =>
  import("@/ingot-docs/demos/IngotMarketingPricingDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotMarketingPricingDemo?raw");

export const IngotMarketingPricingDoc: IngotDocPage = {
  name: "IngotMarketingPricing",
  status: "beta",
  version: "1.0",
  tag: ".pricecard",
  tokens: ["--border", "--surface", "--ink", "--ink-2", "--ink-3", "--ok"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Karty plánů — cena, výčet vlastností a akce na patě. Zvýrazněná karta má obrys a odznak, ne akcentový rámeček.",
    en: "Plan cards — a price, a feature list and an action at the foot. The featured card gets an outline and a badge, not an accent frame.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Veřejná stránka nabízí plány a čtenář se má rozhodnout, který z nich chce.</>,
      <>
        Ceny i názvy plánů přicházejí z dat. <IngotCode>price</IngotCode> je už
        naformátovaný řetězec — formátování měny patří tam, kde se ví, jakou měnu a
        locale tenant má.
      </>,
    ],
    en: [
      <>A public page offers plans and the reader is to decide which one they want.</>,
      <>
        Prices and plan names come from data. <IngotCode>price</IngotCode> is an already
        formatted string — currency formatting belongs where the tenant's currency and
        locale are known.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Uživatel si vybírá z variant uvnitř aplikace. Na to je{" "}
        <IngotCode>IngotOptionCard</IngotCode>: ta je vybíratelná a nese stav volby,
        tahle karta jen nabízí a odkazuje pryč.
      </>,
      <>
        Plány se mají porovnat vlastnost po vlastnosti. Na to je{" "}
        <IngotCode>IngotMarketingComparison</IngotCode> — tři karty vedle sebe se
        párovat nedají.
      </>,
    ],
    en: [
      <>
        The user picks between options inside the app. That is{" "}
        <IngotCode>IngotOptionCard</IngotCode>: it is selectable and holds the choice;
        this card only offers and links away.
      </>,
      <>
        The plans are to be compared feature by feature. That is{" "}
        <IngotCode>IngotMarketingComparison</IngotCode> — three cards side by side
        cannot be paired up.
      </>,
    ],
  },
  props: [
    {
      name: "plans",
      type: "readonly IngotMarketingPlan[]",
      required: true,
      note: {
        cs: "Plány z dat. Trojsloupcová mřížka je výchozí tvar.",
        en: "The plans, from data. Three columns is the default shape.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na mřížce.",
        en: "An anchor for tests — on the grid.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingPlan",
      note: {
        cs: "Jeden plán. Předává se polem plans.",
        en: "One plan. Passed through the plans array.",
      },
      props: [
        {
          name: "id",
          type: "string",
          required: true,
          note: {
            cs: "Stabilní klíč plánu z dat — ne index, plány se přeskládávají.",
            en: "A stable plan key from the data — not an index, plans get reordered.",
          },
        },
        {
          name: "name",
          type: "string",
          required: true,
          note: {
            cs: "Název plánu. Sází se jako h3.",
            en: "The plan name. Set as an h3.",
          },
        },
        {
          name: "price",
          type: "string",
          required: true,
          note: {
            cs: "Naformátovaná cena z dat plánů — nikdy konstanta v JSX.",
            en: "A formatted price from the plan data — never a constant in JSX.",
          },
        },
        {
          name: "period",
          type: "string",
          required: false,
          note: {
            cs: "Perioda za cenou („měsíčně“). Obsah, dodaný přeložený.",
            en: "The period after the price (“per month”). Content, supplied translated.",
          },
        },
        {
          name: "description",
          type: "string",
          required: false,
          note: {
            cs: "Jedna věta, pro koho plán je.",
            en: "One sentence on who the plan is for.",
          },
        },
        {
          name: "features",
          type: "readonly string[]",
          required: true,
          note: {
            cs: "Co plán obsahuje. Odrážky s fajfkou.",
            en: "What the plan includes. Ticked bullets.",
          },
        },
        {
          name: "featured",
          type: "boolean",
          required: false,
          note: {
            cs: "Zvýrazněná karta. Nejvýš jedna — dvě zvýraznění nezvýrazňují nic.",
            en: "The featured card. At most one — two highlights highlight nothing.",
          },
        },
        {
          name: "badge",
          type: "string",
          required: false,
          note: {
            cs: "Text odznaku zvýrazněné karty („Nejčastější“).",
            en: "The featured card's badge text (“Most popular”).",
          },
        },
        {
          name: "action",
          type: "ReactNode",
          required: true,
          note: {
            cs: "CTA karty, typicky odkaz na registraci. Povinná: plán, ze kterého se nedá pokračovat, je slepá ulička.",
            en: "The card's CTA, typically a sign-up link. Required: a plan you cannot continue from is a dead end.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Zvýraznění nenese jen barva: karta má obrys, stín a odznak se slovem, takže
        „nejčastější“ se dá přečíst, ne jen uvidět.
      </>,
      <>
        Akce sedí na patě všech karet ve stejné výšce, takže se dá procházet tabulátorem
        shora dolů bez skákání po stránce.
      </>,
    ],
    en: [
      <>
        Colour is not the only carrier of the highlight: the card has an outline, a
        shadow and a badge with a word in it, so “most popular” can be read, not merely
        seen.
      </>,
      <>
        The action sits at the foot of every card at the same height, so tabbing runs
        top to bottom without jumping around the page.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Název, popis, perioda i odznak jsou obsah a dodává je volající přeložené.</>,
      <>
        <IngotCode>price</IngotCode> se v kitu neformátuje. Měnu i oddělovače zná jen
        volající, a formátování v komponentě by bylo druhé místo, kde se rozhoduje o
        penězích.
      </>,
    ],
    en: [
      <>
        The name, description, period and badge are all content and arrive translated
        from the caller.
      </>,
      <>
        <IngotCode>price</IngotCode> is not formatted in the kit. Only the caller knows
        the currency and separators, and formatting in the component would be a second
        place where money is decided.
      </>,
    ],
  },
};
