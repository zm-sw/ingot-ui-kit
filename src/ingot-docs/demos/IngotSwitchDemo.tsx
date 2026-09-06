import { useState } from "react";

import { IngotSwitch } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    notify: "Upozornění na skluz",
    notifyHint: "Pošle e-mail, jakmile se zakázka dostane po termínu.",
    autoplan: "Automatické plánování",
    autoplanHint: "Nové operace se zařadí do fronty samy.",
    share: "Sdílení s dodavateli",
    shareHint: "Vyžaduje vyšší tarif.",
  },
  en: {
    notify: "Slippage alerts",
    notifyHint: "Sends an e-mail as soon as a job goes past its date.",
    autoplan: "Automatic planning",
    autoplanHint: "New operations join the queue on their own.",
    share: "Sharing with suppliers",
    shareHint: "Needs a higher plan.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [notify, setNotify] = useState(true);
  const [autoplan, setAutoplan] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-4">
      <IngotSwitch
        checked={notify}
        onChange={setNotify}
        label={t.notify}
        hint={t.notifyHint}
        testId="docs-switch-notify"
      />
      <IngotSwitch
        checked={autoplan}
        onChange={setAutoplan}
        label={t.autoplan}
        hint={t.autoplanHint}
        testId="docs-switch-autoplan"
      />
      <IngotSwitch
        checked={false}
        onChange={() => undefined}
        label={t.share}
        hint={t.shareHint}
        disabled
        testId="docs-switch-share"
      />
    </div>
  );
}
