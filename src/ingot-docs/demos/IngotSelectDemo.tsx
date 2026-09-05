import { useState } from "react";

import { IngotSelect, IngotToolbar } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    statusLabel: "Filtr stavu",
    allStatuses: "Všechny stavy",
    active: "Aktivní",
    paused: "Pozastavený",
    tierLabel: "Filtr tarifu",
    allTiers: "Všechny tarify",
    free: "Zdarma",
  },
  en: {
    statusLabel: "Status filter",
    allStatuses: "All statuses",
    active: "Active",
    paused: "Paused",
    tierLabel: "Plan filter",
    allTiers: "All plans",
    free: "Free",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  return (
    <IngotToolbar>
      <IngotSelect
        value={status}
        onChange={setStatus}
        label={t.statusLabel}
        options={[
          { value: "all", label: t.allStatuses },
          { value: "active", label: t.active },
          { value: "paused", label: t.paused },
        ]}
        testId="docs-select-status"
      />
      <IngotSelect
        value={tier}
        onChange={setTier}
        label={t.tierLabel}
        options={[
          { value: "all", label: t.allTiers },
          { value: "free", label: t.free },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise" },
        ]}
        testId="docs-select-tier"
      />
    </IngotToolbar>
  );
}
