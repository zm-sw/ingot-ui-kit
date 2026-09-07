/**
 * What the kit's palette and the design library's variables disagree on.
 *
 * CLAUDE.md says that when the implementation and the handoff disagree the
 * handoff wins, unless a written reason stands beside the difference. That
 * sentence has never been measured. A colour that moves on one side is
 * found on a screen, months later, by somebody who cannot tell which side
 * moved — and by then both sides look deliberate.
 *
 * This module answers one question: given the kit's export and the same
 * palette as the Figma API returns it, which variables differ? It is pure,
 * so the comparison is unit-tested against a fixture instead of being
 * discovered on a red run against a live file.
 *
 * **Matching is by variable NAME and MODE, never by collection.** The
 * collections in a design file are named by whoever built it, and holding
 * a designer to a name the build script happens to use would be a rule
 * about filing rather than about colour. The names inside them are the
 * shared vocabulary — `surface-2` on both sides — and that is what the
 * doc web's naming page asks for.
 */

/** A channel in Figma's 0–1 floats as the two hex digits CSS writes. */
const channel = (value) =>
  Math.round(Math.min(Math.max(value, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");

/**
 * Figma's `{ r, g, b, a }` as `#rrggbb`.
 *
 * The alpha is dropped when it is 1 and kept otherwise, which is what the
 * token file does too — `#ffffffff` and `#ffffff` are the same colour and
 * comparing them as strings would report a difference nobody made.
 */
export function figmaColor({ r, g, b, a = 1 }) {
  const rgb = `#${channel(r)}${channel(g)}${channel(b)}`;
  return a >= 1 ? rgb : `${rgb}${channel(a)}`;
}

/** A variable's value in one mode, as a string the kit's export would write. */
function figmaValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "object" && "r" in value) return figmaColor(value);
  // An alias points at another variable; the value a designer sees is the
  // target's, and resolving it needs the whole table, so it is reported
  // as an alias rather than guessed at.
  if (typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    return { alias: value.id };
  }
  return typeof value === "number" ? value : String(value);
}

/**
 * The API's `variables/local` payload as `name → mode → value`.
 *
 * Aliases are resolved here, where the whole table is in hand: a variable
 * that points at another one shows the value a designer sees, which is
 * what a comparison against a flat palette has to be about.
 */
export function fromFigmaApi(payload) {
  const variables = payload?.meta?.variables ?? {};
  const collections = payload?.meta?.variableCollections ?? {};

  const modeName = (collectionId, modeId) => {
    const modes = collections[collectionId]?.modes ?? [];
    return modes.find((mode) => mode.modeId === modeId)?.name ?? modeId;
  };

  const raw = new Map();
  for (const variable of Object.values(variables)) {
    const byMode = {};
    for (const [modeId, value] of Object.entries(variable.valuesByMode ?? {})) {
      byMode[modeName(variable.variableCollectionId, modeId)] = figmaValue(value);
    }
    raw.set(variable.id, { name: variable.name, values: byMode });
  }

  const resolve = (entry, mode, seen = new Set()) => {
    const value = entry.values[mode];
    if (value === null || typeof value !== "object" || !("alias" in value))
      return value;
    if (seen.has(entry.name)) return null;
    const target = raw.get(value.alias);
    if (!target) return null;
    return resolve(target, mode, new Set([...seen, entry.name]));
  };

  const out = {};
  for (const entry of raw.values()) {
    out[entry.name] = Object.fromEntries(
      Object.keys(entry.values).map((mode) => [mode, resolve(entry, mode)]),
    );
  }
  return out;
}

/** The kit's export as the same `name → mode → value` shape. */
export function fromKitExport(exported) {
  const out = {};
  for (const collection of Object.values(exported.collections ?? {})) {
    for (const [name, variable] of Object.entries(collection.variables)) {
      out[name] = { ...(out[name] ?? {}), ...variable.values };
    }
  }
  return out;
}

/** Two values are the same colour, number or string. */
function same(kit, figma) {
  if (typeof kit === "number" || typeof figma === "number") {
    return Number(kit) === Number(figma);
  }
  return String(kit).toLowerCase() === String(figma).toLowerCase();
}

/**
 * Every disagreement, in the order a reader wants them.
 *
 * A variable the design file does not have is reported once, not once per
 * mode: a designer who has not added `code-attr` yet does not need to be
 * told twice, and a list where one missing variable fills ten lines is a
 * list nobody reads to the end.
 *
 * A variable the design file has and the kit does not is reported too, and
 * it is the more interesting half: it is usually a colour somebody drew a
 * screen with before anyone named it here.
 */
export function diffVariables(kit, figma) {
  const findings = [];

  for (const [name, modes] of Object.entries(kit)) {
    if (!(name in figma)) {
      findings.push({ kind: "missing-in-figma", name });
      continue;
    }
    for (const [mode, value] of Object.entries(modes)) {
      if (!(mode in figma[name])) {
        findings.push({ kind: "missing-mode", name, mode });
        continue;
      }
      const theirs = figma[name][mode];
      if (theirs === null || !same(value, theirs)) {
        findings.push({ kind: "different", name, mode, kit: value, figma: theirs });
      }
    }
  }

  for (const name of Object.keys(figma)) {
    if (!(name in kit)) findings.push({ kind: "only-in-figma", name });
  }

  const order = ["different", "missing-mode", "missing-in-figma", "only-in-figma"];
  return findings.sort(
    (a, b) =>
      order.indexOf(a.kind) - order.indexOf(b.kind) ||
      a.name.localeCompare(b.name) ||
      (a.mode ?? "").localeCompare(b.mode ?? ""),
  );
}

/** One, two to four, five or more — Czech counts in three shapes. */
function differences(count) {
  if (count === 1) return "1 rozdíl";
  if (count < 5) return `${count} rozdíly`;
  return `${count} rozdílů`;
}

/** The findings as the comment a pull request gets. */
export function report(findings, meta = {}) {
  const head = "### Tokeny proti Figmě";
  if (findings.length === 0) {
    return `${head}\n\nPaleta kitu a proměnné v knihovně souhlasí ve všech hodnotách.`;
  }

  const lines = findings.map((finding) => {
    if (finding.kind === "different") {
      return `| \`${finding.name}\` | ${finding.mode} | \`${finding.kit}\` | \`${finding.figma}\` |`;
    }
    if (finding.kind === "missing-mode") {
      return `| \`${finding.name}\` | ${finding.mode} | \`${finding.kit ?? "—"}\` | režim chybí |`;
    }
    if (finding.kind === "missing-in-figma") {
      return `| \`${finding.name}\` | — | v kitu | v knihovně není |`;
    }
    return `| \`${finding.name}\` | — | v kitu není | v knihovně |`;
  });

  // The blank lines are the point, not padding: markdown renders a table
  // only when one stands between it and the paragraph above.
  return [
    head,
    "",
    `${differences(findings.length)} mezi paletou kitu a proměnnými v knihovně.`,
    "",
    "| Proměnná | Režim | Kit | Figma |",
    "| --- | --- | --- | --- |",
    ...lines,
    ...(meta.fileKey ? ["", `<sub>Soubor \`${meta.fileKey}\`.</sub>`] : []),
  ].join("\n");
}
