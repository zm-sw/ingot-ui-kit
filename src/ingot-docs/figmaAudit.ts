/**
 * `npm run check`, for a design file.
 *
 * Whether a frame is built from the system's tokens is checked today by a
 * person who happens to notice. The code has guards for exactly this
 * class of question; a design has nothing, so a hand-written `#3b82f6`
 * and a 10 px gap survive review, reach a screenshot, and are then
 * implemented as written because the implementation follows the design.
 *
 * These are the rules an inspector applies. They take a plain description
 * of a node — a few numbers and hex strings — rather than anything from a
 * design tool's API, which is what lets them be tested here and reused by
 * whatever calls them.
 *
 * **The contrast rule shares `tokenRoles.ts` with the doc web on
 * purpose.** A page background has no contrast requirement, a control's
 * outline has 3:1, text has 4.5:1 — and the Tokens page already computes
 * exactly that. Two implementations of one rule is how a design file and
 * a product come to disagree about what passes while both look right.
 */
import tokens from "@/ingot/tokens.json";
import { INGOT_TYPE_SCALE } from "@/ingot/tokens.generated";
import type { Localized } from "@/ingot-docs/lang";
import { ROLE_THRESHOLD, tokenRole } from "@/ingot-docs/tokenRoles";

/**
 * What an inspector reports about one node.
 *
 * `where` is the layer's name, because that is the only handle a reader
 * has for finding it again on the canvas.
 */
export interface AuditFinding {
  kind: "colour" | "spacing" | "radius" | "type" | "contrast";
  where: string;
  message: Localized<string>;
}

/**
 * A node as an inspector describes it — numbers and hex strings, nothing
 * from a design tool's own types.
 */
export interface AuditNode {
  name: string;
  /** Fill, as `#rrggbb`. */
  fill?: string;
  /** Stroke, as `#rrggbb`. */
  stroke?: string;
  /** Corner radius in px. */
  radius?: number;
  /** Gaps and paddings in px — every measurement the layout decides. */
  spacing?: readonly number[];
  /** Font size in px. */
  fontSize?: number;
  /**
   * The colour this node sits ON, for the contrast rule. Without it a
   * ratio cannot be computed at all, so the rule stays quiet rather than
   * guessing at a ground.
   */
  on?: string;
}

type Leaf = { $value?: unknown };
const isLeaf = (value: unknown): value is Leaf =>
  typeof value === "object" && value !== null && "$value" in value;

const group = (name: string): Record<string, unknown> =>
  (tokens as unknown as Record<string, Record<string, unknown>>)[name] ?? {};

/** Every colour the palette declares, by hex, with the names that hold it. */
function palette(): Map<string, string[]> {
  const byHex = new Map<string, string[]>();
  for (const theme of ["light", "dark"]) {
    for (const [name, leaf] of Object.entries(group(theme))) {
      if (!isLeaf(leaf) || typeof leaf.$value !== "string") continue;
      const hex = leaf.$value.toLowerCase();
      if (!hex.startsWith("#")) continue;
      byHex.set(hex, [...(byHex.get(hex) ?? []), name]);
    }
  }
  return byHex;
}

/** The steps a scale allows, in px. */
function scale(name: "space" | "radius"): number[] {
  return Object.values(group(name))
    .filter(isLeaf)
    .map((leaf) => Number.parseFloat(String(leaf.$value)))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
}

/**
 * The two steps a value falls between, for a message that can be acted on.
 *
 * The conjunction is a parameter rather than a word swapped afterwards:
 * translating a sentence by running `replace` over it works until the day
 * a number contains the word being replaced.
 */
function neighbours(value: number, steps: readonly number[], and: string): string {
  const below = [...steps].reverse().find((step) => step < value);
  const above = steps.find((step) => step > value);
  return [below, above].filter((step) => step !== undefined).join(and);
}

/** `#rrggbb` → relative luminance, per WCAG. Same maths as the Tokens page. */
function luminance(hex: string): number | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const channels = [0, 2, 4].map((at) => {
    const value = Number.parseInt(match[1].slice(at, at + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrast(a: string, b: string): number | null {
  const first = luminance(a);
  const second = luminance(b);
  if (first === null || second === null) return null;
  const [light, dark] = first > second ? [first, second] : [second, first];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
}

/**
 * The token a hex is, or `null`.
 *
 * The first name wins when several tokens share a value — `--ink-4` and
 * `--code-comment` are the same grey — because for this purpose they are
 * the same decision, and listing both would make a finding read like two.
 */
export function tokenFor(hex: string): string | null {
  return palette().get(hex.trim().toLowerCase())?.[0] ?? null;
}

function colourFinding(
  node: AuditNode,
  hex: string,
  what: string,
): AuditFinding | null {
  if (tokenFor(hex)) return null;
  return {
    kind: "colour",
    where: node.name,
    message: {
      cs: `${what} ${hex} není token palety. Barva napsaná do obrazovky znamená jedno ze dvou: buď existuje token, který se nenašel, nebo systému chybí rozhodnutí.`,
      en: `${what} ${hex} is not a token of the palette. A colour written into a screen means one of two things: either a token exists and was not found, or the system is missing a decision.`,
    },
  };
}

/**
 * Everything wrong with one node.
 *
 * Each rule says WHY as well as what, because a finding a reader cannot
 * act on is a finding they learn to scroll past — "10 px, the scale knows
 * 8 and 12" is a sentence somebody can do something about, and "off the
 * scale" is not.
 */
export function auditNode(node: AuditNode): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (node.fill) {
    const finding = colourFinding(node, node.fill, "Výplň");
    if (finding) findings.push(finding);
  }
  if (node.stroke) {
    const finding = colourFinding(node, node.stroke, "Linka");
    if (finding) findings.push(finding);
  }

  const spaceSteps = scale("space");
  for (const value of node.spacing ?? []) {
    // Zero is the absence of a gap, not a gap off the scale.
    if (value === 0 || spaceSteps.includes(value)) continue;
    findings.push({
      kind: "spacing",
      where: node.name,
      message: {
        cs: `Mezera ${value} px, škála zná ${neighbours(value, spaceSteps, " a ")}. Mezery jdou po čtyřech pixelech; menší krok se nezavádí, protože dvě hodnoty, které od oka nerozeznáš, nejsou dvě hodnoty.`,
        en: `A gap of ${value} px; the scale knows ${neighbours(value, spaceSteps, " and ")}. Spacing goes in fours, and a smaller step is not introduced: two values nobody can tell apart are not two values.`,
      },
    });
  }

  const radiusSteps = scale("radius");
  if (
    node.radius !== undefined &&
    node.radius !== 0 &&
    // A full circle is the avatar and the dot, and it is deliberately not
    // on the scale.
    node.radius < 999 &&
    !radiusSteps.includes(node.radius)
  ) {
    findings.push({
      kind: "radius",
      where: node.name,
      message: {
        cs: `Rádius ${node.radius} px, škála zná ${neighbours(node.radius, radiusSteps, " a ")}. Rádius roste s velikostí prvku, plný kruh je vyhrazený pro avatary a puntíky.`,
        en: `A radius of ${node.radius} px; the scale knows ${neighbours(node.radius, radiusSteps, " and ")}. Radius grows with the size of the element, and a full circle is reserved for avatars and dots.`,
      },
    });
  }

  const typeSteps = Object.entries(INGOT_TYPE_SCALE)
    .map(([step, value]) => [step, Number.parseFloat(value.fontSize)] as const)
    .filter(([, size]) => Number.isFinite(size));
  if (
    node.fontSize !== undefined &&
    !typeSteps.some(([, size]) => size === node.fontSize)
  ) {
    const known = typeSteps.map(([step, size]) => `${step} ${size}`).join(", ");
    findings.push({
      kind: "type",
      where: node.name,
      message: {
        cs: `Velikost písma ${node.fontSize} px není stupeň škály (${known}). Velikost se nevybírá od oka — každý stupeň má jméno i pevnou hodnotu.`,
        en: `A font size of ${node.fontSize} px is not a step of the scale (${known}). A size is never picked by eye: every step has a name and a fixed value.`,
      },
    });
  }

  // The role decides the threshold, and the role comes from the token's
  // name. A colour that is not a token has no role, and a ratio judged
  // against the wrong rule is worse than none: it marks a page background
  // as a near miss and lets a control's outline through.
  const name = node.fill ? tokenFor(node.fill) : null;
  if (node.fill && node.on && name !== null) {
    const role = tokenRole(name);
    const threshold = ROLE_THRESHOLD[role];
    const ratio = contrast(node.fill, node.on);
    if (threshold !== null && ratio !== null && ratio < threshold) {
      findings.push({
        kind: "contrast",
        where: node.name,
        message: {
          cs: `Kontrast ${ratio} na ${node.on}; --${name} má jako ${role === "text" ? "text" : "obrys"} projít na ${threshold}.`,
          en: `Contrast ${ratio} against ${node.on}; --${name} has to clear ${threshold} as ${role === "text" ? "text" : "an outline"}.`,
        },
      });
    }
  }

  return findings;
}

/** Every finding across a whole frame, in the order the nodes came in. */
export function auditFrame(nodes: readonly AuditNode[]): AuditFinding[] {
  return nodes.flatMap(auditNode);
}
