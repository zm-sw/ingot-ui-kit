import { useState } from "react";

import {
  Button,
  IngotActionBar,
  IngotColumns,
  IngotField,
  IngotSection,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    section: "Profil firmy",
    name: "Název firmy",
    email: "Kontaktní e-mail",
    phone: "Telefon",
    web: "Web",
    note: "Poznámka",
    save: "Uložit",
    cancel: "Zahodit změny",
    dirty: "Neuložené změny",
    saved: "Uloženo",
    nameValue: "Kovárna Vlašim",
    emailValue: "obchod@kovarna.cz",
    phoneValue: "+420 317 842 118",
    webValue: "kovarna.cz",
  },
  en: {
    section: "Company profile",
    name: "Company name",
    email: "Contact e-mail",
    phone: "Phone",
    web: "Website",
    note: "Note",
    save: "Save",
    cancel: "Discard changes",
    dirty: "Unsaved changes",
    saved: "Saved",
    nameValue: "Vlasim Forge",
    emailValue: "sales@vlasimforge.com",
    phoneValue: "+420 317 842 118",
    webValue: "vlasimforge.com",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const initial = {
    name: t.nameValue,
    email: t.emailValue,
    phone: t.phoneValue,
    web: t.webValue,
    note: "",
  };
  const [values, setValues] = useState<Record<string, string>>(initial);
  const dirty = Object.keys(initial).some(
    (key) => values[key] !== initial[key as keyof typeof initial],
  );
  const set = (key: string) => (next: string) =>
    setValues((current) => ({ ...current, [key]: next }));

  return (
    <div className="max-h-80 overflow-y-auto rounded-md border border-border px-4 py-4">
      <IngotSection title={t.section}>
        <IngotColumns>
          <IngotField label={t.name} value={values.name} onChange={set("name")} />
          <IngotField label={t.email} value={values.email} onChange={set("email")} />
          <IngotField
            label={t.phone}
            mono
            value={values.phone}
            onChange={set("phone")}
          />
          <IngotField label={t.web} value={values.web} onChange={set("web")} />
        </IngotColumns>
      </IngotSection>

      <IngotActionBar
        testId="docs-actionbar"
        dirty={dirty}
        status={dirty ? t.dirty : t.saved}
        onSave={() => setValues(initial)}
        secondary={
          <Button variant="ghost" onClick={() => setValues(initial)}>
            {t.cancel}
          </Button>
        }
        primary={
          <Button variant="accent" onClick={() => setValues(initial)}>
            {t.save}
          </Button>
        }
      />
    </div>
  );
}
