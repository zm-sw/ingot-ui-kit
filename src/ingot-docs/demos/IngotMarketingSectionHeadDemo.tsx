import { IngotMarketingSectionHead } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSectionHead
        eyebrow="Jak to funguje"
        title="Od poptávky k nabídce bez přepisování"
        lede="Stejné tokeny jako administrace, jen větší rozestupy. Sekci nese typografie a linka — žádné gradienty ani ilustrace."
        testId="docs-marketing-section-head"
      />
    </div>
  );
}
