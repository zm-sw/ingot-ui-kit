import { Button, IngotToast, toast } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      <IngotToast testId="docs-toast-region" />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast({ text: "Objednávka uložena." })}
      >
        Uložit objednávku
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            text: "Materiál odebrán ze skladu.",
            undo: () => toast({ text: "Odebrání vráceno." }),
          })
        }
      >
        Odebrat se zpětnou akcí
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast({ text: "Uložení se nepovedlo.", tone: "danger" })}
      >
        Chyba operace
      </Button>
    </div>
  );
}
