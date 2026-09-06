/**
 * The one way anything in the kit touches ``localStorage``.
 *
 * Storage throws more often than people expect — private windows, blocked
 * cookies, an iframe with a strict sandbox — and it throws on the READ as
 * well as on the write. Every call site that spelled its own try/catch got
 * one of the two halves wrong eventually, so there is exactly one pair of
 * functions and they never throw.
 *
 * A key may have a legacy spelling. Reads fall back to it so a returning
 * visitor keeps their choice; writes only ever use the current key, which
 * is how a legacy key eventually stops being written to at all.
 */

/** The stored string, the legacy key's value, or ``null``. Never throws. */
export function readStored(key: string, legacyKey?: string): string | null {
  try {
    const current = window.localStorage.getItem(key);
    if (current !== null) return current;
    return legacyKey === undefined ? null : window.localStorage.getItem(legacyKey);
  } catch {
    return null;
  }
}

/** Write under the current key. Failure is non-fatal: the choice just does not survive a reload. */
export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // See readStored: storage is allowed to be unavailable.
  }
}
