import { Button, IngotAttentionPanel } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Co řešit teď",
    waiting: "objednávky čekají na zpracování",
    abandoned: "rozdělaný košík bez platby",
    body: "5 položek vyžaduje pozornost. Zbytek provozu je v klidu.",
    action: "Otevřít objednávky →",
  },
  en: {
    title: "What needs you now",
    waiting: "orders waiting to be processed",
    abandoned: "unpaid basket left open",
    body: "5 items need attention. The rest of the shop is quiet.",
    action: "Open orders →",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotAttentionPanel
      title={t.title}
      aside={
        <div className="space-y-1.5 text-sm text-bg/80">
          <p>
            <span className="font-mono font-semibold text-warn">4</span> {t.waiting}
          </p>
          <p>
            <span className="font-mono font-semibold text-warn">1</span> {t.abandoned}
          </p>
        </div>
      }
      testId="docs-attention"
    >
      <p>{t.body}</p>
      <Button variant="secondary" size="sm">
        {t.action}
      </Button>
    </IngotAttentionPanel>
  );
}
