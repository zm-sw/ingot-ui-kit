/**
 * Every primitive is named by at least one test (KAN-846).
 *
 * The kit had ten primitives no test mentioned — the marketing blocks, the
 * page header, the list, the accent picker, the segmented switch. Each of
 * them rendered on the doc web, so a broken one would have been noticed
 * eventually, by a person, on a page nobody opens every day.
 *
 * This test is the cheap half of coverage: it does not say a primitive is
 * WELL tested, it says nobody forgot it. The expensive half is the tests
 * themselves, and a missing file is exactly what nobody notices in review.
 *
 * It reads the registry rather than a list of its own, so a new primitive
 * joins this check the moment it gets its doc page — which the doc-page
 * guard already makes mandatory.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

const TESTS_DIR = join(process.cwd(), "tests");

function testSources(): string {
  return (
    readdirSync(TESTS_DIR)
      .filter((file) => file.includes(".test."))
      // This file names every primitive by construction; counting it would
      // make the check pass over an empty test suite.
      .filter((file) => file !== "coverage.test.ts")
      .map((file) => readFileSync(join(TESTS_DIR, file), "utf-8"))
      .join("\n")
  );
}

describe("test coverage of the kit", () => {
  const sources = testSources();

  it.each(INGOT_DOC_PAGES.map((page) => [page.name] as const))(
    "%s is named by at least one test",
    (name) => {
      expect(new RegExp(`\\b${name}\\b`).test(sources)).toBe(true);
    },
  );

  it("keeps every test in one place", () => {
    // Two test files used to live next to their components, where the
    // suite's own conventions (setup, longer waitFor budget) did not reach
    // them and where nobody looked for them.
    const strays = readdirSync(join(process.cwd(), "src", "ingot")).filter((file) =>
      file.includes(".test."),
    );
    expect(strays).toEqual([]);
  });
});
