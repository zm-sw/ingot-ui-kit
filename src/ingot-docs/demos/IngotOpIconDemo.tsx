import { IngotCode, IngotSection } from "@/ingot";
import { IngotOpIcon, INGOT_OP_ICON_KEYS } from "@/ingot/forgmatic";

const SAMPLE = INGOT_OP_ICON_KEYS.slice(0, 6);

export function Demo(): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-5">
        {SAMPLE.map((key) => (
          <span
            key={key}
            className="inline-flex flex-col items-center gap-1.5 text-[12px] text-ink-3"
          >
            <IngotOpIcon token={key} categoryColor="var(--accent)" />
            <IngotCode>{key}</IngotCode>
          </span>
        ))}
      </div>
      <IngotSection title="Varianty inkoustu" level={3}>
        <span className="inline-flex items-center gap-4">
          <IngotOpIcon token={SAMPLE[0]} categoryColor="var(--accent)" size={22} />
          <IngotOpIcon token={`${SAMPLE[0]}:black`} size={22} />
          <span className="inline-flex rounded bg-ink p-1.5">
            <IngotOpIcon token={`${SAMPLE[0]}:white`} size={22} />
          </span>
        </span>
      </IngotSection>
    </div>
  );
}
