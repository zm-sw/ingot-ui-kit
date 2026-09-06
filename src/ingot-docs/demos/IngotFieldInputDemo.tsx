import { useState } from "react";

import { IngotFieldInput, type IngotFieldSpec } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    count: "Počet kusů",
    countHint: "Celé číslo mezi 1 a 10.",
    secretNote:
      "Tajné pole hlásí jen to, že hodnota existuje — placeholder bere z IngotProvider.",
  },
  en: {
    count: "Piece count",
    countHint: "A whole number between 1 and 10.",
    secretNote:
      "A secret field says only that a value exists — the placeholder comes from IngotProvider.",
  },
};

function fields(lang: DocLang): { count: IngotFieldSpec; token: IngotFieldSpec } {
  const t = TEXT[lang];
  return {
    count: {
      key: "count",
      kind: "integer",
      label: t.count,
      description: t.countHint,
      minimum: 1,
      maximum: 10,
    },
    token: {
      key: "api-token",
      kind: "secret",
      label: "API token",
      secretConfigured: true,
    },
  };
}

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const { count: countField, token: tokenField } = fields(lang);
  const [count, setCount] = useState<unknown>(3);
  const [token, setToken] = useState<unknown>("");
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="block text-sm">{countField.label}</span>
        <IngotFieldInput
          field={countField}
          value={count}
          onChange={setCount}
          testId="docs-field-count"
        />
      </label>
      <label className="block space-y-2">
        <span className="block text-sm">{tokenField.label}</span>
        <IngotFieldInput
          field={tokenField}
          value={token}
          onChange={setToken}
          testId="docs-field-token"
        />
      </label>
      <p className="text-xs text-ink-3">{t.secretNote}</p>
    </div>
  );
}
