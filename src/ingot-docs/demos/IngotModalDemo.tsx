import { useState } from "react";

import { Button, IngotModal } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    open: "Otevřít dialog",
    title: "Ukázkový dialog",
    close: "Zavřít",
    body: "ESC, kliknutí do pozadí i křížek zavírají. Fokus je uvnitř a po zavření se vrací na tlačítko, které dialog otevřelo.",
  },
  en: {
    open: "Open the dialog",
    title: "A sample dialog",
    close: "Close",
    body: "Escape, a click on the backdrop and the cross all close it. Focus stays inside and returns to the button that opened it.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        data-testid="docs-modal-open"
      >
        {t.open}
      </Button>
      {open ? (
        <IngotModal
          title={t.title}
          onClose={() => setOpen(false)}
          closeLabel={t.close}
          testId="docs-modal"
        >
          <p className="text-sm text-ink-2">{t.body}</p>
        </IngotModal>
      ) : null}
    </div>
  );
}
