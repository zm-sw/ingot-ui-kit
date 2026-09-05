/**
 * The doc web's `localStorage` keys, in one place and one scheme.
 *
 * They used to be spelled in four modules under two schemes
 * (`forgmatic.theme` next to `forgmatic.ingot-docs.lang`), and the theme
 * key was copied by hand into `public/theme-init.js`. A test now pins that
 * script to `STORAGE_KEYS.theme`.
 *
 * Reads fall back to the legacy key so a returning visitor keeps their
 * choices; writes go to the new key only.
 */
export const STORAGE_KEYS = {
  theme: "forgmatic.ingot.theme",
  accent: "forgmatic.ingot.accent",
  docsLang: "forgmatic.ingot.docs.lang",
  docsDictionary: "forgmatic.ingot.docs.dictionary",
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

/** Keys written before the scheme was unified; read-only from now on. */
export const LEGACY_STORAGE_KEYS: Record<StorageKey, string> = {
  theme: "forgmatic.theme",
  accent: "forgmatic.accent",
  docsLang: "forgmatic.ingot-docs.lang",
  docsDictionary: "forgmatic.ingot-docs.dictionary",
};

/** Stored string under `key`, falling back to the legacy key; `null` when neither exists or storage throws. */
export function readStorage(key: StorageKey): string | null {
  try {
    return (
      window.localStorage.getItem(STORAGE_KEYS[key]) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEYS[key])
    );
  } catch {
    // localStorage can throw (private mode, blocked cookies).
    return null;
  }
}

/** Write under the new key. Failure is non-fatal: the choice just does not survive a reload. */
export function writeStorage(key: StorageKey, value: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {
    // See readStorage.
  }
}
