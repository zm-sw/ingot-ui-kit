import { IngotMarketingCta } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Začněte nacenit první díl",
    text: "Nahrajte výkres a podívejte se, co z něj platforma spočítá.",
    primary: "Vyzkoušet zdarma",
    secondary: "Domluvit ukázku",
  },
  en: {
    title: "Price your first part",
    text: "Upload a drawing and see what the platform works out from it.",
    primary: "Try it free",
    secondary: "Book a demo",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const href = "/pruvodce/verejne-stranky";
  return (
    <div className="bg-bg p-6">
      <IngotMarketingCta
        testId="docs-marketing-cta"
        title={t.title}
        text={t.text}
        primary={{ label: t.primary, href }}
        secondary={{ label: t.secondary, href }}
      />
    </div>
  );
}
