import { Button, IngotBadge, IngotUserMenu, IngotUserMenuRow, IngotUserMenuSection } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <IngotUserMenu label="Menu účtu" testId="docs-usermenu">
      <IngotUserMenuSection>
        <p className="text-sm font-semibold text-ink">Petr Zeman</p>
        <p className="text-[13px] text-ink-3">petr@strojirny-kladno.cz</p>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <a className="block py-1.5 text-sm font-semibold text-ink" href="#/IngotUserMenu">
          Otevřít Strojírny Kladno →
        </a>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <IngotUserMenuRow label="Motiv vzhledu">
          <IngotBadge>Podle systému</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label="Jazyk">
          <IngotBadge>CS</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label="Slovník">
          <IngotBadge tone="accent">Jednoduše</IngotBadge>
        </IngotUserMenuRow>
        <IngotUserMenuRow label="Nápověda na stránkách">
          <IngotBadge tone="ok">Zapnuto</IngotBadge>
        </IngotUserMenuRow>
      </IngotUserMenuSection>
      <IngotUserMenuSection>
        <Button variant="ghost" size="sm">
          Odhlásit se
        </Button>
      </IngotUserMenuSection>
    </IngotUserMenu>
  );
}
