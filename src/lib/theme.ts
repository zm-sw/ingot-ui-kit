/**
 * Dark-mode preference plumbing (pure, framework-free).
 *
 * The user picks one of three: ``system`` (follow the OS via
 * ``prefers-color-scheme``), ``light`` or ``dark``. The choice is
 * persisted on the account (``AuthMe.ui_theme`` via ``PATCH
 * /auth/profile``) so it follows the operator across devices; this
 * module owns only the fast **localStorage mirror** that the
 * ``index.html`` anti-flash script and the first React render read
 * before ``/auth/me`` resolves.
 *
 * Scope: the ``.dark`` class is applied to <html> by the admin/operator
 * shell only (see ``ThemeProvider`` + ``AdminLayout``). The marketing
 * site and the customer storefront never carry it and stay light.
 */
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

/** The key `public/theme-init.js` reads before first paint — a test pins the two together. */
export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

const CHOICES: readonly ThemeChoice[] = ["system", "light", "dark"];

function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === "string" && (CHOICES as readonly string[]).includes(value);
}

export function readStoredTheme(): ThemeChoice {
  const raw = readStorage("theme");
  return isThemeChoice(raw) ? raw : "system";
}

export function writeStoredTheme(choice: ThemeChoice): void {
  writeStorage("theme", choice);
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
