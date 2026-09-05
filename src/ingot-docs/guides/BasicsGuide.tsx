import { useEffect, useRef, useState } from "react";

import { Card, IngotCode, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";
import { ACCENT_CHOICES, type AccentChoice } from "@/lib/accent";

/**
 * "Basics" page — the tokens everything else stands on: the colour scale,
 * the type system and the spacing grid.
 *
 * **The family demo holds no colours of its own.** Every row is wrapped in
 * an element with ``data-accent``, inside which ``var(--accent)`` and
 * friends resolve to that family — so it is drawn by the SAME table in the
 * token stylesheet that the page describes. A list of hexes written here
 * would be a second truth about what a family looks like and would drift
 * from the first at the first shade tweak.
 *
 * For the same reason the rows are generated from ``ACCENT_CHOICES``: a
 * family added to the kit appears on the page by itself, instead of
 * someone having to remember it.
 *
 * The spacing demo draws SQUARES n×n, not bars. A bar a multiple of the
 * value wide looks better, but next to the label "4px" then stands an
 * image 12px wide — a demo that lies about the number it describes.
 *
 * The doc web is a PUBLIC page. Internal prose does not belong here: no
 * tech-debt figures, guard names, issue keys or dated decisions.
 */

const ACCENT_LABELS: Record<AccentChoice, Localized<string>> = {
  blue: CHROME.accentBlue,
  emerald: CHROME.accentEmerald,
  orange: CHROME.accentOrange,
  violet: CHROME.accentViolet,
  slate: CHROME.accentSlate,
};

const TOKEN_NAMES = [
  "--accent",
  "--accent-ink",
  "--accent-bg",
  "--accent-border",
] as const;

/**
 * One colour dot. ``token`` is substituted as ``var(--…)``, so it takes the
 * value from the family currently in effect — set by ``data-accent`` on
 * the row wrapper.
 */
function TokenDot({ token }: { token: string }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 rounded-full border border-border-strong align-middle"
      style={{ background: `var(${token})` }}
    />
  );
}

/**
 * Token value read at runtime via ``getComputedStyle`` — the swatches thus
 * show WHAT the palette currently holds, not a copied list of hexes that
 * would drift with the first shade edit.
 *
 * The effect has no dependency array on purpose: a theme switch changes
 * the token value but no dependency of the component — so it is read
 * again after every render (``setState`` with the same string re-renders
 * nothing).
 */
function TokenValue({ token }: { token: string }): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  // No dependency array on purpose, see the docstring above: a theme switch
  // changes the token value but no dependency of this component.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!ref.current) return;
    setValue(getComputedStyle(ref.current).getPropertyValue(token).trim());
  });
  return (
    <span ref={ref} className="font-mono text-xs text-ink-3">
      {value || "—"}
    </span>
  );
}

interface TokenRow {
  token: string;
  note: Localized<string>;
}

function tokenColumns(lang: DocLang): readonly IngotColumn<TokenRow>[] {
  return [
    {
      key: "swatch",
      header: "",
      cell: (row) => <TokenDot token={row.token} />,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "token",
      header: "Token",
      cell: (row) => <IngotCode>{row.token}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "value",
      header: lang === "cs" ? "Hodnota" : "Value",
      cell: (row) => <TokenValue token={row.token} />,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "note",
      header: lang === "cs" ? "K čemu" : "What for",
      cell: (row) => row.note[lang],
    },
  ];
}

const NEUTRAL_TOKENS: readonly TokenRow[] = [
  {
    token: "--bg",
    note: { cs: "Plocha stránky.", en: "The page surface." },
  },
  {
    token: "--surface",
    note: { cs: "Karty, tabulky.", en: "Cards, tables." },
  },
  {
    token: "--surface-2",
    note: { cs: "Hlavičky, hover.", en: "Headers, hover." },
  },
  {
    token: "--surface-3",
    note: { cs: "Track, výplně.", en: "Tracks, fills." },
  },
  {
    token: "--border",
    note: { cs: "Výchozí linka.", en: "The default line." },
  },
  {
    token: "--border-strong",
    note: { cs: "Vstupy, aktivní.", en: "Inputs, active." },
  },
  {
    token: "--ink",
    note: { cs: "Text, primární tlačítko.", en: "Text, primary button." },
  },
  {
    token: "--ink-2",
    note: { cs: "Běžný text.", en: "Body text." },
  },
  {
    token: "--ink-3",
    note: { cs: "Sekundární.", en: "Secondary." },
  },
  {
    token: "--ink-4",
    note: { cs: "Terciární, disabled.", en: "Tertiary, disabled." },
  },
];

const ACCENT_TOKENS: readonly TokenRow[] = [
  {
    token: "--accent",
    note: { cs: "Akce, focus.", en: "Actions, focus." },
  },
  {
    token: "--accent-ink",
    note: { cs: "Hover, odkazy.", en: "Hover, links." },
  },
  {
    token: "--accent-bg",
    note: { cs: "Výběr, callout.", en: "Selection, callout." },
  },
  {
    token: "--accent-border",
    note: { cs: "Linka akcentu.", en: "The accent line." },
  },
];

const STATE_TOKENS: readonly TokenRow[] = [
  {
    token: "--ok",
    note: { cs: "Aktivní, hotovo.", en: "Active, done." },
  },
  {
    token: "--ok-bg",
    note: { cs: "Podklad.", en: "The tint underneath." },
  },
  {
    token: "--warn",
    note: { cs: "Čeká, limit.", en: "Pending, at the limit." },
  },
  {
    token: "--warn-bg",
    note: { cs: "Podklad.", en: "The tint underneath." },
  },
  {
    token: "--danger",
    note: { cs: "Chyba, stop.", en: "Error, stop." },
  },
  {
    token: "--danger-bg",
    note: { cs: "Podklad.", en: "The tint underneath." },
  },
];

const COLOUR_RULES: readonly Localized<string>[] = [
  {
    cs: "Neutrální škála nese většinu plochy — akcent i stav jsou v ní hosté.",
    en: "The neutral scale carries most of the surface — accent and state are guests in it.",
  },
  {
    cs: "V jednom pohledu se nikdy nemíchají dva akcenty.",
    en: "Two accents are never mixed in one view.",
  },
  {
    cs: "Stavové barvy jsou vyhrazené pro stav dat, ne pro dekoraci.",
    en: "State colours are reserved for the state of the data, never for decoration.",
  },
  {
    cs: "Barva nikdy nenese informaci sama — vždy spolu s textem nebo tvarem.",
    en: "Colour never carries information on its own — always alongside text or a shape.",
  },
];

function TokenSwatches({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Hodnoty ve sloupci se čtou za běhu z právě platné palety — přepnutí motivu vlevo je přepíše. Obrazovka proto vždycky sahá po jménu tokenu, nikdy po hodnotě."
          : "The values in the column are read at runtime from the palette currently in effect — switching the theme on the left rewrites them. A screen therefore always reaches for the token name, never the value."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={tokenColumns(lang)}
          rows={NEUTRAL_TOKENS}
          rowKey={(row) => row.token}
          caption={lang === "cs" ? "Neutrální tokeny" : "Neutral tokens"}
          className="min-w-[34rem]"
          testId="docs-neutral-swatches"
        />
      </div>
      <div className="overflow-x-auto">
        <IngotTable
          columns={tokenColumns(lang)}
          rows={ACCENT_TOKENS}
          rowKey={(row) => row.token}
          caption={lang === "cs" ? "Akcentové tokeny" : "Accent tokens"}
          className="min-w-[34rem]"
          testId="docs-accent-swatches"
        />
      </div>
      <div className="overflow-x-auto">
        <IngotTable
          columns={tokenColumns(lang)}
          rows={STATE_TOKENS}
          rowKey={(row) => row.token}
          caption={lang === "cs" ? "Stavové tokeny" : "State tokens"}
          className="min-w-[34rem]"
          testId="docs-state-swatches"
        />
      </div>
      <p>
        {lang === "cs"
          ? "Každý stav má i podkladovou variantu. Bez ní nejde postavit odznak se stavovým tintem: sytý token je v něm textem a plocha pod ním musí být vlastní barva, ne oslabená verze té první."
          : "Every state also has a tint variant. Without it a badge with a state tint cannot be built: the saturated token is the text in it, and the surface underneath has to be a colour of its own, not a weakened version of the first."}
      </p>
      <IngotList items={COLOUR_RULES.map((rule) => rule[lang])} />
    </div>
  );
}

interface TypeRow {
  className: string;
  step: Localized<string>;
  value: string;
  sample: Localized<string>;
}

const TYPE_SCALE: readonly TypeRow[] = [
  {
    className: "text-h1 text-ink",
    step: { cs: "Nadpis stránky", en: "Page title" },
    value: "40 / 600",
    sample: { cs: "Výrobní partneři", en: "Manufacturing partners" },
  },
  {
    className: "text-h2 text-ink",
    step: { cs: "Nadpis sekce", en: "Section heading" },
    value: "26 / 600",
    sample: { cs: "Cenové vzorce", en: "Pricing formulas" },
  },
  {
    className: "text-h3 text-ink",
    step: { cs: "Podnadpis", en: "Subheading" },
    value: "18 / 600",
    sample: { cs: "Parametry stroje", en: "Machine parameters" },
  },
  {
    className: "text-lede text-ink-2",
    step: { cs: "Perex", en: "Lede" },
    value: "17",
    sample: {
      cs: "Nastavení, které se propíše do všech nabídek.",
      en: "A setting that propagates into every quote.",
    },
  },
  {
    className: "text-body text-ink-2",
    step: { cs: "Běžný text", en: "Body text" },
    value: "14,5",
    sample: {
      cs: "Základní text v panelech a popiscích polí.",
      en: "The ordinary text in panels and field labels.",
    },
  },
  {
    className: "text-small text-ink-2",
    step: { cs: "Drobný text", en: "Small text" },
    value: "13",
    sample: {
      cs: "Sekundární informace, nápověda pod vstupem.",
      en: "Secondary information, the hint under an input.",
    },
  },
  {
    className: "text-eyebrow uppercase text-ink-3",
    step: { cs: "Popisek", en: "Eyebrow" },
    value: "11 / 500",
    sample: { cs: "Sekce · verzálky", en: "Section · uppercase" },
  },
  {
    className: "font-mono tabular-nums text-body text-ink",
    step: { cs: "Číslo", en: "Number" },
    value: "mono",
    sample: {
      cs: "128 640 Kč · S235JR · 3,0 mm · 1 380 ks",
      en: "128 640 CZK · S235JR · 3.0 mm · 1 380 pcs",
    },
  },
];

function typeColumns(lang: DocLang): readonly IngotColumn<TypeRow>[] {
  return [
    {
      key: "sample",
      header: lang === "cs" ? "Ukázka" : "Sample",
      cell: (row) => <span className={row.className}>{row.sample[lang]}</span>,
    },
    {
      key: "step",
      header: lang === "cs" ? "Stupeň" : "Step",
      cell: (row) => row.step[lang],
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "value",
      header: lang === "cs" ? "Velikost / váha" : "Size / weight",
      cell: (row) => <IngotCode>{row.value}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "class",
      header: lang === "cs" ? "Třídy" : "Classes",
      cell: (row) => <IngotCode>{row.className}</IngotCode>,
    },
  ];
}

function TypeScale({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Škála má osm stupňů a každý má jméno i pevnou hodnotu — velikost se nevybírá od oka. Ukázka vlevo je vysázená přesně těmi třídami, které řádek jmenuje."
          : "The scale has eight steps, each with a name and a fixed value — a size is never picked by eye. The sample on the left is set in exactly the classes the row names."}
      </p>
      <p>
        {lang === "cs"
          ? "Bezpatkové písmo nese řeč, mono nese fakta: čísla, kódy, rozměry a identifikátory. Tabulární číslice drží číslo pod číslem, takže se částky ve sloupci dají porovnat okem."
          : "The sans face carries speech, mono carries facts: numbers, codes, dimensions and identifiers. Tabular figures keep digit above digit, so amounts in a column can be compared by eye."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={typeColumns(lang)}
          rows={TYPE_SCALE}
          rowKey={(row) => row.className}
          caption={lang === "cs" ? "Typografická škála" : "Type scale"}
          className="min-w-[38rem]"
          testId="docs-type-scale"
        />
      </div>
    </div>
  );
}

// Spacing and radii match the kit's scale — the picture on the left draws
// exactly that value, so the number next to it cannot lie without it
// showing.
const SPACE_STEPS = [4, 8, 12, 16, 24, 32, 48] as const;

// Labels name TOKENS (r-xs…r-lg from tokens.css), not utility classes —
// the system's vocabulary is the token; the utility is just the
// implementation (CLAUDE.md). The full circle has no token on purpose: it
// is reserved for avatars and dots.
const RADIUS_STEPS = [
  { className: "rounded-sm", label: "r-xs · 4px" },
  { className: "rounded", label: "r-sm · 6px" },
  { className: "rounded-md", label: "r-md · 10px" },
  { className: "rounded-lg", label: "r-lg · 14px" },
  { className: "rounded-full", label: "999px" },
] as const;

const ELEVATIONS = [
  {
    token: "--shadow-sm",
    use: {
      cs: "Karty na pozadí a jejich hover.",
      en: "Cards on the page and their hover.",
    },
  },
  {
    token: "--shadow-md",
    use: {
      cs: "Rozbalovací menu a modální okno.",
      en: "Dropdown menus and the modal.",
    },
  },
  {
    token: "--shadow-lg",
    use: {
      cs: "Boční panel a toast.",
      en: "The side panel and toasts.",
    },
  },
] as const;

interface LayerRow {
  name: Localized<string>;
  z: string;
}

const LAYERS: readonly LayerRow[] = [
  { name: { cs: "Obsah", en: "Content" }, z: "0" },
  { name: { cs: "Přilepený toolbar", en: "Sticky toolbar" }, z: "30" },
  { name: { cs: "Hlavička", en: "Header" }, z: "40" },
  { name: { cs: "Boční panel", en: "Side panel" }, z: "80" },
  { name: { cs: "Modální okno", en: "Modal" }, z: "90" },
  { name: { cs: "Toast", en: "Toast" }, z: "100" },
];

function layerColumns(lang: DocLang): readonly IngotColumn<LayerRow>[] {
  return [
    {
      key: "name",
      header: lang === "cs" ? "Vrstva" : "Layer",
      cell: (row) => row.name[lang],
    },
    {
      key: "z",
      header: lang === "cs" ? "Hladina" : "Level",
      cell: (row) => <IngotCode>{row.z}</IngotCode>,
      align: "end",
      cellClassName: "whitespace-nowrap",
    },
  ];
}

function SpacesAndRadii({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Mezery jdou po čtyřech pixelech. Menší krok se nezavádí — dvě sousední hodnoty, které od oka nerozeznáš, nejsou dvě hodnoty. Čtverec vlevo má přesně tu velikost, kterou popisek jmenuje."
          : "Spacing runs in four-pixel steps. No smaller step exists — two adjacent values you cannot tell apart by eye are not two values. The square below is exactly the size its label names."}
      </p>
      <div className="flex flex-wrap items-end gap-4" data-testid="docs-spaces">
        {SPACE_STEPS.map((px, index) => (
          <div key={px} className="space-y-1 text-center">
            <span
              aria-hidden="true"
              className="block rounded-sm bg-accent"
              style={{ width: `${px}px`, height: `${px}px` }}
            />
            <IngotCode>{`s-${index + 1} · ${px}px`}</IngotCode>
          </div>
        ))}
      </div>
      <p>
        {lang === "cs"
          ? "Rádius roste s velikostí prvku: drobné štítky mají nejmenší, karty a rámečky největší. Plný kruh je vyhrazený pro avatary a puntíky."
          : "Radius grows with the element: small badges take the smallest, cards and frames the largest. The full circle is reserved for avatars and dots."}
      </p>
      <div className="flex flex-wrap items-end gap-4" data-testid="docs-radii">
        {RADIUS_STEPS.map((step) => (
          <div key={step.className} className="space-y-1 text-center">
            <span
              aria-hidden="true"
              className={`block h-14 w-14 border border-border-strong bg-surface-2 ${step.className}`}
            />
            <IngotCode>{`${step.className} · ${step.label}`}</IngotCode>
          </div>
        ))}
      </div>
      <p>
        {lang === "cs"
          ? "Stín říká, jak vysoko nad stránkou prvek leží. Tři stupně stačí: každý má své patro a mimo ně se nepoužívá."
          : "A shadow says how high above the page an element sits. Three steps are enough: each has its floor and is not used outside it."}
      </p>
      <div className="grid gap-4 sm:grid-cols-3" data-testid="docs-elevation">
        {ELEVATIONS.map((elevation) => (
          <Card key={elevation.token} style={{ boxShadow: `var(${elevation.token})` }}>
            <IngotCode>{elevation.token}</IngotCode>
            <p className="mt-2 text-xs text-ink-3">{elevation.use[lang]}</p>
          </Card>
        ))}
      </div>
      <p>
        {lang === "cs"
          ? "Vrstvy mají pevné hladiny, aby se překryvy nepřebíjely případ od případu. Mezera mezi bloky obsahu je 24 px."
          : "Layers sit at fixed levels so overlays do not outbid each other case by case. The gap between content blocks is 24 px."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={layerColumns(lang)}
          rows={LAYERS}
          rowKey={(row) => row.z}
          caption={lang === "cs" ? "Vrstvy" : "Layers"}
          className="min-w-[20rem]"
          testId="docs-layers"
        />
      </div>
    </div>
  );
}

interface FamilyRow {
  accent: AccentChoice;
}

function familyColumns(lang: DocLang): readonly IngotColumn<FamilyRow>[] {
  return [
    {
      key: "family",
      header: lang === "cs" ? "Rodina" : "Family",
      cell: (row) => (
        <span className="capitalize">{ACCENT_LABELS[row.accent][lang]}</span>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "value",
      header: lang === "cs" ? "Hodnota" : "Value",
      cell: (row) => <IngotCode>{row.accent}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    ...TOKEN_NAMES.map((token) => ({
      key: token,
      header: <IngotCode>{token}</IngotCode>,
      // The dot and its row carry ``data-accent`` — the colour thus comes
      // from the family, not from here.
      cell: (row: FamilyRow) => (
        <span data-accent={row.accent}>
          <TokenDot token={token} />
        </span>
      ),
      cellClassName: "whitespace-nowrap",
    })),
  ];
}

function AccentFamilies({ lang }: { lang: DocLang }): JSX.Element {
  const rows: FamilyRow[] = ACCENT_CHOICES.map((accent) => ({ accent }));
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Akcent je jedna ze čtyř barevných rolí, které si obrazovka bere přes proměnnou — nikdy jako hex. Rodin je pět a liší se jen hodnotami těch čtyř proměnných; komponenta o tom, která zrovna platí, neví."
          : "The accent is one of four colour roles a screen takes through a variable — never as a hex. There are five families and they differ only in the values of those four variables; a component never knows which one is in effect."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={familyColumns(lang)}
          rows={rows}
          rowKey={(row) => row.accent}
          caption={lang === "cs" ? "Akcentové rodiny" : "Accent families"}
          className="min-w-[34rem]"
          testId="docs-accent-families"
        />
      </div>
      <p>
        {lang === "cs"
          ? "Každá rodina má vlastní světlé i tmavé hodnoty, takže přepnutí motivu ji přepočítá samo — přepínačem vlevo si to lze vyzkoušet v obou motivech. V aplikaci se rodina volí v menu účtu a pamatuje si ji účet, ne prohlížeč. Uvnitř obchodu má přednost barva toho obchodu."
          : "Every family carries its own light and dark values, so switching the theme re-resolves it on its own — the switcher in the left column shows this in both themes. In the application the family is picked in the account menu and remembered by the account, not by the browser. Inside a shop, that shop's own colour takes precedence."}
      </p>
    </div>
  );
}

export const BasicsGuide: IngotGuidePage = {
  slug: "zaklady",
  group: "system",
  title: { cs: "Základy", en: "Basics" },
  summary: {
    cs: "Tokeny, ze kterých je postavené všechno ostatní: barevná škála, typografický systém a mřížka prostoru.",
    en: "The tokens everything else is built from: the colour scale, the type system and the grid of space.",
  },
  sections: [
    {
      id: "barevne-role",
      title: { cs: "Barevné role", en: "Colour roles" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Barva se v Ingotu nepíše hodnotou, ale rolí. Akcent má role čtyři a každá
              odpovídá na jinou otázku:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>--accent</IngotCode> — samotná barva. Akce, vyplněné
                  tlačítko, ikona, focusový obrys; je to i barva textu, takže musí být
                  čitelná na plochách.
                </>,
                <>
                  <IngotCode>--accent-ink</IngotCode> — tmavší stupeň akcentu. Hover
                  akcí a barva odkazů.
                </>,
                <>
                  <IngotCode>--accent-bg</IngotCode> — tint pod vybraným řádkem,
                  odznakem a calloutem. Nikdy ne text.
                </>,
                <>
                  <IngotCode>--accent-border</IngotCode> — linka akcentu, obrys toho
                  tintu. Dekorativní, nenese informaci sama o sobě.
                </>,
              ]}
            />
            <p>
              Obrazovka sáhne po proměnné, ne po hodnotě. Tím se rodina i motiv dají
              vyměnit bez toho, aby se do obrazovek sahalo.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              In Ingot a colour is not written as a value but as a role. The accent has
              four, and each answers a different question:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>--accent</IngotCode> — the colour itself. Actions, filled
                  buttons, icons, the focus ring; it is also a text colour, so it has to
                  stay readable on surfaces.
                </>,
                <>
                  <IngotCode>--accent-ink</IngotCode> — the darker step of the accent.
                  Hover on actions, and the colour of links.
                </>,
                <>
                  <IngotCode>--accent-bg</IngotCode> — the tint under a selected row, a
                  badge and a callout. Never text.
                </>,
                <>
                  <IngotCode>--accent-border</IngotCode> — the accent line, the outline
                  of that tint. Decorative; it carries no information on its own.
                </>,
              ]}
            />
            <p>
              A screen reaches for the variable, never the value. That is what makes
              both the family and the theme swappable without touching screens.
            </p>
          </div>
        ),
      },
    },
    {
      id: "akcentove-rodiny",
      title: { cs: "Akcentové rodiny", en: "Accent families" },
      body: {
        cs: <AccentFamilies lang="cs" />,
        en: <AccentFamilies lang="en" />,
      },
    },
    {
      id: "sw-neutral",
      title: {
        cs: "Neutrální, akcentové a stavové barvy",
        en: "Neutral, accent and state colours",
      },
      body: {
        cs: <TokenSwatches lang="cs" />,
        en: <TokenSwatches lang="en" />,
      },
    },
    {
      id: "typografie",
      title: { cs: "Typografická škála", en: "Type scale" },
      body: {
        cs: <TypeScale lang="cs" />,
        en: <TypeScale lang="en" />,
      },
    },
    {
      id: "spaces",
      title: { cs: "Prostor, rádiusy, vrstvy", en: "Space, radii, layers" },
      body: {
        cs: <SpacesAndRadii lang="cs" />,
        en: <SpacesAndRadii lang="en" />,
      },
    },
  ],
};
