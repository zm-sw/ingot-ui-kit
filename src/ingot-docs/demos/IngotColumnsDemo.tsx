import { useState } from "react";

import { IngotColumns, IngotColumnsFull, IngotField, IngotSection } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    form: "Fakturační údaje",
    company: "Název firmy",
    ico: "IČO",
    dic: "DIČ",
    street: "Ulice a číslo",
    city: "Město",
    zip: "PSČ",
    note: "Poznámka na faktuře",
    noteHint: "Přes celou šířku: dlouhý text vedle krátkého pole nikdo nečte.",
    settings: "Nastavení číslování",
    prefix: "Předpona",
    prefixHint: "Předchází pořadovému číslu na každém dokladu.",
    counter: "Další číslo",
    companyValue: "Kovárna Vlašim",
    streetValue: "Nádražní 118",
    cityValue: "Vlašim",
  },
  en: {
    form: "Billing details",
    company: "Company name",
    ico: "Company number",
    dic: "VAT number",
    street: "Street and number",
    city: "Town",
    zip: "Post code",
    note: "Note on the invoice",
    noteHint: "The whole width: nobody reads long prose beside a short field.",
    settings: "Numbering settings",
    prefix: "Prefix",
    prefixHint: "Comes before the sequence number on every document.",
    counter: "Next number",
    companyValue: "Vlasim Forge",
    streetValue: "12 Station Road",
    cityValue: "Vlasim",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [values, setValues] = useState<Record<string, string>>({
    company: t.companyValue,
    ico: "24172090",
    dic: "CZ24172090",
    street: t.streetValue,
    city: t.cityValue,
    zip: "258 01",
    note: "",
    prefix: "FV-2026-",
    counter: "184",
  });
  const set = (key: string) => (next: string) =>
    setValues((current) => ({ ...current, [key]: next }));

  return (
    <div className="space-y-6">
      <IngotSection title={t.form}>
        <IngotColumns testId="docs-columns">
          <IngotField
            label={t.company}
            value={values.company}
            onChange={set("company")}
          />
          <IngotField label={t.ico} mono value={values.ico} onChange={set("ico")} />
          <IngotField label={t.dic} mono value={values.dic} onChange={set("dic")} />
          <IngotField label={t.street} value={values.street} onChange={set("street")} />
          <IngotField label={t.city} value={values.city} onChange={set("city")} />
          <IngotField label={t.zip} mono value={values.zip} onChange={set("zip")} />
          <IngotColumnsFull>
            <IngotField
              label={t.note}
              type="textarea"
              hint={t.noteHint}
              value={values.note}
              onChange={set("note")}
            />
          </IngotColumnsFull>
        </IngotColumns>
      </IngotSection>

      <IngotSection title={t.settings}>
        <div className="space-y-4">
          <IngotField
            label={t.prefix}
            labelPlacement="side"
            mono
            hint={t.prefixHint}
            value={values.prefix}
            onChange={set("prefix")}
          />
          <IngotField
            label={t.counter}
            labelPlacement="side"
            mono
            value={values.counter}
            onChange={set("counter")}
          />
        </div>
      </IngotSection>
    </div>
  );
}
