import { useState } from "react";

import { IngotBadge, IngotMegaMenu, IngotTopNav, IngotTopNavAccount } from "@/ingot";

export function Demo(): JSX.Element {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="min-h-[300px] w-full min-w-0">
      <IngotTopNav
        brand={
          <>
            Forgmatic <IngotBadge tone="ink">Admin</IngotBadge>
          </>
        }
        sections={[
          { key: "provoz", label: "Provoz" },
          { key: "procesy", label: "Procesy a kapacity" },
          { key: "sklad", label: "Sklad", href: "#/IngotTopNav", current: true },
          { key: "finance", label: "Finance", href: "#/IngotTopNav" },
        ]}
        openSection={open}
        onOpenSection={setOpen}
        onCloseSection={() => setOpen(null)}
        renderMenu={(key) =>
          key === "provoz" ? (
            <IngotMegaMenu
              groups={[
                {
                  title: "Denní provoz",
                  items: [
                    {
                      href: "#objednavky",
                      label: "Objednávky",
                      description: "Co je přijaté a co čeká na potvrzení výroby.",
                      count: 12,
                    },
                    {
                      href: "#poptavky",
                      label: "Poptávky",
                      description: "Nacenění, která zákazník zatím nepotvrdil.",
                      count: 48,
                    },
                  ],
                },
              ]}
              label="Provoz"
            />
          ) : (
            <IngotMegaMenu
              groups={[
                {
                  items: [
                    {
                      href: "#operace",
                      label: "Operace",
                      description: "Výrobní operace a jejich parametry.",
                    },
                    {
                      href: "#stroje",
                      label: "Stroje",
                      description: "Kapacity strojů a jejich směny.",
                    },
                  ],
                },
              ]}
              label="Procesy a kapacity"
            />
          )
        }
        account={<IngotTopNavAccount initials="8S" label="Menu účtu" />}
        testId="docs-topnav"
      />
    </div>
  );
}
