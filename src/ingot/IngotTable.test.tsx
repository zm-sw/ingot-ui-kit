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

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotTable, type IngotColumn, type IngotSort } from "./IngotTable";

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

describe("IngotTable row selection (KAN-654)", () => {
  const selectionProps = (
    selected: ReadonlySet<string>,
    onChange: (keys: ReadonlySet<string>) => void,
  ) => ({
    selectedKeys: selected,
    onSelectedKeysChange: onChange,
    selectAllLabel: "Vybrat vše",
    selectRowLabel: (row: Row) => `Vybrat ${row.label}`,
  });

  it("without selection props nothing changes — the root stays <table>", () => {
    const { container } = renderTable();

    expect(container.firstElementChild!.tagName).toBe("TABLE");
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("a row checkbox reports the new set and the row carries aria-selected", () => {
    const onChange = vi.fn();
    renderTable(selectionProps(new Set(["a"]), onChange));

    expect(screen.getByTestId("row-a")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("row-b")).toHaveAttribute("aria-selected", "false");

    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat Bravo" }));
    expect(onChange).toHaveBeenCalledWith(new Set(["a", "b"]));
  });

  it("select all selects the rendered rows and clears the selection the second time", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <IngotTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        {...selectionProps(new Set(), onChange)}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat vše" }));
    expect(onChange).toHaveBeenCalledWith(new Set(["a", "b"]));

    rerender(
      <IngotTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        {...selectionProps(new Set(["a", "b"]), onChange)}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat vše" }));
    expect(onChange).toHaveBeenLastCalledWith(new Set());
  });

  it("the header checkbox is indeterminate with a partial selection", () => {
    renderTable(selectionProps(new Set(["a"]), () => {}));

    const all = screen.getByRole("checkbox", { name: "Vybrat vše" });
    expect((all as HTMLInputElement).indeterminate).toBe(true);
    expect((all as HTMLInputElement).checked).toBe(false);
  });

  it("the bulk bar shows only with a non-empty selection", () => {
    const { rerender } = render(
      <IngotTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        bulkbar={<span>2 vybrané</span>}
        {...{
          selectedKeys: new Set<string>(),
          onSelectedKeysChange: () => {},
        }}
      />,
    );
    expect(screen.queryByText("2 vybrané")).toBeNull();

    rerender(
      <IngotTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        bulkbar={<span>2 vybrané</span>}
        {...{
          selectedKeys: new Set(["a", "b"]),
          onSelectedKeysChange: () => {},
        }}
      />,
    );
    expect(screen.getByText("2 vybrané")).toBeInTheDocument();
  });

  it("the selection column raises the colSpan of the empty row", () => {
    renderTable({
      rows: [],
      empty: <span>Nic tu není</span>,
      selectedKeys: new Set<string>(),
      onSelectedKeysChange: () => {},
    });

    expect(screen.getByText("Nic tu není").closest("td")).toHaveAttribute(
      "colSpan",
      "2",
    );
  });
});

describe("IngotTable sorting (KAN-654)", () => {
  const sortableColumns: readonly IngotColumn<Row>[] = [
    { key: "label", header: "Label", cell: (row) => row.label, sortable: true },
    { key: "id", header: "Id", cell: (row) => row.id },
  ];

  it("without onSortChange the header stays plain — a button that does nothing is worse than none", () => {
    renderTable({ columns: sortableColumns });

    expect(screen.queryByRole("button", { name: /Label/ })).toBeNull();
  });

  it("the active header carries aria-sort and a click flips the direction", () => {
    const onSortChange = vi.fn();
    const sort: IngotSort = { key: "label", dir: "asc" };
    renderTable({ columns: sortableColumns, sort, onSortChange });

    const th = screen.getByRole("columnheader", { name: /Label/ });
    expect(th).toHaveAttribute("aria-sort", "ascending");

    fireEvent.click(screen.getByRole("button", { name: /Label/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "label", dir: "desc" });
  });

  it("a click on an inactive sortable header starts ascending", () => {
    const onSortChange = vi.fn();
    renderTable({
      columns: sortableColumns,
      sort: { key: "id", dir: "desc" } as IngotSort,
      onSortChange,
    });

    fireEvent.click(screen.getByRole("button", { name: /Label/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "label", dir: "asc" });
  });

  it("a non-sortable header carries no aria-sort", () => {
    renderTable({
      columns: sortableColumns,
      sort: { key: "label", dir: "asc" } as IngotSort,
      onSortChange: () => {},
    });

    expect(
      screen.getByRole("columnheader", { name: "Id" }),
    ).not.toHaveAttribute("aria-sort");
  });
});

describe("IngotTable density (KAN-654)", () => {
  it("the default density keeps the padding of the first version", () => {
    renderTable();

    const cell = screen.getByTestId("row-a").querySelector("td")!;
    expect(cell.className).toContain("px-3 py-2");
  });

  it("compact pulls the cell padding down to 8px", () => {
    renderTable({ density: "compact" });

    const cell = screen.getByTestId("row-a").querySelector("td")!;
    expect(cell.className).toContain("p-2");
    expect(cell.className).not.toContain("px-3");
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
