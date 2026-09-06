/**
 * The kit's API rules (KAN-842) — the part of them a test can hold.
 *
 * The rules themselves are prose (contributor notes and the Usage rules
 * page). What a test can measure is the half that breaks silently:
 *
 * 1. **A ref reaches the ELEMENT the caller means**, not the wrapper
 *    around it. A screen that focuses a filter or a search field reaches
 *    for the control; if a refactor moved the ref to the wrapper,
 *    ``focus()`` would still be callable and would silently do nothing.
 * 2. **The deprecated ``inputRef`` alias still works** next to ``ref`` —
 *    it goes away in the next major, not in this one, so a caller
 *    mid-migration must not lose its shortcut.
 * 3. **Every doc page states its className policy** in both languages.
 *    A prop that does not exist has no row in the props table, so
 *    "does it take className?" can only be answered by this sentence.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotCheckbox, IngotSearchInput, IngotSelect } from "@/ingot";
import { DOC_LANGS } from "@/ingot-docs/lang";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

describe("refs reach the element, not the wrapper", () => {
  it("IngotSelect forwards its ref to the <select>", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <IngotSelect
        ref={ref}
        value="all"
        onChange={() => undefined}
        options={[{ value: "all", label: "All" }]}
        label="Status"
        testId="select"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId("select"));
    expect(ref.current?.tagName).toBe("SELECT");
  });

  it("IngotSearchInput forwards its ref to the <input>", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <IngotSearchInput
        ref={ref}
        value=""
        onChange={() => undefined}
        label="Search"
        testId="search"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId("search"));
    // The point of the rule: the caller can really focus it.
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it("IngotSearchInput still honours the deprecated inputRef alias", () => {
    const ref = createRef<HTMLInputElement>();
    const legacy = createRef<HTMLInputElement>();
    render(
      <IngotSearchInput
        ref={ref}
        inputRef={legacy}
        value=""
        onChange={() => undefined}
        label="Search"
        testId="search"
      />,
    );
    expect(legacy.current).toBe(screen.getByTestId("search"));
    expect(ref.current).toBe(legacy.current);
  });

  it("IngotCheckbox forwards its ref to the <input>, not the <label>", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <IngotCheckbox
        ref={ref}
        checked={false}
        onChange={() => undefined}
        label="Only what needs attention"
        testId="checkbox"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId("checkbox"));
    expect(ref.current?.type).toBe("checkbox");
    // indeterminate is settable only on the control itself.
    if (ref.current) ref.current.indeterminate = true;
    expect(ref.current?.indeterminate).toBe(true);
  });
});

describe("every doc page states its className policy", () => {
  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page] as const))(
    "%s says what className may do",
    (_name, page) => {
      for (const lang of DOC_LANGS) {
        expect(page.classNameNote[lang].trim().length).toBeGreaterThan(0);
        expect(page.classNameNote[lang]).toContain("className");
      }
    },
  );
});

/**
 * 4. **`size` and `tone` mean one thing across the kit** (KAN-962).
 *
 * `size` used to exist on five primitives with four different types and
 * `tone` on eight with five different enumerations. The same word meant
 * something different in each: a callout's `info` and a badge's `accent`
 * were the same colour under two names, `default` and `neutral` were the
 * same absence of emphasis. Nobody could carry what they had learned from
 * one component to the next — which is the failure a design system exists
 * to prevent.
 *
 * Re-fragmenting is easy and invisible: a fresh `"sm" | "md"` union in a
 * new primitive typechecks, renders correctly and reads fine in review.
 * So the source is read here, and a declaration that does not reach the
 * shared type has to say why out loud.
 */
describe("the kit has one vocabulary for size and tone", () => {
  const KIT = join(process.cwd(), "src", "ingot");

  /** Every `.tsx`/`.ts` in the kit, including the Forgmatic layer. */
  function kitSources(dir: string): { file: string; source: string }[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return kitSources(full);
      if (!/\.tsx?$/.test(entry.name)) return [];
      return [{ file: entry.name, source: readFileSync(full, "utf-8") }];
    });
  }

  /**
   * A declaration that spells out string literals instead of narrowing the
   * shared type — `type XSize = "sm" | "md"` rather than
   * `Extract<IngotSize, "sm" | "md">`.
   */
  const LITERAL_UNION =
    /(?:type\s+\w*(?:Size|Tone)\s*=|(?:size|tone)\??\s*:)\s*(?:\|\s*)?"[^"]+"\s*\|/;

  it("declares no size or tone as a union of bare literals", () => {
    const offenders = kitSources(KIT)
      .filter(({ file }) => !file.includes(".test."))
      // The vocabulary is where the literals are supposed to be. The test
      // above pins its contents, so it is not unguarded, just not this
      // guard's business.
      .filter(({ file }) => file !== "vocabulary.ts")
      .filter(({ source }) => LITERAL_UNION.test(source))
      .map(({ file }) => file);

    expect(
      offenders,
      `${offenders.join(", ")} spell out a size or tone instead of narrowing ` +
        "IngotSize / IngotTone with Extract<>. A fresh union of the same " +
        "strings says nothing and drifts the day the shared set changes.",
    ).toEqual([]);
  });

  it("keeps the vocabulary itself to the words it promises", () => {
    // Guarding the guard: if `IngotTone` quietly grew "info" back, every
    // Extract<> above would still typecheck and the two names for one
    // colour would be back.
    const source = readFileSync(join(KIT, "vocabulary.ts"), "utf-8");
    const tone = source.match(/export type IngotTone =([^;]+);/)?.[1] ?? "";
    const size = source.match(/export type IngotSize =([^;]+);/)?.[1] ?? "";
    expect([...tone.matchAll(/"([^"]+)"/g)].map((m) => m[1])).toEqual([
      "neutral",
      "accent",
      "ok",
      "warn",
      "danger",
      "ink",
    ]);
    expect([...size.matchAll(/"([^"]+)"/g)].map((m) => m[1])).toEqual([
      "sm",
      "md",
      "lg",
    ]);
  });

  it("gives an icon a number, not a size word", () => {
    // An icon's size is a pixel value matched to the type beside it — 13
    // next to a 12px eyebrow, 15 in a search field. Three names cannot
    // carry that without inventing a scale the handoff does not have.
    const icon = readFileSync(join(KIT, "IngotIcon.tsx"), "utf-8");
    expect(icon).toMatch(/size\??\s*:\s*number/);
  });
});
