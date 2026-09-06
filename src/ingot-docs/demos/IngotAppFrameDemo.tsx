import {
  IngotAppFrame,
  IngotPageHeader,
  IngotSection,
  IngotTopNav,
  INGOT_FRAME_ROW,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    brand: "Forgmatic",
    sections: "Sekce",
    orders: "Zakázky",
    production: "Výroba",
    settings: "Nastavení",
    title: "Zakázky",
    description:
      "Rám drží šířku obrazovky a okraje vedle ní; lišta jde přes celé okno.",
    body: "Obsah",
    bodyNote:
      "Řádek v liště a obsah pod ní sdílejí jeden rám — proto jim logo a nadpis začínají na stejné svislici.",
  },
  en: {
    brand: "Forgmatic",
    sections: "Sections",
    orders: "Orders",
    production: "Production",
    settings: "Settings",
    title: "Orders",
    description:
      "The frame holds the screen's width and the margins beside it; the bar spans the whole window.",
    body: "Content",
    bodyNote:
      "The bar's row and the content below it share one frame — which is why the logo and the heading start on the same vertical line.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <IngotAppFrame
        className="py-6"
        testId="docs-app-frame"
        bar={
          <IngotTopNav
            brand={<span className="text-sm font-semibold text-ink">{t.brand}</span>}
            sections={[
              { key: "orders", label: t.orders, href: "#", current: true },
              { key: "production", label: t.production, href: "#" },
              { key: "settings", label: t.settings, href: "#" },
            ]}
            sectionsLabel={t.sections}
            contentClassName={INGOT_FRAME_ROW}
          />
        }
      >
        <IngotPageHeader title={t.title} description={t.description} />
        <IngotSection title={t.body}>
          <p className="text-sm text-ink-2">{t.bodyNote}</p>
        </IngotSection>
      </IngotAppFrame>
    </div>
  );
}
