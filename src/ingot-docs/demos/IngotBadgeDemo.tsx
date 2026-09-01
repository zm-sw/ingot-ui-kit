import { IngotBadge } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IngotBadge>Koncept</IngotBadge>
      <IngotBadge tone="accent">Čeká na schválení</IngotBadge>
      <IngotBadge tone="warn" dot>
        Ve výrobě
      </IngotBadge>
      <IngotBadge tone="ok">Hotovo</IngotBadge>
      <IngotBadge tone="danger">Zamítnuto</IngotBadge>
      <IngotBadge tone="ink" testId="docs-badge-ink">
        Archivováno
      </IngotBadge>
    </div>
  );
}
