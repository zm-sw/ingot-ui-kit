import { useState } from "react";

import { IngotTabs } from "@/ingot";
export function Demo(): JSX.Element {
  const [view, setView] = useState("overview");
  return (
    <IngotTabs
      items={[
        { key: "overview", label: "Přehled" },
        { key: "items", label: "Položky", count: 12 },
        { key: "history", label: "Historie", count: 4 },
      ]}
      value={view}
      onChange={setView}
      label="Pohledy na objednávku"
      testId="docs-tabs"
    >
      {view === "overview" && (
        <p className="text-sm text-ink-2">
          Objednávka OBJ-2041 pro Strojírny Kladno, termín 12. 9.
        </p>
      )}
      {view === "items" && (
        <p className="text-sm text-ink-2">12 položek, z toho 3 ve výrobě.</p>
      )}
      {view === "history" && (
        <p className="text-sm text-ink-2">4 změny za posledních 30 dní.</p>
      )}
    </IngotTabs>
  );
}
