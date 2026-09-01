/**
 * Accent-family preference plumbing (pure, framework-free).
 *
 * Ingot ships five accent families (KAN-648). Each is four tokens —
 * ``--accent``, ``--accent-ink``, ``--accent-bg``, ``--accent-border`` —
 * with separate light and dark values; the values themselves live in
 * ``styles/globals.css`` and are selected by ``data-accent`` on <html>.
 *
 * Why an attribute and not ``style.setProperty``: the theme redefines the
 * SAME four variables, so a value pushed inline at runtime would outrank
 * the dark block too, and the family would keep glowing in its light
 * values after a switch to dark. With the cascade doing the work, flipping
 * the theme recomputes the accent by itself — there is nothing to
 * recompute by hand.
 *
 * The choice is persisted on the account (``AuthMe.ui_accent`` via ``PATCH
 * /auth/profile``) so it follows the operator across devices; this module
 * owns only the fast **localStorage mirror** that the ``theme-init.js``
 * anti-flash script and the first React render read before ``/auth/me``
 * resolves. Same split as ``lib/theme.ts``, deliberately.
 */

export type AccentChoice = "blue" | "emerald" | "orange" | "violet" | "slate";

/** Order is the order the switchers render in — blue first, it is the default. */
export const ACCENT_CHOICES: readonly AccentChoice[] = [
  "blue",
  "emerald",
  "orange",
  "violet",
  "slate",
];

export const DEFAULT_ACCENT: AccentChoice = "blue";

/** Kept in sync with ``theme-init.js`` (the anti-flash script) — change both together. */
export const ACCENT_STORAGE_KEY = "forgmatic.accent";

export function isAccentChoice(value: unknown): value is AccentChoice {
  return (
    typeof value === "string" &&
    (ACCENT_CHOICES as readonly string[]).includes(value)
  );
}

export function readStoredAccent(): AccentChoice {
  try {
    const raw = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    if (isAccentChoice(raw)) return raw;
  } catch {
    // localStorage can throw (Safari private mode, disabled cookies).
  }
  return DEFAULT_ACCENT;
}

export function writeStoredAccent(choice: AccentChoice): void {
  try {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, choice);
  } catch {
    // Non-fatal — the account value is the source of truth anyway.
  }
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
