import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotOptionCardDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotOptionCardDemo?raw");

export const IngotOptionCardDoc: IngotDocMeta = {
  name: "IngotOptionCard",
  status: "beta",
  // 1.1 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.2 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.2",
  tag: ".optioncard",
  tokens: [
    "--surface",
    "--border-strong",
    "--ink",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--r-md",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Výběr jedné varianty, kde volba potřebuje vysvětlení. Klikatelná je celá karta, vybraná varianta je poznat obrysem v akcentu.",
    en: "Picking one option where the choice needs an explanation. The whole card is clickable, and the selected option is marked by an accent outline.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Volba v nastavení, která není „ano/ne“, ale rozhodnutí s důsledkem — ceník podle
        hmotnosti proti ceníku podle času stroje. Obojí je legitimní, liší se tím, co z
        toho plyne.
      </>,
      <>
        Varianta, ke které patří vysvětlující věta. Ta věta není nápověda navíc, je to
        půlka volby — a do rozbalovacího seznamu se nevejde.
      </>,
      <>
        Dvě až čtyři varianty vedle sebe. Karty jsou stavěné na to, aby se daly porovnat
        pohledem, ne aby se v nich listovalo.
      </>,
      <>
        Rozhodnutí, které se dělá jednou a pak drží. Vysvětlení u varianty je to, co si
        o půl roku později přečte ten, kdo nastavení dědí.
      </>,
    ],
    en: [
      <>
        A setting that is not “yes/no” but a decision with consequences — pricing by
        weight versus pricing by machine time. Both are legitimate; they differ in what
        follows from them.
      </>,
      <>
        An option that comes with an explanatory sentence. That sentence is not extra
        help, it is half of the choice — and it does not fit in a dropdown.
      </>,
      <>
        Two to four options side by side. The cards are built to be compared at a
        glance, not paged through.
      </>,
      <>
        A decision made once and then kept. The explanation on the option is what the
        person inheriting the setup reads half a year later.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotOptionCardDoc.body"),
};
