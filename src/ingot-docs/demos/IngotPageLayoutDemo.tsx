import { IngotPageHeader, IngotPageLayout, IngotSection, IngotSideNav } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    navLabel: "Obsah nastavení",
    profile: "Profil firmy",
    tax: "Daňové údaje",
    numbering: "Číslování dokladů",
    description: "Údaje, které se propisují na doklady a veřejné stránky.",
    billing: "Fakturační adresa",
    billingBody: "Sídlo firmy tak, jak má stát na faktuře.",
    contact: "Kontakt pro zákazníky",
    contactBody: "E-mail a telefon, které vidí zákazník v patičce objednávky.",
  },
  en: {
    navLabel: "Settings contents",
    profile: "Company profile",
    tax: "Tax details",
    numbering: "Document numbering",
    description: "Details that reach documents and the public pages.",
    billing: "Billing address",
    billingBody: "The registered address as it should appear on an invoice.",
    contact: "Customer contact",
    contactBody: "The e-mail and phone a customer sees in an order's footer.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <IngotPageLayout
      aside={
        <IngotSideNav
          label={t.navLabel}
          items={[
            { href: "#profil-firmy", label: t.profile, current: true },
            { href: "#danove-udaje", label: t.tax },
            { href: "#cislovani-dokladu", label: t.numbering },
          ]}
        />
      }
      testId="docs-pagelayout"
    >
      <IngotPageHeader title={t.profile} description={t.description} />
      <IngotSection title={t.billing}>
        <p className="text-sm text-ink-2">{t.billingBody}</p>
      </IngotSection>
      <IngotSection title={t.contact}>
        <p className="text-sm text-ink-2">{t.contactBody}</p>
      </IngotSection>
    </IngotPageLayout>
  );
}
