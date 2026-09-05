import { useRef, useState } from "react";

import { Button, IngotCheckbox, IngotPopover } from "@/ingot";

export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [onlyLate, setOnlyLate] = useState(true);
  const [mine, setMine] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        ref={anchorRef}
        variant="secondary"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Filtry
      </Button>
      <IngotPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label="Filtry seznamu"
        className="w-64 p-3"
        testId="docs-popover"
      >
        <div className="space-y-2">
          <IngotCheckbox
            checked={onlyLate}
            onChange={setOnlyLate}
            label="Jen po termínu"
          />
          <IngotCheckbox checked={mine} onChange={setMine} label="Jen moje" />
        </div>
      </IngotPopover>
      <p className="text-xs text-ink-3">
        Klik mimo panel i Escape ho zavřou a vrátí fokus na tlačítko.
      </p>
    </div>
  );
}
