import { IngotBadge } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    draft: "Koncept",
    waiting: "Čeká na schválení",
    inProduction: "Ve výrobě",
    done: "Hotovo",
    rejected: "Zamítnuto",
    archived: "Archivováno",
  },
  en: {
    draft: "Draft",
    waiting: "Waiting for approval",
    inProduction: "In production",
    done: "Done",
    rejected: "Rejected",
    archived: "Archived",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IngotBadge>{t.draft}</IngotBadge>
      <IngotBadge tone="accent">{t.waiting}</IngotBadge>
      <IngotBadge tone="warn" dot>
        {t.inProduction}
      </IngotBadge>
      <IngotBadge tone="ok">{t.done}</IngotBadge>
      <IngotBadge tone="danger">{t.rejected}</IngotBadge>
      <IngotBadge tone="ink" testId="docs-badge-ink">
        {t.archived}
      </IngotBadge>
    </div>
  );
}
