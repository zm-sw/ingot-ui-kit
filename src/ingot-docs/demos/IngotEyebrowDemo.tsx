import { IngotEyebrow, IngotMetrics } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <IngotEyebrow>Sklad</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">Regál 1 · Police 2</p>
        </div>
        <div>
          <IngotEyebrow tone="muted">Naposledy upraveno</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">dnes 14:20</p>
        </div>
        <div>
          <IngotEyebrow tone="ok">Krok 2 · hotovo</IngotEyebrow>
          <p className="mt-1 text-sm text-ink-2">Materiál potvrzen</p>
        </div>
        <div>
          <IngotEyebrow size="md">Rám obrazovky</IngotEyebrow>
          <p className="mt-2 text-sm text-ink-2">
            Horní lišta → drobečky → hlavička stránky → obsah.
          </p>
        </div>
      </div>
      <IngotMetrics
        label="Souhrn"
        items={[
          { label: "Ve výrobě", value: 18 },
          { label: "Po termínu", value: 2, tone: "danger" },
        ]}
      />
    </div>
  );
}
