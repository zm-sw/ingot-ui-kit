import { Button, IngotMarketingPricing } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingPricing
        testId="docs-marketing-pricing"
        plans={[
          {
            id: "start",
            name: "Start",
            price: "X XXX Kč",
            period: "měsíčně",
            description: "Pro první poptávky.",
            features: ["Jeden uživatel", "Základní rozpad operací"],
            action: (
              <Button variant="secondary" className="w-full">
                Vyzkoušet
              </Button>
            ),
          },
          {
            id: "team",
            name: "Team",
            price: "X XXX Kč",
            period: "měsíčně",
            description: "Pro dílnu s obchodem.",
            features: ["Pět uživatelů", "Vlastní sazby strojů", "Historie nabídek"],
            featured: true,
            badge: "Nejčastější",
            action: (
              <Button variant="primary" className="w-full">
                Domluvit ukázku
              </Button>
            ),
          },
          {
            id: "firm",
            name: "Firm",
            price: "X XXX Kč",
            period: "měsíčně",
            description: "Pro výrobu s více provozy.",
            features: ["Neomezení uživatelé", "Napojení na sklad"],
            action: (
              <Button variant="secondary" className="w-full">
                Kontaktovat
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
