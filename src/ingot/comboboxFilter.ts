/**
 * Which options a typed query matches, and in what order.
 *
 * Internal module, not public API — like `placement.ts`, and for the same
 * reason: the arithmetic IS the behaviour here, so it can be measured with
 * strings and arrays instead of with a rendered field. What a reader of
 * `IngotCombobox` has to know about it is on the doc page; what a test has
 * to measure is here.
 *
 * Two decisions worth keeping:
 *
 * **Folding is applied to BOTH sides.** Folding only the query would stop a
 * name carrying diacritics from finding itself, which is the bug that looks
 * like a search engine problem and is in fact a one-sided comparison.
 *
 * **Ranked first, cut afterwards.** A long catalogue (every country, every
 * storage place in a plant) renders at most `max` rows, and cutting before
 * ranking would drop the best match whenever it sits late in `options` —
 * typing the exact name of the last country would show everything except
 * that country.
 */

/** Lower-case and strip diacritics, so an unaccented query finds an accented name. */
export function foldQuery(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * 0 = `query` starts a word in `haystack`, 1 = only mid-word, -1 = no
 * match. Both arguments are already folded.
 *
 * A word start is what a person means by "it matches": typing "rez" is
 * looking for Rez, not for every material with "rez" buried in the middle
 * of it. Mid-word hits are kept, in the last tier, because they are
 * sometimes the only hit there is.
 */
export function matchRank(haystack: string, query: string): number {
  let rank = -1;
  for (let at = haystack.indexOf(query); at !== -1; at = haystack.indexOf(query, at + 1)) {
    if (at === 0 || !WORD_CHAR.test(haystack[at - 1])) return 0;
    rank = 1;
  }
  return rank;
}

/** The searchable text of one option, folded once per option list. */
export interface FoldedOption {
  /** The visible label. */
  label: string;
  /** Secondary line and keywords — matched, ranked one tier lower. */
  rest: readonly string[];
}

export function foldOptions(
  options: readonly { label: string; secondary?: string; keywords?: readonly string[] }[],
): FoldedOption[] {
  return options.map((option) => ({
    label: foldQuery(option.label),
    rest: [option.secondary ?? "", ...(option.keywords ?? [])].map(foldQuery),
  }));
}

/**
 * The options to show for `query`, best first, at most `max` of them.
 *
 * Three tiers: a word start in the label, a word start in the secondary
 * line or a keyword, then anything mid-word. Within a tier the caller's
 * order is kept — the kit never reorders what it was handed.
 */
export function filterOptions<T>({
  options,
  folded,
  query,
  max,
}: {
  options: readonly T[];
  folded: readonly FoldedOption[];
  /** Already folded. An empty string means "everything". */
  query: string;
  max: number;
}): T[] {
  if (query.length === 0) return options.slice(0, max);
  const tiers: T[][] = [[], [], []];
  options.forEach((option, index) => {
    const labelRank = matchRank(folded[index].label, query);
    if (labelRank === 0) {
      tiers[0].push(option);
      return;
    }
    const restRank = folded[index].rest.reduce((best, hay) => {
      const rank = matchRank(hay, query);
      return rank !== -1 && (best === -1 || rank < best) ? rank : best;
    }, -1);
    if (restRank === 0) tiers[1].push(option);
    else if (labelRank === 1 || restRank === 1) tiers[2].push(option);
  });
  return tiers.flat().slice(0, max);
}
