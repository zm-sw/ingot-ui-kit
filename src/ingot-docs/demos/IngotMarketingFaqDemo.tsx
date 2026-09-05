import { IngotMarketingFaq } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    dataQ: "Komu patří nahraná data?",
    dataA: "Vám. Výkresy i nabídky zůstávají ve vašem účtu a kdykoli je smažete.",
    trialQ: "Dá se to vyzkoušet zdarma?",
    trialA: "Ano, zkušební období nevyžaduje platební kartu.",
    importQ: "Přenesu si stávající ceníky?",
    importA: "Sazby strojů a materiálů se dají naimportovat z tabulky.",
  },
  en: {
    dataQ: "Who owns the data I upload?",
    dataA:
      "You do. Drawings and quotes stay in your account and you can delete them at any time.",
    trialQ: "Can I try it for free?",
    trialA: "Yes, the trial does not ask for a card.",
    importQ: "Can I bring my existing price lists?",
    importA: "Machine and material rates can be imported from a spreadsheet.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingFaq
        testId="docs-marketing-faq"
        items={[
          { id: "data", question: t.dataQ, answer: t.dataA },
          { id: "trial", question: t.trialQ, answer: t.trialA },
          { id: "import", question: t.importQ, answer: t.importA },
        ]}
      />
    </div>
  );
}
