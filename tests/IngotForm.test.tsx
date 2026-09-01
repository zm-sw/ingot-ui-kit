/**
 * Deklarativní formulář Ingotu (KAN-382) — první primitivum sdíleného admin UI.
 *
 * Test měří tři věci, na kterých ta sdílenost stojí:
 *   1. render podle popisu pole (boolean / number / integer / text / secret),
 *   2. **write-only chování tajného pole** — netknuté se neodešle, vyplněné
 *      ano. To pravidlo drží Ingot právě proto, aby ho každá obrazovka
 *      neimplementovala po svém a jedna z nich uloženou hodnotu nepřepsala
 *      prázdným řetězcem,
 *   3. že se z manifestu integrace i z ``operation_config_schema`` dostane
 *      týž popis polí — bez toho by „dvě třídy konzumentů" byly dva rendery.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  IngotForm,
  fieldsFromConfigSchema,
  fieldsFromIntegrationManifest,
  ingotFormPayload,
  type IngotFieldSpec,
} from "@/ingot";

function Harness({
  fields,
  initial = {},
}: {
  fields: IngotFieldSpec[];
  initial?: Record<string, unknown>;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  return (
    <>
      <IngotForm
        fields={fields}
        values={values}
        onChange={(key, next) =>
          setValues((prev) => ({ ...prev, [key]: next }))
        }
        testIdPrefix="ingot"
      />
      <output data-testid="payload">
        {JSON.stringify(ingotFormPayload(fields, values))}
      </output>
    </>
  );
}

const payload = () =>
  JSON.parse(screen.getByTestId("payload").textContent ?? "{}");

describe("IngotForm — render podle popisu pole", () => {
  const FIELDS: IngotFieldSpec[] = [
    { key: "enabled", kind: "boolean", label: "Zapnuto" },
    { key: "gap_mm", kind: "number", label: "Mezera", minimum: 0, maximum: 5 },
    { key: "passes", kind: "integer", label: "Průchody", minimum: 1 },
    { key: "note", kind: "text", label: "Poznámka", description: "volný text" },
    { key: "api_token", kind: "secret", label: "Token", secretConfigured: true },
  ];

  it("dá každému druhu pole vlastní vstup", () => {
    render(<Harness fields={FIELDS} initial={{ enabled: true, gap_mm: 0.2 }} />);

    expect(screen.getByTestId("ingot-enabled")).toHaveAttribute(
      "type",
      "checkbox",
    );
    expect(screen.getByTestId("ingot-enabled")).toBeChecked();
    expect(screen.getByTestId("ingot-gap_mm")).toHaveAttribute("type", "number");
    expect(screen.getByTestId("ingot-gap_mm")).toHaveValue(0.2);
    expect(screen.getByTestId("ingot-note")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByText("Poznámka")).toBeInTheDocument();
    expect(screen.getByText("volný text")).toBeInTheDocument();
  });

  it("přenese meze a krok čísla ze schématu do vstupu", () => {
    render(<Harness fields={FIELDS} />);

    const gap = screen.getByTestId("ingot-gap_mm");
    expect(gap).toHaveAttribute("min", "0");
    expect(gap).toHaveAttribute("max", "5");
    expect(gap).toHaveAttribute("step", "any");

    const passes = screen.getByTestId("ingot-passes");
    expect(passes).toHaveAttribute("min", "1");
    // Celé číslo se nesmí dát nastavit na 1,5 — krok je to jediné, čím to
    // formulář ve schématu deklarované ``integer`` vynutí.
    expect(passes).toHaveAttribute("step", "1");
  });

  it("z čísla dělá číslo a z vymazaného pole null, ne prázdný řetězec", () => {
    render(<Harness fields={FIELDS} initial={{ gap_mm: 0.2 }} />);

    fireEvent.change(screen.getByTestId("ingot-gap_mm"), {
      target: { value: "1.5" },
    });
    expect(payload().gap_mm).toBe(1.5);

    fireEvent.change(screen.getByTestId("ingot-gap_mm"), {
      target: { value: "" },
    });
    // ``null`` je typovaná prázdnota, kterou validace na BE přijme;
    // "" by se pokusilo projít jako číslo a vrátilo by se 422.
    expect(payload().gap_mm).toBeNull();
  });

  it("o uloženém credentialu řekne jen to, že tam je", () => {
    render(<Harness fields={FIELDS} />);

    expect(screen.getByTestId("ingot-api_token")).toHaveValue("");
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute(
      "placeholder",
      "nastaveno",
    );
  });

  it("nenastavený credential se od nastaveného pozná placeholderem", () => {
    render(
      <Harness
        fields={[
          { key: "api_token", kind: "secret", label: "Token", secretConfigured: false },
        ]}
      />,
    );
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute(
      "placeholder",
      "nenastaveno",
    );
  });
});

describe("IngotForm — write-only tajné pole", () => {
  const FIELDS: IngotFieldSpec[] = [
    { key: "endpoint_url", kind: "text", label: "endpoint_url" },
    { key: "api_token", kind: "secret", label: "api_token", secretConfigured: true },
  ];

  it("netknuté tajné pole se neodešle", () => {
    render(
      <Harness
        fields={FIELDS}
        initial={{ endpoint_url: "https://erp.example.test", api_token: "" }}
      />,
    );

    fireEvent.change(screen.getByTestId("ingot-endpoint_url"), {
      target: { value: "https://erp.example.test/v2" },
    });

    // Kdyby tady ``api_token: ""`` bylo, uložení by uloženou hodnotu
    // přepsalo na nic — a admin by o credential přišel editací jiného pole.
    expect(payload()).toEqual({ endpoint_url: "https://erp.example.test/v2" });
  });

  it("vyplněné tajné pole se odešle", () => {
    render(<Harness fields={FIELDS} initial={{ api_token: "" }} />);

    fireEvent.change(screen.getByTestId("ingot-api_token"), {
      target: { value: "token-z-konzole" },
    });
    expect(payload().api_token).toBe("token-z-konzole");
  });

  it("samé mezery jsou pořád netknuté pole", () => {
    render(<Harness fields={FIELDS} initial={{ api_token: "" }} />);

    fireEvent.change(screen.getByTestId("ingot-api_token"), {
      target: { value: "   " },
    });
    expect(payload()).not.toHaveProperty("api_token");
  });
});

describe("adaptéry — dvě třídy konzumentů, jeden popis pole", () => {
  it("přeloží operation_config_schema", () => {
    const fields = fieldsFromConfigSchema(
      {
        enabled: { type: "boolean", title: "Zapnuto", title_en: "Enabled" },
        gap_mm: {
          type: "number",
          title: "Mezera",
          minimum: 0,
          maximum: 5,
          description: "v milimetrech",
        },
        writer: { type: "integer", title: "Zapisovatel", x_options: "org_member_groups" },
      },
      { preferEnglish: false },
    );

    expect(fields.map((f) => [f.key, f.kind])).toEqual([
      ["enabled", "boolean"],
      ["gap_mm", "number"],
      // ``x_options`` přebíjí typ: hodnota je id z množiny, ne volné číslo.
      ["writer", "options"],
    ]);
    expect(fields[0].label).toBe("Zapnuto");
    expect(fields[1].maximum).toBe(5);
    expect(fields[2].optionsSource).toBe("org_member_groups");
  });

  it("v angličtině vezme title_en", () => {
    const [field] = fieldsFromConfigSchema(
      { enabled: { type: "boolean", title: "Zapnuto", title_en: "Enabled" } },
      { preferEnglish: true },
    );
    expect(field.label).toBe("Enabled");
  });

  it("přeloží manifest integrace a označí uložené credentialy", () => {
    const fields = fieldsFromIntegrationManifest({
      required_config_keys: ["endpoint_url"],
      secret_config_keys: ["api_token", "signing_key"],
      configured_secret_keys: ["api_token"],
    });

    expect(fields.map((f) => [f.key, f.kind, f.secretConfigured])).toEqual([
      ["endpoint_url", "text", undefined],
      ["api_token", "secret", true],
      ["signing_key", "secret", false],
    ]);
  });
});
