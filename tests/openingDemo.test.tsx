/**
 * The opening page's demo is there before the first render (KAN-985).
 *
 * The skeleton a lazy demo shows cannot know how tall the demo will be, so
 * on the page a reader lands on, everything under it jumped when the demo
 * arrived — CLS 0.108 on `/komponenty/table`. The entry point now loads
 * that one demo before booting; these tests pin that the loaded component
 * is handed out for exactly that page and no other, because handing it to
 * another page would swap a lazy component for a loaded one under a reader
 * and remount it.
 */
import { describe, expect, it } from "vitest";

import { loadOpeningDemo, openingDemoOf } from "@/ingot-docs/openingDemo";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

describe("openingDemo", () => {
  it("has nothing before a page was loaded", () => {
    for (const page of INGOT_DOC_PAGES) expect(openingDemoOf(page)).toBeUndefined();
  });

  it("hands out the loaded demo for the opening page only", async () => {
    const table = INGOT_DOC_PAGES.find((page) => page.name === "IngotTable");
    const other = INGOT_DOC_PAGES.find((page) => page.name !== "IngotTable");
    expect(table).toBeDefined();
    expect(other).toBeDefined();
    if (!table || !other) return;

    await loadOpeningDemo(table);

    expect(openingDemoOf(table)).toBe((await table.demo()).default);
    expect(openingDemoOf(other)).toBeUndefined();
  });
});
