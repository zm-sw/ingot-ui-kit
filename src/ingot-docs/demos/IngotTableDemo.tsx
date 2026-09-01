import { IngotEmptyState, IngotTable, type IngotColumn } from "@/ingot";

interface DemoRow {
  id: string;
  label: string;
  count: number;
}

const ROWS: readonly DemoRow[] = [
  { id: "a", label: "První", count: 12 },
  { id: "b", label: "Druhá", count: 4 },
  { id: "c", label: "Třetí", count: 137 },
];

const COLUMNS: readonly IngotColumn<DemoRow>[] = [
  { key: "order", header: "#", cell: (_row, index) => `#${index + 1}` },
  { key: "label", header: "Popisek", cell: (row) => row.label },
  { key: "count", header: "Počet", align: "end", cell: (row) => row.count },
];

export function Demo(): JSX.Element {
  return (
    <IngotTable
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(row) => row.id}
      caption="Ukázková tabulka"
      empty={<IngotEmptyState title="Zatím tu nic není" />}
      testId="docs-table"
    />
  );
}

