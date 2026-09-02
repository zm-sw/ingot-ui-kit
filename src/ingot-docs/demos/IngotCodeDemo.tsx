import { IngotCode } from "@/ingot";

const SAMPLE = `import { useState } from "react";
import { IngotModal } from "@/ingot";

export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  return <IngotModal open={open} title="Nová položka" onClose={() => setOpen(false)} />;
}`;

export function Demo(): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        Kit se importuje z jednoho místa: <IngotCode>@/ingot</IngotCode>.
      </p>
      <IngotCode block lang="tsx" testId="docs-code">
        {SAMPLE}
      </IngotCode>
    </div>
  );
}
