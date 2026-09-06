import { useState } from "react";

import { IngotChip, IngotChipGroup } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    filters: "Filtr podle operace",
    turning: "Soustružení",
    milling: "Frézování",
    welding: "Svařování",
    chosen: "Vybrané moduly",
    orders: "Zakázky",
    stock: "Sklad",
    remove: "Odebrat",
    none: "Nic nevybráno",
  },
  en: {
    filters: "Filter by process",
    turning: "Turning",
    milling: "Milling",
    welding: "Welding",
    chosen: "Chosen modules",
    orders: "Orders",
    stock: "Stock",
    remove: "Remove",
    none: "Nothing chosen",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [on, setOn] = useState<readonly string[]>(["turning"]);
  const [chosen, setChosen] = useState<readonly string[]>(["orders", "stock"]);

  const toggle = (key: string) =>
    setOn((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
    );

  return (
    <div className="space-y-5">
      <IngotChipGroup label={t.filters} testId="docs-chip-filters">
        {(["turning", "milling", "welding"] as const).map((key) => (
          <IngotChip
            key={key}
            pressed={on.includes(key)}
            onToggle={() => toggle(key)}
            testId={`docs-chip-${key}`}
          >
            {t[key]}
          </IngotChip>
        ))}
      </IngotChipGroup>

      <IngotChipGroup label={t.chosen} testId="docs-chip-chosen">
        {chosen.length === 0 && <span className="text-xs text-ink-3">{t.none}</span>}
        {chosen.map((key) => (
          <IngotChip
            key={key}
            onRemove={() => setChosen((keys) => keys.filter((k) => k !== key))}
            removeLabel={`${t.remove}: ${t[key]}`}
            testId={`docs-chip-${key}`}
          >
            {t[key]}
          </IngotChip>
        ))}
      </IngotChipGroup>
    </div>
  );
}
