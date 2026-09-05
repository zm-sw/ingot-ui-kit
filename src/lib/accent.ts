/**
 * Accent-family preference plumbing (pure, framework-free).
 *
 * Ingot ships five accent families (KAN-648). Each is four tokens —
 * ``--accent``, ``--accent-ink``, ``--accent-bg``, ``--accent-border`` —
 * with separate light and dark values; the values themselves live in
 * ``ingot/tokens.css`` and are selected by ``data-accent`` on <html>.
 *
 * Why an attribute and not ``style.setProperty``: the theme redefines the
 * SAME four variables, so a value pushed inline at runtime would outrank
 * the dark block too, and the family would keep glowing in its light
 * values after a switch to dark. With the cascade doing the work, flipping
 * the theme recomputes the accent by itself — there is nothing to
 * recompute by hand.
 *
 * This module owns the PERSISTENCE only; which families exist is the
 * kit's answer, because the kit is where their tokens are.
 *
 * In the product the choice is persisted on the account so it follows the
 * operator across devices; this module owns only the fast localStorage
 * mirror that the first render reads. Same split as ``lib/theme.ts``.
 */

/**
 * The families themselves live in the kit (``ingot/accent.ts``), next to
 * the ``[data-accent]`` blocks in ``tokens.css`` that give them values.
 * Re-exported here so the app keeps ONE import for the whole accent
 * story — the list and the persistence that hangs off it.
 */
import { ACCENT_CHOICES, DEFAULT_ACCENT, type AccentChoice } from "@/ingot/accent";

import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

export { ACCENT_CHOICES, DEFAULT_ACCENT, type AccentChoice };

export const ACCENT_STORAGE_KEY = STORAGE_KEYS.accent;

export function isAccentChoice(value: unknown): value is AccentChoice {
  return (
    typeof value === "string" && (ACCENT_CHOICES as readonly string[]).includes(value)
  );
}

export function readStoredAccent(): AccentChoice {
  const raw = readStorage("accent");
  return isAccentChoice(raw) ? raw : DEFAULT_ACCENT;
}

export function writeStoredAccent(choice: AccentChoice): void {
  writeStorage("accent", choice);
}

/**
 * Put the family on <html>.
 *
 * ``blue`` REMOVES the attribute rather than writing ``data-accent="blue"``:
 * the default quartet lives in plain ``:root`` and has no family block of
 * its own, so "no attribute" and "blue" have to mean the same thing. Writing
 * the attribute would work too — nothing matches it — but then two spellings
 * of the default exist and the next reader has to check which one the CSS
 * agrees with.
 *
 * Shared by the app shell (``AccentProvider``) and the Ingot doc web, which
 * is its own entry point and never mounts that provider.
 */
export function applyAccent(choice: AccentChoice): void {
  const root = document.documentElement;
  if (choice === DEFAULT_ACCENT) delete root.dataset.accent;
  else root.dataset.accent = choice;
}
