import { IngotMarketingFaq } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="bg-bg p-6">
      <IngotMarketingFaq
        testId="docs-marketing-faq"
        items={[
          {
            id: "data",
            question: "Komu patří nahraná data?",
            answer:
              "Vám. Výkresy i nabídky zůstávají ve vašem účtu a kdykoli je smažete.",
          },
          {
            id: "trial",
            question: "Dá se to vyzkoušet zdarma?",
            answer: "Ano, zkušební období nevyžaduje platební kartu.",
          },
          {
            id: "import",
            question: "Přenesu si stávající ceníky?",
            answer: "Sazby strojů a materiálů se dají naimportovat z tabulky.",
          },
        ]}
      />
    </div>
  );
}
