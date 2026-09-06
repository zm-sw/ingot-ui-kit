import { IngotAvatar, IngotEyebrow } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    sizes: "Velikosti",
    small: "sm — účet v liště",
    medium: "md — řádek seznamu, detail",
    row: "V řádku, kde jméno stojí vedle",
    marek: "Jan Marek",
    dolezal: "Petr Doležal",
    kratka: "Marie Krátká",
    assigned: "Přidělena",
  },
  en: {
    sizes: "Sizes",
    small: "sm — the account in the bar",
    medium: "md — a list row, a detail",
    row: "In a row, with the name beside it",
    marek: "Jan Marek",
    dolezal: "Petr Dolezal",
    kratka: "Marie Kratka",
    assigned: "Assigned to",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <IngotEyebrow tone="muted">{t.sizes}</IngotEyebrow>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <IngotAvatar initials="JM" label={t.marek} testId="docs-avatar" />
            <IngotEyebrow as="span" tone="muted">
              {t.small}
            </IngotEyebrow>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IngotAvatar initials="PD" label={t.dolezal} size="md" />
          <IngotEyebrow as="span" tone="muted">
            {t.medium}
          </IngotEyebrow>
        </div>
      </div>

      <div className="space-y-2">
        <IngotEyebrow tone="muted">{t.row}</IngotEyebrow>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-2">
          <IngotAvatar initials="MK" label={t.kratka} decorative />
          <span>
            {t.assigned}: {t.kratka}
          </span>
        </div>
      </div>
    </div>
  );
}
