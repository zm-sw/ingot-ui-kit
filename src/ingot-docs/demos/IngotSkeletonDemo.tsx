import { useState } from "react";

import {
  Button,
  IngotBadge,
  IngotEyebrow,
  IngotSkeleton,
  IngotTable,
  type IngotColumn,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

interface OrderRow {
  id: string;
  code: string;
  customer: string;
  state: string;
  count: number;
}

const TEXT: Localized<Record<string, string>> = {
  cs: {
    reload: "Načíst znovu",
    loading: "Načítají se zakázky",
    caption: "Zakázky ve výrobě",
    code: "Číslo",
    customer: "Zákazník",
    state: "Stav",
    count: "Kusů",
    inProduction: "Ve výrobě",
    queued: "Ve frontě",
    customerA: "Strojírny Beneš",
    customerB: "Zámečnictví Hrubý",
    shapes: "Tvary",
    text: "text — odstavec",
    metrics: "metrics — řada dlaždic",
  },
  en: {
    reload: "Load again",
    loading: "Loading the orders",
    caption: "Orders in production",
    code: "Number",
    customer: "Customer",
    state: "State",
    count: "Pieces",
    inProduction: "In production",
    queued: "Queued",
    customerA: "Benes Engineering",
    customerB: "Hruby Metalwork",
    shapes: "Shapes",
    text: "text — a paragraph",
    metrics: "metrics — a row of tiles",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [loading, setLoading] = useState(true);

  const rows: readonly OrderRow[] = [
    {
      id: "a",
      code: "ZAK-2026-0184",
      customer: t.customerA,
      state: t.inProduction,
      count: 120,
    },
    {
      id: "b",
      code: "ZAK-2026-0185",
      customer: t.customerB,
      state: t.queued,
      count: 24,
    },
  ];
  const columns: readonly IngotColumn<OrderRow>[] = [
    {
      key: "code",
      header: t.code,
      cell: (row) => row.code,
      cellClassName: "font-mono",
    },
    { key: "customer", header: t.customer, cell: (row) => row.customer },
    {
      key: "state",
      header: t.state,
      cell: (row) => (
        <IngotBadge tone={row.state === t.inProduction ? "accent" : "neutral"}>
          {row.state}
        </IngotBadge>
      ),
    },
    { key: "count", header: t.count, align: "end", cell: (row) => row.count },
  ];

  return (
    <div className="w-full max-w-xl space-y-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setLoading(true);
          window.setTimeout(() => setLoading(false), 1400);
        }}
      >
        {t.reload}
      </Button>

      {loading ? (
        <IngotSkeleton
          shape="table"
          rows={2}
          label={t.loading}
          testId="docs-skeleton"
        />
      ) : (
        <IngotTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          caption={t.caption}
        />
      )}

      <div className="space-y-3">
        <IngotEyebrow tone="muted">{t.shapes}</IngotEyebrow>
        <IngotEyebrow as="p" tone="muted">
          {t.text}
        </IngotEyebrow>
        <IngotSkeleton shape="text" rows={3} label={t.loading} />
        <IngotEyebrow as="p" tone="muted">
          {t.metrics}
        </IngotEyebrow>
        <IngotSkeleton shape="metrics" label={t.loading} />
      </div>
    </div>
  );
}
