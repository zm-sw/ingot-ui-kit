/**
 * Theme and accent, as the package ships them: ``@forgmatic/ingot/theme``.
 *
 * The kit used to own only the LIST of accent families and leave the rest —
 * remembering the reader's choice, putting the class on ``<html>`` — to
 * whoever mounted it. That reasoning holds inside one repository, where the
 * app and the kit are read together. It stops holding the moment the kit is
 * installed from a tag: every consumer then rewrites the same forty lines,
 * and the first one to spell the storage key differently gets a product
 * where the theme survives a reload on one page and not on the next.
 *
 * So the plumbing ships too. It is deliberately small and framework-free —
 * no React, no provider, no context — because a consumer's shell already
 * has its own state management and only needs the four verbs: read the
 * choice, write the choice, resolve it against the system, put it on the
 * document.
 *
 * What is still NOT here: where the choice lives permanently. In the
 * product the operator's preference belongs to their account, so it follows
 * them across devices; storage here is only the fast mirror the anti-flash
 * script (``@forgmatic/ingot/theme-init.js``) and the first render read.
 */
import { ACCENT_CHOICES, DEFAULT_ACCENT, type AccentChoice } from "./accent";
import { readStored, writeStored } from "./storage";

export { ACCENT_CHOICES, DEFAULT_ACCENT, type AccentChoice };

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

/**
 * The keys, in one place, because they are also spelled in
 * ``theme-init.js`` — which runs before any module loads and therefore
 * cannot import them. A test pins the script to these strings.
 */
export const THEME_STORAGE_KEY = "forgmatic.ingot.theme";
export const ACCENT_STORAGE_KEY = "forgmatic.ingot.accent";

/** Written before the scheme was unified; read-only from now on. */
export const LEGACY_THEME_STORAGE_KEY = "forgmatic.theme";
export const LEGACY_ACCENT_STORAGE_KEY = "forgmatic.accent";

const THEME_CHOICES: readonly ThemeChoice[] = ["system", "light", "dark"];

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === "string" && (THEME_CHOICES as readonly string[]).includes(value);
}

export function isAccentChoice(value: unknown): value is AccentChoice {
  return (
    typeof value === "string" && (ACCENT_CHOICES as readonly string[]).includes(value)
  );
}

export function readStoredTheme(): ThemeChoice {
  const raw = readStored(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY);
  return isThemeChoice(raw) ? raw : "system";
}

export function writeStoredTheme(choice: ThemeChoice): void {
  writeStored(THEME_STORAGE_KEY, choice);
}

export function readStoredAccent(): AccentChoice {
  const raw = readStored(ACCENT_STORAGE_KEY, LEGACY_ACCENT_STORAGE_KEY);
  return isAccentChoice(raw) ? raw : DEFAULT_ACCENT;
}

export function writeStoredAccent(choice: AccentChoice): void {
  writeStored(ACCENT_STORAGE_KEY, choice);
}

export function systemPrefersDark(): boolean {
  try {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  } catch {
    return false;
  }
}

/** Collapse a (possibly ``system``) choice into the concrete theme to render. */
export function resolveTheme(choice: ThemeChoice, systemDark: boolean): ResolvedTheme {
  if (choice === "light" || choice === "dark") return choice;
  return systemDark ? "dark" : "light";
}

/**
 * Put ``.dark`` on ``<html>`` (or take it off).
 *
 * The state on a cold load is applied by ``theme-init.js``, which runs
 * before first paint; this is the other half — what happens when the reader
 * switches. Both halves have to agree, which is the reason they ship
 * together instead of being rewritten per consumer.
 */
export function applyTheme(choice: ThemeChoice): void {
  const dark = resolveTheme(choice, systemPrefersDark()) === "dark";
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Put the family on ``<html>``.
 *
 * ``blue`` REMOVES the attribute rather than writing ``data-accent="blue"``:
 * the default quartet lives in plain ``:root`` and has no family block of
 * its own, so "no attribute" and "blue" have to mean the same thing. Writing
 * the attribute would work too — nothing matches it — but then two spellings
 * of the default exist and the next reader has to check which one the CSS
 * agrees with.
 *
 * The attribute is the mechanism on purpose. The theme redefines the SAME
 * four variables, so a value pushed inline with ``style.setProperty`` would
 * outrank the dark block too, and the family would keep glowing in its light
 * values after a switch to dark. With the cascade doing the work, flipping
 * the theme recomputes the accent by itself.
 */
export function applyAccent(choice: AccentChoice): void {
  const root = document.documentElement;
  if (choice === DEFAULT_ACCENT) delete root.dataset.accent;
  else root.dataset.accent = choice;
}
