import { IngotList } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    first: "První položka",
    second: "Druhá položka",
    third: "Třetí položka",
    stepWrite: "Napiš komponentu",
    stepPage: "Přidej doc stránku",
    stepConsumer: "Zapoj konzumenta",
  },
  en: {
    first: "First item",
    second: "Second item",
    third: "Third item",
    stepWrite: "Write the component",
    stepPage: "Add its doc page",
    stepConsumer: "Wire up a consumer",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="space-y-4">
      <IngotList testId="docs-list" items={[t.first, t.second, t.third]} />
      <IngotList variant="ordered" items={[t.stepWrite, t.stepPage, t.stepConsumer]} />
    </div>
  );
}
