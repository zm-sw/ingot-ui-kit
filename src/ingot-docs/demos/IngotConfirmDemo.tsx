import { useState } from "react";

import { Button, IngotConfirm } from "@/ingot";
export function Demo(): JSX.Element {
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
        Smazat položku
      </Button>
      {done ? <p className="text-sm text-ink-3">Potvrzeno.</p> : null}
      {open ? (
        <IngotConfirm
          title="Smazat trvale?"
          description="Ukázka nic nemaže — potvrzení jen zavře dialog."
          confirmLabel="Smazat"
          cancelLabel="Zrušit"
          closeLabel="Zavřít"
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
