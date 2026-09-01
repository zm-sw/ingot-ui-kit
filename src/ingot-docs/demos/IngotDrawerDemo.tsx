import { useState } from "react";

import { Button, IngotDrawer, IngotField } from "@/ingot";
export function Demo(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Ocel S235JR");
  const [note, setNote] = useState("");
  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        data-testid="docs-drawer-open"
      >
        Upravit materiál
      </Button>
      {open ? (
        <IngotDrawer
          title="Upravit materiál"
          subtitle="Sklad Praha · Regál 1"
          onClose={() => setOpen(false)}
          closeLabel="Zavřít"
          dismissable={false}
          testId="docs-drawer"
          footer={
            <>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Uložit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Zrušit
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <IngotField
              label="Název"
              value={name}
              onChange={setName}
              testId="docs-drawer-name"
            />
            <IngotField
              label="Poznámka"
              value={note}
              onChange={setNote}
              optionalLabel="— nepovinné"
              placeholder="Např. hlídat minimální zásobu"
              testId="docs-drawer-note"
            />
          </div>
        </IngotDrawer>
      ) : null}
    </div>
  );
}
