/**
 * The doc web's own `localStorage` keys.
 *
 * Theme and accent are the KIT's keys now — they ship with the primitives
 * that read them (`@forgmatic/ingot/theme`), because every consumer needs
 * the same two and the first one to spell a key differently loses the
 * reader's choice on half their pages. What is left here is what only this
 * site has: the language switch and the dictionary mode.
 *
 * Reads fall back to the legacy key so a returning visitor keeps their
 * choices; writes go to the new key only.
 */
import { readStored, writeStored } from "@/ingot/storage";

export const DOCS_STORAGE_KEYS = {
  lang: "forgmatic.ingot.docs.lang",
  dictionary: "forgmatic.ingot.docs.dictionary",
} as const;

export type DocsStorageKey = keyof typeof DOCS_STORAGE_KEYS;

/** Keys written before the scheme was unified; read-only from now on. */
export const LEGACY_DOCS_STORAGE_KEYS: Record<DocsStorageKey, string> = {
  lang: "forgmatic.ingot-docs.lang",
  dictionary: "forgmatic.ingot-docs.dictionary",
};

/** Stored string under `key`, falling back to the legacy key; `null` when neither exists. */
export function readDocsStorage(key: DocsStorageKey): string | null {
  return readStored(DOCS_STORAGE_KEYS[key], LEGACY_DOCS_STORAGE_KEYS[key]);
}

export function writeDocsStorage(key: DocsStorageKey, value: string): void {
  writeStored(DOCS_STORAGE_KEYS[key], value);
}
