import { IngotDisclosure, IngotDisclosureGroup, IngotList } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="max-w-sm rounded-md border border-border bg-surface">
      <IngotDisclosureGroup testId="docs-disclosure-group">
        <IngotDisclosure title="Osa komunikace" count={4} defaultOpen>
          <IngotList
            items={[
              "Poptávka přijata",
              "Nabídka odeslána",
              "Doplňující dotaz",
              "Objednávka potvrzena",
            ]}
          />
        </IngotDisclosure>
        <IngotDisclosure title="Doklady" count={2}>
          <IngotList items={["Nabídka 2026-0412", "Objednávka 2026-0417"]} />
        </IngotDisclosure>
        <IngotDisclosure title="Poznámky">
          <p>Zákazník žádá dodání do konce měsíce.</p>
        </IngotDisclosure>
      </IngotDisclosureGroup>
    </div>
  );
}
