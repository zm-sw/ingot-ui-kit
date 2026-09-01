import { Button, IngotEmptyState } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <IngotEmptyState
      title="Zatím tu nic není"
      description="Až přibude první položka, objeví se tady."
      action={
        <Button variant="secondary" size="sm">
          Přidat první položku
        </Button>
      }
      testId="docs-empty"
    />
  );
}

