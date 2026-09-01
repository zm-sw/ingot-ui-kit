import { useState } from "react";

import { Button, IngotToolbar } from "@/ingot";

export function Demo(): JSX.Element {
  const [query, setQuery] = useState("");

  return (
    <IngotToolbar
      end={<Button variant="accent">Přidat</Button>}
      testId="docs-toolbar"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Hledat…"
        aria-label="Hledat"
        className="h-[34px] rounded-md border border-border-strong bg-surface px-3 text-sm"
      />
      <select
        aria-label="Stav"
        className="h-[34px] rounded-md border border-border-strong bg-surface px-2 text-sm"
      >
        <option>Všechny stavy</option>
        <option>Aktivní</option>
        <option>Archivované</option>
      </select>
    </IngotToolbar>
  );
}
