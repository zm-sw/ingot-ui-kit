import { Button, IngotMarketingPricing } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    price: "X XXX Kč",
    period: "měsíčně",
    startDesc: "Pro první poptávky.",
    startOne: "Jeden uživatel",
    startTwo: "Základní rozpad operací",
    startAction: "Vyzkoušet",
    teamDesc: "Pro dílnu s obchodem.",
    teamOne: "Pět uživatelů",
    teamTwo: "Vlastní sazby strojů",
    teamThree: "Historie nabídek",
    teamBadge: "Nejčastější",
    teamAction: "Domluvit ukázku",
    firmDesc: "Pro výrobu s více provozy.",
    firmOne: "Neomezení uživatelé",
    firmTwo: "Napojení na sklad",
    firmAction: "Kontaktovat",
  },
  en: {
    price: "X,XXX",
    period: "per month",
    startDesc: "For the first enquiries.",
    startOne: "One user",
    startTwo: "Basic operation breakdown",
    startAction: "Try it",
    teamDesc: "For a shop with a sales desk.",
    teamOne: "Five users",
    teamTwo: "Your own machine rates",
    teamThree: "Quote history",
    teamBadge: "Most chosen",
    teamAction: "Book a demo",
    firmDesc: "For manufacturing across sites.",
    firmOne: "Unlimited users",
    firmTwo: "Stock integration",
    firmAction: "Get in touch",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingPricing
        testId="docs-marketing-pricing"
        plans={[
          {
            id: "start",
            name: "Start",
            price: t.price,
            period: t.period,
            description: t.startDesc,
            features: [t.startOne, t.startTwo],
            action: (
              <Button variant="secondary" className="w-full">
                {t.startAction}
              </Button>
            ),
          },
          {
            id: "team",
            name: "Team",
            price: t.price,
            period: t.period,
            description: t.teamDesc,
            features: [t.teamOne, t.teamTwo, t.teamThree],
            featured: true,
            badge: t.teamBadge,
            action: (
              <Button variant="primary" className="w-full">
                {t.teamAction}
              </Button>
            ),
          },
          {
            id: "firm",
            name: "Firm",
            price: t.price,
            period: t.period,
            description: t.firmDesc,
            features: [t.firmOne, t.firmTwo],
            action: (
              <Button variant="secondary" className="w-full">
                {t.firmAction}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
