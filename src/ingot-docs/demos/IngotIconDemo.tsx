import { IngotCode, IngotIcon, IngotList, IngotSection } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const SIZES = [
  { size: 13, where: 'Button size="sm"' },
  { size: 14, where: "Button" },
  { size: 15, where: "IngotSideNav" },
  { size: 20, where: "IngotEmptyState" },
];

const TEXT: Localized<Record<string, string>> = {
  cs: {
    upload: "Nahrát výkres",
    done: "Hotovo",
    remove: "Smazat",
    close: "Zavřít",
    sizes: "Velikosti",
  },
  en: {
    upload: "Upload a drawing",
    done: "Done",
    remove: "Delete",
    close: "Close",
    sizes: "Sizes",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 text-ink-2">
        <span className="inline-flex items-center gap-1.5 text-sm">
          <IngotIcon name="upload" />
          {t.upload}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm">
          <IngotIcon name="check" />
          {t.done}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-danger">
          <IngotIcon name="trash" />
          {t.remove}
        </span>
        <IngotIcon name="close" size={16} title={t.close} />
      </div>
      <IngotSection title={t.sizes} level={3}>
        <IngotList
          items={SIZES.map((step) => (
            <span key={step.size} className="inline-flex items-center gap-2">
              <IngotIcon name="search" size={step.size} />
              <IngotCode>{`size={${step.size}}`}</IngotCode>
              <span className="text-ink-3">{step.where}</span>
            </span>
          ))}
        />
      </IngotSection>
    </div>
  );
}
