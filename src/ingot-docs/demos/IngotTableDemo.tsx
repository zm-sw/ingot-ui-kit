import { useState } from "react";

import {
  Button,
  IngotEmptyState,
  IngotTable,
  type IngotColumn,
  type IngotSort,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

interface DemoRow {
  id: string;
  label: string;
  count: number;
}

const TEXT: Localized<Record<string, string>> = {
  cs: {
    first: "První",
    second: "Druhá",
    third: "Třetí",
    label: "Popisek",
    count: "Počet",
    caption: "Ukázková tabulka",
    empty: "Zatím tu nic není",
    selectAll: "Vybrat vše",
    select: "Vybrat",
    selected: "Vybráno:",
    clear: "Zrušit výběr",
  },
  en: {
    first: "First",
    second: "Second",
    third: "Third",
    label: "Label",
    count: "Count",
    caption: "A sample table",
    empty: "Nothing here yet",
    selectAll: "Select all",
    select: "Select",
    selected: "Selected:",
    clear: "Clear the selection",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const rowsData: readonly DemoRow[] = [
    { id: "a", label: t.first, count: 12 },
    { id: "b", label: t.second, count: 4 },
    { id: "c", label: t.third, count: 137 },
  ];
  const columns: readonly IngotColumn<DemoRow>[] = [
    { key: "order", header: "#", cell: (_row, index) => `#${index + 1}` },
    { key: "label", header: t.label, cell: (row) => row.label, sortable: true },
    {
      key: "count",
      header: t.count,
      align: "end",
      cell: (row) => row.count,
      sortable: true,
    },
  ];

  const [sort, setSort] = useState<IngotSort>({ key: "label", dir: "asc" });
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const rows = [...rowsData].sort((a, b) => {
    const flip = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "count") return (a.count - b.count) * flip;
    return a.label.localeCompare(b.label, lang) * flip;
  });

  return (
    <IngotTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      caption={t.caption}
      empty={<IngotEmptyState title={t.empty} />}
      sort={sort}
      onSortChange={setSort}
      selectedKeys={selected}
      onSelectedKeysChange={setSelected}
      selectAllLabel={t.selectAll}
      selectRowLabel={(row) => `${t.select} ${row.label}`}
      bulkbar={
        <>
          <span>
            {t.selected} {selected.size}
          </span>
          <Button size="sm" onClick={() => setSelected(new Set())}>
            {t.clear}
          </Button>
        </>
      }
      testId="docs-table"
    />
  );
}
