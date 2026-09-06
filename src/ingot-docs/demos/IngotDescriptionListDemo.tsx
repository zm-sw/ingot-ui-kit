import { IngotAvatar, IngotBadge, IngotDescriptionList, IngotSection } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    section: "Zakázka ZAK-2026-0184",
    code: "Číslo zakázky",
    customer: "Zákazník",
    state: "Stav",
    due: "Termín",
    count: "Kusů",
    price: "Cena bez DPH",
    operator: "Obsluha",
    created: "Založena",
    customerValue: "Strojírny Beneš",
    inProduction: "Ve výrobě",
    operatorValue: "Jan Marek",
    priceValue: "48 600 Kč",
  },
  en: {
    section: "Order ZAK-2026-0184",
    code: "Order number",
    customer: "Customer",
    state: "State",
    due: "Due",
    count: "Pieces",
    price: "Price excl. VAT",
    operator: "Operator",
    created: "Created",
    customerValue: "Benes Engineering",
    inProduction: "In production",
    operatorValue: "Jan Marek",
    priceValue: "CZK 48,600",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="w-full max-w-2xl">
      <IngotSection title={t.section}>
        <IngotDescriptionList
          columns={2}
          testId="docs-description-list"
          items={[
            { label: t.code, value: "ZAK-2026-0184", mono: true },
            { label: t.customer, value: t.customerValue },
            {
              label: t.state,
              value: <IngotBadge tone="accent">{t.inProduction}</IngotBadge>,
            },
            { label: t.due, value: "12. 9. 2026", mono: true },
            { label: t.count, value: "120", mono: true },
            { label: t.price, value: t.priceValue, mono: true },
            {
              label: t.operator,
              value: (
                <span className="flex items-center gap-2">
                  <IngotAvatar initials="JM" label={t.operatorValue} decorative />
                  {t.operatorValue}
                </span>
              ),
            },
            { label: t.created, value: "28. 8. 2026", mono: true },
          ]}
        />
      </IngotSection>
    </div>
  );
}
