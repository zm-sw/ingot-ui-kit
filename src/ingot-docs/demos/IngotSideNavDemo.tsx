import { IngotSideNav } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    label: "Ukázkové menu",
    current: "Právě zobrazené",
    list: "Výčet",
    section: "Sekce",
  },
  en: {
    label: "A sample menu",
    current: "Currently shown",
    list: "List",
    section: "Section",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotSideNav
      label={t.label}
      testId="docs-sidenav"
      items={[
        { href: "/komponenty/side-nav", label: t.current, current: true },
        { href: "/komponenty/list", label: t.list },
        { href: "/komponenty/section", label: t.section },
      ]}
    />
  );
}
