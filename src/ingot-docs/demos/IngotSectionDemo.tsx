import { IngotSection } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <IngotSection id="ukazkova-sekce" title="Nadpis sekce" testId="docs-section">
      <p className="text-sm text-ink-2">
        Obsah sekce. Kotva sedí na sekci, ne na nadpisu, takže odkaz skočí
        nad nadpis a ne doprostřed textu.
      </p>
    </IngotSection>
  );
}
