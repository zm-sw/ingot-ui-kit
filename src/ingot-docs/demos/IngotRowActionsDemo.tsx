import { IngotRowActions } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    edit: "Upravit vzorec",
    duplicate: "Duplikovat vzorec",
    remove: "Smazat vzorec",
  },
  en: {
    edit: "Edit the formula",
    duplicate: "Duplicate the formula",
    remove: "Delete the formula",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotRowActions
      actions={[
        { icon: "sliders", label: t.edit, onClick: () => {} },
        { icon: "copy", label: t.duplicate, onClick: () => {} },
        {
          icon: "trash",
          label: t.remove,
          tone: "danger",
          onClick: () => {},
          testId: "docs-rowaction-delete",
        },
      ]}
      testId="docs-rowactions"
    />
  );
}
