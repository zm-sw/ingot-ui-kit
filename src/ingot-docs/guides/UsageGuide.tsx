import { IngotList, IngotTable, type IngotColumn } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Pravidla používání“ — rám obrazovky, jeden pattern na
 * obrazovku, tabulka ano/ne a pravidla textů (KAN-663).
 */

interface YesNoRow {
  yes: Localized<string>;
  no: Localized<string>;
}

const YES_NO: readonly YesNoRow[] = [
  {
    yes: {
      cs: "Jedna hlavní akce vpravo v hlavičce.",
      en: "One primary action, top right in the header.",
    },
    no: {
      cs: "Dvě primární tlačítka vedle sebe.",
      en: "Two primary buttons side by side.",
    },
  },
  {
    yes: {
      cs: "Editace záznamu v bočním panelu.",
      en: "Editing a record in a side drawer.",
    },
    no: {
      cs: "Formulář rozbalený uprostřed tabulky.",
      en: "A form unfolded in the middle of a table.",
    },
  },
  {
    yes: {
      cs: "Stav entity jako štítek s textem.",
      en: "An entity state as a badge with text.",
    },
    no: {
      cs: "Stav vyjádřený jen barvou puntíku.",
      en: "A state expressed only by the colour of a dot.",
    },
  },
  {
    yes: {
      cs: "Prázdný seznam s vysvětlením a dalším krokem.",
      en: "An empty list with an explanation and a next step.",
    },
    no: {
      cs: "Prázdná bílá plocha bez jediného slova.",
      en: "A blank white area without a single word.",
    },
  },
  {
    yes: {
      cs: "Nevratný krok potvrzený dialogem s dopadem.",
      en: "An irreversible step confirmed by a dialog stating the impact.",
    },
    no: {
      cs: "Smazání provedené hned po kliknutí.",
      en: "A delete performed the instant it is clicked.",
    },
  },
];

function yesNoColumns(lang: DocLang): readonly IngotColumn<YesNoRow>[] {
  return [
    {
      key: "yes",
      header: lang === "cs" ? "Ano" : "Yes",
      cell: (row) => row.yes[lang],
    },
    {
      key: "no",
      header: lang === "cs" ? "Ne" : "No",
      cell: (row) => row.no[lang],
    },
  ];
}

function FrameBody({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Obrazovka má rám: nadpis s větou pod ním, sekce s nadpisy, akce na svých místech. Rám se neskládá pokaždé jinak — čtenář, který ho jednou pochopil, se v každé další obrazovce už jen rozhlíží po obsahu."
          : "A screen has a frame: a title with one sentence under it, sections with headings, actions in their places. The frame is not assembled differently each time — a reader who has understood it once only looks for content on every next screen."}
      </p>
      <p>
        {lang === "cs"
          ? "Na jednu obrazovku patří jeden pattern. Seznam záznamů, detail záznamu, formulář — každý z nich je celá obrazovka. Dva patterny na jedné obrazovce znamenají, že ani jeden nemá dost místa."
          : "One screen takes one pattern. A list of records, a record detail, a form — each of them is a whole screen. Two patterns on one screen mean neither has enough room."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={yesNoColumns(lang)}
          rows={YES_NO}
          rowKey={(row) => row.yes.cs}
          caption={lang === "cs" ? "Ano a ne" : "Yes and no"}
          className="min-w-[34rem]"
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
                  Bez vykřičníků a bez emoji. Text v rozhraní informuje,
                  nekřičí — naléhavost nese stavová barva a místo na
                  obrazovce.
                </>,
                <>
                  Popisek akce začíná slovesem: „Smazat řádek“, ne „Koš“.
                </>,
                <>
                  Chybová hláška říká, co se stalo a co s tím — ne kód
                  výjimky.
                </>,
                <>
                  Prázdný stav říká proč je prázdno a jaký je další krok.
                </>,
              ]
            : [
                <>
                  No exclamation marks and no emoji. Interface text informs,
                  it does not shout — urgency is carried by the state colour
                  and the place on the screen.
                </>,
                <>
                  An action label starts with a verb: “Delete row”, not
                  “Bin”.
                </>,
                <>
                  An error message says what happened and what to do about
                  it — not the exception code.
                </>,
                <>
                  An empty state says why it is empty and what the next step
                  is.
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
      <p>
        {lang === "cs"
          ? "Nová komponenta nevzniká v obrazovce. Chybí-li primitivum, přidá se do kitu i se svou stránkou v téhle dokumentaci — a teprve pak se použije. Komponenta poskládaná v jedné obrazovce je ostrůvek: příště ji nikdo nenajde a napíše si vlastní."
          : "A new component is not born inside a screen. If a primitive is missing, it is added to the kit together with its page in this documentation — and only then used. A component assembled inside one screen is an island: nobody finds it next time, and writes their own."}
      </p>
    </div>
  );
}

export const UsageGuide: IngotGuidePage = {
  slug: "pravidla-pouzivani",
  title: { cs: "Pravidla používání", en: "Usage rules" },
  summary: {
    cs: "Rám obrazovky, jeden pattern na obrazovku, tabulka ano/ne a pravidla textů v rozhraní.",
    en: "The screen frame, one pattern per screen, the yes/no table and the rules for interface text.",
  },
  sections: [
    {
      id: "ram-obrazovky",
      title: { cs: "Rám obrazovky", en: "The screen frame" },
      body: {
        cs: <FrameBody lang="cs" />,
        en: <FrameBody lang="en" />,
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
      id: "udrzba",
      title: { cs: "Údržba", en: "Maintenance" },
      body: {
        cs: <Maintenance lang="cs" />,
        en: <Maintenance lang="en" />,
      },
    },
  ],
};
