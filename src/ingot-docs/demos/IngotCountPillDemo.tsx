import { IngotCountPill, IngotSection } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    structure: "Struktura článku",
    blocks: "Počet bloků",
    empty: "Archiv",
    emptyCount: "Počet archivovaných zakázek",
  },
  en: {
    structure: "Article structure",
    blocks: "Number of blocks",
    empty: "Archive",
    emptyCount: "Number of archived orders",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="space-y-4">
      <IngotSection
        title={
          <span className="inline-flex items-center gap-2">
            {t.structure}
            <IngotCountPill label={t.blocks} testId="docs-countpill">
              10
            </IngotCountPill>
          </span>
        }
      >
        <span className="text-sm text-ink-3">{t.structure}</span>
      </IngotSection>

      <div className="flex items-center gap-2 text-sm text-ink-2">
        {t.empty}
        <IngotCountPill label={t.emptyCount} testId="docs-countpill-zero">
          0
        </IngotCountPill>
      </div>
    </div>
  );
}
