/**
 * Builds everything that stands on the design tokens.
 *
 * ``src/ingot/tokens.json`` is the source. Until now the source was a
 * hand-written stylesheet, the Tailwind preset repeated every name by hand
 * next to it, and the Figma handoff was compared against both by eye — three
 * copies of one palette, drifting at three different speeds. A consumer
 * without React or Tailwind had no way to share the tokens at all.
 *
 * What this writes:
 *
 * - ``src/ingot/tokens.generated.css`` — the custom properties themselves:
 *   the two themes and the five accent families. ``tokens.css`` imports it
 *   and keeps what a generator has no business owning: the reasoning behind
 *   the values, and the one behaviour rule the package ships.
 * - ``src/ingot/tokens.generated.ts`` — the same values as data, so the
 *   Tailwind preset and the doc web read the palette instead of repeating
 *   it.
 * - ``dist/tokens.figma.json`` (with ``--figma``) — a flat map for Figma
 *   Variables, written next to the built doc web.
 *
 * Run it with ``npm run tokens``. The ``ingot-tokens-fresh`` guard runs the
 * same code in memory and fails when a generated file no longer matches the
 * JSON, so the two cannot drift apart quietly.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(
  /^\/([A-Za-z]):\//,
  "$1:/",
);
const SOURCE = join(ROOT, "src/ingot/tokens.json");

const HEADER = `/*
 * GENERATED FROM tokens.json — do not edit.
 *
 * Run \`npm run tokens\` after changing the source. The reasoning behind
 * these values lives in tokens.css, which imports this file; a generated
 * file is the wrong place for prose nobody can attach to a value.
 */`;

/** Reads the token source. Kept separate so the guard can pass its own copy. */
export function readTokens(path = SOURCE) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

const isToken = (value) =>
  value !== null && typeof value === "object" && "$value" in value;

function declarations(group, indent = "  ") {
  return Object.entries(group)
    .filter(([name, value]) => name !== "$description" && isToken(value))
    .map(([name, token]) => `${indent}--${name}: ${token.$value};`)
    .join("\n");
}

const ACCENT_ORDER = ["blue", "emerald", "orange", "violet", "slate"];

/** The stylesheet: two themes, then the five families in both of them. */
export function buildCss(tokens) {
  const shared = [
    declarations(tokens.space, "  ").replace(/--(\d)/g, "--s-$1"),
    declarations(tokens.radius, "  ").replace(/--(\w+)/g, "--r-$1"),
    Object.entries(tokens.font)
      .filter(([name]) => name !== "$description")
      .map(([name, token]) => `  --font-${name}: ${token.$value};`)
      .join("\n"),
    Object.entries(tokens.motion)
      .filter(([name]) => name !== "$description")
      .map(([name, token]) => `  --${name}: ${token.$value};`)
      .join("\n"),
  ].join("\n");

  const shadows = (theme) =>
    Object.entries(tokens.shadow[theme])
      .map(([name, token]) => `  --shadow-${name}: ${token.$value};`)
      .join("\n");

  const family = (name, theme) => {
    const selector =
      theme === "light"
        ? `:root:not(.dark)[data-accent="${name}"],\n:root:not(.dark) [data-accent="${name}"]`
        : `:root.dark[data-accent="${name}"],\n:root.dark [data-accent="${name}"]`;
    return `${selector} {\n${declarations(tokens.accent[name][theme])}\n}`;
  };

  return [
    HEADER,
    "",
    ":root {",
    "  color-scheme: light;",
    declarations(tokens.light),
    shadows("light"),
    shared,
    "}",
    "",
    ":root.dark {",
    "  color-scheme: dark;",
    declarations(tokens.dark),
    shadows("dark"),
    "}",
    "",
    ...ACCENT_ORDER.map((name) => `${family(name, "light")}\n`),
    ...ACCENT_ORDER.map((name) => `${family(name, "dark")}\n`),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
    .concat("\n");
}

/** The same values as data — what the preset and the doc web read. */
export function buildModule(tokens) {
  const names = (group) =>
    Object.keys(group).filter(
      (name) => name !== "$description" && isToken(group[name]),
    );

  const colorNames = names(tokens.light);
  const accentFamilies = ACCENT_ORDER;

  return `/*
 * GENERATED FROM tokens.json — do not edit.
 *
 * Run \`npm run tokens\` after changing the source. The Tailwind preset and
 * the doc web read the palette from here instead of repeating its names,
 * which is how the three copies used to drift apart.
 */

/** Every colour token the two themes define, by name without the -- prefix. */
export const INGOT_COLOR_TOKENS = ${JSON.stringify(colorNames, null, 2)} as const;

/** The accent families, in the order the picker shows them. */
export const INGOT_ACCENT_FAMILIES = ${JSON.stringify(accentFamilies, null, 2)} as const;

/** Light and dark values of every colour token — for the doc web's token page. */
export const INGOT_TOKEN_VALUES: Record<string, { light: string; dark?: string }> = ${JSON.stringify(
    Object.fromEntries(
      colorNames.map((name) => [
        name,
        {
          light: tokens.light[name].$value,
          ...(tokens.dark[name] === undefined
            ? {}
            : { dark: tokens.dark[name].$value }),
        },
      ]),
    ),
    null,
    2,
  )};

/** The spacing scale in px, by step. */
export const INGOT_SPACE: Record<string, string> = ${JSON.stringify(
    Object.fromEntries(
      Object.entries(tokens.space)
        .filter(([name]) => name !== "$description")
        .map(([name, token]) => [name, token.$value]),
    ),
    null,
    2,
  )};

/** The radius scale, by name. */
export const INGOT_RADIUS: Record<string, string> = ${JSON.stringify(
    Object.fromEntries(
      Object.entries(tokens.radius)
        .filter(([name]) => name !== "$description")
        .map(([name, token]) => [name, token.$value]),
    ),
    null,
    2,
  )};
`;
}

/**
 * A flat map for Figma Variables: one entry per token, both themes side by
 * side. Figma's own importers read a flat shape; the nesting that makes the
 * source readable makes the import harder.
 */
export function buildFigma(tokens) {
  const out = {};
  for (const [name, token] of Object.entries(tokens.light)) {
    if (!isToken(token)) continue;
    out[`color/${name}`] = {
      type: "color",
      light: token.$value,
      dark: tokens.dark[name]?.$value,
    };
  }
  for (const family of ACCENT_ORDER) {
    for (const [name, token] of Object.entries(tokens.accent[family].light)) {
      out[`accent/${family}/${name}`] = {
        type: "color",
        light: token.$value,
        dark: tokens.accent[family].dark[name]?.$value,
      };
    }
  }
  for (const [name, token] of Object.entries(tokens.space)) {
    if (isToken(token)) out[`space/${name}`] = { type: "number", value: token.$value };
  }
  for (const [name, token] of Object.entries(tokens.radius)) {
    if (isToken(token)) out[`radius/${name}`] = { type: "number", value: token.$value };
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const tokens = readTokens();
  writeFileSync(join(ROOT, "src/ingot/tokens.generated.css"), buildCss(tokens));
  writeFileSync(join(ROOT, "src/ingot/tokens.generated.ts"), buildModule(tokens));
  console.log("tokens: wrote tokens.generated.css and tokens.generated.ts");

  if (process.argv.includes("--figma")) {
    mkdirSync(join(ROOT, "dist"), { recursive: true });
    writeFileSync(join(ROOT, "dist/tokens.figma.json"), buildFigma(tokens));
    console.log("tokens: wrote dist/tokens.figma.json");
  }
}
