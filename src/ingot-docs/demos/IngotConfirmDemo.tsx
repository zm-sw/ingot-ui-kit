import { useState } from "react";

import { Button, IngotConfirm } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    open: "Smazat položku",
    done: "Potvrzeno.",
    title: "Smazat trvale?",
    description: "Ukázka nic nemaže — potvrzení jen zavře dialog.",
    confirm: "Smazat",
    cancel: "Zrušit",
    close: "Zavřít",
  },
  en: {
    open: "Delete item",
    done: "Confirmed.",
    title: "Delete permanently?",
    description: "The demo deletes nothing — confirming only closes the dialog.",
    confirm: "Delete",
    cancel: "Cancel",
    close: "Close",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-2">
      <Button
        variant="danger"
        size="sm"
        onClick={() => setOpen(true)}
        data-testid="docs-confirm-open"
      >
        {t.open}
      </Button>
      {done ? <p className="text-sm text-ink-3">{t.done}</p> : null}
      {open ? (
        <IngotConfirm
          title={t.title}
          description={t.description}
          confirmLabel={t.confirm}
          cancelLabel={t.cancel}
          closeLabel={t.close}
          onConfirm={() => {
            setDone(true);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          testId="docs-confirm"
        />
      ) : null}
    </div>
  );
}
