import { useEffect, useState, type JSX } from "react";

import {
  Button,
  INGOT_ICON_NAMES,
  IngotBadge,
  IngotCode,
  IngotIcon,
  IngotList,
  IngotSkeleton,
  IngotTable,
  type IngotColumn,
} from "@/ingot";
import { INGOT_OP_ICON_KEYS } from "@/ingot/forgmatic";
import type { DocLang } from "@/ingot-docs/lang";
import { ButtonDoc } from "@/ingot-docs/pages/ButtonDoc";
import { IngotEyebrowDoc } from "@/ingot-docs/pages/IngotEyebrowDoc";
import { IngotTableDoc } from "@/ingot-docs/pages/IngotTableDoc";
import type { IngotDocMeta, IngotGuideBody, IngotPropRow } from "@/ingot-docs/types";

/**
 * "For designers" — the one page that answers the questions a design tool
 * asks of the system.
 *
 * The rest of the doc web speaks code: imports, TSX listings, props
 * tables. Everything a designer needs was in the repository and none of it
 * was addressed to them, so the four files the build now writes would have
 * been four files nobody knew about.
 *
 * What the page settles, in order: which side wins when two of them
 * disagree, what a thing is called on each side, where the files are, and
 * what the status badge means for a library rather than for a caller.
 *
 * The naming table reads three real doc pages. A hand-written example
 * would be a fifth telling of the same fact and would drift from the other
 * four; reading them means a renamed selector, a new variant or a dropped
 * one shows up here by itself.
 *
 * The doc web is a PUBLIC page: no issue keys, no repository paths, no
 * guard names in rendered text. That is what this comment is for.
 */

interface SourceRow {
  what: { cs: string; en: string };
  wins: { cs: string; en: string };
  why: { cs: string; en: string };
}

const SOURCES: readonly SourceRow[] = [
  {
    what: { cs: "Jak to vypadá", en: "How it looks" },
    wins: { cs: "Design handoff", en: "The design handoff" },
    why: {
      cs: "Rozhoduje tvar, hustota a chování. Když se implementace a handoff rozejdou, vyhrává handoff — pokud u odchylky nestojí napsaný důvod.",
      en: "It decides shape, density and behaviour. When the implementation and the handoff disagree, the handoff wins — unless a written reason stands beside the difference.",
    },
  },
  {
    what: { cs: "Jakou má co hodnotu", en: "What a value is" },
    wins: { cs: "Soubor tokenů", en: "The token file" },
    why: {
      cs: "Barvy, mezery, rádiusy, stíny, pohyb i typografická škála. Ze stejného souboru se generuje stylopis i utility — jiná hodnota než ta odsud v produktu neexistuje.",
      en: "Colours, spacing, radii, shadows, motion and the type scale. The stylesheet and the utilities are both generated from it — no other value exists in the product.",
    },
  },
  {
    what: { cs: "Co komponenta umí", en: "What a component can do" },
    wins: { cs: "Stránka komponenty", en: "The component page" },
    why: {
      cs: "Varianty, velikosti, stavy a to, co primitivum schválně neumí. Stránka renderuje skutečnou komponentu, takže nemůže slíbit něco, co kit nedělá.",
      en: "Variants, sizes, states and what a primitive deliberately cannot do. The page renders the real component, so it cannot promise something the kit does not do.",
    },
  },
];

function SourcesOfTruth({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const columns: readonly IngotColumn<SourceRow>[] = [
    {
      key: "what",
      header: cs ? "Otázka" : "Question",
      cell: (row) => (
        <strong className="font-medium text-ink">
          {cs ? row.what.cs : row.what.en}
        </strong>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "wins",
      header: cs ? "Rozhoduje" : "Decided by",
      cell: (row) => (cs ? row.wins.cs : row.wins.en),
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "why",
      header: cs ? "Proč" : "Why",
      cell: (row) => (cs ? row.why.cs : row.why.en),
      cellClassName: "max-w-xl",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-2">
        {cs
          ? "Systém má tři zdroje pravdy a každý odpovídá na jinou otázku. Když si dva odporují, rozhoduje ten, jehož otázka se ptá."
          : "The system has three sources of truth and each answers a different question. When two of them disagree, the one whose question is being asked decides."}
      </p>
      <IngotTable
        rows={SOURCES}
        columns={columns}
        rowKey={(row) => row.what.en}
        caption={cs ? "Zdroje pravdy" : "Sources of truth"}
      />
    </div>
  );
}

/**
 * Three real doc pages, imported rather than looked up in the registry.
 *
 * The registry imports every guide, so a guide that reads the registry
 * back closes a cycle: at the moment this module runs, the list is still
 * `undefined`. Importing the three pages directly is both shorter and
 * acyclic — and it is still real data, so a renamed selector shows up here
 * by itself.
 */
const NAMING_EXAMPLES: readonly IngotDocMeta[] = [
  ButtonDoc,
  IngotEyebrowDoc,
  IngotTableDoc,
];

/**
 * The property worth showing, and the values it takes.
 *
 * Only a type whose every member is quoted is a set of variants; `string`
 * and `ReactNode` are not, and a half-quoted union would promise a
 * completeness the type does not have. Of the ones that qualify the table
 * shows the one that carries meaning rather than plumbing — `variant`
 * before `tone` before `size`, and `as` last, which is a rendering
 * decision rather than a design one.
 */
/**
 * One row of the naming table: the page, and the props it declares.
 *
 * The props are loaded rather than read off the page, because a page keeps
 * its metadata and imports the rest when a reader opens it. Three imports
 * here, in a guide that is itself only loaded when opened.
 */
interface NamingRow {
  doc: IngotDocMeta;
  props: readonly IngotPropRow[];
}

function useNamingRows(): readonly NamingRow[] | null {
  const [rows, setRows] = useState<readonly NamingRow[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      NAMING_EXAMPLES.map(async (doc) => ({
        doc,
        props: (await doc.body()).default.props,
      })),
    ).then((loaded) => {
      if (!cancelled) setRows(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return rows;
}

function variantProp(
  props: readonly IngotPropRow[],
): { name: string; values: readonly string[] } | null {
  const sets = props
    .map((prop) => {
      const parts = prop.type.split("|").map((part) => part.trim());
      if (parts.length < 2 || !parts.every((part) => /^"[^"]*"$/.test(part)))
        return null;
      return { name: prop.name, values: parts.map((part) => part.slice(1, -1)) };
    })
    .filter((entry): entry is { name: string; values: string[] } => entry !== null);
  const preferred = ["variant", "tone", "density", "size"];
  for (const name of preferred) {
    const found = sets.find((entry) => entry.name === name);
    if (found) return found;
  }
  return sets[0] ?? null;
}

function Naming({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const rows = useNamingRows();
  const columns: readonly IngotColumn<NamingRow>[] = [
    {
      key: "design",
      header: cs ? "V návrhu" : "In the design",
      cell: (row) => <IngotCode>{row.doc.tag}</IngotCode>,
    },
    {
      key: "code",
      header: cs ? "V kódu" : "In code",
      cell: (row) => <IngotCode>{row.doc.name}</IngotCode>,
    },
    {
      key: "prop",
      header: cs ? "Vlastnost" : "Property",
      cell: (row) => {
        const prop = variantProp(row.props);
        return prop ? <IngotCode>{prop.name}</IngotCode> : null;
      },
    },
    {
      key: "values",
      header: cs ? "Hodnoty" : "Values",
      cell: (row) => {
        const prop = variantProp(row.props);
        if (!prop) return null;
        return (
          <span className="flex flex-wrap gap-1.5">
            {prop.values.map((value) => (
              <IngotCode key={value}>{value}</IngotCode>
            ))}
          </span>
        );
      },
      cellClassName: "max-w-md",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-2">
        {cs
          ? "V návrhu prvek stojí pod selektorem, v kódu pod jménem exportu. Vlastnost je jméno vlastnosti komponenty, hodnota je jedna z jejího výčtu. Mezi návrhem a kódem se tak nic nepřekládá — a právě proto, že se nepřekládá, se to nemůže rozejít."
          : "In a design the element goes by its selector, in code by its export name. A property is the name of the component's property, a value one member of its set. Nothing is translated between design and code — and because nothing is translated, nothing can drift."}
      </p>
      {rows === null ? (
        <IngotSkeleton
          shape="text"
          rows={3}
          label={cs ? "Načítá se tabulka" : "Loading the table"}
        />
      ) : (
        <IngotTable
          rows={rows}
          columns={columns}
          rowKey={(row) => row.doc.name}
          caption={cs ? "Jak se co jmenuje" : "What a thing is called"}
        />
      )}
      <IngotList
        items={
          cs
            ? [
                <>
                  Token se v návrhu jmenuje jako ve stylopisu —{" "}
                  <IngotCode>surface-2</IngotCode>, ne „Background / Secondary“. Sdílený
                  slovník mezi designérem a vývojářem je celý smysl systému.
                </>,
                <>
                  Akcent je jedna rodina čtyř tokenů, ne čtyři barvy. Rodiny je pět a
                  každá má vlastní světlé i tmavé hodnoty — deset kombinací, mezi
                  kterými se v návrhu přepíná stejně jako v aplikaci.
                </>,
                <>
                  Ikona nese jméno z kitu — <IngotCode>arrow-right</IngotCode>, ne
                  „šipka doprava“. Klíč operace se navíc nepřekládá vůbec: drží ho
                  server.
                </>,
              ]
            : [
                <>
                  A token is named in a design as it is in the stylesheet —{" "}
                  <IngotCode>surface-2</IngotCode>, not &quot;Background /
                  Secondary&quot;. A shared vocabulary between designer and developer is
                  the whole point of the system.
                </>,
                <>
                  The accent is one family of four tokens, not four colours. There are
                  five families and each has its own light and dark values — ten
                  combinations, switched in a design the way the application switches
                  them.
                </>,
                <>
                  An icon carries the kit&apos;s name —{" "}
                  <IngotCode>arrow-right</IngotCode>, not &quot;right arrow&quot;. An
                  operation key is not translated at all: the server holds it.
                </>,
              ]
        }
      />
    </div>
  );
}

interface FileRow {
  href: string;
  label: { cs: string; en: string };
  what: { cs: string; en: string };
}

/** Everything the build writes for a reader outside the code, in one place. */
function files(iconCount: number): readonly FileRow[] {
  return [
    {
      href: "/tokens.json",
      label: { cs: "Tokeny", en: "Tokens" },
      what: {
        cs: "Celá paleta, škály, typografie i pohyb ve standardním formátu návrhových tokenů — tentýž soubor, ze kterého se generuje stylopis.",
        en: "The whole palette, the scales, the type and the motion in the standard design-token format — the same file the stylesheet is generated from.",
      },
    },
    {
      href: "/icons/ingot-icons.zip",
      label: { cs: `Ikony (${iconCount} SVG)`, en: `Icons (${iconCount} SVG)` },
      what: {
        cs: "Obě sady jako soubory, vykreslené tou samou komponentou, kterou kreslí aplikace.",
        en: "Both sets as files, drawn by the same component the application draws with.",
      },
    },
    {
      href: "/components.json",
      label: { cs: "Komponenty", en: "Components" },
      what: {
        cs: "Seznam primitiv se selektorem, stavem, verzí, tokeny a výčty vlastností. Odpovídá na to, co primitivum umí, aniž by se otevřel kód.",
        en: "The primitives with their selector, status, version, tokens and property sets. It answers what a primitive can do without opening the code.",
      },
    },
  ];
}

function Files({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const rows = files(INGOT_ICON_NAMES.length + INGOT_OP_ICON_KEYS.length);
  const columns: readonly IngotColumn<FileRow>[] = [
    {
      key: "file",
      header: cs ? "Soubor" : "File",
      cell: (row) => (
        <Button
          as="a"
          href={row.href}
          size="sm"
          leadingIcon={<IngotIcon name="download" size={13} />}
        >
          {cs ? row.label.cs : row.label.en}
        </Button>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "what",
      header: cs ? "Co je uvnitř" : "What is inside",
      cell: (row) => (cs ? row.what.cs : row.what.en),
      cellClassName: "max-w-xl",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-2">
        {cs
          ? "Čtyři soubory, všechny psané buildem ze stejných zdrojů, ze kterých se staví produkt. Žádný z nich se nepíše rukou, takže žádný z nich nemůže popisovat kit, který neexistuje."
          : "Four files, all written by the build from the same sources the product is built from. None is written by hand, so none can describe a kit that does not exist."}
      </p>
      <IngotTable
        rows={rows}
        columns={columns}
        rowKey={(row) => row.href}
        caption={cs ? "Ke stažení" : "Files"}
      />
    </div>
  );
}

function Badges({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-2">
        {cs
          ? "Odznak vedle názvu komponenty říká vývojáři, jestli se na API smí spolehnout. Pro návrh znamená něco trochu jiného — jestli se na tu komponentu smí spolehnout obrazovka."
          : "The badge beside a component's name tells a developer whether the API can be relied on. In a design it means something slightly different — whether a screen can be built on that component yet."}
      </p>
      <IngotList
        variant="plain"
        items={
          cs
            ? [
                <>
                  <IngotBadge tone="ok">Stabilní</IngotBadge> — tvar se nemění bez
                  ohlášení. Z komponenty se smí stavět obrazovka.
                </>,
                <>
                  <IngotBadge tone="warn">Beta</IngotBadge> — tvar se ještě hledá.
                  Kreslit se z ní smí, ale počítej s tím, že se změní; obrazovka, která
                  na ní stojí, se bude překreslovat.
                </>,
                <>
                  <IngotBadge tone="danger">Zastaralé</IngotBadge> — má nástupce a v
                  ohlášené verzi zmizí. Nové obrazovky ji už nesmí použít, staré se
                  převedou dřív, než ta verze přijde.
                </>,
              ]
            : [
                <>
                  <IngotBadge tone="ok">Stable</IngotBadge> — the shape does not change
                  without notice. The component may go into a screen and be built on.
                </>,
                <>
                  <IngotBadge tone="warn">Beta</IngotBadge> — the shape is still being
                  found. Draw with it, but expect it to change; it belongs in a shared
                  library only after it is promoted.
                </>,
                <>
                  <IngotBadge tone="danger">Deprecated</IngotBadge> — it has a successor
                  and disappears in a named version. New screens may not use it; the old
                  ones are moved over before that version arrives.
                </>,
              ]
        }
      />
      <p className="text-sm text-ink-2">
        {cs
          ? "Vedle odznaku stojí verze primitiva. Soubor s komponentami nese verzi celého kitu, takže jde poznat, proti které verzi byl návrh kreslený."
          : "The primitive's version stands beside the badge. The components file carries the version of the whole kit, so a library can tell that it is behind — and behind what."}
      </p>
    </div>
  );
}

function Mismatch({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <IngotList
      items={
        cs
          ? [
              <>
                Návrh chce hodnotu, kterou paleta nemá. To není chyba návrhu ani kódu —
                systému chybí rozhodnutí. Řeší se v systému: buď se najde token, který
                už existuje, nebo se pojmenuje nový.
              </>,
              <>
                Návrh chce prvek, který kit nemá. Nové primitivum vzniká, až si o něj
                řekne konkrétní obrazovka — a pak jako jedna změna: komponenta, její
                stránka a první obrazovka, která ji doopravdy použije.
              </>,
              <>
                Komponenta v produktu vypadá jinak než v handoffu. Vyhrává handoff,
                pokud u odchylky nestojí napsaný důvod. Když stojí, patří ten důvod
                probrat, ne obejít.
              </>,
              <>
                Vlastní barva, mezera nebo rádius napsané rovnou do obrazovky znamenají
                jedno ze dvou: buď existuje token, který se nenašel, nebo systému chybí
                rozhodnutí. Obojí se řeší v systému, ne v obrazovce.
              </>,
            ]
          : [
              <>
                The design wants a value the palette does not have. That is neither the
                design&apos;s fault nor the code&apos;s — the system is missing a
                decision. It is settled in the system: either a token that already
                exists turns up, or a new one gets a name.
              </>,
              <>
                The design wants an element the kit does not have. A new primitive
                arrives when a concrete screen asks for it — and then as one change: the
                component, its page, and the first screen that really uses it.
              </>,
              <>
                A component looks different in the product than in the handoff. The
                handoff wins, unless a written reason stands beside the difference. When
                one does, that reason is worth discussing rather than working around.
              </>,
              <>
                A colour, a spacing or a radius written straight into a screen means one
                of two things: either a token exists and was not found, or the system is
                missing a decision. Both are settled in the system, not in the screen.
              </>,
            ]
      }
    />
  );
}

const body: IngotGuideBody = {
  "zdroj-pravdy": {
    cs: <SourcesOfTruth lang="cs" />,
    en: <SourcesOfTruth lang="en" />,
  },
  pojmenovani: { cs: <Naming lang="cs" />, en: <Naming lang="en" /> },
  soubory: { cs: <Files lang="cs" />, en: <Files lang="en" /> },
  "stav-a-verze": { cs: <Badges lang="cs" />, en: <Badges lang="en" /> },
  rozpor: { cs: <Mismatch lang="cs" />, en: <Mismatch lang="en" /> },
};

export default body;
