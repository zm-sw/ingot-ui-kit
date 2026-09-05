import {
  IngotCode,
  IngotEyebrow,
  IngotList,
  IngotTable,
  type IngotColumn,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * "Usage rules" page — screen composition, the do/don't table, text rules
 * and system maintenance.
 *
 * The content is taken from the design handoff (the Usage rules page). The
 * do/don't table has three columns on purpose: without the "Situation"
 * column a do/don't pair is just an opinion, with the situation it is a
 * decision. The "Do" column is highlighted with the accent so the right
 * answer can be read at a glance — in the handoff the `hl` class does
 * that.
 *
 * The doc web is a PUBLIC page: issue keys, repository paths and guard
 * names must not be in rendered text. In comments they may.
 */

interface YesNoRow {
  situation: Localized<string>;
  no: Localized<string>;
  yes: Localized<string>;
}

const YES_NO: readonly YesNoRow[] = [
  // Flipped 2026-09-02 by the owner's decision: a longer edit needs room
  // for explanation and full focus on one thing — a modal. The side panel
  // stays for a quick edit that works with the list behind it.
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
      // The right answer should be readable without reading the whole row.
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
                  Tlačítko pojmenovává výsledek: <strong>Přidat zemi</strong>, ne{" "}
                  <strong>OK</strong>. Čtenář se rozhoduje podle toho, co se stane, ne
                  podle toho, že něco potvrzuje. Zrušení je vždy <strong>Zrušit</strong>
                  .
                </>,
                <>
                  Popisek pole je podstatné jméno bez dvojtečky; nápověda pod polem je
                  celá věta s tečkou. Dvě různé role textu se tak poznají i bez čtení.
                </>,
                <>
                  Chyba říká, co udělat: „IČO musí mít 8 číslic“, ne „Neplatná hodnota“.
                  Hláška, ze které nejde poznat další krok, uživatele zastaví stejně
                  jako žádná.
                </>,
                <>
                  Odborný termín se používá jen tam, kde ho výroba sama používá.
                  Přepínač slovníku v menu účtu (Jednoduše / Expert) přepíná mezi
                  lidovou a odbornou variantou — každý termín proto potřebuje obě.
                </>,
                <>Bez vykřičníků, bez emoji a bez „Ups!“. Chyba je fakt, ne omluva.</>,
              ]
            : [
                <>
                  A button names the outcome: <strong>Add country</strong>, not{" "}
                  <strong>OK</strong>. A reader decides by what will happen, not by the
                  fact that something is being confirmed. Cancelling is always{" "}
                  <strong>Cancel</strong>.
                </>,
                <>
                  A field label is a noun without a colon; the hint below the field is a
                  full sentence with a full stop. The two roles of the text are then
                  distinguishable without reading them.
                </>,
                <>
                  An error says what to do: “The company number must have 8 digits”, not
                  “Invalid value”. A message that does not reveal the next step stops
                  the user just as surely as no message.
                </>,
                <>
                  A technical term is used only where production itself uses it. The
                  vocabulary switch in the account menu (Plain / Expert) toggles between
                  the everyday and the technical variant — so every term needs both.
                </>,
                <>
                  No exclamation marks, no emoji and no “Oops”. An error is a fact, not
                  an apology.
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
                  Nová komponenta vzniká v systému, ne v obrazovce — dostane název,
                  pravidlo použití a stránku v téhle dokumentaci, a teprve pak se
                  použije. Komponenta poskládaná uvnitř jedné obrazovky je ostrůvek:
                  příště ji nikdo nenajde a napíše si vlastní.
                </>,
                <>
                  Vlastní barva, mezera nebo rádius v obrazovce znamená chybějící token.
                  Řeší se v systému, ne v obrazovce — jinak ta hodnota zůstane jediná
                  svého druhu a nikdo ji při další změně palety nenajde.
                </>,
                <>
                  Změna tokenu je změna produktu: prochází stejným review jako změna
                  kódu. Projeví se všude naráz, takže se nedá vrátit jednou obrazovkou.
                </>,
              ]
            : [
                <>
                  A new component is born in the system, not in a screen — it gets a
                  name, a rule of use and a page in this documentation, and only then is
                  used. A component assembled inside one screen is an island: nobody
                  finds it next time, and writes their own.
                </>,
                <>
                  A custom colour, spacing or radius in a screen means a missing token.
                  It is settled in the system, not in the screen — otherwise that value
                  stays one of a kind and nobody finds it at the next change of the
                  palette.
                </>,
                <>
                  Changing a token is changing the product: it goes through the same
                  review as a change of code. It lands everywhere at once, so it cannot
                  be undone by one screen.
                </>,
              ]
        }
      />
    </div>
  );
}

/**
 * The pinning contract (written after a false alarm).
 *
 * **A version number does not identify content.** The release automation
 * writes `package.json` only on a push to `main`, so every commit between
 * two releases carries the previous release's version — one number, many
 * different trees. npm caches a git dependency under name and version, so
 * any of them may lie under one version.
 *
 * This cost a day of hunting a "broken" branch that was not broken:
 * `package.json`, `package-lock.json` and a grep into `node_modules` all
 * reported a match — only that `node_modules` was a different 1.0.1.
 *
 * A tag, by contrast, is unambiguous, because the release automation tags
 * every release with an annotated tag. That is why the sentence belongs
 * here: a consumer reads this page, not the release script.
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
                  <strong>Commit vypadá přesněji, ale je méně bezpečný.</strong> Číslo
                  verze se hne až s vydáním, takže každý commit mezi dvěma vydáními nese
                  číslo toho předchozího — jedno číslo verze označuje víc různých
                  stromů.
                </>,
                <>
                  Správce balíčků si závislost z gitu ukládá do mezipaměti pod jménem a
                  verzí. Pod jedním číslem tam proto může ležet jiný strom, než na který
                  pin ukazuje — a nic to neohlásí: <IngotCode>package.json</IngotCode>,{" "}
                  <IngotCode>package-lock.json</IngotCode> i{" "}
                  <IngotCode>node_modules</IngotCode> spolu souhlasí.
                </>,
                <>
                  Vydání se tagují, takže{" "}
                  <strong>tag je právě jedna verze a právě jeden strom</strong>. To je
                  jediný pin, který drží.
                </>,
                <>
                  Když typová kontrola nenajde symbol, který ve zdrojích kitu vidíš,
                  podezřívej instalaci dřív než kit: porovnej nainstalovaný soubor proti{" "}
                  <strong>tagu</strong>, ne proti číslu verze, a napřed vyčisti
                  mezipaměť. Shoda čísel nedokazuje nic.
                </>,
              ]
            : [
                <>
                  <strong>A commit looks more precise and is in fact less safe.</strong>{" "}
                  The version number moves only at a release, so every commit between
                  two releases carries the previous one's number — a single version
                  string names many different trees.
                </>,
                <>
                  A package manager caches a git dependency under its name and version.
                  Under one number it may therefore hold a different tree than the pin
                  points at — and nothing warns you: <IngotCode>package.json</IngotCode>
                  , <IngotCode>package-lock.json</IngotCode> and{" "}
                  <IngotCode>node_modules</IngotCode> all agree.
                </>,
                <>
                  Releases are tagged, so{" "}
                  <strong>a tag is exactly one version and exactly one tree</strong>. It
                  is the only pin that holds.
                </>,
                <>
                  When a type check cannot find a symbol you can see in the kit's own
                  source, suspect the install before the kit: compare the installed file
                  against the <strong>tag</strong>, not against a version number, and
                  clear the cache before measuring again. Matching numbers prove
                  nothing.
                </>,
              ]
        }
      />
    </div>
  );
}

function Lifecycle({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Kit se instaluje z tagu, takže volající nesedí v tomhle repozitáři. Odebrat komponentu bez ohlášení proto znamená, že někomu v pondělí ráno přestane jít build a nemá si co přečíst. Odchod má tři kroky a růst má dvě podmínky."
          : "The kit is installed from a tag, so its callers do not sit in this repository. Removing a component without notice therefore means somebody's build stops on a Monday morning with nothing to read. Leaving has three steps; growing up has two conditions."}
      </p>
      <IngotList
        variant="ordered"
        items={
          cs
            ? [
                <>
                  Stránka dostane stav <strong>zastaralé</strong> a s ním datum
                  odstranění a náhradu. Odznak zčervená a stránka začíná upozorněním —
                  před ukázkou, ne za ní.
                </>,
                <>
                  Komponenta <strong>dál funguje beze změny nejméně dvě vydání</strong>.
                  Zastarání, které věc odstraní v příští verzi, je odstranění s
                  mezikrokem.
                </>,
                <>
                  Zmizí ve verzi, kterou stránka jmenovala — nikdy dřív. Je to{" "}
                  <strong>minor</strong>, ne patch: pro volajícího je to stejně tvrdá
                  změna jako přejmenovaný prop.
                </>,
              ]
            : [
                <>
                  The page gets the <strong>deprecated</strong> status, with a removal
                  version and a replacement. The badge turns red and the page opens with
                  the notice — before the demo, not after it.
                </>,
                <>
                  The component{" "}
                  <strong>keeps working, unchanged, for at least two releases</strong>.
                  A deprecation that removes the thing in the next version is a removal
                  with extra steps.
                </>,
                <>
                  It disappears in the version the page named — never sooner. That is a{" "}
                  <strong>minor</strong> bump, not a patch: to a caller it is as hard a
                  change as a renamed prop.
                </>,
              ]
        }
      />
      <p>
        {cs
          ? "Z bety na stabilní se komponenta dostane na důkazy, ne stářím: musí ji používat dva konzumenti (doc web se nepočítá, ten ukazuje všechno) a dvě vydání za sebou nesmí dostat major. Označit něco za stabilní, protože to vypadá hotově, je nejrychlejší cesta k systému, který si nesmí opravit vlastní chyby."
          : "A component moves from beta to stable on evidence, not on age: two consumers have to use it (the doc web does not count — it demonstrates everything) and it must go two releases without a major bump. Marking something stable because it looks finished is the fastest way to a system that may not fix its own mistakes."}
      </p>
      <p>
        {cs
          ? "Podle toho kritéria je dnes 36 z 55 primitiv v betě a zůstávají tam: kit zatím nemá dva konzumenty mimo tenhle repozitář. Až je bude mít, projde se seznam znovu — a bude z čeho rozhodovat."
          : "By that criterion 36 of the 55 primitives are in beta today and stay there: the kit does not yet have two consumers outside this repository. Once it does, the list gets another pass — and there will be something to decide on."}
      </p>
    </div>
  );
}

function ApiRules({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Komponenta kitu se pozná podle toho, co dovolí a co ne. Tahle čtyři pravidla platí pro každou z nich, takže se nemusíš u každé znovu ptát."
          : "A kit component is recognised by what it allows and what it does not. These four rules hold for every one of them, so you do not have to ask again at each."}
      </p>
      <IngotList
        items={
          cs
            ? [
                <>
                  <IngotCode>className</IngotCode> je rozvržení, nikdy vzhled. Šířka,
                  mezery, umístění v mřížce — nic, co mění barvu, rádius, řez písma nebo
                  vnitřní odsazení. Komponenta, jejímž smyslem je vypadat všude stejně,
                  ho nebere vůbec; každá stránka komponenty to říká nad tabulkou
                  vlastností.
                </>,
                <>
                  Co má cíl v DOM, bere <IngotCode>ref</IngotCode>. Zaostřit pole,
                  odrolovat řádek do výřezu, nastavit
                  <IngotCode>indeterminate</IngotCode> — všechno přes API. Sáhnout
                  dovnitř přes <IngotCode>querySelector</IngotCode> znamená přivázat
                  obrazovku k vnitřku komponenty, který se smí přejmenovat.
                </>,
                <>
                  Popisek, který potřebuje odečítač, je povinná vlastnost — ne nepovinná
                  s výchozí hodnotou. Nepovinný popisek je popisek, na který se
                  zapomene, a na obrazovce tu díru nikdo neuvidí.
                </>,
                <>
                  Každý viditelný text přichází přeložený od volajícího. Pár popisků,
                  které kit říká sám, bydlí ve slovníku{" "}
                  <IngotCode>IngotProvider</IngotCode> a bez něj jsou anglicky.
                </>,
              ]
            : [
                <>
                  <IngotCode>className</IngotCode> is layout, never look. Width,
                  spacing, placement in a grid — nothing that changes colour, radius,
                  weight or inner padding. A component whose whole point is to look the
                  same everywhere does not take it at all; every component page says
                  which it is, above the properties table.
                </>,
                <>
                  Anything with a DOM target takes <IngotCode>ref</IngotCode>. Focusing
                  a field, scrolling a row into view, setting{" "}
                  <IngotCode>indeterminate</IngotCode> — all through the API. Reaching
                  inside with <IngotCode>querySelector</IngotCode> ties the screen to
                  the component's insides, which are free to be renamed.
                </>,
                <>
                  A label a screen reader needs is a required property — not an optional
                  one with a default. An optional label is a label somebody forgets, and
                  nobody sees that hole on screen.
                </>,
                <>
                  Every visible string arrives translated from the caller. The few
                  labels the kit says itself live in the{" "}
                  <IngotCode>IngotProvider</IngotCode> dictionary and are English
                  without it.
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
    // The four rules used to live nowhere, so every new primitive invented
    // them again: className took layout on some components and looks on
    // others, and only two components forwarded a ref. Written down here
    // and in the repo's contributor notes; each component page states its
    // own className policy above the properties table.
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
      id: "api-pravidla",
      title: {
        cs: "Pravidla API komponent",
        en: "The API rules of a component",
      },
      body: { cs: <ApiRules lang="cs" />, en: <ApiRules lang="en" /> },
    },
    {
      id: "zivotni-cyklus",
      title: {
        cs: "Jak komponenta odchází a jak dospívá",
        en: "How a component leaves, and how it grows up",
      },
      body: { cs: <Lifecycle lang="cs" />, en: <Lifecycle lang="en" /> },
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
