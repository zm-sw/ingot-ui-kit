/**
 * PR check: does the design library still hold the palette the kit ships?
 *
 * CLAUDE.md says the handoff wins when the two disagree, unless a written
 * reason stands beside the difference. Nothing has ever measured that. A
 * colour that moves on one side turns up on a screen months later, and by
 * then nobody can say which side moved.
 *
 * The comparison itself lives in ``figmaDiffCore.mjs`` and is unit-tested
 * against a fixture. This file is only the errand: read the credentials,
 * ask the API, print the table.
 *
 * **It skips rather than fails when it has nothing to ask.** Without
 * ``FIGMA_TOKEN`` and ``FIGMA_FILE_KEY`` there is no library to compare
 * against, and a job that goes red because a secret was never added is a
 * job somebody switches off in the first week. The same reasoning as the
 * reference consumer, which skips on a pull request that cannot break it.
 *
 * Informative first, like Lighthouse was: it prints and exits 0. Making it
 * block is a decision for after somebody has watched it for a while — a
 * threshold nobody has read is a threshold that stops the first unrelated
 * pull request and is then removed.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildFigma, readTokens } from "./build-tokens.mjs";
import {
  diffVariables,
  fromFigmaApi,
  fromKitExport,
  report,
} from "./figmaDiffCore.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(
  /^\/([A-Za-z]):\//,
  "$1:/",
);

/**
 * Says the text once on the console, and once wherever CI collects it.
 *
 * The pull-request comment is written ONLY when there is a difference. A
 * bot that says "all good" on every pull request is a bot whose comments
 * stop being read, and then the one that matters is not read either. The
 * run summary carries the quiet answer for whoever goes looking.
 */
function publish(text, hasFindings) {
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`, { flag: "a" });
  }
  if (process.env.FIGMA_DIFF_OUT && hasFindings) {
    writeFileSync(process.env.FIGMA_DIFF_OUT, `${text}\n`);
  }
}

// Written as a function with plain returns rather than `process.exit(0)`:
// exiting while the HTTP client still holds a socket crashes node's event
// loop on some platforms, AFTER the message has been printed — which looks
// exactly like a check that failed for a reason nobody can read.
async function main() {
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;

  if (!token || !fileKey) {
    console.log(
      "[figma-tokens] skipped: FIGMA_TOKEN and FIGMA_FILE_KEY are not both set.",
    );
    console.log(
      "[figma-tokens] Set them in the repository's secrets to compare the palette",
    );
    console.log("[figma-tokens] against the design library on every pull request.");
    return;
  }

  // Through `globalThis` rather than bare: node has had `fetch` as a
  // global since 18, but the lint config gives these scripts a set of
  // globals that predates it, and loosening that set for every file is a
  // worse trade than naming where this one comes from.
  const response = await globalThis.fetch(
    `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/variables/local`,
    { headers: { "X-Figma-Token": token } },
  );

  if (!response.ok) {
    // Not a failure of the palette, so not a failure of the check: a token
    // that expired says nothing about whether a colour moved.
    await response.body?.cancel();
    console.log(`[figma-tokens] skipped: the API answered ${response.status}.`);
    return;
  }

  const payload = await response.json();
  const tokens = readTokens(join(ROOT, "src/ingot/tokens.json"));

  const findings = diffVariables(
    fromKitExport(JSON.parse(buildFigma(tokens))),
    fromFigmaApi(payload),
  );

  publish(report(findings, { fileKey }), findings.length > 0);
  console.log(
    `[figma-tokens] ${findings.length} difference(s); reporting only, not blocking.`,
  );
}

await main();
