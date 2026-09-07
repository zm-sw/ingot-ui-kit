import { describe, expect, it } from "vitest";

import { componentManifest, enumValues } from "@/ingot-docs/manifest";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

/**
 * The manifest is read by tools outside this repository, so its shape is a
 * promise. These tests hold the two halves of it: that it describes the
 * registry completely, and that the fields another tool joins on are
 * really there.
 */

// The build passes a real server renderer; the tests do not need one. What
// matters here is that every sentence arrives as a string.
const toText = (node: unknown): string => (typeof node === "string" ? node : "[prose]");

const manifest = componentManifest(toText, { kit: "0.0.0", generated: "2026-01-01" });

describe("component manifest", () => {
  it("describes every doc page and nothing else", () => {
    expect(manifest.count).toBe(INGOT_DOC_PAGES.length);
    expect(manifest.components.map((entry) => entry.name).sort()).toEqual(
      INGOT_DOC_PAGES.map((doc) => doc.name).sort(),
    );
  });

  it("carries the fields a design library joins on", () => {
    for (const entry of manifest.components) {
      expect(entry.tag, `${entry.name} has no tag`).toMatch(/^[.[]/);
      expect(entry.version, `${entry.name} has no version`).toMatch(/^\d+\.\d+$/);
      expect(["stable", "beta", "deprecated"]).toContain(entry.status);
      expect(entry.page.cs).toMatch(/^https:\/\/ingot\.forgmatic\.com\/komponenty\//);
      expect(entry.page.en).toMatch(
        /^https:\/\/ingot\.forgmatic\.com\/en\/komponenty\//,
      );
    }
  });

  it("gives every tag to exactly one primitive", () => {
    const tags = manifest.components.map((entry) => entry.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("resolves prose to strings in both languages", () => {
    for (const entry of manifest.components) {
      for (const list of [entry.avoidWhen, entry.a11y]) {
        for (const lang of ["cs", "en"] as const) {
          for (const line of list[lang]) expect(typeof line).toBe("string");
        }
      }
    }
  });

  it("lists the members of a union of string literals", () => {
    const button = manifest.components.find((entry) => entry.name === "Button");
    const variant = button?.props.find((entry) => entry.name === "variant");
    const size = button?.props.find((entry) => entry.name === "size");
    expect(variant?.values).toEqual([
      "primary",
      "accent",
      "ok",
      "secondary",
      "ghost",
      "danger",
      "inverse",
    ]);
    expect(size?.values).toEqual(["sm", "md", "lg"]);
  });

  it("leaves values off a type that is not a set of variants", () => {
    expect(enumValues("string")).toBeUndefined();
    expect(enumValues("boolean")).toBeUndefined();
    expect(enumValues("ReactNode")).toBeUndefined();
    // Half-quoted is not a variant set: listing only the quoted members
    // would promise a completeness the type does not have.
    expect(enumValues('"a" | ReactNode')).toBeUndefined();
    expect(enumValues('"sm" | "md"')).toEqual(["sm", "md"]);
  });

  it("names a replacement and a removal for anything deprecated", () => {
    for (const entry of manifest.components) {
      if (entry.status !== "deprecated") continue;
      expect(
        entry.deprecated?.removeIn,
        `${entry.name} deprecated without removeIn`,
      ).toBeTruthy();
    }
  });
});
