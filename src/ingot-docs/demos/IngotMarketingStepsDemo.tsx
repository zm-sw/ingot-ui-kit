import { IngotMarketingSteps } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSteps
        testId="docs-marketing-steps"
        items={[
          {
            title: "Nahrajte díl",
            text: "DXF, STEP nebo PDF — formát řeší platforma.",
          },
          {
            title: "Zkontrolujte rozpad",
            text: "Operace, časy a materiál na jedné obrazovce.",
          },
          {
            title: "Odešlete nabídku",
            text: "Zákazník dostane cenu, vy záznam v historii.",
          },
        ]}
      />
    </div>
  );
}
