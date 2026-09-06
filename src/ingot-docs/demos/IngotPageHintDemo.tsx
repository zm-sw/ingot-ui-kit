import { useState } from "react";

import { IngotPageHint } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Fronta výroby",
    body: "Přetáhněte zakázku myší a změňte její pořadí ve frontě. Filtrem vpravo si zobrazíte jen svoje stroje.",
    hidden: "Nápověda je skrytá.",
    queue: "Fronta: 6 zakázek",
    filter: "Filtr strojů",
  },
  en: {
    title: "Production queue",
    body: "Drag a job to change its place in the queue. The filter on the right shows only your machines.",
    hidden: "The hint is hidden.",
    queue: "Queue: 6 jobs",
    filter: "Machine filter",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-3">
      {visible ? (
        <IngotPageHint
          title={t.title}
          targets={[
            '[data-hint-target="demo-queue"]',
            '[data-hint-target="demo-filter"]',
          ]}
          dismissible
          onDismiss={() => setVisible(false)}
          testId="docs-pagehint"
        >
          {t.body}
        </IngotPageHint>
      ) : (
        <p className="text-sm text-ink-3">{t.hidden}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <div
          data-hint-target="demo-queue"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
        >
          {t.queue}
        </div>
        <div
          data-hint-target="demo-filter"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
        >
          {t.filter}
        </div>
      </div>
    </div>
  );
}
