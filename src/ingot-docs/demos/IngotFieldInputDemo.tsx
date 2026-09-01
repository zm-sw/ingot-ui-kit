import { useState } from "react";

import { IngotCode, IngotFieldInput, SECRET_PLACEHOLDER_SET, type IngotFieldSpec } from "@/ingot";
const FIELD: IngotFieldSpec = {
  key: "count",
  kind: "integer",
  label: "Počet kusů",
  description: "Celé číslo mezi 1 a 10.",
  minimum: 1,
  maximum: 10,
};

export function Demo(): JSX.Element {
  const [value, setValue] = useState<unknown>(3);
  return (
    <div className="space-y-2">
      <label className="block text-sm" htmlFor="docs-field-count">
        {FIELD.label}
      </label>
      <IngotFieldInput
        field={FIELD}
        value={value}
        onChange={setValue}
        testId="docs-field-count"
      />
      <p className="text-xs text-ink-3">
        Tajné pole se stejným primitivem hlásí jen to, že hodnota existuje:{" "}
        <IngotCode>{SECRET_PLACEHOLDER_SET}</IngotCode>.
      </p>
    </div>
  );
}

