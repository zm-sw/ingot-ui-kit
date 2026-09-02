import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotCode } from "@/ingot";
import { highlightTsx } from "@/ingot/highlightTsx";

/** Slepí tokeny zpátky — obarvení nesmí text ani přeskládat, ani ztratit. */
function joined(source: string): string {
  return highlightTsx(source)
    .map((token) => token.text)
    .join("");
}

/** Role prvního tokenu, jehož text se rovná ``needle``. */
function kindOf(source: string, needle: string): string | undefined {
  return highlightTsx(source).find((token) => token.text === needle)?.kind;
}

describe("highlightTsx", () => {
  it("vrátí zpátky přesně vstupní text", () => {
    const source = [
      "import { useState } from 'react';",
      "// komentář",
      "export function Demo(): JSX.Element {",
      '  return <IngotTabs label="Pohledy" count={12} />;',
      "}",
    ].join("\n");
    expect(joined(source)).toBe(source);
  });

  it("nespadne na prázdném vstupu", () => {
    expect(highlightTsx("")).toEqual([]);
  });

  it("rozliší klíčové slovo, řetězec, číslo a komentář", () => {
    const source = 'const x = "ahoj"; // pozn\nconst y = 42;';
    expect(kindOf(source, "const")).toBe("keyword");
    expect(kindOf(source, '"ahoj"')).toBe("string");
    expect(kindOf(source, "42")).toBe("number");
    expect(kindOf(source, "// pozn")).toBe("comment");
  });

  it("v JSX značce pozná jméno značky a atribut", () => {
    const source = '<IngotBadge tone="ok">Hotovo</IngotBadge>';
    expect(kindOf(source, "IngotBadge")).toBe("tag");
    expect(kindOf(source, "tone")).toBe("attr");
  });

  it("mimo značku je identifikátor běžný text, ne atribut", () => {
    // ``Hotovo`` stojí za ``>``, tedy už v obsahu — kdyby se stav značky
    // nezavíral, obarvilo by se jako atribut.
    expect(kindOf('<IngotBadge tone="ok">Hotovo</IngotBadge>', "Hotovo")).toBe(
      "plain",
    );
  });

  it("uvnitř výrazu ve značce se atributy nehledají", () => {
    const source = "<IngotTabs value={view} onChange={setView} />";
    expect(kindOf(source, "value")).toBe("attr");
    expect(kindOf(source, "view")).toBe("plain");
  });

  it("generikum není JSX značka", () => {
    // 🪤 Tohle je ta jediná nejednoznačnost, kterou skener řeší: po
    // identifikátoru je ostrá závorka generikum nebo porovnání.
    expect(kindOf("const [a, b] = useState<string>(null);", "string")).toBe(
      "plain",
    );
    expect(kindOf("return <Demo />;", "Demo")).toBe("tag");
  });
});

describe("IngotCode", () => {
  it("obarvený výpis nese týž text jako neobarvený", () => {
    const source = 'const label = "Hotovo";';
    render(
      <IngotCode block lang="tsx" testId="code">
        {source}
      </IngotCode>,
    );
    expect(screen.getByTestId("code").textContent).toBe(source);
  });

  it("bez lang nevykreslí ani jednu barevnou třídu", () => {
    render(
      <IngotCode block testId="plain">
        {'const label = "Hotovo";'}
      </IngotCode>,
    );
    expect(
      screen.getByTestId("plain").querySelectorAll("[class*='text-code-']"),
    ).toHaveLength(0);
  });

  it("s lang obarví klíčové slovo i řetězec", () => {
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

  it("lang na kódu ve větě nic nekreslí — obarvuje se jen výpis", () => {
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
