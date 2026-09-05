import { useState } from "react";

import { IngotRadioGroup } from "@/ingot";

export function Demo(): JSX.Element {
  const [value, setValue] = useState("standard");

  return (
    <div className="w-full max-w-sm">
      <IngotRadioGroup
        value={value}
        onChange={setValue}
        label="Režim naceňování"
        hint="Platí pro nové poptávky; rozpracované zůstávají beze změny."
        options={[
          {
            value: "standard",
            label: "Standardní",
            hint: "Z platného ceníku materiálu a operací.",
          },
          {
            value: "contract",
            label: "Smluvní",
            hint: "Z ceníku sjednaného s odběratelem.",
          },
          {
            value: "manual",
            label: "Ruční",
            hint: "Cenu zadá obchodník ke každé položce.",
          },
          {
            value: "auction",
            label: "Poptávkové řízení",
            hint: "Zatím jen pro vybrané provozy.",
            disabled: true,
          },
        ]}
        testId="docs-radiogroup"
      />
    </div>
  );
}
