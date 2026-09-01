import { useState } from "react";

import { IngotForm, type IngotFieldSpec } from "@/ingot";

const FIELDS: readonly IngotFieldSpec[] = [
  { key: "label", kind: "text", label: "Název", description: "Krátký popisek." },
  { key: "count", kind: "integer", label: "Počet", minimum: 1, maximum: 10 },
  { key: "ratio", kind: "number", label: "Poměr" },
  { key: "enabled", kind: "boolean", label: "Zapnuto" },
  { key: "token", kind: "secret", label: "Token", secretConfigured: true },
];

export function Demo(): JSX.Element {
  const [values, setValues] = useState<Record<string, unknown>>({
    label: "Ukázka",
    count: 3,
    ratio: 1.5,
    enabled: true,
  });
  return (
    <IngotForm
      fields={FIELDS}
      values={values}
      onChange={(key, next) => setValues((prev) => ({ ...prev, [key]: next }))}
      testIdPrefix="docs-form"
    />
  );
}

