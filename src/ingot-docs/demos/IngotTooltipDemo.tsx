import { Button, IngotRowActions, IngotTooltip } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-4">
      <IngotTooltip
        text="Naceňuje se z platných cen materiálu a operací."
        testId="docs-tooltip"
      >
        <Button variant="secondary">Přepočítat cenu</Button>
      </IngotTooltip>
      <IngotRowActions
        actions={[
          { icon: "file", label: "Upravit objednávku", onClick: () => undefined },
          { icon: "copy", label: "Duplikovat objednávku", onClick: () => undefined },
          {
            icon: "trash",
            label: "Smazat objednávku",
            tone: "danger",
            onClick: () => undefined,
          },
        ]}
      />
      <p className="text-xs text-ink-3">
        Popisek se ukáže po najetí i po zaostření klávesnicí. Řádkové akce ho používají
        místo atributu title.
      </p>
    </div>
  );
}
