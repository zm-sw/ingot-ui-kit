/**
 * Jazyky platformy pro doc web (KAN-627).
 *
 * Které jazyky se nabízejí, **není zabudované v bundlu** — rozhoduje o tom
 * vlastník v registru jazyků a čte se to za běhu z
 * ``GET /public/languages``. Ten endpoint je tenant-free schválně: doc web
 * nemá org ani session, takže na per-tenantní ``/public/orgs/…/branding``,
 * kde týž seznam taky jezdí, nemá jak dosáhnout.
 *
 * ## Co se stane, když API neodpoví
 *
 * Nic dramatického, a je to záměr. Doc web je statická stránka a text má
 * v bundlu; jazyk je jediné, co si potřebuje vzít zvenčí. Když se to
 * nepovede, nabídne to, co má (``DOC_LANGS``), místo aby zmizel přepínač
 * nebo se ukázala chybová hláška o něčem, co čtenáře nezajímá.
 *
 * 🪤 **Fallback NENÍ „ten správný seznam“.** Je to poslední záchrana. Kdyby
 * se z něj stal běžný stav (třeba proto, že host doc webu nikdo nepustil do
 * CORS), přepínač by tiše přestal respektovat registr jazyků a nikdo by si
 * toho nevšiml — proto ``source`` v návratové hodnotě říká, odkud data jsou,
 * a test na to sahá.
 */
import { DOC_LANGS, DOC_LANG_FALLBACK_LABELS, isDocLang, type DocLang } from "@/ingot-docs/lang";

export interface DocLanguageOption {
  code: DocLang;
  label: string;
}

export interface DocLanguages {
  options: readonly DocLanguageOption[];
  /** ``platform`` = z API, ``fallback`` = API nedosažitelné. */
  source: "platform" | "fallback";
}

interface PublicLanguage {
  code: string;
  label: string;
}

/** Co se nabídne, když se platformy nejde zeptat. */
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
 * Průnik „co platforma zapnula“ × „pro co má doc web text“.
 *
 * Pořadí i popisky určuje platforma — je to její registr. Doc web z něj
 * jen vyškrtne, co nemá čím naplnit.
 */
export async function fetchDocLanguages(
  signal?: AbortSignal,
): Promise<DocLanguages> {
  try {
    const response = await fetch(`${apiBaseUrl()}/api/v1/public/languages`, {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!response.ok) return fallbackLanguages();

    const payload = (await response.json()) as { languages?: PublicLanguage[] };
    const options: DocLanguageOption[] = [];
    for (const entry of payload.languages ?? []) {
      // Jazyk, který platforma zapnula, ale doc web pro něj nemá text, se
      // NENABÍDNE. Přepnout na prázdnou stránku je horší než ten jazyk
      // nenabídnout.
      if (isDocLang(entry.code)) {
        options.push({ code: entry.code, label: entry.label || entry.code });
      }
    }
    // Platforma může mít všechny naše jazyky vypnuté. Prázdný přepínač by
    // znamenal stránku, na které se nedá číst nic — fallback je lepší.
    if (options.length === 0) return fallbackLanguages();
    return { options, source: "platform" };
  } catch {
    return fallbackLanguages();
  }
}
