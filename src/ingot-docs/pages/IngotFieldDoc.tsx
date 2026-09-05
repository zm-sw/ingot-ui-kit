import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotFieldDemo";
import demoSource from "@/ingot-docs/demos/IngotFieldDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotFieldDoc: IngotDocPage = {
  name: "IngotField",
  status: "stable",
  // 1.1 — the frame comes from the kit's shared input chrome: `--surface`
  // instead of `--bg`, `--border-strong`, `--r-md`, same height as Button md.
  // 1.2 (KAN-848) — `type` (text, number, password, e-mail, url,
  // tel) and `textarea` with `rows`. The value stays a string: an empty
  // numeric box is ambiguous and only the screen knows what it means.
  version: "1.2",
  tag: ".field",
  tokens: [
    "--surface",
    "--surface-2",
    "--border-strong",
    "--ink",
    "--ink-2",
    "--ink-3",
    "--ink-4",
    "--accent",
    "--accent-bg",
    "--danger",
    "--font-mono",
    "--r-md",
    "--shadow-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Popsané textové pole: popisek, nápověda, chyba, jednotka. Pro ruční formuláře, které pole nemají odkud odvodit.",
    en: "A labelled text field: label, hint, error, unit. For hand-written forms whose fields cannot be derived from anything.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Formulář se píše rukou a má pár daných polí — název tokenu, počet kusů, e-mail.
        Přesně tam, kde by jinak vznikl další ruční pár{" "}
        <IngotCode>&lt;label&gt;</IngotCode> + <IngotCode>&lt;input&gt;</IngotCode>.
      </>,
      <>
        K hodnotě patří jednotka nebo měna. Ta jde do <IngotCode>affix</IngotCode>,
        nikdy do <IngotCode>placeholder</IngotCode> — placeholder zmizí, jakmile
        uživatel začne psát, a s ním i to, v čem se ta hodnota měří.
      </>,
      <>
        Pole má validaci, kterou uživatel uvidí. <IngotCode>error</IngotCode> zapne
        error stav i <IngotCode>aria-invalid</IngotCode> jedním textem, takže se nedá
        udělat červené pole bez vysvětlení.
      </>,
      <>
        Hodnota se čte po sloupcích nebo je to kód — <IngotCode>mono</IngotCode> přepne
        na mono a <IngotCode>tabular-nums</IngotCode>.
      </>,
    ],
    en: [
      <>
        The form is written by hand and has a handful of fixed fields — token name,
        quantity, e-mail. Exactly where another hand-rolled{" "}
        <IngotCode>&lt;label&gt;</IngotCode> + <IngotCode>&lt;input&gt;</IngotCode> pair
        would otherwise appear.
      </>,
      <>
        The value comes with a unit or a currency. That goes into{" "}
        <IngotCode>affix</IngotCode>, never into <IngotCode>placeholder</IngotCode> — a
        placeholder disappears the moment the user starts typing, and takes the unit
        with it.
      </>,
      <>
        The field has validation the user will see. <IngotCode>error</IngotCode> turns
        on the error state and <IngotCode>aria-invalid</IngotCode> from a single text,
        so a red field without an explanation cannot happen.
      </>,
      <>
        The value is read down a column, or it is a code — <IngotCode>mono</IngotCode>{" "}
        switches to mono and <IngotCode>tabular-nums</IngotCode>.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Pole vznikají ze schématu (konfigurace integrace, per-uzlové nastavení operace).
        Tam patří <IngotCode>IngotForm</IngotCode> nad{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>: pole, která nikdo neopsal rukou, se
        nemůžou se schématem rozejít. Tahle komponenta je opačná větev — rukou psaný
        formulář, kde žádné schéma není.
      </>,
      <>
        Potřebuješ jen samotný vstup bez popisku, protože si popisek stránka skládá
        sama. To je <IngotCode>IngotFieldInput</IngotCode>.
      </>,
      <>
        Hodnota se jen ukazuje a nejde měnit. Zamčený vstup tvrdí „tohle je pole“ a
        uživatel do něj bude klikat; použij popis a hodnotu (
        <IngotCode>&lt;dl&gt;</IngotCode> / <IngotCode>&lt;dt&gt;</IngotCode> /{" "}
        <IngotCode>&lt;dd&gt;</IngotCode>), ne <IngotCode>disabled</IngotCode>. To je
        pro pole, které se ODEMKNE — dočasně, ne navždy.
      </>,
      <>
        Vstup není text: zaškrtávátko, výběr z množiny, datum. První verze je schválně
        jen textová — primitivum bez konzumenta je nezapojený slib.
      </>,
    ],
    en: [
      <>
        The fields come from a schema (integration config, per-node operation settings).
        That is <IngotCode>IngotForm</IngotCode> over{" "}
        <IngotCode>IngotFieldSpec[]</IngotCode>: fields nobody typed out by hand cannot
        drift from the schema. This component is the opposite branch — a hand-written
        form where there is no schema.
      </>,
      <>
        You only need the input itself without a label, because the page composes the
        label on its own. That is <IngotCode>IngotFieldInput</IngotCode>.
      </>,
      <>
        The value is only displayed and cannot be changed. A locked input claims
        &quot;this is a field&quot; and users will keep clicking it; use a term and its
        value (<IngotCode>&lt;dl&gt;</IngotCode> / <IngotCode>&lt;dt&gt;</IngotCode> /{" "}
        <IngotCode>&lt;dd&gt;</IngotCode>), not <IngotCode>disabled</IngotCode>. That
        one is for a field that will UNLOCK — temporarily, not forever.
      </>,
      <>
        The input is not text: a checkbox, a choice from a set, a date. The first
        version is deliberately text-only — a primitive without a consumer is an unwired
        promise.
      </>,
    ],
  },
  props: [
    {
      name: "type",
      type: '"text" | "number" | "password" | "email" | "url" | "tel" | "textarea"',
      required: false,
      note: {
        cs: "Jakou klávesnici a masku nabídne prohlížeč. textarea je totéž pole na několik řádků.",
        en: "Which keyboard and mask the browser offers. textarea is the same field grown to several lines.",
      },
    },
    {
      name: "rows",
      type: "number",
      required: false,
      note: {
        cs: "Výška textarea v řádcích. Ostatní typy ji ignorují.",
        en: "Height of a textarea in rows. Every other type ignores it.",
      },
    },
    {
      name: "label",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Podstatné jméno bez dvojtečky („Počet kusů“).",
        en: "A noun without a colon (“Quantity”).",
      },
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Řízená hodnota vstupu.",
        en: "The controlled value of the input.",
      },
    },
    {
      name: "onChange",
      type: "(next: string) => void",
      required: true,
      note: {
        cs: "Dostane rovnou text, ne událost.",
        en: "Receives the text directly, not the event.",
      },
    },
    {
      name: "hint",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Celá věta s tečkou pod polem.",
        en: "A full sentence with a full stop, below the field.",
      },
    },
    {
      name: "error",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Text chyby. Jeho přítomnost zapíná error stav i aria-invalid.",
        en: "The error text. Its presence turns on the error state and aria-invalid.",
      },
    },
    {
      name: "affix",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Jednotka nebo měna uvnitř rámečku („ks“, „%“).",
        en: "A unit or currency inside the frame (“ks”, “%”).",
      },
    },
    {
      name: "mono",
      type: "boolean",
      required: false,
      note: {
        cs: "Mono a tabular-nums pro kódy a čísla.",
        en: "Mono and tabular-nums for codes and numbers.",
      },
    },
    {
      name: "optionalLabel",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Přeložené „— nepovinné“ vedle popisku.",
        en: "A translated “— optional” next to the label.",
      },
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      note: {
        cs: "Příklad hodnoty, nikdy popisek ani jednotka.",
        en: "An example value — never a label, never a unit.",
      },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      note: {
        cs: "Nativní required vstupu.",
        en: "The input's native required.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Dočasně zamčené pole — ne způsob, jak ukázat hodnotu.",
        en: "A temporarily locked field — not a way to display a value.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid vstupu, ne obalu — testy sahají na to, co se ovládá.",
        en: "data-testid of the input, not the wrapper — tests reach for what is operated.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>label for</IngotCode> ↔ <IngotCode>input id</IngotCode> drží
        komponenta přes <IngotCode>useId</IngotCode>. Vazba proto nemůže vzniknout
        špatně ani u dvou stejných polí na jedné stránce a volající žádné{" "}
        <IngotCode>id</IngotCode> nevymýšlí.
      </>,
      <>
        Placeholder popisek NENÍ. Zmizí, jakmile uživatel začne psát, a odečítač ho
        nečte jako jméno pole.
      </>,
      <>
        Chyba se hlásí textem a <IngotCode>aria-invalid</IngotCode>, ne jen červenou
        barvou. <IngotCode>hint</IngotCode>, <IngotCode>affix</IngotCode> i{" "}
        <IngotCode>error</IngotCode> jsou navázané přes{" "}
        <IngotCode>aria-describedby</IngotCode> v pořadí, v jakém se čtou.
      </>,
      <>
        Fokus je vidět na celém rámečku (<IngotCode>focus-within</IngotCode>): border{" "}
        <IngotCode>accent</IngotCode> a ring 3px <IngotCode>accent-bg</IngotCode>. Kdyby
        seděl jen na <IngotCode>&lt;input&gt;</IngotCode>, přípona by z něj vypadla.
      </>,
    ],
    en: [
      <>
        <IngotCode>label for</IngotCode> ↔ <IngotCode>input id</IngotCode> is held by
        the component via <IngotCode>useId</IngotCode>. The binding therefore cannot be
        made wrong, not even with two identical fields on one page, and the caller
        invents no <IngotCode>id</IngotCode>.
      </>,
      <>
        The placeholder is NOT a label. It disappears as soon as the user starts typing,
        and screen readers do not read it as the field&apos;s name.
      </>,
      <>
        An error is announced by text and <IngotCode>aria-invalid</IngotCode>, not by
        red alone. <IngotCode>hint</IngotCode>, <IngotCode>affix</IngotCode> and{" "}
        <IngotCode>error</IngotCode> are all wired through{" "}
        <IngotCode>aria-describedby</IngotCode> in reading order.
      </>,
      <>
        Focus is visible on the whole frame (<IngotCode>focus-within</IngotCode>): an{" "}
        <IngotCode>accent</IngotCode> border and a 3px <IngotCode>accent-bg</IngotCode>{" "}
        ring. On the <IngotCode>&lt;input&gt;</IngotCode> alone the affix would fall
        outside it.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode>, <IngotCode>hint</IngotCode>,{" "}
        <IngotCode>error</IngotCode>, <IngotCode>affix</IngotCode> i{" "}
        <IngotCode>optionalLabel</IngotCode> dodává volající už přeložené — Ingot nemá
        vlastní i18n namespace.
      </>,
      <>
        „— nepovinné“ je jediná vlastnost <IngotCode>optionalLabel</IngotCode>, ne
        dvojice <IngotCode>optional</IngotCode> + text. Booleovské{" "}
        <IngotCode>optional</IngotCode> bez textu by byl stav, který nejde vykreslit,
        protože ten text Ingot nemá odkud vzít.
      </>,
      <>
        <IngotCode>affix</IngotCode> je taky text: jednotky se v některých jazycích
        píšou jinak a měna se liší podle tenanta.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode>, <IngotCode>hint</IngotCode>,{" "}
        <IngotCode>error</IngotCode>, <IngotCode>affix</IngotCode> and{" "}
        <IngotCode>optionalLabel</IngotCode> arrive from the caller already translated —
        Ingot has no i18n namespace of its own.
      </>,
      <>
        &quot;— optional&quot; is a single <IngotCode>optionalLabel</IngotCode> prop,
        not an <IngotCode>optional</IngotCode> boolean plus a text. A boolean without
        the text would be a state that cannot be rendered, because Ingot has nowhere to
        take that text from.
      </>,
      <>
        <IngotCode>affix</IngotCode> is text too: units are written differently in some
        languages, and the currency differs per tenant.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Jen text. Zaškrtávátko, výběr, datum ani <IngotCode>&lt;textarea&gt;</IngotCode>{" "}
        první verze neumí a <IngotCode>type</IngotCode> se schválně nedá nastavit —
        přibude to s obrazovkou, která si o to řekne.
      </>,
      <>
        Neřeší stav formuláře (rozpracováno, odeslání, blokátory). To zůstává na
        volajícím, resp. na <IngotCode>useIngotForm</IngotCode>.
      </>,
    ],
    en: [
      <>
        Text only. No checkbox, choice, date or <IngotCode>&lt;textarea&gt;</IngotCode>{" "}
        in the first version, and <IngotCode>type</IngotCode> is deliberately not
        settable — that arrives with the screen that asks for it.
      </>,
      <>
        It does not handle form state (dirty, submit, blockers). That stays with the
        caller, or with <IngotCode>useIngotForm</IngotCode>.
      </>,
    ],
  },
};
