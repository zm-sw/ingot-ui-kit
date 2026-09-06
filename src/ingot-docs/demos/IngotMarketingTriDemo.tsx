import { IngotMarketingTri } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    uploadTitle: "Nahrajte výkres",
    uploadText: "Poptávka začíná souborem, ne formulářem o dvaceti polích.",
    breakdownTitle: "Okamžitý rozpad",
    breakdownText: "Operace a časy se spočítají z geometrie dílu.",
    quoteTitle: "Nabídka na odeslání",
    quoteText: "Cena vzniká z vašich sazeb, ne z odhadu po telefonu.",
  },
  en: {
    uploadTitle: "Upload the drawing",
    uploadText: "An enquiry starts with a file, not a form of twenty fields.",
    breakdownTitle: "Breakdown at once",
    breakdownText: "Operations and times are worked out from the part's geometry.",
    quoteTitle: "A quote ready to send",
    quoteText: "The price comes from your rates, not from a guess over the phone.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingTri
        testId="docs-marketing-tri"
        items={[
          { icon: "upload", title: t.uploadTitle, text: t.uploadText },
          { icon: "bolt", title: t.breakdownTitle, text: t.breakdownText },
          { icon: "check", title: t.quoteTitle, text: t.quoteText },
        ]}
      />
    </div>
  );
}
