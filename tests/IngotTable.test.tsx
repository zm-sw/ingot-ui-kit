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

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotEmptyState, IngotTable, type IngotColumn } from "@/ingot";

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
