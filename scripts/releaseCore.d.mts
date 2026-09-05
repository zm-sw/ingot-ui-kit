/**
 * Types for the release script's decision module.
 *
 * The script runs under plain node, so the module stays `.mjs`; its shapes
 * live here so the unit tests can import it and `tsc` still sees them.
 */

export interface ReleaseChanges {
  added: string[];
  removed: string[];
  majorBumped: string[];
  changed: string[];
  kind: "major" | "minor" | "patch";
}

export function releaseChanges(input: {
  before: Map<string, string>;
  now: Map<string, string>;
  epoch?: boolean;
}): ReleaseChanges;

export function nextVersion(tag: string, kind: ReleaseChanges["kind"]): string;

export function releaseNotes(input: {
  tag: string;
  next: string;
  changes: ReleaseChanges;
  epoch?: boolean;
}): string[];
