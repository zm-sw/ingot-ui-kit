/**
 * What a colour token is FOR, and therefore which contrast rule it has to
 * meet.
 *
 * The Tokens page used to judge every colour against 4.5:1 and label
 * anything between 3 and 4.5 as "AA+". That is wrong in both directions.
 * A page background has no contrast requirement at all and was being
 * marked as a near-miss; the outline of an input has a requirement of
 * 3:1 (WCAG 1.4.11, non-text) and a value of 3.4 was being shown as if it
 * had fallen short of something.
 *
 * Worse, the mislabelling hid a real defect. The accessibility page
 * promises that an input's outline, a switch and a checkbox take
 * `--border-strong` precisely so they reach 3:1 — and in the light theme
 * that token was at 1.83:1 against white. The promise was written down,
 * the number was in the same repository, and nothing compared them.
 *
 * So each token has a role, the page shows the threshold that role
 * actually has, and a test holds it. Roles come from the name, because
 * the palette is named by role already (`-bg` is a fill, `-border` is a
 * line, everything else is ink); a token whose name does not tell the
 * truth carries an explicit exemption in `tokens.json` with the reason
 * next to it, which is a better place for an exception than a list here.
 */

/** Which rule the token has to meet. */
export type TokenRole =
  /** Text or an icon: 4.5:1 against what it sits on. */
  | "text"
  /** A line or an outline that identifies a control: 3:1. */
  | "boundary"
  /** Something other colours sit ON. It is the ground, so it has no ratio. */
  | "surface"
  /** Deliberately below any threshold — never the only carrier of meaning. */
  | "decorative";

export const ROLE_THRESHOLD: Record<TokenRole, number | null> = {
  text: 4.5,
  boundary: 3,
  surface: null,
  decorative: null,
};

/**
 * The exemptions, by token name, with the reason each one is allowed to
 * sit below its threshold.
 *
 * A list rather than a flag in `tokens.json`: the reason is prose about
 * how components use the colour, and the token file is data the Figma
 * export reads. Keeping the sentences here means the test and the page
 * quote the same one.
 */
export const DECORATIVE: Record<string, { cs: string; en: string }> = {
  "ink-5": {
    cs: "Nejsvětlejší inkoust — dělicí linky a vypnutý stav. Nikdy jako čitelný text; na to je --ink-4.",
    en: "The lightest ink — separators and a disabled state. Never readable text; that is what --ink-4 is for.",
  },
  border: {
    cs: "Obyčejná dělicí linka mezi bloky. Nic neidentifikuje — ohraničení ovládacího prvku je --border-strong.",
    en: "An ordinary separator between blocks. It identifies nothing — a control's outline is --border-strong.",
  },
  "ok-border": {
    cs: "Linka barevného odznaku. Stav vedle ní vždycky stojí slovem, takže linka je druhý kanál, ne jediný nositel významu.",
    en: "The line of a tinted badge. The state is always spelled out beside it, so the line is a second channel rather than the only carrier of meaning.",
  },
  "warn-border": {
    cs: "Totéž co --ok-border: druhý kanál vedle textu.",
    en: "Same as --ok-border: a second channel beside the text.",
  },
  "danger-border": {
    cs: "Totéž co --ok-border: druhý kanál vedle textu.",
    en: "Same as --ok-border: a second channel beside the text.",
  },
  "accent-border": {
    cs: "Totéž co --ok-border: druhý kanál vedle textu.",
    en: "Same as --ok-border: a second channel beside the text.",
  },
  "blue-accent-border": {
    cs: "Hodnota, na kterou --accent-border ukazuje ve výchozí rodině.",
    en: "The value --accent-border points at in the default family.",
  },
  "custom-border": {
    cs: "Totéž co --ok-border: druhý kanál vedle textu.",
    en: "Same as --ok-border: a second channel beside the text.",
  },
  "plan-border": {
    cs: "Totéž co --ok-border: druhý kanál vedle textu.",
    en: "Same as --ok-border: a second channel beside the text.",
  },
};

/** Names that are a ground, not something drawn on one. */
const SURFACE = /^(bg|surface|surface-\d|plan)$|-bg$/;

/**
 * Names that draw a line.
 *
 * Both spellings, because the palette has both: `--border-strong` is the
 * outline of a control, and `--ok-border` is the edge of a tinted badge.
 * Matching only the suffix let `--border-strong` through as text and made
 * the test demand 4.5 of a line — which is how a rule stated once in a
 * regular expression quietly becomes two different rules.
 */
const BOUNDARY = /^border(-|$)|-border$/;

export function tokenRole(name: string): TokenRole {
  if (name in DECORATIVE) return "decorative";
  if (SURFACE.test(name)) return "surface";
  if (BOUNDARY.test(name)) return "boundary";
  return "text";
}
