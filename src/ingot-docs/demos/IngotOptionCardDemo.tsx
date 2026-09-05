import { useState } from "react";

import { IngotOptionCard } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    weightTitle: "Podle hmotnosti",
    weightBody:
      "Cena vychází z hmotnosti dílu a sazby materiálu. Vhodné pro plechové díly z jednoho materiálu.",
    machineTitle: "Podle času stroje",
    machineBody:
      "Cena vychází z odhadu strojního času. Vhodné pro obrábění, kde hmotnost o práci nevypovídá.",
  },
  en: {
    weightTitle: "By weight",
    weightBody:
      "The price comes from the part's weight and the material rate. Good for sheet parts in one material.",
    machineTitle: "By machine time",
    machineBody:
      "The price comes from estimated machine time. Good for machining, where weight says nothing about the work.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [basis, setBasis] = useState("weight");
  return (
    <div className="grid w-full gap-2.5 sm:grid-cols-2">
      <IngotOptionCard
        name="pricing-basis"
        value="weight"
        checked={basis === "weight"}
        onChange={setBasis}
        title={t.weightTitle}
        description={t.weightBody}
        testId="docs-option-weight"
      />
      <IngotOptionCard
        name="pricing-basis"
        value="machine"
        checked={basis === "machine"}
        onChange={setBasis}
        title={t.machineTitle}
        description={t.machineBody}
        testId="docs-option-machine"
      />
    </div>
  );
}
