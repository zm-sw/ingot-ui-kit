import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotOptionCardDemo";
import demoSource from "@/ingot-docs/demos/IngotOptionCardDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotOptionCardDoc: IngotDocPage = {
  name: "IngotOptionCard",
  status: "beta",
  version: "1.0",
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
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Volba v nastavení, která není „ano/ne“, ale rozhodnutí s důsledkem —
        ceník podle hmotnosti proti ceníku podle času stroje. Obojí je
        legitimní, liší se tím, co z toho plyne.
      </>,
      <>
        Varianta, ke které patří vysvětlující věta. Ta věta není nápověda
        navíc, je to půlka volby — a do rozbalovacího seznamu se nevejde.
      </>,
      <>
        Dvě až čtyři varianty vedle sebe. Karty jsou stavěné na to, aby se
        daly porovnat pohledem, ne aby se v nich listovalo.
      </>,
      <>
        Rozhodnutí, které se dělá jednou a pak drží. Vysvětlení u varianty
        je to, co si o půl roku později přečte ten, kdo nastavení dědí.
      </>,
    ],
    en: [
      <>
        A setting that is not “yes/no” but a decision with consequences —
        pricing by weight versus pricing by machine time. Both are
        legitimate; they differ in what follows from them.
      </>,
      <>
        An option that comes with an explanatory sentence. That sentence is
        not extra help, it is half of the choice — and it does not fit in a
        dropdown.
      </>,
      <>
        Two to four options side by side. The cards are built to be compared
        at a glance, not paged through.
      </>,
      <>
        A decision made once and then kept. The explanation on the option is
        what the person inheriting the setup reads half a year later.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Zapnout/vypnout jednu vlastnost. To je přepínač, ne dvě karty
        „Zapnuto“ a „Vypnuto“ — kartami se z jednoho stavu stanou dva.
      </>,
      <>
        Dlouhý výčet rovnocenných hodnot bez vysvětlení — země, měna,
        materiál. Bez popisné věty karta nepřidá nic, co by nezvládl
        rozbalovací seznam, a zabere několikanásobek místa.
      </>,
      <>
        Výběr více možností najednou. Uvnitř je přepínač skupiny, takže
        volby se vylučují; na vícenásobný výběr patří zaškrtávací pole.
      </>,
      <>
        Volba, která spouští akci. Karta jen mění hodnotu — tlačítko, po
        kterém se něco stane, vypadá jinak a patří jinam.
      </>,
    ],
    en: [
      <>
        Turning a single feature on or off. That is a switch, not two cards
        reading “On” and “Off” — cards turn one state into two.
      </>,
      <>
        A long list of equivalent values with nothing to explain — country,
        currency, material. Without a descriptive sentence the card adds
        nothing a dropdown could not do, and takes several times the space.
      </>,
      <>
        Selecting more than one option. Inside is a grouped radio input, so
        the options exclude each other; multi-select calls for checkboxes.
      </>,
      <>
        A choice that triggers an action. The card only changes a value — a
        button that makes something happen looks different and belongs
        elsewhere.
      </>,
    ],
  },
  props: [
    {
      name: "name",
      type: "string",
      required: true,
      note: {
        cs: "Jméno skupiny — všechny varianty jedné volby ho sdílejí, stejně jako skupina přepínačů.",
        en: "The group name — all options of one choice share it, just like a radio group.",
      },
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Hodnota téhle varianty. Vrací se zpět skrz onChange.",
        en: "The value of this option. It comes back through onChange.",
      },
    },
    {
      name: "checked",
      type: "boolean",
      required: true,
      note: {
        cs: "Je vybraná? Řízené zvenčí — kartu vybírá stav volajícího.",
        en: "Is it selected? Controlled from outside — the caller's state picks the card.",
      },
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      required: true,
      note: {
        cs: "Volá se s hodnotou vybrané varianty, ne s událostí.",
        en: "Called with the selected option's value, not with an event.",
      },
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Jméno varianty. Krátké — vysvětlení patří do popisu.",
        en: "The option's name. Keep it short — the explanation belongs in the description.",
      },
    },
    {
      name: "description",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Jedna věta: co ta volba znamená. Ne co dělá tlačítko.",
        en: "One sentence: what the choice means. Not what the button does.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Nedostupná varianta. Zesvětlí kartu a zamkne přepínač uvnitř.",
        en: "An unavailable option. Dims the card and locks the input inside.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Značka pro testy na kořeni karty.",
        en: "A test hook on the card root.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Klikatelná je <strong>celá karta</strong>, ne jen kolečko. Karta
        s textem, kde reaguje jen puntík o průměru 16 px, je past, obzvlášť
        na dotyku — proto je popiskem <IngotCode>label</IngotCode> kolem
        celého obsahu.
      </>,
      <>
        Uvnitř je skutečný přepínač, takže šipky přepínají mezi variantami
        a fokus se chová jako u nativní skupiny. To platí jen tehdy, když
        varianty jedné volby sdílejí stejné <IngotCode>name</IngotCode>.
      </>,
      <>
        Vybraná varianta je poznat <strong>obrysem</strong> v akcentu, ne
        výplní. Vyplněná karta by soupeřila s obsahem, který popisuje;
        obrys drží kontrast i v tmavém motivu.
      </>,
      <>
        <IngotCode>disabled</IngotCode> zamkne přepínač, ne jen vzhled
        karty. Nedostupná varianta tak vypadne z pořadí tabulátoru místo
        toho, aby ho brala bez efektu.
      </>,
    ],
    en: [
      <>
        The <strong>whole card</strong> is clickable, not just the circle. A
        card full of text where only a 16 px dot responds is a trap,
        especially on touch — hence a <IngotCode>label</IngotCode> wrapped
        around the entire content.
      </>,
      <>
        Inside is a real radio input, so arrow keys move between options and
        focus behaves like a native group. That only holds when the options
        of one choice share the same <IngotCode>name</IngotCode>.
      </>,
      <>
        The selected option is marked by an accent <strong>outline</strong>,
        not a fill. A filled card would compete with the content it
        describes; the outline keeps contrast in the dark theme too.
      </>,
      <>
        <IngotCode>disabled</IngotCode> locks the input, not just the card's
        looks. An unavailable option drops out of the tab order instead of
        taking a stop with no effect.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Nadpis i popis dodává volající přeložené — kit vlastní jmenný
        prostor překladů nemá.
      </>,
      <>
        <IngotCode>value</IngotCode> a <IngotCode>name</IngotCode> jsou
        klíče, ne text. Přeložená hodnota by rozbila uložené nastavení.
      </>,
      <>
        Popis je jedna věta i v nejdelším jazyce. Karty stojí vedle sebe
        a rostou spolu — odstavec v jedné z nich roztáhne celý řádek.
      </>,
    ],
    en: [
      <>
        The title and the description are passed in already translated — the
        kit has no translation namespace of its own.
      </>,
      <>
        <IngotCode>value</IngotCode> and <IngotCode>name</IngotCode> are
        keys, not text. A translated value would break stored settings.
      </>,
      <>
        The description stays one sentence even in the longest language. The
        cards sit side by side and grow together — a paragraph in one
        stretches the whole row.
      </>,
    ],
  },
};
