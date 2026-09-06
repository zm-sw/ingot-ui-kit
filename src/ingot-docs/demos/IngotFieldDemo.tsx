import { useState } from "react";

import { IngotField } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    quantity: "Počet kusů",
    unit: "ks",
    quantityHint: "Kolik kusů se má z této položky vyrobit.",
    code: "Označení materiálu",
    codeError: "Takové označení v katalogu není.",
    note: "Poznámka pro výrobu",
    optional: "— nepovinné",
    notePlaceholder: "Např. odjehlit hrany",
  },
  en: {
    quantity: "Piece count",
    unit: "pcs",
    quantityHint: "How many pieces of this item are to be made.",
    code: "Material code",
    codeError: "There is no such code in the catalogue.",
    note: "Note for the shop floor",
    optional: "— optional",
    notePlaceholder: "e.g. deburr the edges",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [quantity, setQuantity] = useState("12");
  const [code, setCode] = useState("PL-1050-H14");
  const [note, setNote] = useState("");

  return (
    <div className="max-w-sm space-y-4">
      <IngotField
        label={t.quantity}
        value={quantity}
        onChange={setQuantity}
        affix={t.unit}
        mono
        hint={t.quantityHint}
        testId="docs-field-quantity"
      />
      <IngotField
        label={t.code}
        value={code}
        onChange={setCode}
        mono
        error={t.codeError}
        testId="docs-field-code"
      />
      <IngotField
        label={t.note}
        value={note}
        onChange={setNote}
        optionalLabel={t.optional}
        placeholder={t.notePlaceholder}
        testId="docs-field-note"
      />
    </div>
  );
}
