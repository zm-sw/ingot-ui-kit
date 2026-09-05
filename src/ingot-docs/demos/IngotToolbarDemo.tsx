import { useState } from "react";

import { Button, IngotToolbar } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    add: "Přidat",
    searchPlaceholder: "Hledat…",
    searchLabel: "Hledat",
    statusLabel: "Stav",
    allStatuses: "Všechny stavy",
    active: "Aktivní",
    archived: "Archivované",
  },
  en: {
    add: "Add",
    searchPlaceholder: "Search…",
    searchLabel: "Search",
    statusLabel: "Status",
    allStatuses: "All statuses",
    active: "Active",
    archived: "Archived",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [query, setQuery] = useState("");

  return (
    <IngotToolbar end={<Button variant="accent">{t.add}</Button>} testId="docs-toolbar">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchLabel}
        className="h-[34px] rounded-md border border-border-strong bg-surface px-3 text-sm"
      />
      <select
        aria-label={t.statusLabel}
        className="h-[34px] rounded-md border border-border-strong bg-surface px-2 text-sm"
      >
        <option>{t.allStatuses}</option>
        <option>{t.active}</option>
        <option>{t.archived}</option>
      </select>
    </IngotToolbar>
  );
}
