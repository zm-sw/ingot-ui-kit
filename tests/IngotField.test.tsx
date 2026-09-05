/**
 * `IngotField` (KAN-651).
 *
 * What is tested is what the component holds FOR the caller — because that
 * is exactly what got lost when every form composed `<label>` + `<input>`
 * itself:
 *
 * 1. **Label-to-input binding.** `getByLabelText` passes only when
 *    `label for` matches `input id`; a copied label next to the input does
 *    not.
 * 2. **Two fields with the same label on one page.** Hand-written `id`
 *    values typically collide here and a click on the second label focuses
 *    the first input. `useId` solves it, but only as long as someone
 *    measures it.
 * 3. **An error is text and `aria-invalid`, not only colour** — and it is
 *    bound via `aria-describedby`, so a screen reader reads it with the
 *    field, not somewhere beside it.
 * 4. **The unit is in `aria-describedby` too.** If it were only visible, a
 *    screen reader would read "3" instead of "3 mm".
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
  it("binds the label to the input, so it can be found by label", async () => {
    const user = userEvent.setup();
    render(<Controlled label="Počet kusů" testId="quantity" />);

    const input = screen.getByLabelText("Počet kusů");
    expect(input).toBe(screen.getByTestId("quantity"));

    // A click on the label focuses the input — that is the binding in
    // operation, not just a matching attribute.
    await user.click(screen.getByText("Počet kusů"));
    expect(input).toHaveFocus();
  });

  it("does not collide the ids of two fields with the same label on one page", () => {
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

  it("without an error reports no aria-invalid and is not described by emptiness", () => {
    render(<Controlled label="Počet kusů" testId="quantity" />);

    const input = screen.getByTestId("quantity");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("reports an error by text and aria-invalid and binds it via aria-describedby", () => {
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

  it("describes the input by hint and unit in the order they are read", () => {
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

  it("appends the translated optional marker to the label when the caller supplies it", () => {
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
