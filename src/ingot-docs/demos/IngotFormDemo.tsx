import { useState } from "react";

import { IngotForm, type IngotFieldSpec } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    label: "Název",
    labelHint: "Krátký popisek.",
    count: "Počet",
    ratio: "Poměr",
    enabled: "Zapnuto",
    token: "Token",
    sample: "Ukázka",
  },
  en: {
    label: "Name",
    labelHint: "A short caption.",
    count: "Count",
    ratio: "Ratio",
    enabled: "Enabled",
    token: "Token",
    sample: "Sample",
  },
};

function fields(lang: DocLang): readonly IngotFieldSpec[] {
  const t = TEXT[lang];
  return [
    { key: "label", kind: "text", label: t.label, description: t.labelHint },
    { key: "count", kind: "integer", label: t.count, minimum: 1, maximum: 10 },
    { key: "ratio", kind: "number", label: t.ratio },
    { key: "enabled", kind: "boolean", label: t.enabled },
    { key: "token", kind: "secret", label: t.token, secretConfigured: true },
  ];
}

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const [values, setValues] = useState<Record<string, unknown>>({
    label: TEXT[lang].sample,
    count: 3,
    ratio: 1.5,
    enabled: true,
  });
  return (
    <IngotForm
      fields={fields(lang)}
      values={values}
      onChange={(key, next) => setValues((prev) => ({ ...prev, [key]: next }))}
      testIdPrefix="docs-form"
    />
  );
}
