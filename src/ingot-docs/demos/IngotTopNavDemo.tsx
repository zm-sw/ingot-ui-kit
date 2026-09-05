import { useState } from "react";

import { IngotBadge, IngotMegaMenu, IngotTopNav, IngotTopNavAccount } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    shop: "Provoz",
    processes: "Procesy a kapacity",
    store: "Sklad",
    finance: "Finance",
    daily: "Denní provoz",
    orders: "Objednávky",
    ordersText: "Co je přijaté a co čeká na potvrzení výroby.",
    enquiries: "Poptávky",
    enquiriesText: "Nacenění, která zákazník zatím nepotvrdil.",
    operations: "Operace",
    operationsText: "Výrobní operace a jejich parametry.",
    machines: "Stroje",
    machinesText: "Kapacity strojů a jejich směny.",
    account: "Menu účtu",
  },
  en: {
    shop: "Shop floor",
    processes: "Processes and capacity",
    store: "Store",
    finance: "Finance",
    daily: "Day to day",
    orders: "Orders",
    ordersText: "What has been taken and what waits for production to confirm.",
    enquiries: "Enquiries",
    enquiriesText: "Prices the customer has not confirmed yet.",
    operations: "Operations",
    operationsText: "Production operations and their parameters.",
    machines: "Machines",
    machinesText: "Machine capacity and its shifts.",
    account: "Account menu",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [open, setOpen] = useState<string | null>(null);
  const here = "/komponenty/top-nav";
  return (
    <div className="min-h-[300px] w-full min-w-0">
      <IngotTopNav
        brand={
          <>
            Forgmatic <IngotBadge tone="ink">Admin</IngotBadge>
          </>
        }
        sections={[
          { key: "provoz", label: t.shop },
          { key: "procesy", label: t.processes },
          { key: "sklad", label: t.store, href: here, current: true },
          { key: "finance", label: t.finance, href: here },
        ]}
        openSection={open}
        onOpenSection={setOpen}
        onCloseSection={() => setOpen(null)}
        renderMenu={(key) =>
          key === "provoz" ? (
            <IngotMegaMenu
              groups={[
                {
                  title: t.daily,
                  items: [
                    {
                      href: "#objednavky",
                      label: t.orders,
                      description: t.ordersText,
                      count: 12,
                    },
                    {
                      href: "#poptavky",
                      label: t.enquiries,
                      description: t.enquiriesText,
                      count: 48,
                    },
                  ],
                },
              ]}
              label={t.shop}
            />
          ) : (
            <IngotMegaMenu
              groups={[
                {
                  items: [
                    {
                      href: "#operace",
                      label: t.operations,
                      description: t.operationsText,
                    },
                    {
                      href: "#stroje",
                      label: t.machines,
                      description: t.machinesText,
                    },
                  ],
                },
              ]}
              label={t.processes}
            />
          )
        }
        account={<IngotTopNavAccount initials="8S" label={t.account} />}
        testId="docs-topnav"
      />
    </div>
  );
}
