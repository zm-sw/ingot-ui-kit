import { IngotIcon, IngotMegaMenu } from "@/ingot";

function SectionArt(): JSX.Element {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden="true" className="text-ink-4">
      <rect x="1" y="1" width="24" height="54" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="32" y="1" width="24" height="42" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="63" y="1" width="24" height="48" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="37" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="68" y="8" width="14" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function Demo(): JSX.Element {
  return (
    <div className="relative h-[300px] w-full min-w-0">
      <IngotMegaMenu
        groups={[
          {
            title: "Denní provoz",
            items: [
              {
                href: "#objednavky",
                label: "Objednávky",
                description:
                  "Co je přijaté a co čeká na potvrzení výroby. Odsud se objednávka pouští do plánu.",
                icon: <IngotIcon name="file" size={15} />,
                count: 12,
                current: true,
              },
              {
                href: "#poptavky",
                label: "Poptávky",
                description:
                  "Nacenění, která zákazník zatím nepotvrdil. Stárnoucí poptávka je první kandidát na telefonát.",
                icon: <IngotIcon name="chat" size={15} />,
                count: 48,
              },
              {
                href: "#expedice",
                label: "Expedice",
                description:
                  "Zabalené zakázky a štítky dopravců. Co tu leží přes noc, mělo být pryč.",
                icon: <IngotIcon name="truck" size={15} />,
                count: 3,
              },
            ],
          },
          {
            title: "Katalog",
            items: [
              {
                href: "#materialy",
                label: "Materiály",
                description:
                  "Skladové položky a jejich vlastnosti — tloušťky, jakosti, ceny.",
                icon: <IngotIcon name="grid" size={15} />,
              },
              {
                href: "#operace",
                label: "Operace",
                description:
                  "Výrobní operace a jejich parametry. Změna se projeví v nacenění.",
                icon: <IngotIcon name="bolt" size={15} />,
              },
            ],
          },
        ]}
        art={<SectionArt />}
        label="Provoz"
        testId="docs-megamenu"
      />
    </div>
  );
}
