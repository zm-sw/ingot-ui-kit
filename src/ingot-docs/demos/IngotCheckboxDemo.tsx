import { useState } from "react";

import { IngotCheckbox } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    attention: "Jen vyžadující zásah",
    sandbox: "Včetně zkušebních",
    archived: "Archivované (uzamčeno plánem)",
  },
  en: {
    attention: "Only those needing action",
    sandbox: "Include sandbox ones",
    archived: "Archived (locked by the plan)",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [attention, setAttention] = useState(true);
  const [sandbox, setSandbox] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <IngotCheckbox
        checked={attention}
        onChange={setAttention}
        label={t.attention}
        testId="docs-checkbox-attention"
      />
      <IngotCheckbox
        checked={sandbox}
        onChange={setSandbox}
        label={t.sandbox}
        testId="docs-checkbox-sandbox"
      />
      <IngotCheckbox
        checked
        onChange={() => undefined}
        label={t.archived}
        disabled
        testId="docs-checkbox-disabled"
      />
    </div>
  );
}
