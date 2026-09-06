import { IngotSection } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    title: "Nadpis sekce",
    body: "Obsah sekce. Kotva sedí na sekci, ne na nadpisu, takže odkaz skočí nad nadpis a ne doprostřed textu.",
  },
  en: {
    title: "Section heading",
    body: "The section's content. The anchor sits on the section rather than the heading, so a link lands above the heading instead of in the middle of the text.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotSection id="ukazkova-sekce" title={t.title} testId="docs-section">
      <p className="text-sm text-ink-2">{t.body}</p>
    </IngotSection>
  );
}
