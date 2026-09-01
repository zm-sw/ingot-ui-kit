import { useState } from "react";

import {
  Button,
  IngotEmptyState,
  IngotTable,
  type IngotColumn,
  type IngotSort,
} from "@/ingot";

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
  { key: "label", header: "Popisek", cell: (row) => row.label, sortable: true },
  {
    key: "count",
    header: "Počet",
    align: "end",
    cell: (row) => row.count,
    sortable: true,
  },
];

export function Demo(): JSX.Element {
  const [sort, setSort] = useState<IngotSort>({ key: "label", dir: "asc" });
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const rows = [...ROWS].sort((a, b) => {
    const flip = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "count") return (a.count - b.count) * flip;
    return a.label.localeCompare(b.label, "cs") * flip;
  });

  return (
    <IngotTable
      columns={COLUMNS}
      rows={rows}
      rowKey={(row) => row.id}
      caption="Ukázková tabulka"
      empty={<IngotEmptyState title="Zatím tu nic není" />}
      sort={sort}
      onSortChange={setSort}
      selectedKeys={selected}
      onSelectedKeysChange={setSelected}
      selectAllLabel="Vybrat vše"
      selectRowLabel={(row) => `Vybrat ${row.label}`}
      bulkbar={
        <>
          <span>Vybráno: {selected.size}</span>
          <Button size="sm" onClick={() => setSelected(new Set())}>
            Zrušit výběr
          </Button>
        </>
      }
      testId="docs-table"
    />
  );
}
