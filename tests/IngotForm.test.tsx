/**
 * Declarative Ingot form (KAN-382) — the first primitive of the shared
 * admin UI.
 *
 * The test measures three things the sharing stands on:
 *   1. rendering by field description (boolean / number / integer / text /
 *      secret),
 *   2. **write-only behaviour of a secret field** — untouched it is not
 *      submitted, filled it is. Ingot holds that rule precisely so every
 *      screen does not implement it its own way and one of them does not
 *      overwrite a stored value with an empty string,
 *   3. that the integration manifest and ``operation_config_schema`` yield
 *      the same field description — without that "two classes of
 *      consumers" would be two renders.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { IngotForm, ingotFormPayload, type IngotFieldSpec } from "@/ingot";
import {
  fieldsFromConfigSchema,
  fieldsFromIntegrationManifest,
} from "@/ingot/forgmatic";

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
        onChange={(key, next) => setValues((prev) => ({ ...prev, [key]: next }))}
        testIdPrefix="ingot"
      />
      <output data-testid="payload">
        {JSON.stringify(ingotFormPayload(fields, values))}
      </output>
    </>
  );
}

const payload = () => JSON.parse(screen.getByTestId("payload").textContent ?? "{}");

describe("IngotForm — render by field description", () => {
  const FIELDS: IngotFieldSpec[] = [
    { key: "enabled", kind: "boolean", label: "Zapnuto" },
    { key: "gap_mm", kind: "number", label: "Mezera", minimum: 0, maximum: 5 },
    { key: "passes", kind: "integer", label: "Průchody", minimum: 1 },
    { key: "note", kind: "text", label: "Poznámka", description: "volný text" },
    { key: "api_token", kind: "secret", label: "Token", secretConfigured: true },
  ];

  it("gives every field kind its own input", () => {
    render(<Harness fields={FIELDS} initial={{ enabled: true, gap_mm: 0.2 }} />);

    expect(screen.getByTestId("ingot-enabled")).toHaveAttribute("type", "checkbox");
    expect(screen.getByTestId("ingot-enabled")).toBeChecked();
    expect(screen.getByTestId("ingot-gap_mm")).toHaveAttribute("type", "number");
    expect(screen.getByTestId("ingot-gap_mm")).toHaveValue(0.2);
    expect(screen.getByTestId("ingot-note")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute("type", "password");
    expect(screen.getByText("Poznámka")).toBeInTheDocument();
    expect(screen.getByText("volný text")).toBeInTheDocument();
  });

  it("carries number bounds and step from the schema into the input", () => {
    render(<Harness fields={FIELDS} />);

    const gap = screen.getByTestId("ingot-gap_mm");
    expect(gap).toHaveAttribute("min", "0");
    expect(gap).toHaveAttribute("max", "5");
    expect(gap).toHaveAttribute("step", "any");

    const passes = screen.getByTestId("ingot-passes");
    expect(passes).toHaveAttribute("min", "1");
    // An integer must not be settable to 1.5 — the step is the only thing
    // by which the form enforces the ``integer`` declared in the schema.
    expect(passes).toHaveAttribute("step", "1");
  });

  it("turns a number into a number and a cleared field into null, not an empty string", () => {
    render(<Harness fields={FIELDS} initial={{ gap_mm: 0.2 }} />);

    fireEvent.change(screen.getByTestId("ingot-gap_mm"), {
      target: { value: "1.5" },
    });
    expect(payload().gap_mm).toBe(1.5);

    fireEvent.change(screen.getByTestId("ingot-gap_mm"), {
      target: { value: "" },
    });
    // ``null`` is a typed emptiness the backend validation accepts; "" would
    // try to pass as a number and come back as a 422.
    expect(payload().gap_mm).toBeNull();
  });

  it("says only that a stored credential is there", () => {
    render(<Harness fields={FIELDS} />);

    expect(screen.getByTestId("ingot-api_token")).toHaveValue("");
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute("placeholder", "set");
  });

  it("an unset credential is told from a set one by the placeholder", () => {
    render(
      <Harness
        fields={[
          { key: "api_token", kind: "secret", label: "Token", secretConfigured: false },
        ]}
      />,
    );
    expect(screen.getByTestId("ingot-api_token")).toHaveAttribute(
      "placeholder",
      "not set",
    );
  });
});

describe("IngotForm — write-only secret field", () => {
  const FIELDS: IngotFieldSpec[] = [
    { key: "endpoint_url", kind: "text", label: "endpoint_url" },
    { key: "api_token", kind: "secret", label: "api_token", secretConfigured: true },
  ];

  it("an untouched secret field is not submitted", () => {
    render(
      <Harness
        fields={FIELDS}
        initial={{ endpoint_url: "https://erp.example.test", api_token: "" }}
      />,
    );

    fireEvent.change(screen.getByTestId("ingot-endpoint_url"), {
      target: { value: "https://erp.example.test/v2" },
    });

    // If ``api_token: ""`` were here, saving would overwrite the stored
    // value with nothing — and the admin would lose the credential by
    // editing another field.
    expect(payload()).toEqual({ endpoint_url: "https://erp.example.test/v2" });
  });

  it("a filled secret field is submitted", () => {
    render(<Harness fields={FIELDS} initial={{ api_token: "" }} />);

    fireEvent.change(screen.getByTestId("ingot-api_token"), {
      target: { value: "token-z-konzole" },
    });
    expect(payload().api_token).toBe("token-z-konzole");
  });

  it("whitespace only is still an untouched field", () => {
    render(<Harness fields={FIELDS} initial={{ api_token: "" }} />);

    fireEvent.change(screen.getByTestId("ingot-api_token"), {
      target: { value: "   " },
    });
    expect(payload()).not.toHaveProperty("api_token");
  });
});

describe("adapters — two classes of consumers, one field description", () => {
  it("translates operation_config_schema", () => {
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
        writer: {
          type: "integer",
          title: "Zapisovatel",
          x_options: "org_member_groups",
        },
      },
      { preferEnglish: false },
    );

    expect(fields.map((f) => [f.key, f.kind])).toEqual([
      ["enabled", "boolean"],
      ["gap_mm", "number"],
      // ``x_options`` overrides the type: the value is an id from a set, not a free number.
      ["writer", "options"],
    ]);
    expect(fields[0].label).toBe("Zapnuto");
    expect(fields[1].maximum).toBe(5);
    expect(fields[2].optionsSource).toBe("org_member_groups");
  });

  it("takes title_en in English", () => {
    const [field] = fieldsFromConfigSchema(
      { enabled: { type: "boolean", title: "Zapnuto", title_en: "Enabled" } },
      { preferEnglish: true },
    );
    expect(field.label).toBe("Enabled");
  });

  it("translates the integration manifest and marks stored credentials", () => {
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
