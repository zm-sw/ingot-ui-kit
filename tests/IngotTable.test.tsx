/**
 * Table + empty state (KAN-585) — the fourth Ingot primitive.
 *
 * The tests aim at what the table fixes **structurally**, because that is
 * exactly what hand-made `<table>` elements in the repo could not do:
 *
 * 1. **`colSpan` is computed.** Hand-made empty states have `colSpan={5}`
 *    hard-coded and drift quietly when a column is added. The test
 *    therefore does not check that `colSpan` is there, but that it
 *    **equals the column count** — and that it changes when an actions
 *    column is added. Without the second part the test would pass over a
 *    hard-wired constant too.
 * 2. **`<th scope="col">` on every column.** Of 42 files with a hand-made
 *    `<thead>` only 12 have `scope`.
 * 3. **Loading is not silence.** An empty body with a spinner sounds to a
 *    screen reader just like "nothing here"; hence `aria-busy` and
 *    `role="status"`.
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotEmptyState, IngotTable, type IngotColumn, type IngotSort } from "@/ingot";

interface Row {
  id: string;
  name: string;
  count: number;
}

const ROWS: Row[] = [
  { id: "a", name: "První", count: 2 },
  { id: "b", name: "Druhá", count: 40 },
];

const COLUMNS: IngotColumn<Row>[] = [
  { key: "name", header: "Název", cell: (row) => row.name },
  { key: "count", header: "Počet", cell: (row) => row.count, align: "end" },
];

function renderTable(props: Partial<Parameters<typeof IngotTable<Row>>[0]> = {}) {
  return render(
    <IngotTable<Row>
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(row) => row.id}
      testId="probe"
      {...props}
    />,
  );
}

describe("IngotTable — header semantics", () => {
  it('every column is <th scope="col">', () => {
    renderTable();
    const heads = screen.getAllByRole("columnheader");
    expect(heads).toHaveLength(2);
    for (const th of heads) expect(th).toHaveAttribute("scope", "col");
  });

  it("the caption describes the table for a screen reader", () => {
    renderTable({ caption: "Seznam položek" });
    expect(screen.getByRole("table")).toHaveAccessibleName("Seznam položek");
  });

  it("the actions column has a screen-reader label even when it is not visible", () => {
    renderTable({
      actions: (row) => <button type="button">smazat {row.name}</button>,
      actionsLabel: "Akce",
    });
    const heads = screen.getAllByRole("columnheader");
    expect(heads).toHaveLength(3);
    expect(heads[2]).toHaveTextContent("Akce");
  });
});

describe("IngotTable — rows", () => {
  it("renders a cell for every column and row", () => {
    renderTable();
    expect(screen.getByText("První")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("cell receives the row index", () => {
    renderTable({
      columns: [{ key: "rank", header: "#", cell: (_row, index) => `#${index + 1}` }],
    });
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  it("rowTestId marks the row", () => {
    renderTable({ rowTestId: (row) => `radek-${row.id}` });
    expect(screen.getByTestId("radek-a")).toBeInTheDocument();
    expect(screen.getByTestId("radek-b")).toBeInTheDocument();
  });

  it("row actions are in the last cell and reachable by keyboard", () => {
    renderTable({
      actions: (row) => <button type="button">smazat {row.name}</button>,
      actionsLabel: "Akce",
    });
    const button = screen.getByRole("button", { name: "smazat První" });
    expect(button).toBeInTheDocument();
    // Not behind hover: `opacity-0 group-hover:…` is a trap for the
    // keyboard, so the primitive puts no such class on the actions.
    expect(button.closest("td")).not.toHaveClass("opacity-0");
  });
});

describe("IngotTable — colSpan is COMPUTED, not hard-wired", () => {
  it("the empty row is as wide as the column count", () => {
    renderTable({ rows: [], empty: <IngotEmptyState title="Nic tu není" /> });
    const cell = screen.getByText("Nic tu není").closest("td");
    expect(cell).toHaveAttribute("colSpan", "2");
  });

  it("the actions column raises that count", () => {
    renderTable({
      rows: [],
      empty: <IngotEmptyState title="Nic tu není" />,
      actions: () => <button type="button">akce</button>,
      actionsLabel: "Akce",
    });
    const cell = screen.getByText("Nic tu není").closest("td");
    // If colSpan were a constant, this case would convict it.
    expect(cell).toHaveAttribute("colSpan", "3");
  });
});

describe("IngotTable — empty and loading state", () => {
  it("the empty state shows only when there are no rows", () => {
    const { rerender } = render(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={[]}
        rowKey={(row) => row.id}
        empty={<IngotEmptyState title="Nic tu není" testId="prazdno" />}
      />,
    );
    expect(screen.getByTestId("prazdno")).toBeInTheDocument();

    rerender(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        empty={<IngotEmptyState title="Nic tu není" testId="prazdno" />}
      />,
    );
    expect(screen.queryByTestId("prazdno")).toBeNull();
    expect(screen.getByText("První")).toBeInTheDocument();
  });

  it("loading tells a screen reader it is waiting — and renders neither rows nor the empty state", () => {
    renderTable({
      loading: true,
      loadingLabel: "Načítám…",
      empty: <IngotEmptyState title="Nic tu není" testId="prazdno" />,
    });

    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Načítám…");
    expect(screen.queryByText("První")).toBeNull();
    expect(screen.queryByTestId("prazdno")).toBeNull();
  });

  it("bez loadingu tabulka aria-busy nenese", () => {
    renderTable();
    expect(screen.getByRole("table")).not.toHaveAttribute("aria-busy");
  });
});

describe("IngotEmptyState", () => {
  it("shows the title, description and affordance", () => {
    render(
      <IngotEmptyState
        title="Zatím tu nic není"
        description="Přidej první položku."
        action={<button type="button">Přidat</button>}
        testId="prazdno"
      />,
    );
    const box = screen.getByTestId("prazdno");
    expect(box).toHaveTextContent("Zatím tu nic není");
    expect(box).toHaveTextContent("Přidej první položku.");
    expect(within(box).getByRole("button", { name: "Přidat" })).toBeInTheDocument();
  });

  it("neither description nor affordance is required", () => {
    render(<IngotEmptyState title="Prázdno" testId="prazdno" />);
    const box = screen.getByTestId("prazdno");
    expect(box).toHaveTextContent("Prázdno");
    expect(within(box).queryByRole("button")).toBeNull();
  });
});

/**
 * The rest of this file arrived from ``src/ingot/IngotTable.test.tsx``, where
 * it sat next to the component. Two homes for the same component's tests
 * meant the suite's own setup did not reach one of them, and neither did
 * anybody looking for "the table's tests".
 *
 * What it measures: the two presentation props (``stickyHeader``,
 * ``rowClassName``), row selection and sorting. Presentation props are
 * exactly the kind that rot unnoticed — a `sticky` class dropped from the
 * head, or a row class on the wrong ``<tr>``, changes nothing a type check
 * or a smoke render would see.
 */

interface PropRow {
  id: string;
  label: string;
  blocked: boolean;
}

const PROP_ROWS: PropRow[] = [
  { id: "a", label: "Alpha", blocked: false },
  { id: "b", label: "Bravo", blocked: true },
];

const PROP_COLUMNS: readonly IngotColumn<PropRow>[] = [
  { key: "label", header: "Label", cell: (row) => row.label },
];

function renderPropTable(extra: Record<string, unknown> = {}) {
  return render(
    <IngotTable
      columns={PROP_COLUMNS}
      rows={PROP_ROWS}
      rowKey={(row) => row.id}
      rowTestId={(row) => `row-${row.id}`}
      {...extra}
    />,
  );
}

describe("IngotTable rowClassName", () => {
  it("puts the row's own classes on that row only", () => {
    renderPropTable({
      rowClassName: (row: PropRow) => (row.blocked ? "opacity-40" : undefined),
    });

    expect(screen.getByTestId("row-b").className).toContain("opacity-40");
    expect(screen.getByTestId("row-a").className).not.toContain("opacity-40");
  });

  it("keeps the table's own row classes when it adds one", () => {
    renderPropTable({ rowClassName: () => "opacity-40" });

    // The primitive owns the row separator; a caller asking for state styling
    // must not have to re-declare it (and must not be able to drop it).
    expect(screen.getByTestId("row-a").className).toContain("border-b");
  });

  it("leaves rows untouched when the prop is absent", () => {
    renderPropTable();

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
    selectRowLabel: (row: PropRow) => `Vybrat ${row.label}`,
  });

  it("without selection props nothing changes — the root stays <table>", () => {
    const { container } = renderPropTable();

    expect(container.firstElementChild!.tagName).toBe("TABLE");
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("a row checkbox reports the new set and the row carries aria-selected", () => {
    const onChange = vi.fn();
    renderPropTable(selectionProps(new Set(["a"]), onChange));

    expect(screen.getByTestId("row-a")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("row-b")).toHaveAttribute("aria-selected", "false");

    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat Bravo" }));
    expect(onChange).toHaveBeenCalledWith(new Set(["a", "b"]));
  });

  it("select all selects the rendered rows and clears the selection the second time", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <IngotTable
        columns={PROP_COLUMNS}
        rows={PROP_ROWS}
        rowKey={(row) => row.id}
        {...selectionProps(new Set(), onChange)}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat vše" }));
    expect(onChange).toHaveBeenCalledWith(new Set(["a", "b"]));

    rerender(
      <IngotTable
        columns={PROP_COLUMNS}
        rows={PROP_ROWS}
        rowKey={(row) => row.id}
        {...selectionProps(new Set(["a", "b"]), onChange)}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Vybrat vše" }));
    expect(onChange).toHaveBeenLastCalledWith(new Set());
  });

  it("the header checkbox is indeterminate with a partial selection", () => {
    renderPropTable(selectionProps(new Set(["a"]), () => {}));

    const all = screen.getByRole("checkbox", { name: "Vybrat vše" });
    expect((all as HTMLInputElement).indeterminate).toBe(true);
    expect((all as HTMLInputElement).checked).toBe(false);
  });

  it("the bulk bar shows only with a non-empty selection", () => {
    const { rerender } = render(
      <IngotTable
        columns={PROP_COLUMNS}
        rows={PROP_ROWS}
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
        columns={PROP_COLUMNS}
        rows={PROP_ROWS}
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
    renderPropTable({
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
  const sortableColumns: readonly IngotColumn<PropRow>[] = [
    { key: "label", header: "Label", cell: (row) => row.label, sortable: true },
    { key: "id", header: "Id", cell: (row) => row.id },
  ];

  it("without onSortChange the header stays plain — a button that does nothing is worse than none", () => {
    renderPropTable({ columns: sortableColumns });

    expect(screen.queryByRole("button", { name: /Label/ })).toBeNull();
  });

  it("the active header carries aria-sort and a click flips the direction", () => {
    const onSortChange = vi.fn();
    const sort: IngotSort = { key: "label", dir: "asc" };
    renderPropTable({ columns: sortableColumns, sort, onSortChange });

    const th = screen.getByRole("columnheader", { name: /Label/ });
    expect(th).toHaveAttribute("aria-sort", "ascending");

    fireEvent.click(screen.getByRole("button", { name: /Label/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "label", dir: "desc" });
  });

  it("a click on an inactive sortable header starts ascending", () => {
    const onSortChange = vi.fn();
    renderPropTable({
      columns: sortableColumns,
      sort: { key: "id", dir: "desc" } as IngotSort,
      onSortChange,
    });

    fireEvent.click(screen.getByRole("button", { name: /Label/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "label", dir: "asc" });
  });

  it("a non-sortable header carries no aria-sort", () => {
    renderPropTable({
      columns: sortableColumns,
      sort: { key: "label", dir: "asc" } as IngotSort,
      onSortChange: () => {},
    });

    expect(screen.getByRole("columnheader", { name: "Id" })).not.toHaveAttribute(
      "aria-sort",
    );
  });
});

describe("IngotTable density (KAN-654)", () => {
  it("the default density keeps the padding of the first version", () => {
    renderPropTable();

    const cell = screen.getByTestId("row-a").querySelector("td")!;
    expect(cell.className).toContain("px-3 py-2");
  });

  it("compact pulls the cell padding down to 8px", () => {
    renderPropTable({ density: "compact" });

    const cell = screen.getByTestId("row-a").querySelector("td")!;
    expect(cell.className).toContain("p-2");
    expect(cell.className).not.toContain("px-3");
  });
});

describe("IngotTable stickyHeader", () => {
  it("is off by default", () => {
    const { container } = renderPropTable();

    expect(container.querySelector("thead")!.className).not.toContain("sticky");
  });

  it("pins the head and gives it an opaque background when asked", () => {
    const { container } = renderPropTable({ stickyHeader: true });

    const thead = container.querySelector("thead")!;
    expect(thead.className).toContain("sticky");
    // Without a background the rows scroll THROUGH the pinned head, which
    // looks like a rendering bug rather than a missing class.
    expect(thead.className).toContain("bg-surface-2");
  });

  it("keeps the a11y floor either way", () => {
    const { container } = renderPropTable({ stickyHeader: true });

    expect(container.querySelector("th")!.getAttribute("scope")).toBe("col");
  });
});
