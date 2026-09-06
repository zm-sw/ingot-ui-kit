import { useState } from "react";

import {
  Button,
  IngotBadge,
  IngotEmptyState,
  IngotTable,
  type IngotColumn,
  type IngotSort,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

interface DemoRow {
  id: string;
  code: string;
  customer: string;
  product: string;
  state: string;
  due: string;
  count: number;
  price: number;
  operator: string;
}

const TEXT: Localized<Record<string, string>> = {
  cs: {
    code: "Číslo",
    customer: "Zákazník",
    product: "Výrobek",
    state: "Stav",
    due: "Termín",
    count: "Kusů",
    price: "Cena",
    operator: "Obsluha",
    caption: "Zakázky ve výrobě",
    empty: "Zatím tu nic není",
    selectAll: "Vybrat vše",
    select: "Vybrat",
    selected: "Vybráno:",
    clear: "Zrušit výběr",
    inProduction: "Ve výrobě",
    queued: "Ve frontě",
    late: "Po termínu",
    customerA: "Strojírny Beneš",
    customerB: "Zámečnictví Hrubý",
    customerC: "Kovo Sedlčany",
    productA: "Příruba DN80",
    productB: "Konzole svařovaná",
    productC: "Hřídel kalená",
    operatorA: "J. Marek",
    operatorB: "P. Doležal",
    operatorC: "M. Krátká",
  },
  en: {
    code: "Number",
    customer: "Customer",
    product: "Product",
    state: "State",
    due: "Due",
    count: "Pieces",
    price: "Price",
    operator: "Operator",
    caption: "Orders in production",
    empty: "Nothing here yet",
    selectAll: "Select all",
    select: "Select",
    selected: "Selected:",
    clear: "Clear the selection",
    inProduction: "In production",
    queued: "Queued",
    late: "Overdue",
    customerA: "Benes Engineering",
    customerB: "Hruby Metalwork",
    customerC: "Kovo Sedlcany",
    productA: "Flange DN80",
    productB: "Welded bracket",
    productC: "Hardened shaft",
    operatorA: "J. Marek",
    operatorB: "P. Dolezal",
    operatorC: "M. Kratka",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const rowsData: readonly DemoRow[] = [
    {
      id: "a",
      code: "ZAK-2026-0184",
      customer: t.customerA,
      product: t.productA,
      state: t.inProduction,
      due: "12. 9. 2026",
      count: 120,
      price: 48600,
      operator: t.operatorA,
    },
    {
      id: "b",
      code: "ZAK-2026-0185",
      customer: t.customerB,
      product: t.productB,
      state: t.queued,
      due: "18. 9. 2026",
      count: 24,
      price: 12400,
      operator: t.operatorB,
    },
    {
      id: "c",
      code: "ZAK-2026-0179",
      customer: t.customerC,
      product: t.productC,
      state: t.late,
      due: "2. 9. 2026",
      count: 8,
      price: 91200,
      operator: t.operatorC,
    },
  ];

  const tone = (state: string) => {
    if (state === t.late) return "danger" as const;
    if (state === t.inProduction) return "accent" as const;
    return "neutral" as const;
  };

  const columns: readonly IngotColumn<DemoRow>[] = [
    { key: "order", header: "#", cell: (_row, index) => `#${index + 1}` },
    {
      key: "code",
      header: t.code,
      cell: (row) => row.code,
      cellClassName: "whitespace-nowrap font-mono",
      sortable: true,
    },
    {
      key: "customer",
      header: t.customer,
      cell: (row) => row.customer,
      cellClassName: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "product",
      header: t.product,
      cell: (row) => row.product,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "state",
      header: t.state,
      cell: (row) => <IngotBadge tone={tone(row.state)}>{row.state}</IngotBadge>,
    },
    {
      key: "due",
      header: t.due,
      cell: (row) => row.due,
      cellClassName: "whitespace-nowrap",
      sortable: true,
    },
    { key: "count", header: t.count, align: "end", cell: (row) => row.count },
    {
      key: "price",
      header: t.price,
      align: "end",
      cell: (row) => row.price.toLocaleString(lang === "cs" ? "cs-CZ" : "en-GB"),
      sortable: true,
    },
    {
      key: "operator",
      header: t.operator,
      cell: (row) => row.operator,
      cellClassName: "whitespace-nowrap",
    },
  ];

  const [sort, setSort] = useState<IngotSort>({ key: "code", dir: "asc" });
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const rows = [...rowsData].sort((a, b) => {
    const flip = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "count") return (a.count - b.count) * flip;
    if (sort.key === "price") return (a.price - b.price) * flip;
    if (sort.key === "customer")
      return a.customer.localeCompare(b.customer, lang) * flip;
    if (sort.key === "due") return a.due.localeCompare(b.due, lang) * flip;
    return a.code.localeCompare(b.code, lang) * flip;
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
      selectRowLabel={(row) => `${t.select} ${row.code}`}
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
