import { IngotBreadcrumbs } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: { shop: "Provoz", orders: "Objednávky", label: "Kde se nacházíte" },
  en: { shop: "Shop floor", orders: "Orders", label: "Where you are" },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotBreadcrumbs
      items={[
        { label: t.shop, href: "/komponenty/breadcrumbs" },
        { label: t.orders, href: "/komponenty/breadcrumbs" },
        { label: "OBJ-2418" },
      ]}
      label={t.label}
      testId="docs-crumbs"
    />
  );
}
