import { useState } from "react";

import { Button, IngotSearchInput, IngotToolbar } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    create: "Nová položka",
    label: "Hledat v položkách",
    placeholder: "Hledat podle názvu nebo kódu…",
  },
  en: {
    create: "New item",
    label: "Search the items",
    placeholder: "Search by name or code…",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [query, setQuery] = useState("");
  return (
    <IngotToolbar end={<Button variant="primary">{t.create}</Button>}>
      <IngotSearchInput
        value={query}
        onChange={setQuery}
        label={t.label}
        placeholder={t.placeholder}
        className="w-72"
        testId="docs-search"
      />
    </IngotToolbar>
  );
}
