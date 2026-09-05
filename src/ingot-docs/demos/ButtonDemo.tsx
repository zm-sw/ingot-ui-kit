import { Button } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    save: "Uložit změny",
    create: "Vytvořit vzorec",
    duplicate: "Duplikovat",
    cancel: "Zrušit",
    remove: "Odebrat",
    saving: "Ukládám změny",
    addRow: "Přidat řádek",
    unavailable: "Nedostupné",
    pricing: "Přejít na ceník",
    onDark: "Na tmavé ploše",
  },
  en: {
    save: "Save changes",
    create: "Create formula",
    duplicate: "Duplicate",
    cancel: "Cancel",
    remove: "Remove",
    saving: "Saving changes",
    addRow: "Add row",
    unavailable: "Unavailable",
    pricing: "Go to pricing",
    onDark: "On a dark surface",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" data-testid="docs-button">
        {t.save}
      </Button>
      <Button variant="accent">{t.create}</Button>
      <Button>{t.duplicate}</Button>
      <Button variant="ghost">{t.cancel}</Button>
      <Button variant="danger">{t.remove}</Button>
      <Button variant="primary" loading>
        {t.saving}
      </Button>
      <Button iconOnly aria-label={t.addRow}>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M8 3.5v9M3.5 8h9" />
        </svg>
      </Button>
      <Button disabled>{t.unavailable}</Button>
      <Button as="a" href="/komponenty/button" variant="accent">
        {t.pricing}
      </Button>
      <span className="inline-flex rounded-md bg-ink p-2">
        <Button as="a" href="/komponenty/button" variant="inverse">
          {t.onDark}
        </Button>
      </span>
    </div>
  );
}
