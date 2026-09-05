import { useState } from "react";

import { IngotFieldInput, type IngotFieldSpec } from "@/ingot";

const COUNT: IngotFieldSpec = {
  key: "count",
  kind: "integer",
  label: "Počet kusů",
  description: "Celé číslo mezi 1 a 10.",
  minimum: 1,
  maximum: 10,
};

const TOKEN: IngotFieldSpec = {
  key: "api-token",
  kind: "secret",
  label: "API token",
  secretConfigured: true,
};

export function Demo(): JSX.Element {
  const [count, setCount] = useState<unknown>(3);
  const [token, setToken] = useState<unknown>("");
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="block text-sm">{COUNT.label}</span>
        <IngotFieldInput
          field={COUNT}
          value={count}
          onChange={setCount}
          testId="docs-field-count"
        />
      </label>
      <label className="block space-y-2">
        <span className="block text-sm">{TOKEN.label}</span>
        <IngotFieldInput
          field={TOKEN}
          value={token}
          onChange={setToken}
          testId="docs-field-token"
        />
      </label>
      <p className="text-xs text-ink-3">
        Tajné pole hlásí jen to, že hodnota existuje — placeholder bere z IngotProvider.
      </p>
    </div>
  );
}
