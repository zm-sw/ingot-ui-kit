import { useState } from "react";

import { IngotSegmented } from "@/ingot";

export function Demo(): JSX.Element {
  const [theme, setTheme] = useState("light");
  return (
    <div className="flex items-center gap-4">
      <IngotSegmented
        label="Motiv"
        value={theme}
        onChange={setTheme}
        testId="docs-segmented"
        options={[
          { value: "light", label: "Světlý" },
          { value: "dark", label: "Tmavý" },
          { value: "system", label: "Systém" },
        ]}
      />
      <span className="text-sm text-ink-3">{theme}</span>
    </div>
  );
}
