/**
 * The grid inside a block (KAN-956).
 *
 * The kit had none. `IngotPageLayout` says outright that a two-column
 * detail is "the inside of a block, not the page frame", and nothing else
 * took it — so a settings form, a record's detail and a row of cards were
 * each composed from utilities, with a different gap and a different
 * folding point in every screen. The columns themselves are trivial; that
 * everybody's columns are the SAME columns is the whole point.
 *
 * jsdom lays nothing out, so what is measured is the decision: the shape
 * the grid asks for, that a child can span the row without the screen
 * writing `col-span-2` itself, and that reading order is untouched.
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotColumns, IngotColumnsFull, IngotField } from "@/ingot";

describe("the grid", () => {
  it("is one column until there is room for two", () => {
    render(
      <IngotColumns testId="grid">
        <p>a</p>
        <p>b</p>
      </IngotColumns>,
    );
    const grid = screen.getByTestId("grid");
    // One column first, the second added at a breakpoint — not two columns
    // narrowed until they stop being readable.
    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("md:grid-cols-2");
  });

  it("takes three columns when asked, and folds them at the same point", () => {
    render(
      <IngotColumns columns={3} testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    expect(screen.getByTestId("grid").className).toContain("md:grid-cols-3");
  });

  it("folds later for a block that needs the width", () => {
    // A detail beside prose does not survive being narrow the way a pair of
    // short fields does.
    render(
      <IngotColumns collapseBelow="lg" testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.className).toContain("lg:grid-cols-2");
    expect(grid.className).not.toContain("md:grid-cols-2");
  });

  it("spells every shape out, because Tailwind reads the source", () => {
    // A composed `md:grid-cols-${columns}` produces a class that is never
    // generated, and nothing reports it — the grid simply stays at one
    // column forever. So all four shapes are literals in the source.
    for (const [columns, below, expected] of [
      [2, "md", "md:grid-cols-2"],
      [3, "md", "md:grid-cols-3"],
      [4, "md", "md:grid-cols-4"],
      [2, "lg", "lg:grid-cols-2"],
      [3, "lg", "lg:grid-cols-3"],
      [4, "lg", "lg:grid-cols-4"],
    ] as const) {
      const { unmount } = render(
        <IngotColumns columns={columns} collapseBelow={below} testId="grid">
          <p>a</p>
        </IngotColumns>,
      );
      expect(screen.getByTestId("grid").className).toContain(expected);
      unmount();
    }
  });

  // Four columns going straight to one wastes half a tablet, and going
  // straight to four makes each of them about 160 px wide.
  it.each([
    [3, true],
    [4, true],
    [2, false],
  ] as const)("gives %s columns an intermediate step: %s", (columns, stepped) => {
    render(
      <IngotColumns columns={columns} testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    expect(screen.getByTestId("grid").className.includes("sm:grid-cols-2")).toBe(
      stepped,
    );
  });

  // A count answers "how many across"; tiles answer "how narrow may one
  // get" and let the row hold as many as fit.
  it("lays tiles by their narrowest width instead of by a count", () => {
    render(
      <IngotColumns minItemWidth={196} columns={3} testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.style.gridTemplateColumns).toBe(
      "repeat(auto-fill, minmax(196px, 1fr))",
    );
    // A caller that asked for tiles asked for tiles: the count is not also
    // applied, or the two would fight at every breakpoint.
    expect(grid.className).not.toContain("grid-cols-3");
  });

  // 471 grids in an application built on this kit used a gap that is not on
  // the space scale at all. A scale that can be missed by two pixels is not
  // a scale, so the prop takes steps rather than numbers.
  it.each([
    [3, "gap-3"],
    [4, "gap-4"],
    [5, "gap-5"],
  ] as const)("puts %s of the space scale between cells", (gap, expected) => {
    render(
      <IngotColumns gap={gap} testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    expect(screen.getByTestId("grid").className).toContain(expected);
  });

  it("keeps the gap out of the caller's hands", () => {
    render(
      <IngotColumns className="mt-8" testId="grid">
        <p>a</p>
      </IngotColumns>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.className).toContain("gap-4");
    // `className` places the block; it does not get to change its shape.
    expect(grid.className).toContain("mt-8");
  });

  it("does not touch reading order", () => {
    // A grid that moves elements visually away from where they are in the
    // document is the commonest way for tab order to part company with
    // what is on screen.
    render(
      <IngotColumns testId="grid">
        <p>první</p>
        <p>druhý</p>
        <p>třetí</p>
      </IngotColumns>,
    );
    const text = screen.getByTestId("grid").textContent ?? "";
    expect(text).toBe("prvnídruhýtřetí");
  });
});

describe("a child that takes the whole row", () => {
  it("spans without the screen writing a span itself", () => {
    // The day the block goes from two columns to three, a hand-written
    // `col-span-2` is wrong and nothing says so.
    render(
      <IngotColumns testId="grid">
        <p>pole</p>
        <IngotColumnsFull testId="full">
          <p>poznámka</p>
        </IngotColumnsFull>
      </IngotColumns>,
    );
    expect(screen.getByTestId("full").className).toContain("col-span-full");
  });
});

describe("a label beside its field", () => {
  it("keeps the label bound to the input it names", () => {
    // The pair has to stay one element: split it across two grid children
    // and `htmlFor` points at nothing.
    render(
      <IngotField
        label="Předpona"
        labelPlacement="side"
        value="FV-2026-"
        onChange={() => {}}
        testId="prefix"
      />,
    );
    const input = screen.getByTestId("prefix");
    expect(screen.getByLabelText("Předpona")).toBe(input);
  });

  it("folds back to a stacked label on a narrow screen", () => {
    const { container } = render(
      <IngotField
        label="Předpona"
        labelPlacement="side"
        value="FV-2026-"
        onChange={() => {}}
      />,
    );
    const field = container.firstElementChild;
    // A label column on a phone leaves the field about 150 px wide.
    expect(field?.className).toContain("grid-cols-1");
    expect(field?.className).toContain("md:grid-cols-[12rem_1fr]");
  });

  it("leaves the stacked field as it was", () => {
    const { container } = render(
      <IngotField label="Název firmy" value="Kovárna" onChange={() => {}} />,
    );
    const field = container.firstElementChild;
    expect(field?.className).toContain("space-y-1");
    expect(field?.className).not.toContain("grid");
  });

  it("lines the hint and the error up with the input, not with the label", () => {
    render(
      <IngotField
        label="Předpona"
        labelPlacement="side"
        hint="Předchází pořadovému číslu."
        error="Předpona je povinná."
        value=""
        onChange={() => {}}
        testId="prefix"
      />,
    );
    // Everything under the label lives in the second column with the
    // field, so all of it starts on the field's left edge.
    const column = screen.getByTestId("prefix").closest<HTMLElement>("div.space-y-1");
    expect(column).not.toBeNull();
    expect(
      within(column!).getByText("Předchází pořadovému číslu."),
    ).toBeInTheDocument();
    expect(within(column!).getByText("Předpona je povinná.")).toBeInTheDocument();
  });
});
