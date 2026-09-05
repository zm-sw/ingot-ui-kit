import { IngotCode, IngotEyebrow, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Pravidla používání“ — skladba obrazovky, tabulka ano/ne,
 * pravidla textů a údržba systému (KAN-663).
 *
 * 🚨 Obsah je převzatý z design handoffu (stránka Pravidla používání).
 * Tabulka ano/ne má tři sloupce schválně: bez sloupce „Situace“ je dvojice
 * ano/ne jen názor, se situací je to rozhodnutí. Sloupec „Ano“ je
 * zvýrazněný akcentem, aby se správná odpověď dala přečíst na první
 * pohled — v handoffu to dělá třída `hl`.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka: klíče úkolů, cesty do repa ani jména
 * kontrol nesmí být v renderovaném textu. V komentářích ano.
 */

interface YesNoRow {
  situation: Localized<string>;
  no: Localized<string>;
  yes: Localized<string>;
}

const YES_NO: readonly YesNoRow[] = [
  // Otočeno 2026-09-02 rozhodnutím vlastníka: delší editace potřebuje
  // místo na vysvětlení a plné soustředění na jednu věc — modal.
  // Boční panel zůstává rychlé úpravě, kde se pracuje se seznamem za ní.
  {
    situation: {
      cs: "Delší editace záznamu",
      en: "A longer edit of a record",
    },
    no: {
      cs: "Boční panel vmáčknutý vedle seznamu",
      en: "A side drawer squeezed next to the list",
    },
    yes: {
      cs: "Modální okno — místo na vysvětlení a soustředění na jednu věc",
      en: "A modal — room to explain and focus on the thing at hand",
    },
  },
  {
    situation: { cs: "Potvrzení smazání", en: "Confirming a delete" },
    no: {
      cs: "Plná červená plocha",
      en: "A solid red surface",
    },
    yes: {
      cs: "Obrysové tlačítko a název entity přímo v textu",
      en: "An outline button and the entity name in the text",
    },
  },
  {
    situation: { cs: "Výsledek uložení", en: "The result of saving" },
    no: {
      cs: "Modální okno „Hotovo“",
      en: "A “Done” modal",
    },
    yes: {
      cs: "Toast se zpětnou akcí",
      en: "A toast with an undo action",
    },
  },
  {
    situation: { cs: "Chyba ve formuláři", en: "An error in a form" },
    no: {
      cs: "Jen toast nahoře",
      en: "Only a toast at the top",
    },
    yes: {
      cs: "Hláška u pole, které chybu má",
      en: "A message at the field that has the error",
    },
  },
  {
    situation: { cs: "Prázdný seznam", en: "An empty list" },
    no: {
      cs: "Prázdná tabulka s hlavičkou",
      en: "An empty table with a header row",
    },
    yes: {
      cs: "Prázdný stav s první akcí",
      en: "An empty state with the first action",
    },
  },
];

function yesNoColumns(lang: DocLang): readonly IngotColumn<YesNoRow>[] {
  return [
    {
      key: "situation",
      header: lang === "cs" ? "Situace" : "Situation",
      cell: (row) => <strong className="text-ink">{row.situation[lang]}</strong>,
    },
    {
      key: "no",
      header: lang === "cs" ? "Ne" : "No",
      cell: (row) => row.no[lang],
    },
    {
      key: "yes",
      header: lang === "cs" ? "Ano" : "Yes",
      cell: (row) => row.yes[lang],
      // Správná odpověď se má dát přečíst bez čtení celého řádku.
      cellClassName: "bg-accent-bg text-accent-ink",
    },
  ];
}

function Layout({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="grid gap-4 text-sm text-ink-2 sm:grid-cols-3">
      <div>
        <IngotEyebrow as="div" size="md">
          {lang === "cs" ? "Rám" : "Frame"}
        </IngotEyebrow>
        <p className="mt-2">
          {lang === "cs"
            ? "Horní lišta → drobečky → hlavička stránky → obsah. Drobečky se vynechávají jen na kořenových stránkách sekce, kde by ukazovaly samy na sebe."
            : "Top bar → breadcrumbs → page header → content. Breadcrumbs are left out only on the root pages of a section, where they would point at themselves."}
        </p>
      </div>
      <div>
        <IngotEyebrow as="div" size="md">
          {lang === "cs" ? "Obsah" : "Content"}
        </IngotEyebrow>
        <p className="mt-2">
          {lang === "cs"
            ? "Právě jeden hlavní pattern: tabulka, krokový setup, skupinové karty, detail s taby, nebo metriky. Dva se nemíchají — ani jeden by neměl dost místa."
            : "Exactly one main pattern: a table, a step-by-step setup, grouped cards, a detail with tabs, or metrics. Two are never mixed — neither would have enough room."}
        </p>
      </div>
      <div>
        <IngotEyebrow as="div" size="md">
          {lang === "cs" ? "Akce" : "Actions"}
        </IngotEyebrow>
        <p className="mt-2">
          {lang === "cs"
            ? "Primární akce je vpravo v hlavičce, nikdy plovoucí. Akce řádku jsou ikonové a vždy na konci řádku, aby se v seznamu hledaly na jednom místě."
            : "The primary action sits at the right of the header, never floating. Row actions are icon-only and always at the end of the row, so a list has one place to look for them."}
        </p>
      </div>
    </div>
  );
}

function YesNo({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Pět situací, které se v administraci opakují a pokaždé svádí ke stejné špatné odpovědi. Sloupec vpravo je ta, která platí."
          : "Five situations that keep coming back in admin screens and keep inviting the same wrong answer. The right-hand column is the one that holds."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={yesNoColumns(lang)}
          rows={YES_NO}
          rowKey={(row) => row.situation.cs}
          caption={lang === "cs" ? "Ano a ne" : "Yes and no"}
          className="min-w-[40rem]"
          testId="docs-yes-no"
        />
      </div>
    </div>
  );
}

function TextRules({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Tlačítko pojmenovává výsledek: <strong>Přidat zemi</strong>,
                  ne <strong>OK</strong>. Čtenář se rozhoduje podle toho, co
                  se stane, ne podle toho, že něco potvrzuje. Zrušení je vždy{" "}
                  <strong>Zrušit</strong>.
                </>,
                <>
                  Popisek pole je podstatné jméno bez dvojtečky; nápověda pod
                  polem je celá věta s tečkou. Dvě různé role textu se tak
                  poznají i bez čtení.
                </>,
                <>
                  Chyba říká, co udělat: „IČO musí mít 8 číslic“, ne
                  „Neplatná hodnota“. Hláška, ze které nejde poznat další
                  krok, uživatele zastaví stejně jako žádná.
                </>,
                <>
                  Odborný termín se používá jen tam, kde ho výroba sama
                  používá. Přepínač slovníku v menu účtu (Jednoduše / Expert)
                  přepíná mezi lidovou a odbornou variantou — každý termín
                  proto potřebuje obě.
                </>,
                <>
                  Bez vykřičníků, bez emoji a bez „Ups!“. Chyba je fakt, ne
                  omluva.
                </>,
              ]
            : [
                <>
                  A button names the outcome: <strong>Add country</strong>,
                  not <strong>OK</strong>. A reader decides by what will
                  happen, not by the fact that something is being confirmed.
                  Cancelling is always <strong>Cancel</strong>.
                </>,
                <>
                  A field label is a noun without a colon; the hint below the
                  field is a full sentence with a full stop. The two roles of
                  the text are then distinguishable without reading them.
                </>,
                <>
                  An error says what to do: “The company number must have 8
                  digits”, not “Invalid value”. A message that does not reveal
                  the next step stops the user just as surely as no message.
                </>,
                <>
                  A technical term is used only where production itself uses
                  it. The vocabulary switch in the account menu (Plain /
                  Expert) toggles between the everyday and the technical
                  variant — so every term needs both.
                </>,
                <>
                  No exclamation marks, no emoji and no “Oops”. An error is a
                  fact, not an apology.
                </>,
              ]
        }
      />
    </div>
  );
}

function Maintenance({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Nová komponenta vzniká v systému, ne v obrazovce — dostane
                  název, pravidlo použití a stránku v téhle dokumentaci, a
                  teprve pak se použije. Komponenta poskládaná uvnitř jedné
                  obrazovky je ostrůvek: příště ji nikdo nenajde a napíše si
                  vlastní.
                </>,
                <>
                  Vlastní barva, mezera nebo rádius v obrazovce znamená
                  chybějící token. Řeší se v systému, ne v obrazovce — jinak
                  ta hodnota zůstane jediná svého druhu a nikdo ji při další
                  změně palety nenajde.
                </>,
                <>
                  Změna tokenu je změna produktu: prochází stejným review jako
                  změna kódu. Projeví se všude naráz, takže se nedá vrátit
                  jednou obrazovkou.
                </>,
              ]
            : [
                <>
                  A new component is born in the system, not in a screen — it
                  gets a name, a rule of use and a page in this documentation,
                  and only then is used. A component assembled inside one
                  screen is an island: nobody finds it next time, and writes
                  their own.
                </>,
                <>
                  A custom colour, spacing or radius in a screen means a
                  missing token. It is settled in the system, not in the
                  screen — otherwise that value stays one of a kind and nobody
                  finds it at the next change of the palette.
                </>,
                <>
                  Changing a token is changing the product: it goes through
                  the same review as a change of code. It lands everywhere at
                  once, so it cannot be undone by one screen.
                </>,
              ]
        }
      />
    </div>
  );
}

/**
 * Pinovací kontrakt (KAN-813, po planém poplachu KAN-790).
 *
 * 🪤 **Číslo verze neidentifikuje obsah.** `package.json` píše release
 * automatika až při pushi do `main`, takže každý commit mezi dvěma
 * releasy nese verzi toho předchozího — jedno číslo, víc různých stromů.
 * npm si git závislost cachuje pod jménem a verzí, takže pod jednou
 * verzí mu může ležet kterýkoli z nich.
 *
 * Tohle stálo den hledání „rozbité" větve, která rozbitá nebyla: shodu
 * hlásil `package.json`, `package-lock.json` i grep do `node_modules` —
 * jen to `node_modules` bylo jiné 1.0.1.
 *
 * Tag je proti tomu jednoznačný, protože release automatika taguje každý
 * release anotovaným tagem. Proto sem ta věta patří: konzument čte tuhle
 * stránku, ne release skript.
 */
function Pinning({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Kit se instaluje z gitu, takže pin je celá dohoda. Míří na tag vydání, ne na commit."
          : "The kit is installed from git, so the pin is the whole agreement. It points at a release tag, never at a commit."}
      </p>
      <IngotCode block lang="tsx">
        {'"@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#v1.1.0"'}
      </IngotCode>
      <IngotList
        items={
          cs
            ? [
                <>
                  <strong>Commit vypadá přesněji, ale je méně
                  bezpečný.</strong> Číslo verze se hne až s vydáním, takže
                  každý commit mezi dvěma vydáními nese číslo toho
                  předchozího — jedno číslo verze označuje víc různých
                  stromů.
                </>,
                <>
                  Správce balíčků si závislost z gitu ukládá do mezipaměti
                  pod jménem a verzí. Pod jedním číslem tam proto může ležet
                  jiný strom, než na který pin ukazuje — a nic to
                  neohlásí: <IngotCode>package.json</IngotCode>,{" "}
                  <IngotCode>package-lock.json</IngotCode> i{" "}
                  <IngotCode>node_modules</IngotCode> spolu souhlasí.
                </>,
                <>
                  Vydání se tagují, takže <strong>tag je právě jedna verze a
                  právě jeden strom</strong>. To je jediný pin, který drží.
                </>,
                <>
                  Když typová kontrola nenajde symbol, který ve zdrojích kitu
                  vidíš, podezřívej instalaci dřív než kit: porovnej
                  nainstalovaný soubor proti <strong>tagu</strong>, ne proti
                  číslu verze, a napřed vyčisti mezipaměť. Shoda čísel
                  nedokazuje nic.
                </>,
              ]
            : [
                <>
                  <strong>A commit looks more precise and is in fact less
                  safe.</strong> The version number moves only at a release,
                  so every commit between two releases carries the previous
                  one's number — a single version string names many
                  different trees.
                </>,
                <>
                  A package manager caches a git dependency under its name
                  and version. Under one number it may therefore hold a
                  different tree than the pin points at — and nothing warns
                  you: <IngotCode>package.json</IngotCode>,{" "}
                  <IngotCode>package-lock.json</IngotCode> and{" "}
                  <IngotCode>node_modules</IngotCode> all agree.
                </>,
                <>
                  Releases are tagged, so <strong>a tag is exactly one
                  version and exactly one tree</strong>. It is the only pin
                  that holds.
                </>,
                <>
                  When a type check cannot find a symbol you can see in the
                  kit's own source, suspect the install before the kit:
                  compare the installed file against the <strong>tag</strong>,
                  not against a version number, and clear the cache before
                  measuring again. Matching numbers prove nothing.
                </>,
              ]
        }
      />
    </div>
  );
}

export const UsageGuide: IngotGuidePage = {
  slug: "pravidla-pouzivani",
  group: "rules",
  title: { cs: "Pravidla používání", en: "Usage rules" },
  summary: {
    cs: "Rozhodnutí, která nejsou vidět v katalogu, ale drží produkt pohromadě. Když se dva návrhy neshodnou, rozhoduje tato sekce.",
    en: "The decisions that are not visible in the catalogue but hold the product together. When two designs disagree, this section decides.",
  },
  sections: [
    {
      id: "skladba-obrazovky",
      title: { cs: "Skladba obrazovky", en: "The layout of a screen" },
      body: {
        cs: <Layout lang="cs" />,
        en: <Layout lang="en" />,
      },
    },
    {
      id: "ano-ne",
      title: { cs: "Ano a ne", en: "Yes and no" },
      body: {
        cs: <YesNo lang="cs" />,
        en: <YesNo lang="en" />,
      },
    },
    {
      id: "texty",
      title: { cs: "Texty", en: "Text" },
      body: {
        cs: <TextRules lang="cs" />,
        en: <TextRules lang="en" />,
      },
    },
    {
      id: "pinovani",
      title: { cs: "Připojení kitu", en: "Pinning the kit" },
      body: { cs: <Pinning lang="cs" />, en: <Pinning lang="en" /> },
    },
    {
      id: "udrzba",
      title: { cs: "Údržba", en: "Maintenance" },
      body: {
        cs: <Maintenance lang="cs" />,
        en: <Maintenance lang="en" />,
      },
    },
  ],
};
