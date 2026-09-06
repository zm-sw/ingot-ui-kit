import { useRef, useState } from "react";

import { Button, IngotCheckbox, IngotPopover } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    trigger: "Filtry",
    label: "Filtry seznamu",
    late: "Jen po termínu",
    mine: "Jen moje",
    hint: "Klik mimo panel i Escape ho zavřou a vrátí fokus na tlačítko.",
  },
  en: {
    trigger: "Filters",
    label: "List filters",
    late: "Only past due",
    mine: "Only mine",
    hint: "A click outside and Escape both close it and return focus to the button.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
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
        {t.trigger}
      </Button>
      <IngotPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label={t.label}
        className="w-64 p-3"
        testId="docs-popover"
      >
        <div className="space-y-2">
          <IngotCheckbox checked={onlyLate} onChange={setOnlyLate} label={t.late} />
          <IngotCheckbox checked={mine} onChange={setMine} label={t.mine} />
        </div>
      </IngotPopover>
      <p className="text-xs text-ink-3">{t.hint}</p>
    </div>
  );
}
