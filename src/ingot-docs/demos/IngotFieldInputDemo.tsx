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
      <div className="space-y-2">
        <label className="block text-sm" htmlFor="docs-field-count">
          {COUNT.label}
        </label>
        <IngotFieldInput
          field={COUNT}
          value={count}
          onChange={setCount}
          testId="docs-field-count"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm" htmlFor="docs-field-token">
          {TOKEN.label}
        </label>
        <IngotFieldInput
          field={TOKEN}
          value={token}
          onChange={setToken}
          testId="docs-field-token"
        />
        <p className="text-xs text-ink-3">
          Tajné pole hlásí jen to, že hodnota existuje — placeholder bere z
          IngotProvider.
        </p>
      </div>
    </div>
  );
}
