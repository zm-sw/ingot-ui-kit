import { useState } from "react";

import { IngotAccentSwatches, type AccentChoice } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    group: "Akcent",
    blue: "modrá",
    emerald: "smaragdová",
    orange: "oranžová",
    violet: "fialová",
    slate: "břidlicová",
  },
  en: {
    group: "Accent",
    blue: "blue",
    emerald: "emerald",
    orange: "orange",
    violet: "violet",
    slate: "slate",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [accent, setAccent] = useState<AccentChoice>("blue");
  const name = (choice: AccentChoice) => t[choice];
  return (
    <div className="flex items-center gap-4">
      <IngotAccentSwatches
        value={accent}
        onChange={setAccent}
        groupLabel={t.group}
        optionLabel={(choice) => `${t.group} ${name(choice)}`}
      />
      <span className="text-sm text-ink-3">{name(accent)}</span>
    </div>
  );
}
