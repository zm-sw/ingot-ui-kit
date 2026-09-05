import { Button, IngotEmptyState } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Zatím tu nic není",
    description: "Až přibude první položka, objeví se tady.",
    action: "Přidat první položku",
  },
  en: {
    title: "Nothing here yet",
    description: "The first item will show up here once it is added.",
    action: "Add the first item",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotEmptyState
      title={t.title}
      description={t.description}
      action={
        <Button variant="secondary" size="sm">
          {t.action}
        </Button>
      }
      testId="docs-empty"
    />
  );
}
