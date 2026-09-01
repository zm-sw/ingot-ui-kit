import { IngotCode } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        Kit se importuje z jednoho místa: <IngotCode>@/ingot</IngotCode>.
      </p>
      <IngotCode block testId="docs-code">
        {'import { IngotTable } from "@/ingot";'}
      </IngotCode>
    </div>
  );
}
