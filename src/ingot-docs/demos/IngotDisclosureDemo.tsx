import { IngotDisclosure, IngotDisclosureGroup, IngotList } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    thread: "Osa komunikace",
    enquiry: "Poptávka přijata",
    quoteSent: "Nabídka odeslána",
    question: "Doplňující dotaz",
    confirmed: "Objednávka potvrzena",
    documents: "Doklady",
    quoteDoc: "Nabídka 2026-0412",
    orderDoc: "Objednávka 2026-0417",
    notes: "Poznámky",
    note: "Zákazník žádá dodání do konce měsíce.",
  },
  en: {
    thread: "Conversation",
    enquiry: "Enquiry received",
    quoteSent: "Quote sent",
    question: "Follow-up question",
    confirmed: "Order confirmed",
    documents: "Documents",
    quoteDoc: "Quote 2026-0412",
    orderDoc: "Order 2026-0417",
    notes: "Notes",
    note: "The customer asks for delivery by the end of the month.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="max-w-sm rounded-md border border-border bg-surface">
      <IngotDisclosureGroup testId="docs-disclosure-group">
        <IngotDisclosure title={t.thread} count={4} defaultOpen>
          <IngotList items={[t.enquiry, t.quoteSent, t.question, t.confirmed]} />
        </IngotDisclosure>
        <IngotDisclosure title={t.documents} count={2}>
          <IngotList items={[t.quoteDoc, t.orderDoc]} />
        </IngotDisclosure>
        <IngotDisclosure title={t.notes}>
          <p>{t.note}</p>
        </IngotDisclosure>
      </IngotDisclosureGroup>
    </div>
  );
}
