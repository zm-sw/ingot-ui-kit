import { Button, IngotBadge, IngotStepCard } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    kickerOne: "Krok 01",
    titleOne: "Země a měny",
    metaOne: "3 / 3 aktivní",
    done: "Hotovo",
    toggleOne: "Rozbalit krok Země a měny",
    addCountry: "Přidat zemi",
    bodyOne: "Česko, Slovensko a Polsko. Ceny se přepočítávají kurzem ČNB.",
    kickerTwo: "Krok 02",
    titleTwo: "Skupiny vlastností",
    metaTwo: "24 vlastností",
    toggleTwo: "Sbalit krok Skupiny vlastností",
    addProperty: "Přidat vlastnost",
    bodyTwoStart: "Materiály a povrchové úpravy.",
    canonical: "kanonická",
    bodyTwoEnd: "skupina se do nabídek propíše všem partnerům.",
  },
  en: {
    kickerOne: "Step 01",
    titleOne: "Countries and currencies",
    metaOne: "3 / 3 active",
    done: "Done",
    toggleOne: "Expand the Countries and currencies step",
    addCountry: "Add a country",
    bodyOne:
      "Czechia, Slovakia and Poland. Prices are converted at the central bank rate.",
    kickerTwo: "Step 02",
    titleTwo: "Property groups",
    metaTwo: "24 properties",
    toggleTwo: "Collapse the Property groups step",
    addProperty: "Add a property",
    bodyTwoStart: "Materials and surface finishes. A",
    canonical: "canonical",
    bodyTwoEnd: "group reaches every partner's quotes.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="w-full space-y-3">
      <IngotStepCard
        step="01"
        kicker={t.kickerOne}
        title={t.titleOne}
        meta={t.metaOne}
        done
        doneLabel={t.done}
        collapsible
        toggleLabel={t.toggleOne}
        footer={
          <Button variant="ghost" size="sm">
            {t.addCountry}
          </Button>
        }
        testId="docs-stepcard-done"
      >
        <p className="text-sm text-ink-2">{t.bodyOne}</p>
      </IngotStepCard>
      <IngotStepCard
        step="02"
        kicker={t.kickerTwo}
        title={t.titleTwo}
        meta={t.metaTwo}
        collapsible
        toggleLabel={t.toggleTwo}
        footer={
          <Button variant="ghost" size="sm">
            {t.addProperty}
          </Button>
        }
        testId="docs-stepcard-open"
      >
        <p className="text-sm text-ink-2">
          {t.bodyTwoStart} <IngotBadge>{t.canonical}</IngotBadge> {t.bodyTwoEnd}
        </p>
      </IngotStepCard>
    </div>
  );
}
