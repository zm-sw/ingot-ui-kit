import { useRef, useState } from "react";

import { Button, IngotMenu } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    trigger: "Akce objednávky",
    nothing: "zatím nic",
    open: "Otevřít detail",
    duplicate: "Duplikovat",
    exportPdf: "Exportovat do PDF",
    remove: "Smazat",
    lastLabel: "Naposledy vybráno:",
    hint: "Šipky procházejí položky, psaní hledá podle prvních písmen, Tab menu opustí.",
  },
  en: {
    trigger: "Order actions",
    nothing: "nothing yet",
    open: "Open the detail",
    duplicate: "Duplicate",
    exportPdf: "Export to PDF",
    remove: "Delete",
    lastLabel: "Last chosen:",
    hint: "Arrows walk the items, typing jumps by first letters, Tab leaves the menu.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(t.nothing);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        ref={anchorRef}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {t.trigger}
      </Button>
      <IngotMenu
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label={t.trigger}
        items={[
          {
            key: "open",
            label: t.open,
            icon: "file",
            onSelect: () => setLast(t.open),
          },
          {
            key: "copy",
            label: t.duplicate,
            icon: "copy",
            onSelect: () => setLast(t.duplicate),
          },
          {
            key: "export",
            label: t.exportPdf,
            icon: "download",
            disabled: true,
            onSelect: () => setLast(t.exportPdf),
          },
          {
            key: "delete",
            label: t.remove,
            icon: "trash",
            tone: "danger",
            separatorBefore: true,
            onSelect: () => setLast(t.remove),
          },
        ]}
        testId="docs-menu"
      />
      <p className="text-xs text-ink-3">
        {t.lastLabel} <strong className="text-ink">{last}</strong>. {t.hint}
      </p>
    </div>
  );
}
