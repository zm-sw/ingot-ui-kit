import { useState } from "react";

import { Button, IngotDrawer, IngotField } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    open: "Upravit materiál",
    subtitle: "Sklad Praha · Regál 1",
    close: "Zavřít",
    save: "Uložit",
    cancel: "Zrušit",
    nameLabel: "Název",
    material: "Ocel S235JR",
    noteLabel: "Poznámka",
    optional: "— nepovinné",
    notePlaceholder: "Např. hlídat minimální zásobu",
  },
  en: {
    open: "Edit material",
    subtitle: "Prague store · Rack 1",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    nameLabel: "Name",
    material: "Steel S235JR",
    noteLabel: "Note",
    optional: "— optional",
    notePlaceholder: "e.g. watch the minimum stock",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(t.material);
  const [note, setNote] = useState("");
  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        data-testid="docs-drawer-open"
      >
        {t.open}
      </Button>
      {open ? (
        <IngotDrawer
          title={t.open}
          subtitle={t.subtitle}
          onClose={() => setOpen(false)}
          closeLabel={t.close}
          dismissable={false}
          testId="docs-drawer"
          footer={
            <>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                {t.save}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <IngotField
              label={t.nameLabel}
              value={name}
              onChange={setName}
              testId="docs-drawer-name"
            />
            <IngotField
              label={t.noteLabel}
              value={note}
              onChange={setNote}
              optionalLabel={t.optional}
              placeholder={t.notePlaceholder}
              testId="docs-drawer-note"
            />
          </div>
        </IngotDrawer>
      ) : null}
    </div>
  );
}
