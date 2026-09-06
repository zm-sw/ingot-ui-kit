/**
 * The kit's accent families — the type and the order they are offered in.
 *
 * It belongs here because the values are here too: ``tokens.css`` carries
 * for every family the quadruple ``--accent`` / ``--accent-ink`` /
 * ``--accent-bg`` / ``--accent-border`` under ``[data-accent="…"]``, in a
 * light and a dark variant. A list of families outside the kit would be a
 * second truth about how many there are — and the one not checked against
 * the CSS.
 *
 * **Only the list, no persistence.** Persisting the choice (localStorage
 * mirror, the operator's account) is the application's business, not the
 * kit's; that part stays in the app's ``lib/accent.ts``, which imports
 * this list. The kit knows which families exist; where the user remembers
 * their choice is not its concern.
 */

export type AccentChoice = "blue" | "emerald" | "orange" | "violet" | "slate";

/** The order is the order the switches draw — blue first, it is the default. */
export const ACCENT_CHOICES: readonly AccentChoice[] = [
  "blue",
  "emerald",
  "orange",
  "violet",
  "slate",
];

export const DEFAULT_ACCENT: AccentChoice = "blue";
