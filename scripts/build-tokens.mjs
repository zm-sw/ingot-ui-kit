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
 * - ``dist/tokens.figma.json`` (with ``--figma``) — the palette as Figma
 *   Variables: collections and modes, written next to the built doc web.
 * - ``dist/tokens.json`` (with ``--figma``) — the source itself. It is
 *   already DTCG, and the tools that read DTCG need no converter at all.
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
    declarations(tokens.focus, "  ").replace(/--([\w-]+)/g, "--focus-$1"),
    declarations(tokens.layout, "  "),
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

/**
 * The type scale, by step. The Tailwind preset builds its \`fontSize\`
 * entries from this instead of declaring the numbers itself — which is how
 * the scale used to stay out of every export the kit writes.
 */
export const INGOT_TYPE_SCALE: Record<
  string,
  {
    fontSize: string;
    lineHeight: string;
    letterSpacing?: string;
    fontWeight?: string;
  }
> = ${JSON.stringify(
    Object.fromEntries(
      Object.entries(tokens.type)
        .filter(([name, token]) => name !== "$description" && isToken(token))
        .map(([name, token]) => [name, token.$value]),
    ),
    null,
    2,
  )};
`;
}

/**
 * Every group of ``tokens.json`` the Figma export covers.
 *
 * A list rather than "whatever the builder happens to read", because the
 * guard compares it against the source's own keys: a group added to
 * ``tokens.json`` and not to the export is a decision, and it has to be
 * made here rather than discovered by a designer who cannot find the
 * shadows.
 */
export const FIGMA_GROUPS = [
  "light",
  "dark",
  "accent",
  "space",
  "radius",
  "layout",
  "focus",
  "shadow",
  "font",
  "type",
  "motion",
];

/**
 * A CSS value as a Figma variable value.
 *
 * ``4px`` and ``1.06`` are numbers to Figma; ``-0.025em``, a font stack and
 * a cubic-bezier are not, and forcing them would lose what they say. The
 * rule is mechanical on purpose — a list of which token is which kind
 * would be a second thing to keep in step with the source.
 */
function figmaValue(value) {
  const text = String(value).trim();
  const number = /^-?\d+(?:\.\d+)?(?:px)?$/.exec(text);
  if (number) return { type: "FLOAT", value: Number.parseFloat(text) };
  return { type: "STRING", value: text };
}

/**
 * Follows ``var(--x)`` to the value it names, within one theme.
 *
 * The four accent ROLES (``--accent``, ``--accent-ink``, ``--accent-bg``,
 * ``--accent-border``) are declared as aliases of the default family, and
 * the first export wrote that alias out literally: eight entries whose
 * "colour" was the string ``var(--blue-accent)``. No importer reads that —
 * it either refuses the file or skips those entries, and skipping is the
 * worse half, because the palette then looks complete and has no accent.
 */
function resolveColor(value, table, seen = new Set()) {
  const alias = /^var\(--([\w-]+)\)$/.exec(String(value).trim());
  if (!alias) return String(value).trim();
  const name = alias[1];
  if (seen.has(name)) throw new Error(`tokens: --${name} aliases itself`);
  const target = table[name];
  if (!isToken(target)) throw new Error(`tokens: var(--${name}) names no token`);
  return resolveColor(target.$value, table, new Set([...seen, name]));
}

/** True when a colour token is an alias of another token rather than a value. */
const isAlias = (token) => /^var\(--[\w-]+\)$/.test(String(token.$value).trim());

/**
 * The palette as Figma Variables — collections and modes, not a flat map.
 *
 * The first export was one object per token with ``light`` and ``dark``
 * beside each other. That is not the shape Figma has: a variable holds one
 * value PER MODE, and a mode is a column of a collection. Flattening the
 * two themes into one entry therefore left every importer to guess, and
 * flattening the five accent families into their names lost the fact that
 * they are one axis with five positions.
 *
 * So: five collections, each with the modes it actually varies over.
 * ``accent`` is the interesting one — it varies over the family AND the
 * theme, which is two axes and one collection, so its ten modes are named
 * ``blue/light`` … ``slate/dark``. That is exactly the ten combinations the
 * doc web can switch between, and a designer picks one the same way.
 */
export function buildFigma(tokens, meta = {}) {
  const themeModes = ["light", "dark"];

  // The four roles live in the accent collection; here they would be a
  // second, frozen copy of the default family under a name that promises
  // to follow the picker.
  const themeColors = {};
  for (const [name, token] of Object.entries(tokens.light)) {
    if (!isToken(token) || isAlias(token)) continue;
    themeColors[`color/${name}`] = {
      type: "COLOR",
      values: {
        light: resolveColor(token.$value, tokens.light),
        dark: resolveColor(tokens.dark[name].$value, tokens.dark),
      },
    };
  }
  for (const name of Object.keys(tokens.shadow.light)) {
    themeColors[`effect/shadow-${name}`] = {
      type: "STRING",
      values: {
        light: tokens.shadow.light[name].$value,
        dark: tokens.shadow.dark[name].$value,
      },
    };
  }

  const accentModes = ACCENT_ORDER.flatMap((family) =>
    themeModes.map((theme) => `${family}/${theme}`),
  );
  const accentVars = {};
  for (const role of Object.keys(tokens.accent[ACCENT_ORDER[0]].light)) {
    accentVars[`color/${role}`] = {
      type: "COLOR",
      values: Object.fromEntries(
        ACCENT_ORDER.flatMap((family) =>
          themeModes.map((theme) => [
            `${family}/${theme}`,
            // The default family is itself written as aliases of the
            // ``blue-*`` tokens, so this resolves against the theme it
            // belongs to rather than assuming a literal.
            resolveColor(tokens.accent[family][theme][role].$value, tokens[theme]),
          ]),
        ),
      ),
    };
  }

  const single = (entries) =>
    Object.fromEntries(
      entries.map(([name, value]) => {
        const { type, value: resolved } = figmaValue(value);
        return [name, { type, values: { value: resolved } }];
      }),
    );

  const flat = (group, prefix) =>
    Object.entries(tokens[group])
      .filter(([name, token]) => name !== "$description" && isToken(token))
      .map(([name, token]) => [`${prefix}/${name}`, token.$value]);

  // Each step becomes four variables rather than one composite: Figma has
  // no typography variable, and a text style is assembled from exactly
  // these four numbers.
  const typeVars = [];
  for (const [step, token] of Object.entries(tokens.type)) {
    if (!isToken(token)) continue;
    for (const [property, value] of Object.entries(token.$value)) {
      typeVars.push([`type/${step}/${property}`, value]);
    }
  }

  return `${JSON.stringify(
    {
      kit: meta.kit ?? null,
      generated: meta.generated ?? null,
      collections: {
        theme: { modes: themeModes, variables: themeColors },
        accent: { modes: accentModes, variables: accentVars },
        scale: {
          modes: ["value"],
          variables: single([
            ...flat("space", "space"),
            ...flat("radius", "radius"),
            ...flat("layout", "layout"),
            ...flat("focus", "focus"),
          ]),
        },
        type: { modes: ["value"], variables: single(typeVars) },
        motion: {
          modes: ["value"],
          variables: single([...flat("font", "font"), ...flat("motion", "motion")]),
        },
      },
    },
    null,
    2,
  )}\n`;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const tokens = readTokens();
  writeFileSync(join(ROOT, "src/ingot/tokens.generated.css"), buildCss(tokens));
  writeFileSync(join(ROOT, "src/ingot/tokens.generated.ts"), buildModule(tokens));
  console.log("tokens: wrote tokens.generated.css and tokens.generated.ts");

  if (process.argv.includes("--figma")) {
    const { version } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
    const meta = { kit: version, generated: new Date().toISOString().slice(0, 10) };
    mkdirSync(join(ROOT, "dist"), { recursive: true });
    writeFileSync(join(ROOT, "dist/tokens.figma.json"), buildFigma(tokens, meta));
    // The source itself, beside the site. It is already DTCG, which
    // Tokens Studio and the design-token plugins read directly — and a
    // consumer with neither React nor Tailwind had no other way to share
    // the palette at all.
    writeFileSync(join(ROOT, "dist/tokens.json"), readFileSync(SOURCE));
    console.log("tokens: wrote dist/tokens.figma.json and dist/tokens.json");
  }
}
