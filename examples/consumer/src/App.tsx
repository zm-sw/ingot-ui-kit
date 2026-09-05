import { useState } from "react";

import {
  Button,
  IngotBreadcrumbs,
  IngotPageHeader,
  IngotPageLayout,
  IngotProvider,
  IngotTable,
  IngotTopNav,
  type IngotColumn,
} from "@forgmatic/ingot";
import { IngotDrawer } from "@forgmatic/ingot";
import { IngotMarketingCta } from "@forgmatic/ingot/marketing";
import { applyTheme, readStoredTheme, writeStoredTheme } from "@forgmatic/ingot/theme";

/**
 * The smallest application that is still a real one.
 *
 * It exists to fail. Every kind of mistake this repository cannot see in
 * its own tests shows up here as a build error: a module that leaked a
 * relative path out of the package, an export the barrel forgot, a peer
 * dependency nobody declared, a Tailwind class that only exists because
 * the doc web happened to have it in `content`.
 *
 * Nothing here reaches into the kit's sources. It installs the packed
 * package, exactly as anyone outside this repository would.
 */

interface Order {
  id: string;
  customer: string;
  pieces: number;
  state: string;
}

const ORDERS: readonly Order[] = [
  {
    id: "2411-018",
    customer: "Kovosvit Sezimovo Ústí",
    pieces: 240,
    state: "Ve výrobě",
  },
  {
    id: "2411-019",
    customer: "Strojírny Poldi",
    pieces: 60,
    state: "Čeká na materiál",
  },
  { id: "2411-021", customer: "TS Plzeň", pieces: 1200, state: "Hotovo" },
];

const COLUMNS: readonly IngotColumn<Order>[] = [
  { key: "id", header: "Zakázka", cell: (row) => row.id },
  { key: "customer", header: "Odběratel", cell: (row) => row.customer },
  { key: "pieces", header: "Kusů", cell: (row) => row.pieces, align: "end" },
  { key: "state", header: "Stav", cell: (row) => row.state },
];

export function App(): JSX.Element {
  const [detail, setDetail] = useState<Order | null>(null);
  const [theme, setTheme] = useState(readStoredTheme);

  function toggleTheme(): void {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    writeStoredTheme(next);
    applyTheme(next);
  }

  return (
    <IngotProvider lang="cs">
      <IngotTopNav
        brand={<span className="font-semibold">Forgmatic</span>}
        actions={
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "dark" ? "Světlý motiv" : "Tmavý motiv"}
          </Button>
        }
      />
      <IngotPageLayout>
        <IngotBreadcrumbs
          label="Kde jsem"
          items={[{ label: "Výroba", href: "#" }, { label: "Zakázky" }]}
        />
        <IngotPageHeader
          title="Zakázky"
          description="Přehled běžících zakázek z výrobního plánu."
          actions={<Button>Nová zakázka</Button>}
        />
        <IngotTable
          columns={COLUMNS}
          rows={ORDERS}
          rowKey={(row) => row.id}
          caption="Zakázky ve výrobě"
          actions={(row) => (
            <Button variant="ghost" onClick={() => setDetail(row)}>
              Detail
            </Button>
          )}
          actionsLabel="Akce"
        />
        <IngotMarketingCta
          title="Chcete stejný přehled i u sebe?"
          text="Ingot je jeden zdroj pravdy pro vzhled Forgmaticu — administrace i veřejné stránky."
          primary={{ label: "Vyzkoušet", href: "https://ingot.forgmatic.com" }}
        />
      </IngotPageLayout>
      {detail !== null && (
        <IngotDrawer
          title={`Zakázka ${detail.id}`}
          subtitle={detail.customer}
          closeLabel="Zavřít"
          onClose={() => setDetail(null)}
        >
          <p className="text-sm text-ink-2">
            {detail.pieces} kusů, stav: {detail.state}.
          </p>
        </IngotDrawer>
      )}
    </IngotProvider>
  );
}
