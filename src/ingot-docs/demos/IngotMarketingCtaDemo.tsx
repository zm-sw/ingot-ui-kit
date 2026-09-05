import { IngotMarketingCta } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingCta
        testId="docs-marketing-cta"
        title="Začněte nacenit první díl"
        text="Nahrajte výkres a podívejte se, co z něj platforma spočítá."
        primary={{ label: "Vyzkoušet zdarma", href: "#/verejne-stranky" }}
        secondary={{ label: "Domluvit ukázku", href: "#/verejne-stranky" }}
      />
    </div>
  );
}
