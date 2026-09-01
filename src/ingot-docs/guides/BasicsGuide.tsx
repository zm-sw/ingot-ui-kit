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
  ],
};
