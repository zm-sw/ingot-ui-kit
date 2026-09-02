import { useState } from "react";

import { IngotOptionCard } from "@/ingot";
export function Demo(): JSX.Element {
  const [basis, setBasis] = useState("weight");
  return (
    <div className="grid w-full gap-2.5 sm:grid-cols-2">
      <IngotOptionCard
        name="pricing-basis"
        value="weight"
        checked={basis === "weight"}
        onChange={setBasis}
        title="Podle hmotnosti"
        description="Cena vychází z hmotnosti dílu a sazby materiálu. Vhodné pro plechové díly z jednoho materiálu."
        testId="docs-option-weight"
      />
      <IngotOptionCard
        name="pricing-basis"
        value="machine"
        checked={basis === "machine"}
        onChange={setBasis}
        title="Podle času stroje"
        description="Cena vychází z odhadu strojního času. Vhodné pro obrábění, kde hmotnost o práci nevypovídá."
        testId="docs-option-machine"
      />
    </div>
  );
}
