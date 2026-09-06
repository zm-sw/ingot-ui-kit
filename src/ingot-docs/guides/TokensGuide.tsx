import { IngotBadge, IngotCode, IngotTable, type IngotColumn } from "@/ingot";
import tokens from "@/ingot/tokens.json";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Every token, from the token file itself (KAN-857).
 *
 * The values were only ever visible one component at a time, on the page
 * of whatever happened to use them. A designer asking "what is our muted
 * ink, and does it pass on the card surface" had to open four pages and
 * add it up.
 *
 * The table is built from ``tokens.json`` — the same file the stylesheet
 * and the Tailwind preset are generated from — so it cannot describe a
 * palette the product does not have. The contrast is computed here rather
 * than written down, for the same reason: a number typed by hand is right
 * on the day it is typed.
 *
 * The doc web is a PUBLIC page: no issue keys, no repository paths, no
 * guard names in rendered text.
 */

interface TokenRow {
  name: string;
  light: string;
  dark: string;
  /** Contrast against the light theme's page background, when it is a colour. */
  onBg: number | null;
  onSurface: number | null;
}

type TokenLeaf = { $type?: string; $value?: string };

function isLeaf(value: unknown): value is TokenLeaf {
  return typeof value === "object" && value !== null && "$value" in value;
}

/** ``#rrggbb`` → relative luminance, per WCAG. */
function luminance(hex: string): number | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const channels = [0, 2, 4].map((at) => {
    const value = Number.parseInt(match[1].slice(at, at + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number | null {
  const first = luminance(a);
  const second = luminance(b);
  if (first === null || second === null) return null;
  const [light, dark] = first > second ? [first, second] : [second, first];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
}

function group(name: string): Record<string, unknown> {
  // The file is a DTCG document: a group is a map of leaves, with `$`
  // metadata mixed in beside them. TypeScript infers its literal shape from
  // the import, which is more precise than useful here — the page reads it
  // as data, and the shape it reads is checked one leaf at a time below.
  const all = tokens as unknown as Record<string, Record<string, unknown>>;
  return all[name] ?? {};
}

function rows(): TokenRow[] {
  const light = group("light");
  const dark = group("dark");
  const bg = (light.bg as TokenLeaf)?.$value ?? "#ffffff";
  const surface = (light.surface as TokenLeaf)?.$value ?? "#ffffff";

  const colours = Object.keys(light)
    .filter((key) => !key.startsWith("$"))
    .map((key): TokenRow => {
      const lightValue = isLeaf(light[key]) ? (light[key] as TokenLeaf).$value! : "";
      const darkValue = isLeaf(dark[key]) ? (dark[key] as TokenLeaf).$value! : "";
      return {
        name: `--${key}`,
        light: lightValue,
        dark: darkValue,
        onBg: contrast(lightValue, bg),
        onSurface: contrast(lightValue, surface),
      };
    });

  // The scales are one value each — no theme, no contrast — but they are
  // tokens the same way, and a page called "Tokens" that showed only the
  // colours would send the reader back to the stylesheet for the rest.
  const scales = (["space", "radius", "shadow", "font", "motion"] as const).flatMap(
    (name) =>
      Object.keys(group(name))
        .filter((key) => !key.startsWith("$"))
        .filter((key) => isLeaf(group(name)[key]))
        .map((key): TokenRow => {
          const value = (group(name)[key] as TokenLeaf).$value ?? "";
          const prefix = name === "space" ? "s" : name === "radius" ? "r" : name;
          return {
            name: `--${prefix}-${key}`,
            light: value,
            dark: value,
            onBg: null,
            onSurface: null,
          };
        }),
  );

  return [...colours, ...scales];
}

const ROWS = rows();

function Swatch({ value }: { value: string }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 shrink-0 rounded-sm border border-border align-middle"
      style={{ background: value }}
    />
  );
}

/**
 * Contrast as a verdict, not just a number.
 *
 * 4.5 is the threshold for body text and 3 for large text and interface
 * borders. A reader who has to remember which is which reads the number
 * and moves on; the badge is what makes the column answerable at a glance.
 */
function Contrast({ ratio }: { ratio: number | null }): JSX.Element {
  if (ratio === null) return <span className="text-ink-4">—</span>;
  const tone = ratio >= 4.5 ? "ok" : ratio >= 3 ? "warn" : "neutral";
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums">
      {ratio.toFixed(2)}
      <IngotBadge tone={tone}>
        {ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA+" : "—"}
      </IngotBadge>
    </span>
  );
}

const HEADERS: Localized<Record<string, string>> = {
  cs: {
    token: "Token",
    light: "Světlý",
    dark: "Tmavý",
    onBg: "Kontrast na --bg",
    onSurface: "Kontrast na --surface",
  },
  en: {
    token: "Token",
    light: "Light",
    dark: "Dark",
    onBg: "Contrast on --bg",
    onSurface: "Contrast on --surface",
  },
};

function columns(lang: DocLang): readonly IngotColumn<TokenRow>[] {
  const h = HEADERS[lang];
  return [
    {
      key: "name",
      header: h.token,
      cell: (row) => <IngotCode>{row.name}</IngotCode>,
    },
    {
      key: "light",
      header: h.light,
      cell: (row) => (
        <span className="inline-flex items-center gap-2 font-mono text-xs">
          {row.light.startsWith("#") ? <Swatch value={row.light} /> : null}
          {row.light}
        </span>
      ),
    },
    {
      key: "dark",
      header: h.dark,
      cell: (row) => (
        <span className="inline-flex items-center gap-2 font-mono text-xs">
          {row.dark.startsWith("#") ? <Swatch value={row.dark} /> : null}
          {row.dark}
        </span>
      ),
    },
    { key: "onBg", header: h.onBg, cell: (row) => <Contrast ratio={row.onBg} /> },
    {
      key: "onSurface",
      header: h.onSurface,
      cell: (row) => <Contrast ratio={row.onSurface} />,
    },
  ];
}

function Body({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Tabulka je postavená z toho samého souboru, ze kterého se generuje stylopis i preset pro Tailwind. Nemůže tedy popisovat paletu, kterou produkt nemá — a kontrast se počítá, ne opisuje: číslo napsané rukou platí jen v den, kdy bylo napsáno."
          : "The table is built from the same file the stylesheet and the Tailwind preset are generated from, so it cannot describe a palette the product does not have. The contrast is computed rather than written down: a number typed by hand is right on the day it was typed."}
      </p>
      <p>
        {cs
          ? "Kontrast se počítá proti světlému motivu. 4,5 je práh pro běžný text, 3 pro velký text a rozhraní. Tokeny inkoustu mají projít na obou plochách; tokeny linek jen na té, na které se kreslí."
          : "Contrast is measured against the light theme. 4.5 is the threshold for body text, 3 for large text and interface borders. Ink tokens should pass on both surfaces; border tokens only on the one they are drawn on."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={columns(lang)}
          rows={ROWS}
          rowKey={(row) => row.name}
          caption={cs ? "Všechny tokeny kitu" : "Every token in the kit"}
          testId="docs-tokens-table"
        />
      </div>
    </div>
  );
}

export const TokensGuide: IngotGuidePage = {
  slug: "tokeny",
  group: "system",
  title: { cs: "Tokeny", en: "Tokens" },
  summary: {
    cs: "Všechny tokeny na jednom místě — hodnota ve světlém i tmavém motivu a spočítaný kontrast.",
    en: "Every token in one place — its value in both themes and its computed contrast.",
  },
  sections: [
    {
      id: "prehled",
      title: { cs: "Přehled", en: "The table" },
      body: { cs: <Body lang="cs" />, en: <Body lang="en" /> },
    },
  ],
};
