import type { JSX } from "react";

import {
  INGOT_ICON_NAMES,
  INGOT_OP_ICON_KEYS,
  IngotBadge,
  IngotCode,
  IngotIcon,
  IngotList,
  IngotOpIcon,
  IngotTable,
  type IngotColumn,
} from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Ikony“ — obě sady (rozhraní + výrobní operace), stupnice
 * velikostí a pravidla jejich používání (KAN-663, sady samotné KAN-649).
 *
 * 🪤 Obě mřížky se generují ze seznamů kitu — ``INGOT_ICON_NAMES``
 * a ``INGOT_OP_ICON_KEYS``. Glyf přidaný do sady se tu objeví sám.
 * Ručně psaný výčet by byl druhá pravda o tom, co sada umí, a rozešel
 * by se s první při prvním přidaném glyfu — návrh vykresluje CELOU
 * sadu operací, takže stránka, která jich ukáže šest, o sadě lže.
 *
 * 🪤 Velikosti jsou stupnice z návrhu: 13 · 14 · 15 · 20. Mřížka sady se
 * proto sází ve 20 px, ne v 18 — 18 px na stupnici není a nemá odkud
 * vzít smysl.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka: v renderovaném textu žádné klíče úkolů
 * ani interní cesty. Vysvětlení patří sem, do komentáře.
 */

/** Glyf, na kterém se ukazuje stupnice velikostí. */
const SCALE_GLYPH = "search" as const;

/** Stupnice z návrhu: velikost + kde se používá. */
const SIZES: readonly { size: number; cs: string; en: string }[] = [
  { size: 13, cs: "tlačítko sm", en: "small button" },
  { size: 14, cs: "tlačítko", en: "button" },
  { size: 15, cs: "navigace", en: "navigation" },
  { size: 20, cs: "prázdný stav", en: "empty state" },
];

function IconGrid(): JSX.Element {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      data-testid="docs-icon-grid"
    >
      {INGOT_ICON_NAMES.map((name) => (
        <span
          key={name}
          className="flex items-center gap-2 rounded border border-border bg-surface px-2 py-1.5"
        >
          <IngotIcon name={name} size={20} />
          <IngotCode>{name}</IngotCode>
        </span>
      ))}
    </div>
  );
}

function SizeScale({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Velikost není volná: každý stupeň má své místo. Mezi stupni se nesází, protože ikona o půl pixelu vedle rozhodí účaří celého řádku."
          : "Size is not a free choice: every step has its place. Nothing is set between the steps, because half a pixel off throws the whole row off its baseline."}
      </p>
      <div className="flex flex-wrap items-end gap-7 rounded-md border border-border bg-surface px-5 py-4 text-ink-2">
        {SIZES.map((step) => (
          <span key={step.size} className="flex flex-col items-center gap-2">
            <IngotIcon name={SCALE_GLYPH} size={step.size} />
            <IngotCode>
              {`${step.size} · ${lang === "cs" ? step.cs : step.en}`}
            </IngotCode>
          </span>
        ))}
      </div>
    </div>
  );
}

function OpIconGrid(): JSX.Element {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      data-testid="docs-op-icon-grid"
    >
      {INGOT_OP_ICON_KEYS.map((key) => (
        <span
          key={key}
          className="flex items-center gap-2 rounded border border-border bg-surface px-2 py-1.5"
        >
          <IngotOpIcon token={key} size={22} categoryColor="var(--ink-2)" />
          <IngotCode>{key}</IngotCode>
        </span>
      ))}
    </div>
  );
}

interface OpRow {
  token: string;
  cs: string;
  en: string;
  rate: string;
  state: { cs: string; en: string; tone: "ok" | "warn" | "neutral" };
}

/**
 * Ukázkové řádky přesně podle návrhu (Laser, Ohyb, Svařování, Prášková
 * barva). Klíče jsou skutečné tokeny z knihovny, ne vymyšlené řetězce —
 * kdyby se z knihovny ztratily, ikona se přestane kreslit a je to vidět.
 */
const OP_ROWS: readonly OpRow[] = [
  {
    token: "laser",
    cs: "Laserové řezání",
    en: "Laser cutting",
    rate: "1 250",
    state: { cs: "Aktivní", en: "Active", tone: "ok" },
  },
  {
    token: "bend",
    cs: "Ohýbání",
    en: "Bending",
    rate: "980",
    state: { cs: "Aktivní", en: "Active", tone: "ok" },
  },
  {
    token: "weld",
    cs: "Svařování",
    en: "Welding",
    rate: "1 420",
    state: { cs: "Kapacita plná", en: "At capacity", tone: "warn" },
  },
  {
    token: "powder_coat",
    cs: "Prášková barva",
    en: "Powder coating",
    rate: "640",
    state: { cs: "Kooperace", en: "Outsourced", tone: "neutral" },
  },
];

function OpRowExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const columns: readonly IngotColumn<OpRow>[] = [
    {
      key: "operation",
      header: cs ? "Operace" : "Operation",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <IngotOpIcon token={row.token} size={20} categoryColor="var(--ink-2)" />
          <strong className="font-medium text-ink">{cs ? row.cs : row.en}</strong>
        </span>
      ),
    },
    {
      key: "token",
      header: cs ? "Klíč" : "Key",
      cell: (row) => <IngotCode>{row.token}</IngotCode>,
    },
    {
      key: "rate",
      header: cs ? "Sazba" : "Rate",
      align: "end",
      cell: (row) => (cs ? `${row.rate} Kč/h` : `${row.rate} CZK/h`),
    },
    {
      key: "state",
      header: cs ? "Stav" : "Status",
      cell: (row) => (
        <IngotBadge tone={row.state.tone} dot={row.state.tone === "ok"}>
          {cs ? row.state.cs : row.state.en}
        </IngotBadge>
      ),
    },
  ];
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <IngotTable
        columns={columns}
        rows={OP_ROWS}
        rowKey={(row) => row.token}
        className="min-w-[34rem]"
        caption={
          cs
            ? "Ukázka řádku operace s ikonou"
            : "An example operation row with its icon"
        }
        testId="docs-op-icon-table"
      />
    </div>
  );
}

function OpIcons({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {cs
          ? "Druhá sada na téže kostře: technologie výroby — dělení, tváření, obrábění, spojování, povrchy, kontrola a logistika. Kreslí se u operací stroje, v konfiguraci výrobního řetězu a v přehledu kapacit. Mřížka níž je celá sada, jak ji kit zná; klíč si drží server a nepřekládá se."
          : "A second set on the same skeleton: manufacturing technologies — cutting, forming, machining, joining, finishing, inspection and logistics. It appears on machine operations, in the production chain setup and in the capacity overview. The grid below is the whole set as the kit knows it; the key is stored by the server and is never translated."}
      </p>
      <OpIconGrid />
      <p className="font-medium text-ink">
        {cs ? "Použití v řádku" : "In a row"}
      </p>
      <p>
        {cs
          ? "V tabulce stojí ikona vždy vedle názvu operace a drží barvu řádku, ne barvu kategorie."
          : "In a table the icon always stands next to the operation name and keeps the row's colour, not the category colour."}
      </p>
      <OpRowExample lang={lang} />
    </div>
  );
}

function IconRules({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Obě sady stojí na jedné kostře: čtvercový rám 24×24, tloušťka čáry 1,6 (s jmenovitými výjimkami tam, kde by se detail slil), kulaté konce i spoje. Barva se dědí přes currentColor — ikona nemá vlastní paletu a barvu i velikost jí dává místo, kde stojí."
          : "Both sets stand on one skeleton: a square 24×24 frame, a stroke width of 1.6 (with named exceptions where detail would otherwise merge), round caps and round joins. Colour is inherited through currentColor — an icon has no palette of its own, and the place where it stands gives it both colour and size."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Výchozí stav je dekorativní: ikona vedle popisku se
                  odečítači obrazovky nehlásí, aby neřekl totéž dvakrát.
                </>,
                <>
                  Ikona, která stojí sama a nese význam, dostane{" "}
                  <IngotCode>title</IngotCode> — odečítač ji pak přečte.
                </>,
                <>
                  Nový glyf se přidává do sady, ne do obrazovky. Ikona
                  nakreslená v jednom souboru je ostrůvek, který příště
                  nikdo nenajde.
                </>,
                <>
                  Operační ikona se kreslí v 18–22 px: pod 18 px se detail
                  slévá, nad 24 px působí jako ilustrace.
                </>,
                <>
                  Barevná tečka operace a ikona se nekombinují v jednom
                  řádku — buď barva, nebo tvar. Obojí říká totéž a vedle
                  sebe si protiřečí.
                </>,
                <>
                  Ikona operace nikdy nestojí bez názvu operace; výjimkou je
                  šířkově kritický řádek, kde musí nést popisek pro odečítač.
                </>,
                <>
                  Nová technologie znamená novou ikonu v sadě, nikdy emoji
                  ani obrázek.
                </>,
              ]
            : [
                <>
                  The default is decorative: an icon next to its label is
                  hidden from screen readers, so they do not say the same
                  thing twice.
                </>,
                <>
                  An icon standing alone and carrying meaning takes a{" "}
                  <IngotCode>title</IngotCode> — screen readers then announce
                  it.
                </>,
                <>
                  A new glyph goes into the set, not into a screen. An icon
                  drawn in one file is an island nobody finds next time.
                </>,
                <>
                  An operation icon is set at 18–22 px: below 18 px the
                  detail merges, above 24 px it reads as an illustration.
                </>,
                <>
                  An operation's colour dot and its icon never share a row —
                  either the colour, or the shape. Both say the same thing
                  and contradict each other side by side.
                </>,
                <>
                  An operation icon never stands without the operation name;
                  the exception is a width-critical row, where it must carry
                  a label for screen readers.
                </>,
                <>
                  A new technology means a new icon in the set, never an
                  emoji and never a picture.
                </>,
              ]
        }
      />
    </div>
  );
}

export const IconsGuide: IngotGuidePage = {
  slug: "ikony",
  group: "system",
  title: { cs: "Ikony", en: "Icons" },
  summary: {
    cs: "Dvě sady čárových ikon na jedné kostře — rozhraní a výrobní operace. Přehled glyfů, stupnice velikostí a pravidla, kdy ikonu popsat a kdy nechat dekorativní.",
    en: "Two sets of stroke icons on one skeleton — interface and manufacturing operations. The glyph overview, the size scale, and the rules for when to label an icon and when to leave it decorative.",
  },
  sections: [
    {
      id: "sada",
      title: { cs: "Sada", en: "The set" },
      body: {
        cs: <IconGrid />,
        en: <IconGrid />,
      },
    },
    {
      id: "velikosti",
      title: { cs: "Velikosti", en: "Sizes" },
      body: {
        cs: <SizeScale lang="cs" />,
        en: <SizeScale lang="en" />,
      },
    },
    {
      id: "operace",
      title: { cs: "Operace", en: "Operations" },
      body: {
        cs: <OpIcons lang="cs" />,
        en: <OpIcons lang="en" />,
      },
    },
    {
      id: "pravidla-ikon",
      title: { cs: "Pravidla", en: "Rules" },
      body: {
        cs: <IconRules lang="cs" />,
        en: <IconRules lang="en" />,
      },
    },
  ],
};
