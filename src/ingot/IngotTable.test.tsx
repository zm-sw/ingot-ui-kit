/**
 * `IngotTable` — the two props KAN-590 added, and the invariants they must not
 * break.
 *
 * Why these and not the whole table: `stickyHeader` and `rowClassName` exist
 * because the first Application (`apps/nesting`) asked for them, and both are
 * pure presentation — exactly the kind of prop that can rot unnoticed. A
 * `sticky` class silently dropped from the head, or a row class applied to the
 * wrong `<tr>`, changes nothing a type check or a smoke render would see.
 *
 * The default-off assertions matter as much as the on ones: 43 admin screens
 * are meant to stand on this table, and a prop that leaks its behaviour into
 * callers who never asked for it is a regression on all of them at once.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotTable, type IngotColumn } from "./IngotTable";

interface Row {
  id: string;
  label: string;
  blocked: boolean;
}

const ROWS: Row[] = [
  { id: "a", label: "Alpha", blocked: false },
  { id: "b", label: "Bravo", blocked: true },
];

const COLUMNS: readonly IngotColumn<Row>[] = [
  { key: "label", header: "Label", cell: (row) => row.label },
];

function renderTable(extra: Record<string, unknown> = {}) {
  return render(
    <IngotTable
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(row) => row.id}
      rowTestId={(row) => `row-${row.id}`}
      {...extra}
    />,
  );
}

describe("IngotTable rowClassName", () => {
  it("puts the row's own classes on that row only", () => {
    renderTable({
      rowClassName: (row: Row) => (row.blocked ? "opacity-40" : undefined),
    });

    expect(screen.getByTestId("row-b").className).toContain("opacity-40");
    expect(screen.getByTestId("row-a").className).not.toContain("opacity-40");
  });

  it("keeps the table's own row classes when it adds one", () => {
    renderTable({ rowClassName: () => "opacity-40" });

    // The primitive owns the row separator; a caller asking for state styling
    // must not have to re-declare it (and must not be able to drop it).
    expect(screen.getByTestId("row-a").className).toContain("border-b");
  });

  it("leaves rows untouched when the prop is absent", () => {
    renderTable();

    expect(screen.getByTestId("row-a").className).toBe("border-b border-border");
  });
});

describe("IngotTable stickyHeader", () => {
  it("is off by default", () => {
    const { container } = renderTable();

    expect(container.querySelector("thead")!.className).not.toContain("sticky");
  });

  it("pins the head and gives it an opaque background when asked", () => {
    const { container } = renderTable({ stickyHeader: true });

    const thead = container.querySelector("thead")!;
    expect(thead.className).toContain("sticky");
    // Without a background the rows scroll THROUGH the pinned head, which
    // looks like a rendering bug rather than a missing class.
    expect(thead.className).toContain("bg-surface-2");
  });

  it("keeps the a11y floor either way", () => {
    const { container } = renderTable({ stickyHeader: true });

    expect(container.querySelector("th")!.getAttribute("scope")).toBe("col");
  });
});
