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
    expect(input.labels?.[0]?.textContent).toBe("Poznámka pro výrobu— nepovinné");
  });
});

describe("IngotField on several lines", () => {
  it("keeps the whole accessible contract of the one-line field", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        label="Poznámka pro výrobu"
        type="textarea"
        rows={3}
        hint="Nejvýše 160 znaků."
        testId="note"
      />,
    );

    // The point of keeping several lines a type rather than a component of
    // its own: exactly one wiring to get right, measured the same way.
    const area = screen.getByLabelText("Poznámka pro výrobu");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toBe(screen.getByTestId("note"));

    const describedBy = area.getAttribute("aria-describedby") as string;
    expect(document.getElementById(describedBy)?.textContent).toBe(
      "Nejvýše 160 znaků.",
    );

    await user.type(area, "Odjehlit hrany");
    expect(area).toHaveValue("Odjehlit hrany");
  });

  it("marks an error by aria-invalid, not by the red alone", () => {
    render(
      <Controlled label="Perex" type="textarea" error="Perex chybí." testId="perex" />,
    );

    const area = screen.getByTestId("perex");
    expect(area).toHaveAttribute("aria-invalid", "true");
    const describedBy = area.getAttribute("aria-describedby") as string;
    expect(document.getElementById(describedBy)?.textContent).toBe("Perex chybí.");
  });
});

describe("the character count", () => {
  it("counts what is typed and never truncates it", async () => {
    const user = userEvent.setup();
    render(<Controlled label="Perex" type="textarea" counterMax={5} testId="perex" />);

    expect(screen.getByTestId("perex-counter")).toHaveTextContent("0 / 5");

    // Past the limit the field keeps every character: the limit belongs to
    // the server, and a counter that swallowed the sixth one would lose a
    // word the writer already typed.
    await user.type(screen.getByTestId("perex"), "sedm zn");
    expect(screen.getByTestId("perex")).toHaveValue("sedm zn");
    expect(screen.getByTestId("perex-counter")).toHaveTextContent("7 / 5");
    expect(screen.getByTestId("perex")).not.toHaveAttribute("maxlength");
  });

  it("is hidden from a screen reader — the limit is a sentence in the hint", () => {
    render(
      <Controlled
        label="Perex"
        type="textarea"
        hint="Nejvýše 160 znaků."
        counterMax={160}
        testId="perex"
      />,
    );

    // A number that changes on every keystroke would talk over the typing.
    expect(screen.getByTestId("perex-counter")).toHaveAttribute("aria-hidden", "true");

    const area = screen.getByTestId("perex");
    const texts = (area.getAttribute("aria-describedby") as string)
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(["Nejvýše 160 znaků."]);
  });

  it("is drawn without a hint too, and left out when nobody asked for it", () => {
    const { rerender } = render(
      <Controlled label="Perex" counterMax={40} testId="perex" />,
    );
    expect(screen.getByTestId("perex-counter")).toBeInTheDocument();

    rerender(<Controlled label="Perex" testId="perex" />);
    expect(screen.queryByTestId("perex-counter")).not.toBeInTheDocument();
  });
});
