import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotCode } from "@/ingot";
import { highlightTsx } from "@/ingot/highlightTsx";

/** Glues the tokens back together — colouring must neither reorder nor lose text. */
function joined(source: string): string {
  return highlightTsx(source)
    .map((token) => token.text)
    .join("");
}

/** Role of the first token whose text equals ``needle``. */
function kindOf(source: string, needle: string): string | undefined {
  return highlightTsx(source).find((token) => token.text === needle)?.kind;
}

describe("highlightTsx", () => {
  it("returns exactly the input text", () => {
    const source = [
      "import { useState } from 'react';",
      "// komentář",
      "export function Demo(): JSX.Element {",
      '  return <IngotTabs label="Pohledy" count={12} />;',
      "}",
    ].join("\n");
    expect(joined(source)).toBe(source);
  });

  it("does not crash on empty input", () => {
    expect(highlightTsx("")).toEqual([]);
  });

  it("tells keyword, string, number and comment apart", () => {
    const source = 'const x = "ahoj"; // pozn\nconst y = 42;';
    expect(kindOf(source, "const")).toBe("keyword");
    expect(kindOf(source, '"ahoj"')).toBe("string");
    expect(kindOf(source, "42")).toBe("number");
    expect(kindOf(source, "// pozn")).toBe("comment");
  });

  it("recognises the tag name and an attribute in a JSX tag", () => {
    const source = '<IngotBadge tone="ok">Hotovo</IngotBadge>';
    expect(kindOf(source, "IngotBadge")).toBe("tag");
    expect(kindOf(source, "tone")).toBe("attr");
  });

  it("outside a tag an identifier is plain text, not an attribute", () => {
    // ``Hotovo`` stands after ``>``, so already in content — if the tag
    // state did not close, it would be coloured as an attribute.
    expect(kindOf('<IngotBadge tone="ok">Hotovo</IngotBadge>', "Hotovo")).toBe(
      "plain",
    );
  });

  it("attributes are not looked for inside an expression in a tag", () => {
    const source = "<IngotTabs value={view} onChange={setView} />";
    expect(kindOf(source, "value")).toBe("attr");
    expect(kindOf(source, "view")).toBe("plain");
  });

  it("a generic is not a JSX tag", () => {
    // This is the single ambiguity the scanner resolves: after an
    // identifier an angle bracket is a generic or a comparison.
    expect(kindOf("const [a, b] = useState<string>(null);", "string")).toBe(
      "plain",
    );
    expect(kindOf("return <Demo />;", "Demo")).toBe("tag");
  });
});

describe("IngotCode", () => {
  it("a coloured listing carries the same text as an uncoloured one", () => {
    const source = 'const label = "Hotovo";';
    render(
      <IngotCode block lang="tsx" testId="code">
        {source}
      </IngotCode>,
    );
    expect(screen.getByTestId("code").textContent).toBe(source);
  });

  it("without lang renders not a single colour class", () => {
    render(
      <IngotCode block testId="plain">
        {'const label = "Hotovo";'}
      </IngotCode>,
    );
    expect(
      screen.getByTestId("plain").querySelectorAll("[class*='text-code-']"),
    ).toHaveLength(0);
  });

  it("with lang colours a keyword and a string", () => {
    render(
      <IngotCode block lang="tsx" testId="code">
        {'const label = "Hotovo";'}
      </IngotCode>,
    );
    const pre = screen.getByTestId("code");
    expect(pre.querySelector(".text-code-keyword")?.textContent).toBe("const");
    expect(pre.querySelector(".text-code-string")?.textContent).toBe(
      '"Hotovo"',
    );
  });

  it("lang on inline code draws nothing — only a listing is coloured", () => {
    render(
      <IngotCode lang="tsx" testId="inline">
        {"const x = 1;"}
      </IngotCode>,
    );
    expect(
      screen.getByTestId("inline").querySelectorAll("[class*='text-code-']"),
    ).toHaveLength(0);
  });
});
