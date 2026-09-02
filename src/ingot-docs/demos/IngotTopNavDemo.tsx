import { useState } from "react";

import { IngotBadge, IngotTopNav, IngotTopNavAccount } from "@/ingot";
export function Demo(): JSX.Element {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="w-full min-w-0">
      <IngotTopNav
        brand={
          <>
            Forgmatic <IngotBadge tone="ink">Admin</IngotBadge>
          </>
        }
        sections={[
          { key: "provoz", label: "Provoz" },
          { key: "procesy", label: "Procesy a kapacity" },
          { key: "sklad", label: "Sklad" },
          { key: "finance", label: "Finance" },
        ]}
        openSection={open}
        onToggleSection={(key) => setOpen(open === key ? null : key)}
        account={<IngotTopNavAccount initials="8S" label="Menu účtu" />}
        testId="docs-topnav"
      />
    </div>
  );
}
