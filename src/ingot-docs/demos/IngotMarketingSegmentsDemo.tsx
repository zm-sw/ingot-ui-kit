import { IngotMarketingSegments } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSegments
        testId="docs-marketing-segments"
        items={[
          {
            title: "Zakázková kovovýroba",
            text: "Desítky poptávek týdně a každá jiná.",
            tags: ["laser", "ohyb", "svařování"],
          },
          {
            title: "Obrobny",
            text: "Ceny stojí na strojních časech, ne na odhadu.",
            tags: ["frézování", "soustružení"],
          },
          {
            title: "Konstrukční kanceláře",
            text: "Rychlá zpětná vazba na vyrobitelnost dílu.",
            tags: ["prototypy", "malé série"],
          },
        ]}
      />
    </div>
  );
}
