import { IngotCode } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const SAMPLE = `import { useState } from "react";
import { IngotModal } from "@/ingot";

export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  return <IngotModal open={open} title={title} onClose={() => setOpen(false)} />;
}`;

const TEXT: Localized<Record<string, string>> = {
  cs: { intro: "Kit se importuje z jednoho místa:" },
  en: { intro: "The kit is imported from one place:" },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {t.intro} <IngotCode>@/ingot</IngotCode>.
      </p>
      <IngotCode block lang="tsx" testId="docs-code">
        {SAMPLE}
      </IngotCode>
    </div>
  );
}
