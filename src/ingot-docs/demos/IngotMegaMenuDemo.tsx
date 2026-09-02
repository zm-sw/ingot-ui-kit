import { IngotIcon, IngotMegaMenu } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <div className="relative h-[260px] w-full min-w-0">
      <IngotMegaMenu
        columns={[
          {
            title: "Denní provoz",
            items: [
              {
                href: "#/IngotMegaMenu",
                label: "Objednávky",
                icon: <IngotIcon name="file" size={15} />,
                count: 12,
                current: true,
              },
              {
                href: "#/IngotMegaMenu",
                label: "Poptávky",
                icon: <IngotIcon name="chat" size={15} />,
                count: 48,
              },
              {
                href: "#/IngotMegaMenu",
                label: "Expedice",
                icon: <IngotIcon name="truck" size={15} />,
                count: 3,
              },
            ],
          },
          {
            title: "Platforma",
            items: [
              {
                href: "#/IngotMegaMenu",
                label: "Partneři",
                icon: <IngotIcon name="globe" size={15} />,
              },
              {
                href: "#/IngotMegaMenu",
                label: "Uživatelé",
                icon: <IngotIcon name="shield" size={15} />,
              },
            ],
          },
          {
            title: "Katalog",
            items: [
              {
                href: "#/IngotMegaMenu",
                label: "Materiály",
                icon: <IngotIcon name="grid" size={15} />,
              },
              {
                href: "#/IngotMegaMenu",
                label: "Operace",
                icon: <IngotIcon name="bolt" size={15} />,
              },
            ],
          },
        ]}
        preview={
          <div className="space-y-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-ink-4">
              Objednávky
            </p>
            <p className="text-sm text-ink-2">
              Co je přijaté a co čeká na potvrzení výroby. Odsud se objednávka
              pouští do plánu.
            </p>
          </div>
        }
        label="Provoz"
        testId="docs-megamenu"
      />
    </div>
  );
}
