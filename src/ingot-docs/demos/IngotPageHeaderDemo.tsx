import { Button, IngotPageHeader } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Šarže materiálu",
    description: "Co operátor na téhle obrazovce najde, jednou větou.",
    action: "Přidat šarži",
  },
  en: {
    title: "Material batches",
    description: "What the operator finds on this screen, in one sentence.",
    action: "Add a batch",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotPageHeader
      title={t.title}
      description={t.description}
      actions={<Button variant="primary">{t.action}</Button>}
      testId="docs-page-header"
    />
  );
}
