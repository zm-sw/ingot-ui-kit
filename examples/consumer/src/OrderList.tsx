import { useState } from "react";

import {
  Button,
  IngotBadge,
  IngotBreadcrumbs,
  IngotEmptyState,
  IngotPageHeader,
  IngotPageLayout,
  IngotPagination,
  IngotSearchInput,
  IngotSkeleton,
  IngotTable,
  IngotToolbar,
  type IngotColumn,
  type IngotSort,
} from "@forgmatic/ingot";

import { ORDERS, type Order } from "./orders";

/**
 * The list screen: a toolbar, a table, paging, an empty state.
 *
 * Together with `OrderDetail` this is the point of this example. Not
 * "does the package install" — the old screen already proved that — but
 * **can a real screen be built from the kit alone**. Until these two
 * existed nobody could answer it, because there was nothing to check: the
 * kit had no frame, no grid, no action bar and no loading state, so every
 * screen filled the gaps with its own utilities and the question stopped
 * being askable.
 *
 * The `ingot-docs-kit-only` guard reads this directory now. A `<table>`,
 * a `<button>` or a `<ul>` written here fails the build.
 */
export function OrderList({ onOpen }: { onOpen: (order: Order) => void }): JSX.Element {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<IngotSort>({ key: "id", dir: "asc" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const found = ORDERS.filter((order) =>
    `${order.id} ${order.customer} ${order.product}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const rows = [...found].sort((a, b) => {
    const flip = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "pieces") return (a.pieces - b.pieces) * flip;
    if (sort.key === "customer")
      return a.customer.localeCompare(b.customer, "cs") * flip;
    return a.id.localeCompare(b.id, "cs") * flip;
  });

  const columns: readonly IngotColumn<Order>[] = [
    {
      key: "id",
      header: "Zakázka",
      cell: (row) => row.id,
      cellClassName: "whitespace-nowrap font-mono",
      sortable: true,
    },
    {
      key: "customer",
      header: "Odběratel",
      cell: (row) => row.customer,
      cellClassName: "whitespace-nowrap",
      sortable: true,
    },
    { key: "product", header: "Výrobek", cell: (row) => row.product },
    {
      key: "state",
      header: "Stav",
      cell: (row) => <IngotBadge tone={row.tone}>{row.state}</IngotBadge>,
    },
    {
      key: "due",
      header: "Termín",
      cell: (row) => row.due,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "pieces",
      header: "Kusů",
      align: "end",
      cell: (row) => row.pieces,
      sortable: true,
    },
    {
      key: "price",
      header: "Cena",
      align: "end",
      cell: (row) => row.price.toLocaleString("cs-CZ"),
    },
    { key: "operator", header: "Obsluha", cell: (row) => row.operator },
    { key: "site", header: "Provoz", cell: (row) => row.site },
  ];

  return (
    <IngotPageLayout>
      <IngotBreadcrumbs
        label="Kde jsem"
        items={[{ label: "Výroba", href: "#" }, { label: "Zakázky" }]}
      />
      <IngotPageHeader
        title="Zakázky"
        description="Přehled běžících zakázek z výrobního plánu."
        actions={<Button variant="accent">Nová zakázka</Button>}
      />

      <IngotToolbar>
        <IngotSearchInput
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          label="Hledat zakázku"
          placeholder="Číslo, odběratel nebo výrobek…"
          className="w-64"
        />
        <Button
          variant="secondary"
          className="ml-auto"
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 900);
          }}
        >
          Načíst znovu
        </Button>
      </IngotToolbar>

      {loading ? (
        <IngotSkeleton shape="table" rows={4} label="Načítají se zakázky" />
      ) : (
        <IngotTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          caption="Zakázky ve výrobě"
          sort={sort}
          onSortChange={setSort}
          empty={
            <IngotEmptyState
              title="Žádná zakázka neodpovídá"
              description="Zkuste kratší dotaz nebo jiné číslo zakázky."
            />
          }
          actions={(row) => (
            <Button variant="ghost" size="sm" onClick={() => onOpen(row)}>
              Detail
            </Button>
          )}
          actionsLabel="Akce"
        />
      )}

      {rows.length > 0 && (
        <IngotPagination
          page={page}
          pageCount={3}
          onPageChange={setPage}
          label="Stránkování zakázek"
          prevLabel="Předchozí"
          nextLabel="Další"
        />
      )}
    </IngotPageLayout>
  );
}
