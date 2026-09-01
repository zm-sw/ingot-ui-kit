import { useState } from "react";

import { IngotField } from "@/ingot";

export function Demo(): JSX.Element {
  const [quantity, setQuantity] = useState("12");
  const [code, setCode] = useState("PL-1050-H14");
  const [note, setNote] = useState("");

  return (
    <div className="max-w-sm space-y-4">
      <IngotField
        label="Počet kusů"
        value={quantity}
        onChange={setQuantity}
        affix="ks"
        mono
        hint="Kolik kusů se má z této položky vyrobit."
        testId="docs-field-quantity"
      />
      <IngotField
        label="Označení materiálu"
        value={code}
        onChange={setCode}
        mono
        error="Takové označení v katalogu není."
        testId="docs-field-code"
      />
      <IngotField
        label="Poznámka pro výrobu"
        value={note}
        onChange={setNote}
        optionalLabel="— nepovinné"
        placeholder="Např. odjehlit hrany"
        testId="docs-field-note"
      />
    </div>
  );
}
