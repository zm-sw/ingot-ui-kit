/**
 * How a primitive leaves (KAN-851).
 *
 * The kit is installed from a tag, so its callers do not live in this
 * repository any more. The old rule — "a breaking change rewrites every
 * call site in the same change" — cannot reach them, and a removal they
 * did not hear about is a build that stops with nothing to read.
 *
 * Two halves are measured here:
 *
 * 1. **The release arithmetic.** A removal is a MINOR bump. Shipping the
 *    end of a deprecation as a patch would be the one release nobody looks
 *    at twice, which is precisely the release that breaks them.
 * 2. **The registry's own promises.** Every deprecated page names a
 *    removal version, and no page carries a removal date without being
 *    deprecated. The guard enforces both on the file; this holds the same
 *    line on the data the doc web actually renders.
 */
import { describe, expect, it } from "vitest";

import { nextVersion, releaseChanges, releaseNotes } from "../scripts/releaseCore.mjs";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

const versions = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("what moves the version", () => {
  it("a patch bump is a patch release", () => {
    const changes = releaseChanges({
      before: versions({ IngotTable: "1.0" }),
      now: versions({ IngotTable: "1.1" }),
    });
    expect(changes.kind).toBe("patch");
    expect(nextVersion("v1.2.3", changes.kind)).toBe("v1.2.4".slice(1));
  });

  it("a new primitive is a minor release", () => {
    const changes = releaseChanges({
      before: versions({ IngotTable: "1.0" }),
      now: versions({ IngotTable: "1.0", IngotMenu: "1.0" }),
    });
    expect(changes.kind).toBe("minor");
    expect(changes.added).toEqual(["IngotMenu"]);
  });

  it("a REMOVAL is a minor release too, not a patch", () => {
    const changes = releaseChanges({
      before: versions({ IngotTable: "1.0", IngotOldThing: "2.0" }),
      now: versions({ IngotTable: "1.0" }),
    });
    expect(changes.removed).toEqual(["IngotOldThing"]);
    expect(changes.kind).toBe("minor");
  });

  it("a major bump of one component is a minor release of the kit", () => {
    const changes = releaseChanges({
      before: versions({ IngotForm: "1.4" }),
      now: versions({ IngotForm: "2.0" }),
    });
    expect(changes.majorBumped).toEqual(["IngotForm"]);
    expect(changes.kind).toBe("minor");
  });

  it("only a release!: commit moves the epoch", () => {
    const changes = releaseChanges({
      before: versions({ IngotTable: "1.0" }),
      now: versions({ IngotTable: "1.1" }),
      epoch: true,
    });
    expect(changes.kind).toBe("major");
    expect(nextVersion("v1.2.3", "major")).toBe("2.0.0");
  });

  it("the notes say what happened, removals included", () => {
    const changes = releaseChanges({
      before: versions({ IngotOldThing: "2.0" }),
      now: versions({ IngotMenu: "1.0" }),
    });
    const notes = releaseNotes({ tag: "v1.1.1", next: "1.2.0", changes });
    expect(notes.join("\n")).toContain("Removed after deprecation: IngotOldThing.");
    expect(notes.join("\n")).toContain("New primitives: IngotMenu.");
  });
});

describe("the registry keeps its deprecation promises", () => {
  it("a deprecated page names when it goes away", () => {
    for (const page of INGOT_DOC_PAGES) {
      if (page.status !== "deprecated") continue;
      expect(
        page.deprecated,
        `${page.name} is deprecated without a notice`,
      ).toBeDefined();
      expect(page.deprecated?.removeIn).toMatch(/^\d+\.\d+$/);
      expect(page.deprecated?.since).toMatch(/^\d+\.\d+$/);
    }
  });

  it("no page carries a removal date without being deprecated", () => {
    for (const page of INGOT_DOC_PAGES) {
      if (page.deprecated === undefined) continue;
      expect(page.status, `${page.name} has a notice but is not deprecated`).toBe(
        "deprecated",
      );
    }
  });

  it("every status is one the badge can draw", () => {
    for (const page of INGOT_DOC_PAGES) {
      expect(["stable", "beta", "deprecated"]).toContain(page.status);
    }
  });
});
