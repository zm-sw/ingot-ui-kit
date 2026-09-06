import { IngotMarketingSegments } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    fabTitle: "Zakázková kovovýroba",
    fabText: "Desítky poptávek týdně a každá jiná.",
    fabTagOne: "laser",
    fabTagTwo: "ohyb",
    fabTagThree: "svařování",
    machTitle: "Obrobny",
    machText: "Ceny stojí na strojních časech, ne na odhadu.",
    machTagOne: "frézování",
    machTagTwo: "soustružení",
    designTitle: "Konstrukční kanceláře",
    designText: "Rychlá zpětná vazba na vyrobitelnost dílu.",
    designTagOne: "prototypy",
    designTagTwo: "malé série",
  },
  en: {
    fabTitle: "Custom metal fabrication",
    fabText: "Dozens of enquiries a week, every one different.",
    fabTagOne: "laser",
    fabTagTwo: "bending",
    fabTagThree: "welding",
    machTitle: "Machine shops",
    machText: "Prices stand on machine times, not on a guess.",
    machTagOne: "milling",
    machTagTwo: "turning",
    designTitle: "Design offices",
    designText: "Quick feedback on whether a part can be made.",
    designTagOne: "prototypes",
    designTagTwo: "small runs",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="bg-bg p-6">
      <IngotMarketingSegments
        testId="docs-marketing-segments"
        items={[
          {
            title: t.fabTitle,
            text: t.fabText,
            tags: [t.fabTagOne, t.fabTagTwo, t.fabTagThree],
          },
          {
            title: t.machTitle,
            text: t.machText,
            tags: [t.machTagOne, t.machTagTwo],
          },
          {
            title: t.designTitle,
            text: t.designText,
            tags: [t.designTagOne, t.designTagTwo],
          },
        ]}
      />
    </div>
  );
}
