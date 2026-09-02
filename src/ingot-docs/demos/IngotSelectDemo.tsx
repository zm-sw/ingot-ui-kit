import { useState } from "react";

import { IngotSelect, IngotToolbar } from "@/ingot";

export function Demo(): JSX.Element {
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  return (
    <IngotToolbar>
      <IngotSelect
        value={status}
        onChange={setStatus}
        label="Filtr stavu"
        options={[
          { value: "all", label: "Všechny stavy" },
          { value: "active", label: "Aktivní" },
          { value: "paused", label: "Pozastavený" },
        ]}
        testId="docs-select-status"
      />
      <IngotSelect
        value={tier}
        onChange={setTier}
        label="Filtr tarifu"
        options={[
          { value: "all", label: "Všechny tarify" },
          { value: "free", label: "Zdarma" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise" },
        ]}
        testId="docs-select-tier"
      />
    </IngotToolbar>
  );
}
