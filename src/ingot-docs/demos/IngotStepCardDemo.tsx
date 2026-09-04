import { Button, IngotBadge, IngotStepCard } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <div className="w-full space-y-3">
      <IngotStepCard
        step="01"
        kicker="Krok 01"
        title="Země a měny"
        meta="3 / 3 aktivní"
        done
        doneLabel="Hotovo"
        collapsible
        toggleLabel="Rozbalit krok Země a měny"
        footer={
          <Button variant="ghost" size="sm">
            Přidat zemi
          </Button>
        }
        testId="docs-stepcard-done"
      >
        <p className="text-sm text-ink-2">
          Česko, Slovensko a Polsko. Ceny se přepočítávají kurzem ČNB.
        </p>
      </IngotStepCard>
      <IngotStepCard
        step="02"
        kicker="Krok 02"
        title="Skupiny vlastností"
        meta="24 vlastností"
        collapsible
        toggleLabel="Sbalit krok Skupiny vlastností"
        footer={
          <Button variant="ghost" size="sm">
            Přidat vlastnost
          </Button>
        }
        testId="docs-stepcard-open"
      >
        <p className="text-sm text-ink-2">
          Materiály a povrchové úpravy. <IngotBadge>kanonická</IngotBadge> skupina
          se do nabídek propíše všem partnerům.
        </p>
      </IngotStepCard>
    </div>
  );
}
