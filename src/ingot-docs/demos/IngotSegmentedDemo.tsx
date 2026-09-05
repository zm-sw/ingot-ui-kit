import { useState } from "react";

import { IngotSegmented } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: { label: "Motiv", light: "Světlý", dark: "Tmavý", system: "Systém" },
  en: { label: "Theme", light: "Light", dark: "Dark", system: "System" },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [theme, setTheme] = useState("light");
  return (
    <div className="flex items-center gap-4">
      <IngotSegmented
        label={t.label}
        value={theme}
        onChange={setTheme}
        testId="docs-segmented"
        options={[
          { value: "light", label: t.light },
          { value: "dark", label: t.dark },
          { value: "system", label: t.system },
        ]}
      />
      <span className="text-sm text-ink-3">{theme}</span>
    </div>
  );
}
