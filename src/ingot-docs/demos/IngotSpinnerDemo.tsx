import { useState } from "react";

import { Button, IngotEyebrow, IngotSpinner } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    inline: "V řádku, vedle textu",
    saving: "Ukládá se",
    blockTitle: "Na vlastním řádku — panel, který čeká na odpověď",
    waiting: "Načítá se náhled dokladu",
    button: "Uložit",
    run: "Spustit ukládání",
  },
  en: {
    inline: "Inline, beside text",
    saving: "Saving",
    blockTitle: "On its own line — a panel waiting on an answer",
    waiting: "Loading the document preview",
    button: "Save",
    run: "Start saving",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [saving, setSaving] = useState(false);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <IngotEyebrow tone="muted">{t.inline}</IngotEyebrow>
        <p className="flex items-center gap-2 text-sm text-ink-2">
          <IngotSpinner label={t.saving} testId="docs-spinner" />
          {t.saving}…
        </p>
      </div>

      <div className="space-y-2">
        <IngotEyebrow tone="muted">{t.blockTitle}</IngotEyebrow>
        <div className="rounded-md border border-border bg-surface">
          <IngotSpinner size="md" block label={t.waiting} />
        </div>
      </div>

      <Button
        variant="accent"
        loading={saving}
        onClick={() => {
          setSaving(true);
          window.setTimeout(() => setSaving(false), 1400);
        }}
      >
        {saving ? t.saving : t.run}
      </Button>
    </div>
  );
}
