/**
 * Tabulka + prázdný stav (KAN-585) — čtvrté primitivum Ingotu.
 *
 * Testy míří na to, co tabulka opravuje **strukturálně**, protože právě to
 * ruční `<table>` v repu neuměly:
 *
 * 1. **`colSpan` se počítá.** Ruční prázdné stavy mají `colSpan={5}` natvrdo
 *    a při přidání sloupce se tiše rozejdou. Test proto neověřuje, že tam
 *    `colSpan` je, ale že se **rovná počtu sloupců** — a že se změní, když
 *    přibude sloupec akcí. Bez toho druhého by test prošel i nad zadrátovanou
 *    konstantou.
 * 2. **`<th scope="col">` na každém sloupci.** Ze 42 souborů s ručním
 *    `<thead>` má `scope` jen 12.
 * 3. **Loading není ticho.** Prázdné tělo se spinnerem zní pro odečítač
 *    stejně jako „nic tu není"; proto `aria-busy` a `role="status"`.
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

describe("IngotTable — sémantika hlavičky", () => {
  it("každý sloupec je <th scope=\"col\">", () => {
    renderTable();
    const heads = screen.getAllByRole("columnheader");
    expect(heads).toHaveLength(2);
    for (const th of heads) expect(th).toHaveAttribute("scope", "col");
  });

  it("caption popisuje tabulku pro odečítač", () => {
    renderTable({ caption: "Seznam položek" });
    expect(screen.getByRole("table")).toHaveAccessibleName("Seznam položek");
  });

  it("sloupec akcí má popisek pro odečítač, i když ho není vidět", () => {
    renderTable({
      actions: (row) => <button type="button">smazat {row.name}</button>,
      actionsLabel: "Akce",
    });
    const heads = screen.getAllByRole("columnheader");
    expect(heads).toHaveLength(3);
    expect(heads[2]).toHaveTextContent("Akce");
  });
});

describe("IngotTable — řádky", () => {
  it("vykreslí buňku pro každý sloupec a řádek", () => {
    renderTable();
    expect(screen.getByText("První")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("cell dostane pořadí řádku", () => {
    renderTable({
      columns: [
        { key: "rank", header: "#", cell: (_row, index) => `#${index + 1}` },
      ],
    });
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  it("rowTestId označí řádek", () => {
    renderTable({ rowTestId: (row) => `radek-${row.id}` });
    expect(screen.getByTestId("radek-a")).toBeInTheDocument();
    expect(screen.getByTestId("radek-b")).toBeInTheDocument();
  });

  it("řádkové akce jsou v poslední buňce a jsou dosažitelné klávesnicí", () => {
    renderTable({
      actions: (row) => <button type="button">smazat {row.name}</button>,
      actionsLabel: "Akce",
    });
    const button = screen.getByRole("button", { name: "smazat První" });
    expect(button).toBeInTheDocument();
    // Ne za hoverem: `opacity-0 group-hover:…` je pro klávesnici past,
    // takže primitivum na akce žádnou takovou třídu nedává.
    expect(button.closest("td")).not.toHaveClass("opacity-0");
  });
});

describe("IngotTable — colSpan se POČÍTÁ, není zadrátovaný", () => {
  it("prázdný řádek je široký jako počet sloupců", () => {
    renderTable({ rows: [], empty: <IngotEmptyState title="Nic tu není" /> });
    const cell = screen.getByText("Nic tu není").closest("td");
    expect(cell).toHaveAttribute("colSpan", "2");
  });

  it("sloupec akcí ten počet zvedne", () => {
    renderTable({
      rows: [],
      empty: <IngotEmptyState title="Nic tu není" />,
      actions: () => <button type="button">akce</button>,
      actionsLabel: "Akce",
    });
    const cell = screen.getByText("Nic tu není").closest("td");
    // Kdyby byl colSpan konstanta, tenhle případ ji usvědčí.
    expect(cell).toHaveAttribute("colSpan", "3");
  });
});

describe("IngotTable — prázdný a loading stav", () => {
  it("prázdný stav se ukáže jen když nejsou řádky", () => {
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

  it("loading řekne odečítači, že se čeká — a nevykreslí řádky ani prázdno", () => {
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
  it("ukáže titulek, popis i afordanci", () => {
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

  it("popis ani afordance nejsou povinné", () => {
    render(<IngotEmptyState title="Prázdno" testId="prazdno" />);
    const box = screen.getByTestId("prazdno");
    expect(box).toHaveTextContent("Prázdno");
    expect(within(box).queryByRole("button")).toBeNull();
  });
});
