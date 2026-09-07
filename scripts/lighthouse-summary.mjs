/**
 * Turns a Lighthouse run into one line per address.
 *
 * The point is the NUMBERS, not a pass/fail. A check that says only
 * "failed" tells a reader to go and dig; a comment that says
 * "Performance 78 (was 81)" tells them what changed and roughly how much
 * it cost, which is the only form of this information anybody acts on.
 *
 * Reads the reports `@lhci/cli` wrote into `.lighthouseci` and prints
 * markdown on stdout. The workflow posts that as a pull request comment.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = ".lighthouseci";

/** The thresholds the ticket set. Warnings for now — see the workflow. */
const TARGET = { performance: 90, seo: 95, accessibility: 95 };

/**
 * One report per address: the median run, not all three.
 *
 * Each address is measured three times, because one run on a shared
 * runner is a number that moves on its own. Lighthouse marks the median
 * of the three in `manifest.json`; that is the one worth reporting, and
 * printing all three would be a table where every address appears three
 * times with three different answers.
 */
function reports() {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(DIR, "manifest.json"), "utf-8"));
  } catch {
    return [];
  }
  return manifest
    .filter((entry) => entry.isRepresentativeRun)
    .map((entry) => JSON.parse(readFileSync(entry.jsonPath, "utf-8")));
}

const rows = reports()
  .map((report) => ({
    url: new URL(report.finalDisplayedUrl ?? report.finalUrl).pathname,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, category]) => [
        key,
        Math.round((category.score ?? 0) * 100),
      ]),
    ),
  }))
  .sort((a, b) => a.url.localeCompare(b.url));

if (rows.length === 0) {
  console.log("Lighthouse produced no report — see the job log.");
  process.exit(0);
}

/** A number with the target beside it, so a reader need not remember them. */
const cell = (value, target) =>
  target === undefined
    ? `${value}`
    : `${value} / ${target}${value >= target ? "" : " ⚠️"}`;

const lines = [
  "### Lighthouse",
  "",
  "Mobile, 4G throttling, against the built site served locally — so these",
  "read lower than the live site, which is served compressed from a CDN.",
  "Median of three runs per address.",
  "",
  "| Address | Performance | Accessibility | Best practices | SEO |",
  "| --- | --- | --- | --- | --- |",
  ...rows.map(
    (row) =>
      `| \`${row.url}\` | ${cell(row.scores.performance, TARGET.performance)} ` +
      `| ${cell(row.scores.accessibility, TARGET.accessibility)} ` +
      `| ${cell(row.scores["best-practices"])} ` +
      `| ${cell(row.scores.seo, TARGET.seo)} |`,
  ),
  "",
  "Informative, not a gate. It becomes a required check on **2026-10-06**,",
  "a month after it started reporting — long enough to see what the numbers",
  "do on ordinary changes before anybody is blocked by one.",
];

console.log(lines.join("\n"));
