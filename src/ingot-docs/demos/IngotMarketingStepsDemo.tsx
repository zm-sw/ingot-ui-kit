import { IngotMarketingSteps } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    uploadTitle: "Nahrajte díl",
    uploadText: "DXF, STEP nebo PDF — formát řeší platforma.",
    checkTitle: "Zkontrolujte rozpad",
    checkText: "Operace, časy a materiál na jedné obrazovce.",
    sendTitle: "Odešlete nabídku",
    sendText: "Zákazník dostane cenu, vy záznam v historii.",
  },
  en: {
    uploadTitle: "Upload the part",
    uploadText: "DXF, STEP or PDF — the platform deals with the format.",
    checkTitle: "Check the breakdown",
    checkText: "Operations, times and material on one screen.",
    sendTitle: "Send the quote",
    sendText: "The customer gets a price, you get a record.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSteps
        testId="docs-marketing-steps"
        items={[
          { title: t.uploadTitle, text: t.uploadText },
          { title: t.checkTitle, text: t.checkText },
          { title: t.sendTitle, text: t.sendText },
        ]}
      />
    </div>
  );
}
