/**
 * Types for the guard's decision module.
 *
 * The guard runs under plain node, so the module itself is `.mjs` — a
 * build step for a repo check would be a build step nobody wants to debug
 * at 3am on a red PR. Its types live here so the unit tests can import it
 * like any other module and `tsc` still sees the shapes.
 */

export interface OwedEntry {
  /** The changed kit file that owes something. */
  file: string;
  /** Why these pages, in one phrase, for the failure message. */
  reason: string;
  /** Pages that still have to move their version. */
  pages: string[];
}

export interface PagesOwedInput {
  /** Kit files that changed substantively (comments-only already dropped). */
  changedFiles: readonly string[];
  /** Every kit module by name, with its source — the import graph is read from it. */
  sources: Record<string, string>;
  /** Every doc page by primitive name, with the tokens it declares. */
  pages: Record<string, readonly string[]>;
  /** Pages whose `version:` moved in this diff. */
  bumpedPages: readonly string[];
  /** Pages added in this diff — a new primitive arrives with its own version. */
  addedPages: readonly string[];
  /** `tokens.css` before and after, for the token-level diff. */
  tokensBefore?: string;
  tokensAfter?: string;
}

export function moduleName(file: string): string;
export function localImports(source: string): string[];
export function importers(sources: Record<string, string>): Map<string, Set<string>>;
export function changedTokens(before: string, after: string): string[];
export function pagesOwed(input: PagesOwedInput): OwedEntry[];
