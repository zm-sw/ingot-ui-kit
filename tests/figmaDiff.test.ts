import { describe, expect, it } from "vitest";

// @ts-expect-error - build scripts, deliberately untyped JavaScript.
import { buildFigma, readTokens } from "../scripts/build-tokens.mjs";
import {
  diffVariables,
  figmaColor,
  fromFigmaApi,
  fromKitExport,
  report,
  // @ts-expect-error - see above.
} from "../scripts/figmaDiffCore.mjs";

/**
 * The comparison between the kit's palette and a design library's
 * variables. It runs against a live file in CI and against this fixture
 * here — the shape of the API's answer is documented and stable, so the
 * logic can be held to it without a token.
 */

/** The `variables/local` payload, shaped as the API returns it. */
const payload = {
  meta: {
    variableCollections: {
      "VariableCollectionId:1": {
        id: "VariableCollectionId:1",
        name: "Ingot theme",
        modes: [
          { modeId: "1:0", name: "light" },
          { modeId: "1:1", name: "dark" },
        ],
      },
    },
    variables: {
      "VariableID:1": {
        id: "VariableID:1",
        name: "color/bg",
        variableCollectionId: "VariableCollectionId:1",
        resolvedType: "COLOR",
        valuesByMode: {
          "1:0": { r: 0.945098, g: 0.941176, b: 0.929412, a: 1 },
          "1:1": { r: 0.043137, g: 0.039216, b: 0.035294, a: 1 },
        },
      },
      "VariableID:2": {
        id: "VariableID:2",
        name: "color/surface",
        variableCollectionId: "VariableCollectionId:1",
        resolvedType: "COLOR",
        // Deliberately wrong in the light mode: #fefefe, not #ffffff.
        valuesByMode: {
          "1:0": { r: 0.996078, g: 0.996078, b: 0.996078, a: 1 },
          "1:1": { r: 0.180392, g: 0.168627, b: 0.152941, a: 1 },
        },
      },
      "VariableID:3": {
        id: "VariableID:3",
        name: "color/page",
        variableCollectionId: "VariableCollectionId:1",
        resolvedType: "COLOR",
        // An alias of color/bg — what a designer sees is bg's value.
        valuesByMode: {
          "1:0": { type: "VARIABLE_ALIAS", id: "VariableID:1" },
          "1:1": { type: "VARIABLE_ALIAS", id: "VariableID:1" },
        },
      },
    },
  },
};

describe("a colour from the API", () => {
  it("is read as the hex the token file writes", () => {
    expect(figmaColor({ r: 1, g: 1, b: 1, a: 1 })).toBe("#ffffff");
    expect(figmaColor({ r: 0, g: 0, b: 0, a: 1 })).toBe("#000000");
    expect(figmaColor({ r: 0.945098, g: 0.941176, b: 0.929412, a: 1 })).toBe("#f1f0ed");
  });

  it("keeps an alpha below one and drops one that is one", () => {
    // `#ffffffff` and `#ffffff` are the same colour, and comparing them as
    // strings would report a difference nobody made.
    expect(figmaColor({ r: 1, g: 1, b: 1, a: 1 })).toBe("#ffffff");
    expect(figmaColor({ r: 1, g: 1, b: 1, a: 0.5 })).toBe("#ffffff80");
  });
});

describe("the payload", () => {
  const figma = fromFigmaApi(payload);

  it("is read as name → mode → value, with the modes named", () => {
    expect(figma["color/bg"]).toEqual({ light: "#f1f0ed", dark: "#0b0a09" });
  });

  it("follows an alias to the value a designer sees", () => {
    expect(figma["color/page"].light).toBe("#f1f0ed");
  });
});

describe("the comparison", () => {
  const kit = fromKitExport(
    JSON.parse(buildFigma(readTokens("src/ingot/tokens.json"))),
  );
  const findings = diffVariables(kit, fromFigmaApi(payload));

  it("reads the kit's export as one flat table across its collections", () => {
    expect(kit["color/bg"]).toEqual({ light: "#f1f0ed", dark: "#0b0a09" });
    // The accent collection carries its ten modes into the same table.
    expect(kit["color/accent"]["blue/light"]).toBe("#2563eb");
  });

  it("names the value on each side when they differ", () => {
    const surface = findings.find(
      (entry: { name: string; mode?: string }) =>
        entry.name === "color/surface" && entry.mode === "light",
    );
    expect(surface).toMatchObject({
      kind: "different",
      kit: "#ffffff",
      figma: "#fefefe",
    });
  });

  it("says nothing about a variable both sides agree on", () => {
    expect(
      findings.filter((entry: { name: string }) => entry.name === "color/bg"),
    ).toEqual([]);
  });

  it("reports a variable the library does not have once, not once per mode", () => {
    const missing = findings.filter(
      (entry: { kind: string; name: string }) =>
        entry.kind === "missing-in-figma" && entry.name === "color/ink",
    );
    expect(missing).toHaveLength(1);
  });

  it("reports a variable only the library has", () => {
    // Usually a colour somebody drew a screen with before anyone named it
    // in the kit — the more interesting half of the two.
    expect(
      findings.some(
        (entry: { kind: string; name: string }) =>
          entry.kind === "only-in-figma" && entry.name === "color/page",
      ),
    ).toBe(true);
  });

  it("writes a table a reader can act on", () => {
    const text = report(findings, { fileKey: "abc123" });
    expect(text).toContain("### Tokeny proti Figmě");
    expect(text).toContain("`color/surface`");
    expect(text).toContain("#fefefe");
    expect(text).toContain("abc123");
  });

  it("leaves the blank line markdown needs before a table", () => {
    // Without it the table renders as one long line of pipes, and the
    // comment is then worse than no comment at all.
    const lines = report(findings).split("\n");
    const header = lines.findIndex((line: string) => line.startsWith("| Proměnná"));
    expect(header).toBeGreaterThan(0);
    expect(lines[header - 1]).toBe("");
    expect(lines[header + 1]).toBe("| --- | --- | --- | --- |");
  });

  it("counts in Czech, which needs three shapes and not two", () => {
    const one = [{ kind: "missing-in-figma", name: "a" }];
    expect(report(one)).toContain("1 rozdíl ");
    expect(report([...one, { kind: "missing-in-figma", name: "b" }])).toContain(
      "2 rozdíly",
    );
    expect(
      report(
        ["a", "b", "c", "d", "e"].map((name) => ({ kind: "missing-in-figma", name })),
      ),
    ).toContain("5 rozdílů");
  });

  it("says so plainly when the two agree", () => {
    expect(report([])).toContain("souhlasí");
  });
});
