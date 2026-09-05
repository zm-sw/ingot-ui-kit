import { useRef, useState } from "react";

import { Button, IngotMenu } from "@/ingot";

export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("zatím nic");
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
        Akce objednávky
      </Button>
      <IngotMenu
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label="Akce objednávky"
        items={[
          {
            key: "open",
            label: "Otevřít detail",
            icon: "file",
            onSelect: () => setLast("Otevřít detail"),
          },
          {
            key: "copy",
            label: "Duplikovat",
            icon: "copy",
            onSelect: () => setLast("Duplikovat"),
          },
          {
            key: "export",
            label: "Exportovat do PDF",
            icon: "download",
            disabled: true,
            onSelect: () => setLast("Exportovat do PDF"),
          },
          {
            key: "delete",
            label: "Smazat",
            icon: "trash",
            tone: "danger",
            separatorBefore: true,
            onSelect: () => setLast("Smazat"),
          },
        ]}
        testId="docs-menu"
      />
      <p className="text-xs text-ink-3">
        Naposledy vybráno: <strong className="text-ink">{last}</strong>. Šipky
        procházejí položky, psaní hledá podle prvních písmen, Tab menu opustí.
      </p>
    </div>
  );
}
