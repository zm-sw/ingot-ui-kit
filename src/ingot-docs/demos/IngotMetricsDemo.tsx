import { IngotMetrics } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    inProduction: "Ve výrobě",
    inProductionNote: "z toho 4 dnes",
    waiting: "Čeká na potvrzení",
    waitingNote: "nejstarší 3 dny",
    late: "Po termínu",
    lateNote: "OBJ-2411, OBJ-2390",
    capacity: "Volná kapacita",
    capacityValue: "19 h",
    capacityNote: "tento týden",
    ordersLabel: "Přehled objednávek",
    groups: "skupiny",
    properties: "vlastností",
    free: "volných",
    settingsLabel: "Souhrn nastavení",
  },
  en: {
    inProduction: "In production",
    inProductionNote: "4 of them today",
    waiting: "Waiting for confirmation",
    waitingNote: "oldest 3 days",
    late: "Past due",
    lateNote: "ORD-2411, ORD-2390",
    capacity: "Free capacity",
    capacityValue: "19 h",
    capacityNote: "this week",
    ordersLabel: "Orders at a glance",
    groups: "groups",
    properties: "properties",
    free: "free",
    settingsLabel: "Settings at a glance",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="w-full space-y-4">
      <IngotMetrics
        items={[
          {
            label: t.inProduction,
            value: 18,
            note: t.inProductionNote,
            trend: [9, 11, 10, 14, 12, 15, 13, 16, 14, 17, 16, 18],
          },
          {
            label: t.waiting,
            value: 12,
            note: t.waitingNote,
            trend: [18, 16, 17, 14, 15, 12, 13, 11, 12, 10, 11, 12],
          },
          { label: t.late, value: 2, note: t.lateNote, tone: "danger" },
          { label: t.capacity, value: t.capacityValue, note: t.capacityNote },
        ]}
        label={t.ordersLabel}
        testId="docs-metrics"
      />
      <IngotMetrics
        variant="inline"
        items={[
          { label: t.groups, value: 2 },
          { label: t.properties, value: 24 },
          { label: t.free, value: 19 },
        ]}
        label={t.settingsLabel}
        testId="docs-metrics-inline"
      />
    </div>
  );
}
