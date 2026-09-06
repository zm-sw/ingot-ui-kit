import { IngotMarketingComparison } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    task: "Úkol",
    before: "Dnes",
    after: "S platformou",
    quote: "Ocenit poptávku",
    quoteBefore: "Dva až tři dny čekání",
    quoteAfter: "Do minuty",
    rate: "Změna sazby stroje",
    rateBefore: "Ruční přepis v tabulce",
    rateAfter: "Jedno pole, propíše se všude",
    margin: "Přehled marží",
    marginBefore: "Až po fakturaci",
    marginAfter: "U každé nabídky",
  },
  en: {
    task: "Task",
    before: "Today",
    after: "With the platform",
    quote: "Price an enquiry",
    quoteBefore: "Two or three days of waiting",
    quoteAfter: "Within a minute",
    rate: "Change a machine rate",
    rateBefore: "Retyped by hand in a spreadsheet",
    rateAfter: "One field, applied everywhere",
    margin: "See the margins",
    marginBefore: "Only after invoicing",
    marginAfter: "On every quote",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingComparison
        testId="docs-marketing-comparison"
        headers={{ task: t.task, before: t.before, after: t.after }}
        rows={[
          {
            id: "quote",
            task: t.quote,
            before: { icon: "clock", text: t.quoteBefore },
            after: { icon: "check", text: t.quoteAfter },
          },
          {
            id: "rate",
            task: t.rate,
            before: { icon: "alert", text: t.rateBefore },
            after: { icon: "check", text: t.rateAfter },
          },
          {
            id: "margin",
            task: t.margin,
            before: { icon: "close", text: t.marginBefore },
            after: { icon: "check", text: t.marginAfter },
          },
        ]}
      />
    </div>
  );
}
