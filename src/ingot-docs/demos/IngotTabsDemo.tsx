import { useState } from "react";

import { IngotTabs } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    overview: "Přehled",
    items: "Položky",
    history: "Historie",
    label: "Pohledy na objednávku",
    overviewBody: "Objednávka OBJ-2041 pro Strojírny Kladno, termín 12. 9.",
    itemsBody: "12 položek, z toho 3 ve výrobě.",
    historyBody: "4 změny za posledních 30 dní.",
  },
  en: {
    overview: "Overview",
    items: "Items",
    history: "History",
    label: "Views of the order",
    overviewBody: "Order ORD-2041 for Kladno Engineering, due 12 Sep.",
    itemsBody: "12 items, 3 of them in production.",
    historyBody: "4 changes in the last 30 days.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [view, setView] = useState("overview");
  return (
    <IngotTabs
      items={[
        { key: "overview", label: t.overview },
        { key: "items", label: t.items, count: 12 },
        { key: "history", label: t.history, count: 4 },
      ]}
      value={view}
      onChange={setView}
      label={t.label}
      testId="docs-tabs"
    >
      {view === "overview" && <p className="text-sm text-ink-2">{t.overviewBody}</p>}
      {view === "items" && <p className="text-sm text-ink-2">{t.itemsBody}</p>}
      {view === "history" && <p className="text-sm text-ink-2">{t.historyBody}</p>}
    </IngotTabs>
  );
}
