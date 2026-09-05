import { Card, CardHeader, CardTitle } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    eyebrow: "Cenový vzorec",
    title: "Výchozí sazba stroje",
    body: "Základ = dráha nástroje × sazba stroje + prostoje. Přirážka 12 %.",
    edited: "upraveno 12. 8.",
    tenants: "34 tenantů",
    quotesLabel: "Nabídky tento měsíc",
    quotesTrend: "meziměsíčně +4,1 %",
    batchTitle: "Šarže materiálu",
    batchBody: "Otevře přehled šarží a jejich zbytkových kusů.",
    darkTitle: "Nový modul: Kontrola kvality",
    darkBody:
      "Zapíná se v Nastavení → Moduly. Takhle obrácená karta patří na obrazovku nejvýš jedna.",
  },
  en: {
    eyebrow: "Pricing formula",
    title: "Default machine rate",
    body: "Base = tool path × machine rate + idle time. Markup 12%.",
    edited: "edited 12 Aug",
    tenants: "34 tenants",
    quotesLabel: "Quotes this month",
    quotesTrend: "month on month +4.1%",
    batchTitle: "Material batch",
    batchBody: "Opens the batches and how many pieces are left of each.",
    darkTitle: "New module: Quality control",
    darkBody:
      "Switched on under Settings → Modules. At most one inverted card belongs on a screen.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card elevation="raised" data-testid="docs-card">
        <CardHeader>
          <div className="font-mono text-eyebrow uppercase text-ink-3">{t.eyebrow}</div>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <p className="text-sm text-ink-2">{t.body}</p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-border pt-3 font-mono text-xs text-ink-3">
          <span>v4</span>
          <span>·</span>
          <span>{t.edited}</span>
          <span>·</span>
          <span>{t.tenants}</span>
        </div>
      </Card>

      <Card padded={false} className="p-4">
        <div className="font-mono text-eyebrow uppercase text-ink-3">
          {t.quotesLabel}
        </div>
        <div className="mt-1 font-mono text-[22px] font-semibold tracking-tight">
          1 284
        </div>
        <p className="mt-1 text-sm text-ink-2">{t.quotesTrend}</p>
      </Card>

      <a href="/komponenty/card" className="block rounded-md">
        <Card hover>
          <CardTitle>{t.batchTitle}</CardTitle>
          <p className="mt-1 text-sm text-ink-2">{t.batchBody}</p>
        </Card>
      </a>

      <Card tone="dark">
        <CardTitle>{t.darkTitle}</CardTitle>
        <p className="mt-1 text-sm">{t.darkBody}</p>
      </Card>
    </div>
  );
}
