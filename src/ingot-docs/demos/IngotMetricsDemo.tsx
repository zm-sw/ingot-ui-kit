import { IngotMetrics } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <div className="w-full space-y-4">
      <IngotMetrics
        items={[
          {
            label: "Ve výrobě",
            value: 18,
            note: "z toho 4 dnes",
            trend: [9, 11, 10, 14, 12, 15, 13, 16, 14, 17, 16, 18],
          },
          {
            label: "Čeká na potvrzení",
            value: 12,
            note: "nejstarší 3 dny",
            trend: [18, 16, 17, 14, 15, 12, 13, 11, 12, 10, 11, 12],
          },
          { label: "Po termínu", value: 2, note: "OBJ-2411, OBJ-2390", tone: "danger" },
          { label: "Volná kapacita", value: "19 h", note: "tento týden" },
        ]}
        label="Přehled objednávek"
        testId="docs-metrics"
      />
      <IngotMetrics
        variant="inline"
        items={[
          { label: "skupiny", value: 2 },
          { label: "vlastností", value: 24 },
          { label: "volných", value: 19 },
        ]}
        label="Souhrn nastavení"
        testId="docs-metrics-inline"
      />
    </div>
  );
}
