import { IngotCode, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Úvodní stránka doc webu (KAN-625) — výchozí obrazovka.
 *
 * Do KAN-625 padl příchozí rovnou na první komponentu v registru, takže
 * první věta, kterou o kitu četl, byla popis propu. Kdo neví, co Ingot
 * je, se z toho nedozví nic.
 *
 * 🚨 Text sekcí „Co to je“, „Principy“, „Z čeho se systém skládá“, „Jak
 * začít“ a „Pravidlo palce“ je převzatý z design handoffu (stránka Úvod).
 * Handoff popisuje vrstvu „kde žije“ cestami do svých vlastních souborů;
 * na veřejném doc webu je to přepsané na neutrální popis vrstvy, protože
 * cesta do repa čtenáři zvenku neříká nic.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka. Nepatří sem interní próza: čísla
 * technického dluhu, jména kontrol, klíče úkolů ani rozhodnutí s daty.
 */
const IMPORT_EXAMPLE = 'import { IngotTable, IngotEmptyState } from "@/ingot";';

const EYEBROW = "text-eyebrow uppercase text-ink-3";

interface Principle {
  /** Pořadové číslo z návrhu — je to popisek, ne index v poli. */
  num: string;
  title: Localized<string>;
  body: Localized<string>;
}

const PRINCIPLES: readonly Principle[] = [
  {
    num: "01",
    title: { cs: "Data před dekorací", en: "Data before decoration" },
    body: {
      cs: "Rozhraní administrace je hustý zápis skutečnosti. Žádné ozdobné plochy ani barevné přechody — plocha slouží tomu, aby se v ní dala číst čísla.",
      en: "An admin interface is a dense record of reality. No ornamental surfaces and no gradients — a surface exists so that numbers can be read on it.",
    },
  },
  {
    num: "02",
    title: { cs: "Kontrast dělá strukturu", en: "Contrast makes the structure" },
    body: {
      cs: "Pozadí stránky je vždy tmavší než karta. Hierarchii nese odsazení a linka, ne stín a ne barva.",
      en: "The page background is always darker than a card. Hierarchy is carried by spacing and a rule, not by a shadow and not by colour.",
    },
  },
  {
    num: "03",
    title: { cs: "Jeden akcent", en: "One accent" },
    body: {
      cs: "Akcent je jedna rodina čtyř tokenů. Barva navíc znamená nový význam — a ten musí být pojmenovaný, ne vymyšlený až v obrazovce.",
      en: "The accent is one family of four tokens. An extra colour means a new meaning — and that meaning has to be named, not invented inside a screen.",
    },
  },
  {
    num: "04",
    title: { cs: "Fakta jsou mono", en: "Facts are monospaced" },
    body: {
      cs: "Čísla, kódy, identifikátory, rozměry a časy patří do neproporcionálního písma s tabulkovými číslicemi. Text vysvětluje, mono měří.",
      en: "Numbers, codes, identifiers, dimensions and times belong in the monospaced face with tabular figures. Prose explains, monospace measures.",
    },
  },
  {
    num: "05",
    title: { cs: "Tenant = platform", en: "Tenant = platform" },
    body: {
      cs: "Obě administrace sdílí jednu lištu i jedny komponenty. Liší se odznakem u značky a obsahem sekcí — nikdy vlastním vzhledem.",
      en: "Both admin surfaces share one top bar and one set of components. They differ by the badge next to the brand and by the content of their sections — never by a look of their own.",
    },
  },
  {
    num: "06",
    title: { cs: "Jazyk uživatele", en: "The user’s language" },
    body: {
      cs: "Popisky mluví řečí dílny, ne databáze. Odborný termín se uvádí jen tam, kde ho výroba sama používá.",
      en: "Labels speak the language of the shop floor, not of the database. A technical term appears only where production itself uses it.",
    },
  },
];

interface LayerRow {
  layer: Localized<string>;
  where: Localized<string>;
  when: Localized<string>;
}

const LAYERS: readonly LayerRow[] = [
  {
    layer: { cs: "Tokeny", en: "Tokens" },
    where: {
      cs: "Kořen systému — jediné místo, kde je hodnota deklarovaná.",
      en: "The root of the system — the one place a value is declared.",
    },
    when: {
      cs: "Barva, mezera, rádius, stín, písmo.",
      en: "Colour, spacing, radius, shadow, typeface.",
    },
  },
  {
    layer: { cs: "Prvky", en: "Elements" },
    where: {
      cs: "Vrstva nad tokeny — tlačítko, pole, štítek.",
      en: "The layer above the tokens — button, field, badge.",
    },
    when: {
      cs: "Jednotlivé ovládání a značky.",
      en: "Individual controls and markers.",
    },
  },
  {
    layer: { cs: "Bloky", en: "Blocks" },
    where: {
      cs: "Složeniny z prvků — tabulka, karta kroku, prázdný stav.",
      en: "Compositions of elements — a table, a step card, an empty state.",
    },
    when: {
      cs: "Opakující se části obrazovky.",
      en: "Parts of a screen that repeat.",
    },
  },
  {
    layer: { cs: "Shell", en: "Shell" },
    where: {
      cs: "Rám aplikace — horní lišta, drobečky, hlavní plocha.",
      en: "The application frame — top bar, breadcrumbs, main area.",
    },
    when: {
      cs: "Rám každé stránky administrace.",
      en: "The frame of every admin page.",
    },
  },
];

function layerColumns(lang: DocLang): readonly IngotColumn<LayerRow>[] {
  return [
    {
      key: "layer",
      header: lang === "cs" ? "Vrstva" : "Layer",
      cell: (row) => <strong className="text-ink">{row.layer[lang]}</strong>,
    },
    {
      key: "where",
      header: lang === "cs" ? "Kde žije" : "Where it lives",
      cell: (row) => row.where[lang],
    },
    {
      key: "when",
      header: lang === "cs" ? "Kdy sáhnout" : "When to reach for it",
      cell: (row) => row.when[lang],
      cellClassName: "bg-accent-bg text-accent-ink",
    },
  ];
}

function WhatItIs({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {lang === "cs" ? (
          <>
            <strong>Ingot</strong> je designový systém Forgmaticu — sada
            rozhodnutí o barvě, typografii, prostoru a chování, ze které se
            skládá administrace tenanta, administrace platformy i veřejné
            stránky. Není to galerie komponent. Je to dohoda, jak vypadá
            práce ve výrobě přeložená do obrazovky.
          </>
        ) : (
          <>
            <strong>Ingot</strong> is the Forgmatic design system — a set of
            decisions about colour, typography, space and behaviour, from
            which the tenant admin, the platform admin and the public pages
            are all assembled. It is not a component gallery. It is the
            agreement on what work on the shop floor looks like once it is
            translated onto a screen.
          </>
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className={EYEBROW}>{lang === "cs" ? "Co to je" : "What it is"}</div>
          <p className="mt-2">
            {lang === "cs"
              ? "Tokeny a třídy na jednom místě. Obrazovka se z nich skládá — nevzniká z vlastních stylů psaných až v ní. Proto se změna rozhodnutí projeví všude, a ne jen tam, kde si na ni někdo vzpomene."
              : "Tokens and classes in one place. A screen is assembled from them — not from styles written on the spot. That is why changing a decision shows up everywhere, and not only where someone happens to remember it."}
          </p>
        </div>
        <div>
          <div className={EYEBROW}>{lang === "cs" ? "Pro koho" : "Who it is for"}</div>
          <p className="mt-2">
            {lang === "cs"
              ? "Pro designéry i vývojáře. Stejný slovník na obou stranách znamená, že návrh a kód mluví o téže věci — a nikdo mezi nimi nepřekládá dva popisy jedné obrazovky."
              : "For designers and developers alike. The same vocabulary on both sides means the design and the code talk about the same thing — nobody translates between two descriptions of one screen."}
          </p>
        </div>
        <div>
          <div className={EYEBROW}>{lang === "cs" ? "Jak se mění" : "How it changes"}</div>
          <p className="mt-2">
            {lang === "cs"
              ? "Nová komponenta nevzniká v obrazovce. Nejdřív vznikne v systému, dostane pravidlo a název, a teprve pak se použije."
              : "A new component is not born inside a screen. It appears in the system first, gets a rule and a name, and only then is used."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Principles({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PRINCIPLES.map((principle) => (
        <div
          key={principle.num}
          className="rounded-md border border-border bg-surface p-4"
        >
          <span className="font-mono text-xs tabular-nums text-ink-3">
            {principle.num}
          </span>
          <p className="mt-2 font-semibold text-ink">{principle.title[lang]}</p>
          <p className="mt-1 text-sm text-ink-2">{principle.body[lang]}</p>
        </div>
      ))}
    </div>
  );
}

function Layers({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Systém má čtyři vrstvy a každá odpovídá na jinou otázku. Než něco přidáš, patří rozhodnout, do které z nich to patří — vrstva určuje, kde se ta věc mění a co změna zasáhne."
          : "The system has four layers and each answers a different question. Before adding anything, decide which one it belongs to — the layer decides where the thing is changed and what a change touches."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={layerColumns(lang)}
          rows={LAYERS}
          rowKey={(row) => row.layer.cs}
          caption={
            lang === "cs" ? "Vrstvy systému" : "The layers of the system"
          }
          className="min-w-[38rem]"
          testId="docs-layers"
        />
      </div>
    </div>
  );
}

function GettingStarted({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        variant="ordered"
        items={
          lang === "cs"
            ? [
                <>
                  <strong>Připojit.</strong> Do projektu patří tokeny palety,
                  sada ikon a písma Geist a Geist Mono. Bez tokenů nemají
                  komponenty z čeho brát barvu ani mezeru.
                </>,
                <>
                  <strong>Postavit rám.</strong> Horní lišta → drobečky →
                  hlavička stránky → jeden pattern obsahu. Vždycky v tomhle
                  pořadí: čtenář, který ho jednou pochopil, se v každé další
                  obrazovce rozhlíží už jen po obsahu.
                </>,
                <>
                  <strong>Doplnit obsah.</strong> Skládat z existujících
                  prvků. Chybí-li něco, přidá se to nejdřív do systému.
                </>,
              ]
            : [
                <>
                  <strong>Connect it.</strong> The project needs the palette
                  tokens, the icon set and the Geist and Geist Mono typefaces.
                  Without the tokens the components have nowhere to take a
                  colour or a spacing from.
                </>,
                <>
                  <strong>Build the frame.</strong> Top bar → breadcrumbs →
                  page header → one content pattern. Always in that order: a
                  reader who has understood it once only looks for content on
                  every next screen.
                </>,
                <>
                  <strong>Fill in the content.</strong> Assemble it from the
                  existing elements. If something is missing, it is added to
                  the system first.
                </>,
              ]
        }
      />
    </div>
  );
}

function RuleOfThumb({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="rounded-md border border-accent-border bg-accent-bg p-4 text-sm text-accent-ink">
      <p>
        {lang === "cs" ? (
          <>
            <strong>Pravidlo palce.</strong> Píšeš-li do obrazovky vlastní
            barvu, mezeru nebo rádius, platí jedno ze dvou: buď existuje
            token, který jsi nenašel, nebo systému chybí rozhodnutí. Obojí se
            řeší v systému, ne v komponentě.
          </>
        ) : (
          <>
            <strong>Rule of thumb.</strong> If you are writing your own
            colour, spacing or radius into a screen, one of two things is
            true: either there is a token you did not find, or the system is
            missing a decision. Both are settled in the system, not in the
            component.
          </>
        )}
      </p>
    </div>
  );
}

export const IntroGuide: IngotGuidePage = {
  slug: "uvod",
  group: "system",
  title: { cs: "Úvod", en: "Introduction" },
  summary: {
    cs: "Ingot je designový systém Forgmaticu — sada rozhodnutí o barvě, typografii, prostoru a chování. Není to galerie komponent.",
    en: "Ingot is the Forgmatic design system — a set of decisions about colour, typography, space and behaviour. It is not a component gallery.",
  },
  sections: [
    {
      id: "co-to-je",
      title: { cs: "Co to je", en: "What it is" },
      body: {
        cs: <WhatItIs lang="cs" />,
        en: <WhatItIs lang="en" />,
      },
    },
    {
      id: "principy",
      title: { cs: "Principy", en: "Principles" },
      body: {
        cs: <Principles lang="cs" />,
        en: <Principles lang="en" />,
      },
    },
    {
      id: "z-ceho-se-sklada",
      title: {
        cs: "Z čeho se systém skládá",
        en: "What the system is made of",
      },
      body: {
        cs: <Layers lang="cs" />,
        en: <Layers lang="en" />,
      },
    },
    {
      id: "jak-zacit",
      title: { cs: "Jak začít", en: "How to start" },
      body: {
        cs: <GettingStarted lang="cs" />,
        en: <GettingStarted lang="en" />,
      },
    },
    {
      id: "jak-se-pouziva",
      title: { cs: "Jak se používá", en: "How to use it" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>Všechno se importuje z jednoho místa:</p>
            <IngotCode block lang="tsx">{IMPORT_EXAMPLE}</IngotCode>
            <p>
              <strong>Vždycky přes tenhle jeden vstup</strong>, nikdy hlubší
              cestou na konkrétní soubor. Co odsud vede ven, je veřejné
              rozhraní kitu a mění se ohlášeně; co ne, je vnitřek a smí se
              přejmenovat nebo rozdělit kdykoli. Součástí toho rozhraní jsou
              i typy, které si prvek žádá — třeba{" "}
              <IngotCode>IngotColumn</IngotCode> pro sloupce tabulky.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>Everything is imported from one place:</p>
            <IngotCode block lang="tsx">{IMPORT_EXAMPLE}</IngotCode>
            <p>
              <strong>Always through this one entry point</strong>, never by a
              deeper path to a specific file. What comes out of it is the
              kit’s public interface and changes are announced; what does not
              is internal and may be renamed or split at any time. That
              interface includes the types an element asks for —{" "}
              <IngotCode>IngotColumn</IngotCode> for table columns, say.
            </p>
          </div>
        ),
      },
    },
    {
      id: "jak-pridat",
      title: {
        cs: "Jak se přidává nové primitivum",
        en: "How a new primitive is added",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Nové primitivum vzniká,{" "}
              <strong>až si o něj řekne konkrétní obrazovka</strong>. Když ten
              žadatel je, patří k sobě tři věci v jedné změně: komponenta a
              její vyvedení z <IngotCode>@/ingot</IngotCode>, stránka na
              tomhle webu s živou ukázkou, a první obrazovka, která ji
              doopravdy používá.
            </p>
            <p>
              Ukázku musí stránka vykreslit{" "}
              <strong>skutečnou komponentou</strong>. Opsané JSX vypadá v den
              zápisu stejně a od druhého dne tiše lže.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A new primitive appears{" "}
              <strong>once a concrete screen asks for it</strong>. Once there
              is such a caller, three things belong together in one change:
              the component and its export from{" "}
              <IngotCode>@/ingot</IngotCode>, a page on this site with a live
              demo, and the first screen that genuinely uses it.
            </p>
            <p>
              The page must render the demo with the{" "}
              <strong>real component</strong>. Copied JSX looks identical on
              the day it is written and lies quietly from the second day on.
            </p>
          </div>
        ),
      },
    },
    {
      id: "co-tu-najdes",
      title: { cs: "Co tu najdeš", en: "What you will find here" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Každá stránka komponenty má stejnou stavbu: živou ukázku i s
              kódem, kdy použít a kdy nepoužít, tabulku vlastností,
              přístupnost a překlady. Tam, kde první verze něco schválně
              neumí, je to vypsané taky. Pravidlo o překladech je společné
              všem prvkům, takže má vlastní stránku —{" "}
              <a className="underline" href="#/preklady">
                Překlady
              </a>
              .
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Every component page has the same shape: a live demo with the
              code that produces it, when to use it and when not to, a table
              of properties, accessibility and translations. Where the first
              version deliberately cannot do something, that is listed too.
              The rule about translations is common to every element, so it
              has a page of its own —{" "}
              <a className="underline" href="#/preklady">
                Translations
              </a>
              .
            </p>
          </div>
        ),
      },
    },
    {
      id: "pravidlo-palce",
      title: { cs: "Pravidlo palce", en: "Rule of thumb" },
      body: {
        cs: <RuleOfThumb lang="cs" />,
        en: <RuleOfThumb lang="en" />,
      },
    },
  ],
};
