import { IngotPageHeader, IngotPageLayout, IngotSection, IngotSideNav } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <IngotPageLayout
      aside={
        <IngotSideNav
          label="Obsah nastavení"
          items={[
            { href: "#profil-firmy", label: "Profil firmy", current: true },
            { href: "#danove-udaje", label: "Daňové údaje" },
            { href: "#cislovani-dokladu", label: "Číslování dokladů" },
          ]}
        />
      }
      testId="docs-pagelayout"
    >
      <IngotPageHeader
        title="Profil firmy"
        description="Údaje, které se propisují na doklady a veřejné stránky."
      />
      <IngotSection title="Fakturační adresa">
        <p className="text-sm text-ink-2">Sídlo firmy tak, jak má stát na faktuře.</p>
      </IngotSection>
      <IngotSection title="Kontakt pro zákazníky">
        <p className="text-sm text-ink-2">
          E-mail a telefon, které vidí zákazník v patičce objednávky.
        </p>
      </IngotSection>
    </IngotPageLayout>
  );
}
