/**
 * Which languages the doc web offers.
 *
 * **The bundle is the source of truth.** ``DOC_LANGS`` names the languages
 * this build actually has text for, and the type makes that literal: a
 * language cannot be added to the list without every string being written,
 * because ``Localized<T>`` is a total record and the typecheck refuses a
 * gap. So the switch can be drawn before anything is asked of anyone.
 *
 * That inverts what this module used to do. It used to *fetch* the list,
 * which made a static documentation site depend on a platform being awake:
 * a cold start on the API host left the switch in a fallback that looked
 * exactly like a decision, and nobody could tell the difference.
 *
 * The platform is now an **enrichment**, and it can do exactly two things:
 *
 * 1. **Name a language better.** The registry's own label beats the one
 *    this bundle ships with, because the registry is where the owner
 *    writes it and this list is only a sensible default.
 * 2. **Hide one.** A language the owner switched off platform-wide should
 *    not be offered here either. Only an answer can hide something —
 *    silence hides nothing, which is the whole point.
 *
 * It cannot ADD a language. A language the bundle has no text for would
 * switch the reader to an empty page, and an empty page is worse than a
 * missing option.
 *
 * The request has a short deadline for the same reason: after it, the page
 * is not waiting for anything. Nothing about the site's behaviour depends
 * on the answer arriving.
 */
import {
  DOC_LANGS,
  DOC_LANG_FALLBACK_LABELS,
  isDocLang,
  type DocLang,
} from "@/ingot-docs/lang";

export interface DocLanguageOption {
  code: DocLang;
  label: string;
}

export interface DocLanguages {
  options: readonly DocLanguageOption[];
  /** ``platform`` = the registry answered and was applied, ``bundle`` = it did not. */
  source: "platform" | "bundle";
}

interface PublicLanguage {
  code: string;
  label: string;
}

/** How long the enrichment is worth waiting for. */
export const LANGUAGE_TIMEOUT_MS = 1500;

/** What the build itself knows — offered immediately, before anything is fetched. */
export function bundleLanguages(): DocLanguages {
  return {
    options: DOC_LANGS.map((code) => ({
      code,
      label: DOC_LANG_FALLBACK_LABELS[code],
    })),
    source: "bundle",
  };
}

function apiBaseUrl(): string {
  const meta = import.meta as ImportMeta & { env?: { VITE_API_URL?: unknown } };
  const fromEnv = meta.env?.VITE_API_URL;
  return typeof fromEnv === "string" ? fromEnv : "";
}

/**
 * The bundle's languages, relabelled and possibly narrowed by the platform.
 *
 * Never throws and never returns nothing: the worst case is the list this
 * build shipped with, which is also the case where the site behaves exactly
 * as it does with the platform up.
 */
export async function fetchDocLanguages(signal?: AbortSignal): Promise<DocLanguages> {
  const base = bundleLanguages();
  try {
    const response = await fetch(`${apiBaseUrl()}/api/v1/public/languages`, {
      headers: { Accept: "application/json" },
      signal: signal ?? AbortSignal.timeout(LANGUAGE_TIMEOUT_MS),
    });
    if (!response.ok) return base;

    const payload = (await response.json()) as { languages?: PublicLanguage[] };
    const enabled = new Map<DocLang, string>();
    for (const entry of payload.languages ?? []) {
      if (isDocLang(entry.code)) enabled.set(entry.code, entry.label || entry.code);
    }
    // The platform answered and none of our languages was in it. Taking
    // that literally would leave a page nobody can read; the build's own
    // list is the better answer, and `source` still says the platform was
    // not applied.
    if (enabled.size === 0) return base;

    return {
      options: base.options
        .filter((option) => enabled.has(option.code))
        .map((option) => ({ code: option.code, label: enabled.get(option.code)! })),
      source: "platform",
    };
  } catch {
    return base;
  }
}
