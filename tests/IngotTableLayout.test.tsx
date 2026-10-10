/**
 * IngotTable layout (KAN-1999) — the user arranges the columns: picker,
 * column menu, resize, drag. The table holds no layout of its own; these
 * tests check that it draws the layout it is given and reports changes,
 * and that a stale stored layout cannot break it.
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotTable, type IngotColumn, type IngotTableLayout } from "@/ingot";
import { hiddenKeys, moveKey, orderedKeys } from "@/ingot/tableLayout";

interface Row {
  id: string;
  name: string;
  state: string;
  count: number;
}

const ROWS: Row[] = [
  { id: "a", name: "Alpha", state: "open", count: 2 },
  { id: "b", name: "Beta", state: "closed", count: 40 },
];

const COLUMNS: IngotColumn<Row>[] = [
  { key: "name", header: "Name", cell: (row) => row.name, hideable: false },
  { key: "state", header: "State", cell: (row) => row.state },
  { key: "count", header: "Count", cell: (row) => row.count, align: "end" },
];

function headers(): string[] {
  return screen
    .getAllByRole("columnheader")
    .map((th) => th.getAttribute("data-testid") ?? "")
    .filter((id) => id.startsWith("t-head-"))
    .map((id) => id.slice("t-head-".length));
}

function Harness({
  initial = {},
  onChange,
  columns = COLUMNS,
}: {
  initial?: IngotTableLayout;
  onChange?: (layout: IngotTableLayout) => void;
  columns?: IngotColumn<Row>[];
}) {
  const [layout, setLayout] = useState<IngotTableLayout>(initial);
  return (
    <IngotTable<Row>
      columns={columns}
      rows={ROWS}
      rowKey={(row) => row.id}
      layout={layout}
      onLayoutChange={(next) => {
        setLayout(next);
        onChange?.(next);
      }}
      onLayoutReset={() => setLayout({})}
      testId="t"
    />
  );
}

describe("layout functions", () => {
  it("orderedKeys ignores unknown and duplicate keys and appends new columns", () => {
    expect(orderedKeys(["a", "b", "c"], { order: ["c", "gone", "c", "a"] })).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("hiddenKeys never hides a locked column", () => {
    expect([...hiddenKeys({ hidden: ["a", "b"] }, new Set(["a"]))]).toEqual(["b"]);
  });

  it("moveKey moves among visible columns and keeps hidden ones in their slots", () => {
    const hidden = new Set(["b"]);
    expect(moveKey(["a", "b", "c", "d"], hidden, "d", "first")).toEqual([
      "d",
      "b",
      "a",
      "c",
    ]);
    expect(moveKey(["a", "b", "c", "d"], hidden, "a", "right")).toEqual([
      "c",
      "b",
      "a",
      "d",
    ]);
    expect(moveKey(["a", "b", "c", "d"], hidden, "a", "left")).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });
});

describe("IngotTable with a layout", () => {
  it("draws the stored order and leaves out hidden columns", () => {
    render(<Harness initial={{ order: ["count", "name"], hidden: ["state"] }} />);

    expect(headers()).toEqual(["count", "name"]);
  });

  it("survives a layout written for other columns", () => {
    render(
      <Harness initial={{ order: ["gone", "state"], hidden: ["name", "gone"] }} />,
    );

    // `name` may not be hidden and `count` was never in the stored order.
    expect(headers()).toEqual(["state", "name", "count"]);
  });

  it("applies a layout without the arranging UI when no onLayoutChange is given", () => {
    render(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        layout={{ hidden: ["count"] }}
        testId="t"
      />,
    );

    expect(headers()).toEqual(["name", "state"]);
    expect(screen.queryByRole("button", { name: "Columns" })).toBeNull();
  });

  it("keeps the empty row as wide as the header, picker column included", () => {
    render(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={[]}
        rowKey={(row) => row.id}
        layout={{ hidden: ["count"] }}
        onLayoutChange={() => {}}
        empty="nothing"
      />,
    );

    expect(screen.getByText("nothing").closest("td")).toHaveAttribute("colSpan", "3");
  });
});

describe("the column picker", () => {
  it("hides and shows a column and reports the layout", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    fireEvent.click(screen.getByTestId("t-columns-toggle-state"));

    expect(headers()).toEqual(["name", "count"]);
    expect(onChange).toHaveBeenLastCalledWith({
      order: ["name", "state", "count"],
      hidden: ["state"],
    });

    fireEvent.click(screen.getByTestId("t-columns-toggle-state"));
    expect(headers()).toEqual(["name", "state", "count"]);
  });

  it("cannot hide a column that may not be hidden", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));

    expect(screen.getByTestId("t-columns-toggle-name")).toBeDisabled();
  });

  it("filters its list by the search field and counts what is shown", () => {
    render(<Harness initial={{ hidden: ["count"] }} />);
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    const panel = screen.getByTestId("t-columns-panel");

    expect(within(panel).getByText("2 / 3")).toBeInTheDocument();
    fireEvent.change(within(panel).getByRole("searchbox"), {
      target: { value: "sta" },
    });
    expect(within(panel).getAllByRole("checkbox")).toHaveLength(1);
  });

  it("resets to the default layout", () => {
    render(
      <Harness initial={{ order: ["count", "state", "name"], hidden: ["state"] }} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    fireEvent.click(screen.getByTestId("t-columns-reset"));

    expect(headers()).toEqual(["name", "state", "count"]);
  });
});

describe("the column menu", () => {
  function openMenu(key: string) {
    fireEvent.click(screen.getByTestId(`t-col-${key}`));
    return screen.getByTestId(`t-col-${key}-menu`);
  }

  it("moves a column and disables the moves that go nowhere", () => {
    render(<Harness />);

    const menu = openMenu("name");
    expect(within(menu).getByRole("menuitem", { name: "Move left" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    fireEvent.click(
      within(menu).getByRole("menuitem", { name: "Move to last position" }),
    );

    expect(headers()).toEqual(["state", "count", "name"]);
  });

  it("hides a column, and offers no hide on a locked one", () => {
    render(<Harness />);

    expect(
      within(openMenu("name")).queryByRole("menuitem", { name: "Hide column" }),
    ).toBeNull();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });

    fireEvent.click(
      within(openMenu("state")).getByRole("menuitem", { name: "Hide column" }),
    );
    expect(headers()).toEqual(["name", "count"]);
  });

  it("sorts through the menu only when the column is sortable", () => {
    const onSortChange = vi.fn();
    render(
      <IngotTable<Row>
        columns={[{ ...COLUMNS[0], sortable: true }, COLUMNS[1]]}
        rows={ROWS}
        rowKey={(row) => row.id}
        sort={{ key: "name", dir: "asc" }}
        onSortChange={onSortChange}
        onLayoutChange={() => {}}
        testId="t"
      />,
    );

    fireEvent.click(
      within(openMenu("name")).getByRole("menuitem", { name: "Sort descending" }),
    );
    expect(onSortChange).toHaveBeenCalledWith({ key: "name", dir: "desc" });
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(
      within(openMenu("state")).queryByRole("menuitem", { name: "Sort ascending" }),
    ).toBeNull();
  });

  it("opens the column's own filter", () => {
    render(
      <Harness
        columns={[
          COLUMNS[0],
          { ...COLUMNS[1], filter: <span>state filter</span>, filterActive: true },
          COLUMNS[2],
        ]}
      />,
    );

    fireEvent.click(
      within(openMenu("state")).getByRole("menuitem", { name: "Filter" }),
    );
    expect(
      within(screen.getByTestId("t-col-state-filter")).getByText("state filter"),
    ).toBeInTheDocument();
  });
});

describe("resizing", () => {
  it("the keyboard widens a column and the layout records the width", () => {
    const onChange = vi.fn();
    render(<Harness initial={{ widths: { count: 100 } }} onChange={onChange} />);

    const handle = screen.getByRole("separator", { name: "Resize column: Count" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(onChange).toHaveBeenLastCalledWith({ widths: { count: 116 } });
    expect(screen.getByTestId("t-head-count").style.width).toBe("116px");
  });

  it("never shrinks below the minimum", () => {
    const onChange = vi.fn();
    render(<Harness initial={{ widths: { count: 70 } }} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole("separator", { name: "Resize column: Count" }), {
      key: "ArrowLeft",
    });
    expect(onChange).toHaveBeenLastCalledWith({ widths: { count: 64 } });
  });
});

describe("dragging a header", () => {
  it("drops a column onto another column's place", () => {
    render(<Harness />);

    const source = within(screen.getByTestId("t-head-count")).getByText("Count");
    const transfer = { setData: () => {}, effectAllowed: "" };
    fireEvent.dragStart(source.closest("[draggable]")!, { dataTransfer: transfer });
    fireEvent.dragOver(screen.getByTestId("t-head-name"), { dataTransfer: transfer });
    fireEvent.drop(screen.getByTestId("t-head-name"), { dataTransfer: transfer });

    expect(headers()).toEqual(["count", "name", "state"]);
  });
});

describe("walking the rows with the keyboard", () => {
  function renderWalk(onRowOpen = vi.fn(), onSelectedKeysChange = vi.fn()) {
    render(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        rowTestId={(row) => `row-${row.id}`}
        keyboard
        onRowOpen={onRowOpen}
        selectedKeys={new Set()}
        onSelectedKeysChange={onSelectedKeysChange}
        footer="2"
        testId="t"
      />,
    );
    return { box: screen.getByTestId("t-scroll"), onRowOpen, onSelectedKeysChange };
  }

  it("J and K move the active row, Enter opens it, X selects it", () => {
    const { box, onRowOpen, onSelectedKeysChange } = renderWalk();

    fireEvent.keyDown(box, { key: "j" });
    fireEvent.keyDown(box, { key: "j" });
    fireEvent.keyDown(box, { key: "j" });
    expect(box).toHaveAttribute(
      "aria-activedescendant",
      screen.getByTestId("row-b").id,
    );

    fireEvent.keyDown(box, { key: "k" });
    fireEvent.keyDown(box, { key: "Enter" });
    expect(onRowOpen).toHaveBeenCalledWith(ROWS[0]);

    fireEvent.keyDown(box, { key: "x" });
    expect(onSelectedKeysChange).toHaveBeenCalledWith(new Set(["a"]));
  });

  it("ignores keys typed into a control inside the table", () => {
    const { box } = renderWalk();

    const checkbox = within(screen.getByTestId("row-a")).getByRole("checkbox");
    fireEvent.keyDown(checkbox, { key: "j" });
    expect(box).not.toHaveAttribute("aria-activedescendant");
  });

  it("prints the shortcuts in the footer", () => {
    renderWalk();

    expect(screen.getByTestId("t-keys")).toHaveTextContent("JKmoveXselect↵open");
  });

  it("does nothing without the keyboard prop", () => {
    render(
      <IngotTable<Row>
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        testId="t"
      />,
    );

    const box = screen.getByTestId("t-scroll");
    fireEvent.keyDown(box, { key: "j" });
    expect(box).not.toHaveAttribute("aria-activedescendant");
  });
});
