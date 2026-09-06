import {
  Button,
  IngotBadge,
  IngotUserMenu,
  IngotUserMenuRow,
  IngotUserMenuSection,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    menu: "Menu účtu",
    tenant: "Otevřít Strojírny Kladno →",
    theme: "Motiv vzhledu",
    themeValue: "Podle systému",
    language: "Jazyk",
    dictionary: "Slovník",
    dictionaryValue: "Jednoduše",
    hints: "Nápověda na stránkách",
    hintsValue: "Zapnuto",
    signOut: "Odhlásit se",
  },
  en: {
    menu: "Account menu",
    tenant: "Open Kladno Engineering →",
    theme: "Appearance",
    themeValue: "Follow the system",
    language: "Language",
    dictionary: "Dictionary",
    dictionaryValue: "Plain",
    hints: "Hints on pages",
    hintsValue: "On",
    signOut: "Sign out",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotUserMenu label={t.menu} testId="docs-usermenu">
      <IngotUserMenuSection>
        <p className="text-sm font-semibold text-ink">Petr Zeman</p>
        <p className="text-[13px] text-ink-3">petr@strojirny-kladno.cz</p>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <a
          className="block py-1.5 text-sm font-semibold text-ink"
          href="/komponenty/user-menu"
        >
          {t.tenant}
        </a>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <IngotUserMenuRow label={t.theme}>
          <IngotBadge>{t.themeValue}</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label={t.language}>
          <IngotBadge>{lang.toUpperCase()}</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label={t.dictionary}>
          <IngotBadge tone="accent">{t.dictionaryValue}</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label={t.hints}>
          <IngotBadge tone="ok">{t.hintsValue}</IngotBadge>
        </IngotUserMenuRow>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <Button variant="ghost" size="sm">
          {t.signOut}
        </Button>
      </IngotUserMenuSection>
    </IngotUserMenu>
  );
}
