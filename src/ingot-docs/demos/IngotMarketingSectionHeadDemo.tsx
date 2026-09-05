import { IngotMarketingSectionHead } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    eyebrow: "Jak to funguje",
    title: "Od poptávky k nabídce bez přepisování",
    lede: "Stejné tokeny jako administrace, jen větší rozestupy. Sekci nese typografie a linka — žádné gradienty ani ilustrace.",
  },
  en: {
    eyebrow: "How it works",
    title: "From enquiry to quote without retyping",
    lede: "The same tokens as the admin, only with more room. The section is carried by type and a rule — no gradients, no illustrations.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSectionHead
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        testId="docs-marketing-section-head"
      />
    </div>
  );
}
