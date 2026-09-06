/**
 * Types for the release-data module.
 *
 * The scripts run under plain node, so the module stays `.mjs`; its shapes
 * live here so the unit tests can import it and `tsc` still sees them.
 */

export interface ReleaseEntry {
  tag: string;
  date: string;
  notes: string | null;
}

export interface ReleaseInput extends Partial<ReleaseEntry> {
  tag: string;
  date: string;
  pages?: readonly string[];
}

export function releasesData(input: {
  tagged: readonly ReleaseInput[];
  pending?: ReleaseInput | null;
}): { releases: ReleaseEntry[]; since: Record<string, string> };
