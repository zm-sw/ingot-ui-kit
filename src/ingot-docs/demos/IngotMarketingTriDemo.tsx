import { IngotMarketingTri } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingTri
        testId="docs-marketing-tri"
        items={[
          {
            icon: "upload",
            title: "Nahrajte výkres",
            text: "Poptávka začíná souborem, ne formulářem o dvaceti polích.",
          },
          {
            icon: "bolt",
            title: "Okamžitý rozpad",
            text: "Operace a časy se spočítají z geometrie dílu.",
          },
          {
            icon: "check",
            title: "Nabídka na odeslání",
            text: "Cena vzniká z vašich sazeb, ne z odhadu po telefonu.",
          },
        ]}
      />
    </div>
  );
}
