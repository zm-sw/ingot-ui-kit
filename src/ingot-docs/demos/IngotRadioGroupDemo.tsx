import { useState } from "react";

import { IngotRadioGroup } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    label: "Režim naceňování",
    hint: "Platí pro nové poptávky; rozpracované zůstávají beze změny.",
    standard: "Standardní",
    standardHint: "Z platného ceníku materiálu a operací.",
    contract: "Smluvní",
    contractHint: "Z ceníku sjednaného s odběratelem.",
    manual: "Ruční",
    manualHint: "Cenu zadá obchodník ke každé položce.",
    auction: "Poptávkové řízení",
    auctionHint: "Zatím jen pro vybrané provozy.",
  },
  en: {
    label: "Pricing mode",
    hint: "Applies to new enquiries; those in progress stay as they are.",
    standard: "Standard",
    standardHint: "From the current material and operation price list.",
    contract: "Contract",
    contractHint: "From the price list agreed with the customer.",
    manual: "Manual",
    manualHint: "Sales enters a price for every item.",
    auction: "Tender",
    auctionHint: "Only for selected sites so far.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [value, setValue] = useState("standard");

  return (
    <div className="w-full max-w-sm">
      <IngotRadioGroup
        value={value}
        onChange={setValue}
        label={t.label}
        hint={t.hint}
        options={[
          { value: "standard", label: t.standard, hint: t.standardHint },
          { value: "contract", label: t.contract, hint: t.contractHint },
          { value: "manual", label: t.manual, hint: t.manualHint },
          {
            value: "auction",
            label: t.auction,
            hint: t.auctionHint,
            disabled: true,
          },
        ]}
        testId="docs-radiogroup"
      />
    </div>
  );
}
