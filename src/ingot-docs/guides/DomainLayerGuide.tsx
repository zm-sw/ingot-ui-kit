import { IngotCode, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * "The domain layer" page — why the package has a second entry and who is
 * supposed to import it (KAN-853).
 *
 * The split is easy to undo by accident: the next person who needs the
 * operation icons will reach for the main barrel, find them re-exported,
 * and never learn there was a line. The page states the question that
 * draws the line, so it can be applied to the next module instead of
 * remembered as a list.
 *
 * The doc web is a PUBLIC page: no issue keys, no repository paths, no
 * guard names in rendered text.
 */

interface SplitRow {
  what: Localized<string>;
  where: string;
  why: Localized<string>;
}

const ROWS: readonly SplitRow[] = [
  {
    what: { cs: "Popis pole formuláře", en: "A form field description" },
    where: "@forgmatic/ingot",
    why: {
      cs: "Dává smysl v jakémkoli produktu: klíč, druh, popisek, rozsah.",
      en: "Makes sense in any product: a key, a kind, a label, a range.",
    },
  },
  {
    what: {
      cs: "Převod schématu operace na pole",
      en: "Turning an operation schema into fields",
    },
    where: "@forgmatic/ingot/forgmatic",
    why: {
      cs: "Čte jména, která si vymyslelo tohle API. Jiná platforma má vlastní.",
      en: "It reads names this platform's API chose. Another platform has its own.",
    },
  },
  {
    what: { cs: "Ikony rozhraní", en: "Interface icons" },
    where: "@forgmatic/ingot",
    why: {
      cs: "Šipka, koš, lupa. Rozhraní bez nich nepostavíte.",
      en: "An arrow, a bin, a magnifier. No interface is built without them.",
    },
  },
  {
    what: { cs: "Ikony výrobních operací", en: "Manufacturing operation icons" },
    where: "@forgmatic/ingot/forgmatic",
    why: {
      cs: "Třiačtyřicet kreseb a klíče, které ukládá backend. Kdo je nekreslí, nemá je stahovat.",
      en: "Forty-three drawings and keys the backend stores. Whoever does not draw them should not download them.",
    },
  },
  {
    what: { cs: "Jak hluboko v dialozích jsem", en: "How deep in dialogs I am" },
    where: "@forgmatic/ingot",
    why: {
      cs: "Ví to jenom kit — počítá otevřené dialogy sám.",
      en: "Only the kit knows: it is the thing counting open dialogs.",
    },
  },
  {
    what: {
      cs: "Do jaké hloubky se smí rychle zakládat",
      en: "How deep a quick-create may still be offered",
    },
    where: "@forgmatic/ingot/forgmatic",
    why: {
      cs: "Rozhodnutí o produktu. Jiná aplikace může povolit tři úrovně nebo žádnou.",
      en: "A product decision. Another application may allow three levels, or none.",
    },
  },
];

function columns(lang: DocLang): readonly IngotColumn<SplitRow>[] {
  const cs = lang === "cs";
  return [
    {
      key: "what",
      header: cs ? "Co" : "What",
      cell: (row) => row.what[lang],
    },
    {
      key: "where",
      header: cs ? "Odkud" : "From where",
      cell: (row) => <IngotCode>{row.where}</IngotCode>,
    },
    {
      key: "why",
      header: cs ? "Proč tam" : "Why there",
      cell: (row) => row.why[lang],
    },
  ];
}

function Question({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Balíček má dva hlavní vstupy a čára mezi nimi není věcí vkusu. Je to jedna otázka, kterou lze položit nad každým modulem: dávalo by tohle smysl v produktu, který není Forgmatic?"
          : "The package has two main entries, and the line between them is not a matter of taste. It is one question you can ask of any module: would this still make sense in a product that is not Forgmatic?"}
      </p>
      <p>
        {cs
          ? "Popis pole formuláře by dával. Klíč ikony, který ukládá naše databáze, ne. Odpověď rozhoduje o vstupu, a proto se dá použít i na modul, který ještě nikdo nenapsal — na rozdíl od seznamu, který si musí každý pamatovat."
          : "A form field description would. An icon key our database stores would not. The answer decides the entry, which is why it also works on a module nobody has written yet — unlike a list, which has to be remembered."}
      </p>
      <IngotTable
        columns={columns(lang)}
        rows={ROWS}
        rowKey={(row) => row.what[lang]}
      />
    </div>
  );
}

function Who({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          cs
            ? [
                <>
                  <strong>Administrace Forgmaticu</strong> bere oba vstupy. Kreslí ikony
                  operací a čte schémata, která posílá naše API.
                </>,
                <>
                  <strong>Veřejný web</strong> bere hlavní vstup a bloky veřejných
                  stránek. Doménovou vrstvu nepotřebuje ani na jedné stránce.
                </>,
                <>
                  <strong>Aplikace třetí strany</strong> bere hlavní vstup. Doménovou
                  vrstvu si smí vzít taky — je to veřejná část balíčku — ale skoro jistě
                  chce vlastní.
                </>,
              ]
            : [
                <>
                  <strong>The Forgmatic admin</strong> takes both entries. It draws
                  operation icons and reads schemas our API sends.
                </>,
                <>
                  <strong>The public site</strong> takes the main entry and the
                  public-page blocks. It needs the domain layer on no page at all.
                </>,
                <>
                  <strong>A third-party application</strong> takes the main entry. It
                  may take the domain layer too — it is a public part of the package —
                  but it almost certainly wants its own.
                </>,
              ]
        }
      />
      <p>
        {cs
          ? "Hlavní vstup zatím posílá doménovou vrstvu dál a označuje ji za zastaralou, aby split nikomu nerozbil build ze dne na den. V příštím velkém vydání ty přeposlané exporty zmizí a celá migrace je změna cesty v importu."
          : "The main entry still passes the domain layer through, marked deprecated, so the split breaks nobody's build overnight. In the next major those pass-through exports go away, and the whole migration is a changed import path."}
      </p>
    </div>
  );
}

export const DomainLayerGuide: IngotGuidePage = {
  slug: "domenova-vrstva",
  group: "rules",
  title: { cs: "Doménová vrstva", en: "The domain layer" },
  summary: {
    cs: "Co v kitu není kit: ikony operací, převod schémat a pravidla produktu mají vlastní vstup balíčku.",
    en: "What in the kit is not the kit: operation icons, schema adapters and product rules have their own package entry.",
  },
  sections: [
    {
      id: "otazka",
      title: { cs: "Jedna otázka, ne seznam", en: "One question, not a list" },
      body: { cs: <Question lang="cs" />, en: <Question lang="en" /> },
    },
    {
      id: "kdo-co-bere",
      title: { cs: "Kdo si co bere", en: "Who takes what" },
      body: { cs: <Who lang="cs" />, en: <Who lang="en" /> },
    },
  ],
};
