/**
 * `IngotField` (KAN-651).
 *
 * Testuje se to, co komponenta drží ZA volajícího — protože přesně to se
 * ztrácelo, když si každý formulář skládal `<label>` + `<input>` sám:
 *
 * 1. **Vazba popisku na vstup.** `getByLabelText` ji projde jen tehdy, když
 *    `label for` sedí na `input id`; opsaný popisek vedle vstupu ne.
 * 2. 🪤 **Dvě pole se stejným popiskem na jedné stránce.** Ruční `id` se tady
 *    typicky srazí a klik na druhý popisek zaostří první vstup. `useId` to
 *    řeší, ale jen dokud to někdo měří.
 * 3. **Chyba je text a `aria-invalid`, ne jen barva** — a je navázaná přes
 *    `aria-describedby`, takže ji odečítač přečte s polem, ne někde vedle.
 * 4. **Jednotka je v `aria-describedby` taky.** Kdyby byla jen vidět,
 *    odečítač by přečetl „3“ místo „3 mm“.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { IngotField } from "@/ingot";

function Controlled(
  props: Omit<Parameters<typeof IngotField>[0], "value" | "onChange">,
): JSX.Element {
  const [value, setValue] = useState("");
  return <IngotField {...props} value={value} onChange={setValue} />;
}

describe("IngotField", () => {
  it("váže popisek na vstup, takže se dá najít podle popisku", async () => {
    const user = userEvent.setup();
    render(<Controlled label="Počet kusů" testId="quantity" />);

    const input = screen.getByLabelText("Počet kusů");
    expect(input).toBe(screen.getByTestId("quantity"));

    // Klik na popisek zaostří vstup — to je ta vazba v provozu, ne jen
    // shodný atribut.
    await user.click(screen.getByText("Počet kusů"));
    expect(input).toHaveFocus();
  });

  it("nesrazí id dvou polí se stejným popiskem na jedné stránce", () => {
    render(
      <>
        <Controlled label="Počet kusů" testId="a" />
        <Controlled label="Počet kusů" testId="b" />
      </>,
    );

    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");
    expect(a.id).not.toBe("");
    expect(a.id).not.toBe(b.id);

    const labels = screen.getAllByText("Počet kusů");
    expect(labels.map((el) => el.getAttribute("for"))).toEqual([a.id, b.id]);
  });

  it("bez chyby nehlásí aria-invalid a nepopisuje se prázdnem", () => {
    render(<Controlled label="Počet kusů" testId="quantity" />);

    const input = screen.getByTestId("quantity");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("chybu hlásí textem i aria-invalid a naváže ji přes aria-describedby", () => {
    render(
      <Controlled
        label="Označení materiálu"
        error="Takové označení v katalogu není."
        testId="code"
      />,
    );

    const input = screen.getByTestId("code");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const described = (describedBy as string)
      .split(" ")
      .map((id) => document.getElementById(id));
    expect(described.every((el) => el !== null)).toBe(true);
    expect(described.map((el) => el?.textContent)).toContain(
      "Takové označení v katalogu není.",
    );
  });

  it("popíše vstup nápovědou i jednotkou v pořadí, v jakém se čtou", () => {
    render(
      <Controlled
        label="Počet kusů"
        hint="Kolik kusů se má z této položky vyrobit."
        affix="ks"
        error="Mimo rozsah."
        testId="quantity"
      />,
    );

    const input = screen.getByTestId("quantity");
    const texts = (input.getAttribute("aria-describedby") as string)
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual([
      "Kolik kusů se má z této položky vyrobit.",
      "ks",
      "Mimo rozsah.",
    ]);
  });

  it("přidá k popisku přeložené „nepovinné“, když ho volající dodá", () => {
    render(
      <Controlled
        label="Poznámka pro výrobu"
        optionalLabel="— nepovinné"
        testId="note"
      />,
    );

    const input = screen.getByTestId("note") as HTMLInputElement;
    expect(input.labels?.[0]?.textContent).toBe(
      "Poznámka pro výrobu— nepovinné",
    );
  });
});
