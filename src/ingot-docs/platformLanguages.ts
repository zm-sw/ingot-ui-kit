/**
 * Platform languages for the doc web.
 *
 * Which languages are offered is **not built into the bundle** — the owner
 * decides it in the language registry and it is read at runtime from
 * ``GET /public/languages``. That endpoint is tenant-free on purpose: the
 * doc web has no org and no session, so it has no way to reach the
 * per-tenant ``/public/orgs/…/branding`` where the same list also travels.
 *
 * ## What happens when the API does not answer
 *
 * Nothing dramatic, and that is intended. The doc web is a static page and
 * has its text in the bundle; the language is the only thing it needs to
 * take from outside. When that fails, it offers what it has
 * (``DOC_LANGS``) instead of the switch disappearing or an error message
 * showing about something the reader does not care about.
 *
 * **The fallback is NOT "the right list".** It is the last resort. If it
 * became the normal state (say because nobody let the doc web host through
 * CORS), the switch would silently stop respecting the language registry
 * and nobody would notice — hence ``source`` in the return value says where
 * the data is from, and a test reaches for it.
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
  /** ``platform`` = from the API, ``fallback`` = API unreachable. */
  source: "platform" | "fallback";
}

interface PublicLanguage {
  code: string;
  label: string;
}

/** What is offered when the platform cannot be asked. */
export function fallbackLanguages(): DocLanguages {
  return {
    options: DOC_LANGS.map((code) => ({
      code,
      label: DOC_LANG_FALLBACK_LABELS[code],
    })),
    source: "fallback",
  };
}

function apiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL;
  return typeof fromEnv === "string" ? fromEnv : "";
}

/**
 * Intersection of "what the platform enabled" × "what the doc web has text
 * for".
 *
 * Order and labels are set by the platform — it is its registry. The doc
 * web only strikes out what it has nothing to fill.
 */
export async function fetchDocLanguages(signal?: AbortSignal): Promise<DocLanguages> {
  try {
    const response = await fetch(`${apiBaseUrl()}/api/v1/public/languages`, {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!response.ok) return fallbackLanguages();

    const payload = (await response.json()) as { languages?: PublicLanguage[] };
    const options: DocLanguageOption[] = [];
    for (const entry of payload.languages ?? []) {
      // A language the platform enabled but the doc web has no text for is
      // NOT offered. Switching to an empty page is worse than not offering
      // the language.
      if (isDocLang(entry.code)) {
        options.push({ code: entry.code, label: entry.label || entry.code });
      }
    }
    // The platform may have all our languages disabled. An empty switch
    // would mean a page where nothing can be read — the fallback is better.
    if (options.length === 0) return fallbackLanguages();
    return { options, source: "platform" };
  } catch {
    return fallbackLanguages();
  }
}
