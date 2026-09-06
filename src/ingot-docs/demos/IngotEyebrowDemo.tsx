import { IngotEyebrow, IngotMetrics } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    store: "Sklad",
    storePlace: "Regál 1 · Police 2",
    edited: "Naposledy upraveno",
    editedAt: "dnes 14:20",
    step: "Krok 2 · hotovo",
    stepBody: "Materiál potvrzen",
    frame: "Rám obrazovky",
    frameBody: "Horní lišta → drobečky → hlavička stránky → obsah.",
    summary: "Souhrn",
    inProduction: "Ve výrobě",
    late: "Po termínu",
  },
  en: {
    store: "Store",
    storePlace: "Rack 1 · Shelf 2",
    edited: "Last edited",
    editedAt: "today 14:20",
    step: "Step 2 · done",
    stepBody: "Material confirmed",
    frame: "Screen frame",
    frameBody: "Top bar → breadcrumbs → page header → content.",
    summary: "Summary",
    inProduction: "In production",
    late: "Past due",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <IngotEyebrow>{t.store}</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">{t.storePlace}</p>
        </div>
        <div>
          <IngotEyebrow tone="muted">{t.edited}</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">{t.editedAt}</p>
        </div>
        <div>
          <IngotEyebrow tone="ok">{t.step}</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">{t.stepBody}</p>
        </div>
        <div>
          <IngotEyebrow size="md">{t.frame}</IngotEyebrow>
          <p className="mt-2 text-sm text-ink-2">{t.frameBody}</p>
        </div>
      </div>
      <IngotMetrics
        label={t.summary}
        items={[
          { label: t.inProduction, value: 18 },
          { label: t.late, value: 2, tone: "danger" },
        ]}
      />
    </div>
  );
}
