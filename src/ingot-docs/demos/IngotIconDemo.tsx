import { IngotCode, IngotIcon, IngotList, IngotSection } from "@/ingot";

const SIZES = [
  { size: 13, where: "Button size=\"sm\"" },
  { size: 14, where: "Button" },
  { size: 15, where: "IngotSideNav" },
  { size: 20, where: "IngotEmptyState" },
];

export function Demo(): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 text-ink-2">
        <span className="inline-flex items-center gap-1.5 text-sm">
          <IngotIcon name="upload" />
          Nahrát výkres
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm">
          <IngotIcon name="check" />
          Hotovo
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-danger">
          <IngotIcon name="trash" />
          Smazat
        </span>
        <IngotIcon name="close" size={16} title="Zavřít" />
      </div>
      <IngotSection title="Velikosti" level={3}>
        <IngotList
          items={SIZES.map((step) => (
            <span key={step.size} className="inline-flex items-center gap-2">
              <IngotIcon name="search" size={step.size} />
              <IngotCode>{`size={${step.size}}`}</IngotCode>
              <span className="text-ink-3">{step.where}</span>
            </span>
          ))}
        />
      </IngotSection>
    </div>
  );
}
