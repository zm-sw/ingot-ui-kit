import { useState } from "react";

import { IngotCheckbox } from "@/ingot";

export function Demo(): JSX.Element {
  const [attention, setAttention] = useState(true);
  const [sandbox, setSandbox] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <IngotCheckbox
        checked={attention}
        onChange={setAttention}
        label="Jen vyžadující zásah"
        testId="docs-checkbox-attention"
      />
      <IngotCheckbox
        checked={sandbox}
        onChange={setSandbox}
        label="Včetně zkušebních"
        testId="docs-checkbox-sandbox"
      />
      <IngotCheckbox
        checked
        onChange={() => undefined}
        label="Archivované (uzamčeno plánem)"
        disabled
        testId="docs-checkbox-disabled"
      />
    </div>
  );
}
