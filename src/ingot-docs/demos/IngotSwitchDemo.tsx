import { useState } from "react";

import { IngotSwitch } from "@/ingot";

export function Demo(): JSX.Element {
  const [notify, setNotify] = useState(true);
  const [autoplan, setAutoplan] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-4">
      <IngotSwitch
        checked={notify}
        onChange={setNotify}
        label="Upozornění na skluz"
        hint="Pošle e-mail, jakmile se zakázka dostane po termínu."
        testId="docs-switch-notify"
      />
      <IngotSwitch
        checked={autoplan}
        onChange={setAutoplan}
        label="Automatické plánování"
        hint="Nové operace se zařadí do fronty samy."
        testId="docs-switch-autoplan"
      />
      <IngotSwitch
        checked={false}
        onChange={() => undefined}
        label="Sdílení s dodavateli"
        hint="Vyžaduje vyšší tarif."
        disabled
        testId="docs-switch-share"
      />
    </div>
  );
}
