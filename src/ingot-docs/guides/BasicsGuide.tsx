import { useEffect, useRef, useState } from "react";

import { IngotCode, IngotList, IngotTable, type IngotColumn } from "@/ingot";
import { CHROME } from "@/ingot-docs/chrome";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";
import { ACCENT_CHOICES, type AccentChoice } from "@/lib/accent";

/**
 * Stránka „Základy“ — barevné tokeny a akcentové rodiny.
 *
 * 🪤 **Ukázka rodin si barvy nedrží.** Každý řádek je obalený prvkem
 * s ``data-accent``, uvnitř kterého ``var(--accent)`` a spol. odpovídají
 * té rodině — kreslí to tedy TÁŽ tabulka v ``styles/globals.css``, kterou
 * stránka popisuje. Seznam hexů napsaný tady by byl druhá pravda o tom,
 * jak rodina vypadá, a rozešel by se s první při prvním doladění odstínu.
 *
 * Ze stejného důvodu se řádky generují z ``ACCENT_CHOICES``: rodina
 * přidaná do kitu se na stránce objeví sama, místo aby na ni někdo musel
 * vzpomenout.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka. Nepatří sem interní próza: čísla
 * technického dluhu, jména kontrol, klíče úkolů ani rozhodnutí s daty.
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
 * Jeden puntík barvy. ``token`` se dosadí jako ``var(--…)``, takže hodnotu
 * bere z právě platné rodiny — tu určuje ``data-accent`` na obalu řádku.
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
 * Hodnota tokenu odečtená za běhu přes ``getComputedStyle`` — swatche
 * tedy ukazují TO, co paleta právě drží, ne opsaný seznam hexů, který
 * by se rozešel s první úpravou odstínu.
 *
 * Efekt schválně bez pole závislostí: přepnutí motivu hodnotu tokenu
 * změní, ale žádnou závislost komponenty ne — po každém překreslení se
 * proto odečte znovu (``setState`` se stejným řetězcem nic nepřekreslí).
 */
function TokenValue({ token }: { token: string }): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
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
    note: { cs: "Karty a vstupy.", en: "Cards and inputs." },
  },
  {
    token: "--surface-2",
    note: {
      cs: "Zvednutá plocha — hlavičky tabulek, stage ukázek.",
      en: "A raised surface — table headers, demo stages.",
    },
  },
  {
    token: "--border",
    note: { cs: "Běžný obrys.", en: "The ordinary outline." },
  },
  {
    token: "--border-strong",
    note: {
      cs: "Obrys ovládacích prvků.",
      en: "The outline of controls.",
    },
  },
  {
    token: "--ink",
    note: { cs: "Hlavní text.", en: "Primary text." },
  },
  {
    token: "--ink-2",
    note: { cs: "Běžný text odstavců.", en: "Ordinary paragraph text." },
  },
  {
    token: "--ink-3",
    note: { cs: "Popisky a doprovodný text.", en: "Labels and helper text." },
  },
];

const STATE_TOKENS: readonly TokenRow[] = [
  {
    token: "--ok",
    note: { cs: "Kladný stav — hotovo, schváleno.", en: "Positive — done, approved." },
  },
  {
    token: "--warn",
    note: { cs: "Varování — vyžaduje pozornost.", en: "Warning — needs attention." },
  },
  {
    token: "--danger",
    note: { cs: "Chyba a nevratné akce.", en: "Errors and irreversible actions." },
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
          rows={STATE_TOKENS}
          rowKey={(row) => row.token}
          caption={lang === "cs" ? "Stavové tokeny" : "State tokens"}
          className="min-w-[34rem]"
          testId="docs-state-swatches"
        />
      </div>
    </div>
  );
}

interface TypeRow {
  className: string;
  note: Localized<string>;
}

const TYPE_SCALE: readonly TypeRow[] = [
  {
    className: "text-2xl font-semibold tracking-tight text-ink",
    note: { cs: "Nadpis stránky.", en: "The page title." },
  },
  {
    className: "text-lg font-semibold text-ink",
    note: { cs: "Nadpis sekce.", en: "A section heading." },
  },
  {
    className: "text-sm text-ink-2",
    note: { cs: "Běžný text.", en: "Ordinary text." },
  },
  {
    className: "text-xs text-ink-3",
    note: { cs: "Popisky a doprovodný text.", en: "Labels and helper text." },
  },
  {
    className: "font-mono text-xs",
    note: { cs: "Kód a technické hodnoty.", en: "Code and technical values." },
  },
];

function typeColumns(lang: DocLang): readonly IngotColumn<TypeRow>[] {
  return [
    {
      key: "sample",
      header: lang === "cs" ? "Ukázka" : "Sample",
      cell: (row) => <span className={row.className}>Aa Bb Cc 123</span>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "class",
      header: lang === "cs" ? "Třídy" : "Classes",
      cell: (row) => <IngotCode>{row.className}</IngotCode>,
    },
    {
      key: "note",
      header: lang === "cs" ? "K čemu" : "What for",
      cell: (row) => row.note[lang],
    },
  ];
}

function TypeScale({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Škála má čtyři stupně a mono pro kód. Velikost se nevybírá od oka: každý stupeň má svou roli a ukázka vlevo je vysázená přesně těmi třídami, které řádek jmenuje."
          : "The scale has four steps plus mono for code. Sizes are not picked by eye: each step has a role, and the sample on the left is set in exactly the classes the row names."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={typeColumns(lang)}
          rows={TYPE_SCALE}
          rowKey={(row) => row.className}
          caption={lang === "cs" ? "Typografická škála" : "Type scale"}
          className="min-w-[34rem]"
          testId="docs-type-scale"
        />
      </div>
    </div>
  );
}

const SPACE_STEPS = [4, 8, 12, 16, 24, 32] as const;
const RADIUS_STEPS = [
  { className: "rounded-sm", px: 2 },
  { className: "rounded", px: 4 },
  { className: "rounded-md", px: 6 },
  { className: "rounded-lg", px: 8 },
] as const;

function SpacesAndRadii({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Mezery jdou po čtyřech pixelech. Menší krok se nezavádí — dvě sousední hodnoty, které od oka nerozeznáš, nejsou dvě hodnoty."
          : "Spacing runs in four-pixel steps. No smaller step exists — two adjacent values you cannot tell apart by eye are not two values."}
      </p>
      <div className="space-y-1.5" data-testid="docs-spaces">
        {SPACE_STEPS.map((px) => (
          <div key={px} className="flex items-center gap-3">
            <IngotCode>{`${px}px`}</IngotCode>
            <span
              aria-hidden="true"
              className="inline-block h-3 rounded-sm bg-accent"
              style={{ width: `${px * 3}px` }}
            />
          </div>
        ))}
      </div>
      <p>
        {lang === "cs"
          ? "Rádius roste s velikostí prvku: drobné štítky mají nejmenší, karty a rámečky největší. Kruh je vyhrazený pro avatary a puntíky."
          : "Radius grows with the element: small badges take the smallest, cards and frames the largest. The circle is reserved for avatars and dots."}
      </p>
      <div className="flex flex-wrap items-end gap-4" data-testid="docs-radii">
        {RADIUS_STEPS.map((step) => (
          <div key={step.className} className="space-y-1 text-center">
            <span
              aria-hidden="true"
              className={`block h-12 w-16 border border-border-strong bg-surface-2 ${step.className}`}
            />
            <IngotCode>{`${step.className} · ${step.px}px`}</IngotCode>
          </div>
        ))}
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
      // Puntík i jeho řádek nesou ``data-accent`` — barva tedy pochází
      // z rodiny, ne odsud.
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
  title: { cs: "Základy", en: "Basics" },
  summary: {
    cs: "Barevné role, které si obrazovky berou přes proměnné, a pět akcentových rodin, mezi kterými se přepíná.",
    en: "The colour roles screens take through variables, and the five accent families you can switch between.",
  },
  sections: [
    {
      id: "barevne-role",
      title: { cs: "Barevné role", en: "Colour roles" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Barva se v Ingotu nepíše hodnotou, ale rolí. Akcent má role
              čtyři a každá odpovídá na jinou otázku:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>--accent</IngotCode> — samotná barva. Vyplněné
                  tlačítko, ikona, aktivní stav; je to i barva textu, takže
                  musí být čitelná na plochách.
                </>,
                <>
                  <IngotCode>--accent-ink</IngotCode> — text na vlastním
                  tintu. Tmavší než akcent, aby popisek na
                  <IngotCode>--accent-bg</IngotCode> nezmizel.
                </>,
                <>
                  <IngotCode>--accent-bg</IngotCode> — tint pod odznaky a
                  zvýrazněné řádky. Nikdy ne text.
                </>,
                <>
                  <IngotCode>--accent-border</IngotCode> — obrys toho tintu.
                  Dekorativní, nenese informaci sám o sobě.
                </>,
              ]}
            />
            <p>
              Obrazovka sáhne po proměnné, ne po hodnotě. Tím se rodina i
              motiv dají vyměnit bez toho, aby se do obrazovek sahalo.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              In Ingot a colour is not written as a value but as a role. The
              accent has four, and each answers a different question:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>--accent</IngotCode> — the colour itself. Filled
                  buttons, icons, active states; it is also a text colour, so
                  it has to stay readable on surfaces.
                </>,
                <>
                  <IngotCode>--accent-ink</IngotCode> — text on the accent's
                  own tint. Darker than the accent so a label on{" "}
                  <IngotCode>--accent-bg</IngotCode> does not disappear.
                </>,
                <>
                  <IngotCode>--accent-bg</IngotCode> — the tint under badges
                  and highlighted rows. Never text.
                </>,
                <>
                  <IngotCode>--accent-border</IngotCode> — the outline of that
                  tint. Decorative; it carries no information on its own.
                </>,
              ]}
            />
            <p>
              A screen reaches for the variable, never the value. That is what
              makes both the family and the theme swappable without touching
              screens.
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
      title: { cs: "Neutrální a stavové barvy", en: "Neutral and state colours" },
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
      title: { cs: "Prostor a rádiusy", en: "Space and radii" },
      body: {
        cs: <SpacesAndRadii lang="cs" />,
        en: <SpacesAndRadii lang="en" />,
      },
    },
  ],
};
