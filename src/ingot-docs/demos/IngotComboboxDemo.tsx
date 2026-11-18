import { useState } from "react";

import { IngotCombobox, type IngotComboboxOption } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    label: "Země doručení",
    placeholder: "Začněte psát název nebo kód…",
    at: "Rakousko",
    cz: "Česká republika",
    de: "Německo",
    pl: "Polsko",
    sk: "Slovensko",
    dialCode: "předvolba",
  },
  en: {
    label: "Delivery country",
    placeholder: "Start typing a name or a code…",
    at: "Austria",
    cz: "Czech Republic",
    de: "Germany",
    pl: "Poland",
    sk: "Slovakia",
    dialCode: "dial code",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  const [country, setCountry] = useState("CZ");
  const options: IngotComboboxOption[] = [
    {
      value: "AT",
      label: t.at,
      secondary: `+43 ${t.dialCode}`,
      keywords: ["AT", "AUT", "+43", "Austria"],
    },
    {
      value: "CZ",
      label: t.cz,
      secondary: `+420 ${t.dialCode}`,
      keywords: ["CZ", "CZE", "+420", "Czechia"],
    },
    {
      value: "DE",
      label: t.de,
      secondary: `+49 ${t.dialCode}`,
      keywords: ["DE", "DEU", "+49", "Germany"],
    },
    {
      value: "PL",
      label: t.pl,
      secondary: `+48 ${t.dialCode}`,
      keywords: ["PL", "POL", "+48", "Poland"],
    },
    {
      value: "SK",
      label: t.sk,
      secondary: `+421 ${t.dialCode}`,
      keywords: ["SK", "SVK", "+421", "Slovakia"],
    },
  ];
  return (
    <IngotCombobox
      options={options}
      value={country}
      onChange={setCountry}
      label={t.label}
      placeholder={t.placeholder}
      className="w-80"
      testId="docs-combobox"
    />
  );
}
