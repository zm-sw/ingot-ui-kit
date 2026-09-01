import { IngotList } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="space-y-4">
      <IngotList
        testId="docs-list"
        items={["První položka", "Druhá položka", "Třetí položka"]}
      />
      <IngotList
        variant="ordered"
        items={["Napiš komponentu", "Přidej doc stránku", "Zapoj konzumenta"]}
      />
    </div>
  );
}
