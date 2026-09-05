import { useState } from "react";

import { IngotPageHint } from "@/ingot";

export function Demo(): JSX.Element {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-3">
      {visible ? (
        <IngotPageHint
          title="Fronta výroby"
          targets={[
            '[data-hint-target="demo-queue"]',
            '[data-hint-target="demo-filter"]',
          ]}
          dismissible
          onDismiss={() => setVisible(false)}
          testId="docs-pagehint"
        >
          Přetáhněte zakázku myší a změňte její pořadí ve frontě. Filtrem vpravo si
          zobrazíte jen svoje stroje.
        </IngotPageHint>
      ) : (
        <p className="text-sm text-ink-3">Nápověda je skrytá.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <div
          data-hint-target="demo-queue"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
        >
          Fronta: 6 zakázek
        </div>
        <div
          data-hint-target="demo-filter"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
        >
          Filtr strojů
        </div>
      </div>
    </div>
  );
}
