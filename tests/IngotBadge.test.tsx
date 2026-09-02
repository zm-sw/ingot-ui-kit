/**
 * `IngotBadge` (KAN-652).
 *
 * 🚨 **Kontrast se tu MĚŘÍ, netvrdí.** Test na `toHaveClass("text-ok")` by
 * prošel i nad tónem, který na svém pozadí není vidět — jméno třídy o
 * kontrastu neříká nic. Proto se z vykresleného štítku vezmou třídy, které
 * komponenta doopravdy vydala, přeloží se na tokeny a poměr se spočítá nad
 * hodnotami z `globals.css`, a to v OBOU motivech: token má dvě hodnoty a
 * změřit jen jednu znamená změřit půlku.
 *
 * Zbytek je to, co se u štítku dá pokazit potichu:
 *
 * 1. **Každý tón vydá jiné pozadí i text.** Kdyby dva tóny spadly na tutéž
 *    dvojici, štítek by dvě různá sdělení kreslil stejně.
 * 2. 🎨 **Tón nejde přepsat zvenčí.** `Pill` bere `className`, a jeho
 *    `bg-…` s tónem prohrává — volající si myslí, že barvu přepsal, a ona
 *    zůstane. Tady ta vlastnost neexistuje, což musí platit i po refaktoru.
 * 3. **`dot` je dekorace.** Odečítač ho nesmí přečíst.
 */

import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { IngotBadge, type IngotBadgeTone } from "@/ingot";

const TONES: readonly IngotBadgeTone[] = [
  "neutral",
  "ok",
  "warn",
  "danger",
  "accent",
  "ink",
];

const GLOBALS = readFileSync(
  path.resolve(__dirname, "../src/ingot/tokens.css"),
  "utf-8",
);

/**
 * Hodnoty tokenů z jednoho `:root` bloku `globals.css`.
 *
 * 🪤 Token nemusí nést hex přímo. Výchozí akcentová rodina drží hodnoty
 * ve `--blue-*` a `--accent-*` je jen odkazuje, aby je nemusel opisovat
 * blok `[data-accent="blue"]` — jinak by existovaly dvě definice téže
 * modré. Alias se proto dohledá; měří se pořád skutečná barva.
 */
function tokens(selector: string): Record<string, string> {
  const start = GLOBALS.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`globals.css nemá blok ${selector}`);
  const body = GLOBALS.slice(start, GLOBALS.indexOf("\n}", start));
  const found: Record<string, string> = {};
  const aliases: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(
    /(--[\w-]+):\s*(#[0-9a-fA-F]{3,8}|var\(\s*--[\w-]+\s*\))\s*;/g,
  )) {
    const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (alias) aliases[name] = alias[1];
    else found[name] = value;
  }
  for (const [name, target] of Object.entries(aliases)) {
    const resolved = found[target];
    if (resolved === undefined) {
      throw new Error(`${selector}: ${name} odkazuje na ${target}, který blok nemá`);
    }
    found[name] = resolved;
  }
  return found;
}

const THEMES = {
  light: tokens(":root"),
  dark: tokens(":root.dark"),
};

function relativeLuminance(hex: string): number {
  const full =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const channels = [1, 3, 5].map((at) => {
    const srgb = parseInt(full.slice(at, at + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return (
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * `bg-ok-bg` → `--ok-bg`, `text-ink-2` → `--ink-2`.
 *
 * 🪤 `text-` nese i velikost (`text-[11px]`). Hranaté hodnoty proto ven —
 * bez toho helper vrátil `--[11px]` a měřil velikost místo barvy.
 */
function tokenOf(className: string, prefix: string): string {
  const hits = className
    .split(" ")
    .filter((name) => name.startsWith(`${prefix}-`))
    .map((name) => name.slice(prefix.length + 1))
    .filter((rest) => /^[a-z]+(-[a-z0-9]+)*$/.test(rest));
  if (hits.length !== 1) {
    throw new Error(
      `štítek má vydat právě jednu tokenovou třídu '${prefix}-*', vydal `
        + `${hits.length}: ${className}`,
    );
  }
  return `--${hits[0]}`;
}

/** Dvojice pozadí/text, kterou komponenta pro daný tón doopravdy vydala. */
function painted(tone: IngotBadgeTone): { bg: string; text: string } {
  const { unmount } = render(
    <IngotBadge tone={tone} testId="badge">
      Ve výrobě
    </IngotBadge>,
  );
  const className = screen.getByTestId("badge").className;
  unmount();
  return { bg: tokenOf(className, "bg"), text: tokenOf(className, "text") };
}

describe("IngotBadge", () => {
  it.each(TONES)("tón %s unese 4,5:1 ve světlém i tmavém motivu", (tone) => {
    const { bg, text } = painted(tone);

    for (const [theme, values] of Object.entries(THEMES)) {
      const background = values[bg];
      const foreground = values[text];
      expect(
        background,
        `${theme}: globals.css nedeklaruje ${bg}`,
      ).toBeDefined();
      expect(
        foreground,
        `${theme}: globals.css nedeklaruje ${text}`,
      ).toBeDefined();
      expect(
        contrast(background, foreground),
        `tón ${tone} v motivu ${theme} (${text} na ${bg})`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("nekreslí dva tóny stejně", () => {
    const pairs = TONES.map((tone) => {
      const { bg, text } = painted(tone);
      return `${bg}/${text}`;
    });
    expect(new Set(pairs).size).toBe(TONES.length);
  });

  it("bez tónu je neutrální", () => {
    render(
      <>
        <IngotBadge testId="implicit">Koncept</IngotBadge>
        <IngotBadge tone="neutral" testId="explicit">
          Koncept
        </IngotBadge>
      </>,
    );
    expect(screen.getByTestId("implicit").className).toBe(
      screen.getByTestId("explicit").className,
    );
  });

  it("nese význam textem, ne barvou", () => {
    render(
      <IngotBadge tone="danger" testId="badge">
        Zamítnuto
      </IngotBadge>,
    );
    expect(screen.getByTestId("badge")).toHaveTextContent("Zamítnuto");
  });

  it("verzálky dělá CSS, ne přepsaný řetězec", () => {
    render(<IngotBadge testId="badge">Ve výrobě</IngotBadge>);
    const badge = screen.getByTestId("badge");
    // Kdyby to dělal `toUpperCase()`, přišel by o to překlad i všude, kde se
    // ten řetězec použije znovu.
    expect(badge.textContent).toBe("Ve výrobě");
    expect(badge.className).toContain("uppercase");
  });

  it("tečku živého stavu odečítač nečte a bez dot tam není", () => {
    const { unmount } = render(
      <IngotBadge dot testId="badge">
        Ve výrobě
      </IngotBadge>,
    );
    const dots = screen
      .getByTestId("badge")
      .querySelectorAll("[aria-hidden]");
    expect(dots).toHaveLength(1);
    unmount();

    render(<IngotBadge testId="plain">Ve výrobě</IngotBadge>);
    expect(
      screen.getByTestId("plain").querySelectorAll("[aria-hidden]"),
    ).toHaveLength(0);
  });

  it("nebere className, takže tón nejde přepsat zvenčí", () => {
    // 🎨 Kdyby ho někdo doplnil, tenhle výraz začne typovat — a to je ta
    // regrese: u dnešního Pill `className="bg-…"` s tónem tiše prohrává.
    render(
      // @ts-expect-error IngotBadge className schválně nepřijímá.
      <IngotBadge className="bg-danger-bg" testId="badge">
        Ve výrobě
      </IngotBadge>,
    );
    expect(screen.getByTestId("badge").className).not.toContain("danger");
  });
});
