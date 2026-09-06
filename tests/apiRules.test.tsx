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
