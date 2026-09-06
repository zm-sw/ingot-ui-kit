import { IngotIcon, IngotMegaMenu } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    label: "Provoz",
    daily: "Denní provoz",
    orders: "Objednávky",
    ordersText:
      "Co je přijaté a co čeká na potvrzení výroby. Odsud se objednávka pouští do plánu.",
    enquiries: "Poptávky",
    enquiriesText:
      "Nacenění, která zákazník zatím nepotvrdil. Stárnoucí poptávka je první kandidát na telefonát.",
    dispatch: "Expedice",
    dispatchText:
      "Zabalené zakázky a štítky dopravců. Co tu leží přes noc, mělo být pryč.",
    catalogue: "Katalog",
    materials: "Materiály",
    materialsText: "Skladové položky a jejich vlastnosti — tloušťky, jakosti, ceny.",
    operations: "Operace",
    operationsText: "Výrobní operace a jejich parametry. Změna se projeví v nacenění.",
  },
  en: {
    label: "Shop floor",
    daily: "Day to day",
    orders: "Orders",
    ordersText:
      "What has been taken and what waits for production to confirm it. An order enters the plan from here.",
    enquiries: "Enquiries",
    enquiriesText:
      "Prices the customer has not confirmed yet. An ageing enquiry is the first candidate for a phone call.",
    dispatch: "Dispatch",
    dispatchText:
      "Packed jobs and carrier labels. Whatever sits here overnight should have gone.",
    catalogue: "Catalogue",
    materials: "Materials",
    materialsText: "Stock items and their properties — thickness, grade, price.",
    operations: "Operations",
    operationsText:
      "Production operations and their parameters. A change shows up in the pricing.",
  },
};

function SectionArt(): JSX.Element {
  return (
    <svg
      width="88"
      height="56"
      viewBox="0 0 88 56"
      fill="none"
      aria-hidden="true"
      className="text-ink-4"
    >
      <rect
        x="1"
        y="1"
        width="24"
        height="54"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="32"
        y="1"
        width="24"
        height="42"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="63"
        y="1"
        width="24"
        height="48"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="6" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="37" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="68" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="relative h-[300px] w-full min-w-0">
      <IngotMegaMenu
        groups={[
          {
            title: t.daily,
            items: [
              {
                href: "#objednavky",
                label: t.orders,
                description: t.ordersText,
                icon: <IngotIcon name="file" size={15} />,
                count: 12,
                current: true,
              },
              {
                href: "#poptavky",
                label: t.enquiries,
                description: t.enquiriesText,
                icon: <IngotIcon name="chat" size={15} />,
                count: 48,
              },
              {
                href: "#expedice",
                label: t.dispatch,
                description: t.dispatchText,
                icon: <IngotIcon name="truck" size={15} />,
                count: 3,
              },
            ],
          },
          {
            title: t.catalogue,
            items: [
              {
                href: "#materialy",
                label: t.materials,
                description: t.materialsText,
                icon: <IngotIcon name="grid" size={15} />,
              },
              {
                href: "#operace",
                label: t.operations,
                description: t.operationsText,
                icon: <IngotIcon name="bolt" size={15} />,
              },
            ],
          },
        ]}
        art={<SectionArt />}
        label={t.label}
        testId="docs-megamenu"
      />
    </div>
  );
}
