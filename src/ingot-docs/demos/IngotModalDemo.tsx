import { useState } from "react";

import { Button, IngotModal } from "@/ingot";
export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        data-testid="docs-modal-open"
      >
        Otevřít dialog
      </Button>
      {open ? (
        <IngotModal
          title="Ukázkový dialog"
          onClose={() => setOpen(false)}
          closeLabel="Zavřít"
          testId="docs-modal"
        >
          <p className="text-sm text-ink-2">
            ESC, kliknutí do pozadí i křížek zavírají. Fokus je uvnitř a po
            zavření se vrací na tlačítko, které dialog otevřelo.
          </p>
        </IngotModal>
      ) : null}
    </div>
  );
}

