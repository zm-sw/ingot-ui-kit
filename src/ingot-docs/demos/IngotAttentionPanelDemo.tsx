import { Button, IngotAttentionPanel } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <IngotAttentionPanel
      title="Co řešit teď"
      aside={
        <div className="space-y-1.5 text-sm text-bg/80">
          <p>
            <span className="font-mono font-semibold text-warn">4</span> objednávky
            čekají na zpracování
          </p>
          <p>
            <span className="font-mono font-semibold text-warn">1</span> rozdělaný košík
            bez platby
          </p>
        </div>
      }
      testId="docs-attention"
    >
      <p>5 položek vyžaduje pozornost. Zbytek provozu je v klidu.</p>
      <Button variant="secondary" size="sm">
        Otevřít objednávky →
      </Button>
    </IngotAttentionPanel>
  );
}
