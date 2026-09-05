/**
 * Languages of the doc web.
 *
 * ## Why there is a list here when "a hard-coded list is a bug"
 *
 * These are two different questions and they are easily confused:
 *
 * 1. **Which languages does the platform offer?** That is *policy* and the
 *    owner decides it at runtime (the language registry in the admin). A
 *    hard-coded list would be a bug here, and there is none — it is read
 *    from the API, see ``platformLanguages.ts``.
 * 2. **Which languages does the doc web have content for?** That is
 *    *inventory*. The doc web is a static page: the text either is in the
 *    bundle or it is not, and no API changes that. This file answers the
 *    second question.
 *
 * Only languages that pass **both** are offered — the platform has them
 * enabled AND the doc web has text for them. A switch that switches to a
 * language without content is worse than a switch that does not offer it.
 *
 * ## The type enforces it, not an agreement
 *
 * ``Localized<T>`` is ``Record<DocLang, T>``, so adding a code to
 * ``DOC_LANGS`` means ``tsc`` refuses **every** text missing in that
 * language. A language thus cannot be promised without being written —
 * which is exactly the half that prose cannot guard.
 */

/** Languages this bundle CARRIES text for. Inventory, not policy. */
import { readStorage, writeStorage } from "@/lib/storage";

export const DOC_LANGS = ["cs", "en"] as const;

export type DocLang = (typeof DOC_LANGS)[number];

/**
 * A value that exists in every language of the doc web.
 *
 * ``Record``, not ``Partial<Record>``: a missing translation should fail
 * the typecheck, not silently fall back to another language at runtime.
 */
export type Localized<T> = Readonly<Record<DocLang, T>>;

export function isDocLang(value: unknown): value is DocLang {
  return typeof value === "string" && (DOC_LANGS as readonly string[]).includes(value);
}

/**
 * Labels for when the platform cannot be asked.
 *
 * These are not "the right" labels — the platform owns those and they
 * arrive from the API with their own naming. This is only what shows when
 * the API does not answer, so the switch does not disappear entirely.
 */
export const DOC_LANG_FALLBACK_LABELS: Localized<string> = {
  cs: "Čeština",
  en: "English",
};

/** Stored choice, or ``null`` when there is no (valid) one. */
export function readStoredLang(): DocLang | null {
  const raw = readStorage("docsLang");
  return isDocLang(raw) ? raw : null;
}

export function writeStoredLang(lang: DocLang): void {
  writeStorage("docsLang", lang);
}

/**
 * Default language: stored choice → browser language → Czech.
 *
 * ``navigator.language`` may be ``cs-CZ``; only the part before the dash
 * is taken, otherwise ``cs-CZ`` would never match ``cs``.
 */
export function initialLang(): DocLang {
  const stored = readStoredLang();
  if (stored) return stored;
  try {
    const preferred = navigator.language?.split("-")[0];
    if (isDocLang(preferred)) return preferred;
  } catch {
    // navigator may be missing (SSR, an exotic runtime).
  }
  return "cs";
}
