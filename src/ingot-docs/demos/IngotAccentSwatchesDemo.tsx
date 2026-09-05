import { useState } from "react";

import { IngotAccentSwatches, type AccentChoice } from "@/ingot";

const NAMES: Record<AccentChoice, string> = {
  blue: "modrá",
  emerald: "smaragdová",
  orange: "oranžová",
  violet: "fialová",
  slate: "břidlicová",
};

export function Demo(): JSX.Element {
  const [accent, setAccent] = useState<AccentChoice>("blue");
  return (
    <div className="flex items-center gap-4">
      <IngotAccentSwatches
        value={accent}
        onChange={setAccent}
        groupLabel="Akcent"
        optionLabel={(choice) => "Akcent " + NAMES[choice]}
      />
      <span className="text-sm text-ink-3">{NAMES[accent]}</span>
    </div>
  );
}
