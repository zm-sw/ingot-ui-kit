import { Button, IngotToast, toast } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    saved: "Objednávka uložena.",
    save: "Uložit objednávku",
    removed: "Materiál odebrán ze skladu.",
    undone: "Odebrání vráceno.",
    removeWithUndo: "Odebrat se zpětnou akcí",
    failed: "Uložení se nepovedlo.",
    fail: "Chyba operace",
  },
  en: {
    saved: "Order saved.",
    save: "Save the order",
    removed: "Material taken out of stock.",
    undone: "Removal undone.",
    removeWithUndo: "Remove with an undo",
    failed: "Saving did not work.",
    fail: "Failed operation",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="flex flex-wrap gap-2">
      <IngotToast testId="docs-toast-region" />
      <Button variant="secondary" size="sm" onClick={() => toast({ text: t.saved })}>
        {t.save}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            text: t.removed,
            undo: () => toast({ text: t.undone }),
          })
        }
      >
        {t.removeWithUndo}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast({ text: t.failed, tone: "danger" })}
      >
        {t.fail}
      </Button>
    </div>
  );
}
