import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSearchInputDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSearchInputDemo?raw");

export const IngotSearchInputDoc: IngotDocPage = {
  name: "IngotSearchInput",
  status: "beta",
  // 1.1 — `inputRef` added; callers touch nothing.
  // 1.3 (KAN-842) — the field is a forwardRef, so `ref` reaches the input;
  // `inputRef` stays as a deprecated alias until the next major.
  // 1.2 — shared input chrome: accent focus ring, Button-md height.
  // 1.4 (KAN-952) — optional `combobox`, for a search that drives its own
  // result list. A field without it renders exactly as before.
  // 1.5 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  version: "1.5",
  tag: ".search",
  tokens: [
    "--surface",
    "--surface-2",
    "--border-strong",
    "--ink",
    "--ink-4",
    "--accent",
    "--accent-bg",
    "--r-md",
    "--shadow-sm",
  ],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Hledací pole nad seznamem — první prvek filtr baru. Filtruje, nevyhledává: zužuje seznam každým úhozem, žádné tlačítko Hledat.",
    en: "A search field above a list — the first element of the filter bar. It filters, it does not search: it narrows the list on every keystroke, no Search button.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        První prvek <IngotCode>IngotToolbar</IngotCode> nad seznamem, kde se záznam
        hledá podle názvu, kódu nebo slugu.
      </>,
      <>
        Seznamy, kde je záznamů víc, než se vejde na obrazovku — hledání je rychlejší
        než listování pagerem.
      </>,
    ],
    en: [
      <>
        The first element of <IngotCode>IngotToolbar</IngotCode> above a list where
        records are found by name, code or slug.
      </>,
      <>
        Lists with more records than fit the screen — searching beats paging through
        them.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Hledání přes celý produkt z horní lišty. Takové v produktu není — a kdyby
        vzniklo, je to vlastní primitivum s výsledky, ne pole nad jedním seznamem.
      </>,
      <>
        Pole formuláře, do kterého se zapisuje hodnota. Tohle pole nic neukládá — jen
        zužuje, co je vidět.
      </>,
    ],
    en: [
      <>
        Product-wide search from the top bar. The product has none — and if one appears,
        it is its own primitive with results, not a field above a single list.
      </>,
      <>
        A form field that stores a value. This field saves nothing — it only narrows
        what is visible.
      </>,
    ],
  },
  props: [
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Aktuální dotaz. Řízené zvenčí.",
        en: "The current query. Controlled from outside.",
      },
    },
    {
      name: "onChange",
      type: "(next: string) => void",
      required: true,
      note: {
        cs: "Nový dotaz při každém úhozu. Debounce si drží volající u dat — pole neví, jestli za dotazem stojí síťový požadavek.",
        en: "The new query on every keystroke. Debouncing belongs to the caller, next to the data — the field cannot know whether a network request rides on it.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label. Placeholder jméno nenahradí — po vyplnění zmizí.",
        en: "A translated aria-label. A placeholder is no substitute for a name — it disappears once filled.",
      },
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      note: {
        cs: "Přeložená nápověda formátu („Hledat podle názvu nebo kódu…“).",
        en: "A translated format hint (“Search by name or code…”).",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypnuté pole. Výchozí false.",
        en: "A disabled field. Defaults to false.",
      },
    },
    {
      name: "ref",
      type: "React.Ref<HTMLInputElement>",
      required: false,
      note: {
        cs: "Ref na samotné pole — pro klávesovou zkratku, která do hledání skáče. Ne na fokus po mountu; ten patří autoFocus.",
        en: "A ref to the field itself — for the keyboard shortcut that jumps into search. Not for focus on mount; that is what autoFocus is for.",
      },
    },
    {
      name: "combobox",
      type: "{ controls: string; expanded: boolean; activeOption?: string | null }",
      required: false,
      note: {
        cs: 'Pole, které řídí vlastní seznam výsledků: `controls` je id seznamu s `role="listbox"`, `expanded` říká, jestli je vidět, a `activeOption` je id zvýrazněné položky. Bez toho odečítač o výsledcích neví — šipky hýbou zvýrazněním, ne fokusem. Pro filtr nad seznamem se nedává.',
        en: 'A field that drives its own result list: `controls` is the id of the element with `role="listbox"`, `expanded` says whether it is showing, and `activeOption` is the id of the highlighted item. Without it a screen reader knows nothing about the results — the arrows move a highlight, not the focus. Not for a filter above a list.',
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída obalu — šířku určuje obrazovka.",
        en: "A pass-through class on the wrapper — the screen sets the width.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na inputu.",
        en: "An anchor for tests — on the input.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Lupa je dekorace (<IngotCode>aria-hidden</IngotCode>); jméno pole nese{" "}
        <IngotCode>label</IngotCode>. Ikona beze jména by odečítači řekla „obrázek“, ne
        „hledání“.
      </>,
      <>
        <IngotCode>type="search"</IngotCode> dává prohlížečový křížek na vymazání a
        odečítači roli hledacího pole zadarmo.
      </>,
      <>
        Klávesová zkratka, která do hledání skáče, si pole vezme přes{" "}
        <IngotCode>ref</IngotCode> — ne hledáním <IngotCode>&lt;input&gt;</IngotCode>{" "}
        uvnitř obalu. Vnitřek primitiva se smí přejmenovat, vlastnost ne.
      </>,
      <>
        Pole, které řídí vlastní seznam výsledků, dostane{" "}
        <IngotCode>combobox</IngotCode>. Šipky v takovém hledání hýbou zvýrazněním, ne
        fokusem — kurzor musí zůstat v poli, aby další písmeno šlo tam, kam čtenář čeká.
        Odečítač o tom ale neví, dokud se to neřekne nahlas:{" "}
        <IngotCode>aria-activedescendant</IngotCode> jde za zvýrazněním a položky nesou{" "}
        <IngotCode>role="option"</IngotCode> uvnitř{" "}
        <IngotCode>role="listbox"</IngotCode>.
      </>,
    ],
    en: [
      <>
        The magnifier is decoration (<IngotCode>aria-hidden</IngotCode>); the field's
        name is carried by <IngotCode>label</IngotCode>. A nameless icon tells a screen
        reader “image”, not “search”.
      </>,
      <>
        <IngotCode>type="search"</IngotCode> gives the browser's clear cross and the
        search-field role for free.
      </>,
      <>
        A keyboard shortcut that jumps into search takes the field through{" "}
        <IngotCode>ref</IngotCode> — not by looking for the{" "}
        <IngotCode>&lt;input&gt;</IngotCode> inside the wrapper. The inside of a
        primitive may be renamed; a prop may not.
      </>,
      <>
        A field that drives its own result list takes <IngotCode>combobox</IngotCode>.
        The arrows in such a search move a highlight, not the focus — the caret has to
        stay in the field so the next letter goes where the reader expects. A screen
        reader cannot see that unless it is said out loud:{" "}
        <IngotCode>aria-activedescendant</IngotCode> follows the highlight and the items
        carry <IngotCode>role="option"</IngotCode> inside a{" "}
        <IngotCode>role="listbox"</IngotCode>.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode> i <IngotCode>placeholder</IngotCode> dodává
        volající už přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Placeholder vyjmenovává, PODLE ČEHO se hledá — to je věc obrazovky a jejích dat,
        ne primitiva.
      </>,
    ],
    en: [
      <>
        Both <IngotCode>label</IngotCode> and <IngotCode>placeholder</IngotCode> arrive
        already translated from the caller — the kit has no translation namespace of its
        own.
      </>,
      <>
        The placeholder names WHAT the search matches on — that belongs to the screen
        and its data, not to the primitive.
      </>,
    ],
  },
};
