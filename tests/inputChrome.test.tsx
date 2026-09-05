import { render, screen } from "@testing-library/react";

import {
  IngotField,
  IngotFieldInput,
  IngotSearchInput,
  IngotSelect,
} from "@/ingot";
import {
  INPUT_BORDER,
  INPUT_BORDER_ERROR,
  INPUT_FOCUS,
  INPUT_FOCUS_WITHIN,
  INPUT_FRAME,
  INPUT_PAD,
} from "@/ingot/inputChrome";

/**
 * One frame for every form control. The four controls below used to draw
 * three different boxes; this test pins them to the shared chrome so a
 * fourth variant cannot appear unnoticed.
 */

const FRAME = INPUT_FRAME.split(" ");
const PAD = INPUT_PAD.split(" ");

function classesOf(el: Element): Set<string> {
  return new Set(el.className.split(/\s+/).filter(Boolean));
}

function expectHasAll(el: Element, classes: readonly string[]): void {
  const have = classesOf(el);
  for (const cls of classes) expect(have.has(cls), `${cls} missing`).toBe(true);
}

describe("input chrome", () => {
  it("IngotSelect and IngotSearchInput are the same box", () => {
    render(
      <>
        <IngotSelect
          value="a"
          onChange={() => {}}
          label="Select"
          options={[{ value: "a", label: "A" }]}
          testId="sel"
        />
        <IngotSearchInput value="" onChange={() => {}} label="Search" testId="search" />
      </>,
    );
    const select = screen.getByTestId("sel");
    const search = screen.getByTestId("search");
    expectHasAll(select, [...FRAME, ...PAD, INPUT_BORDER, ...INPUT_FOCUS.split(" ")]);
    expectHasAll(search, [...FRAME, INPUT_BORDER, ...INPUT_FOCUS.split(" ")]);
    // Search keeps the vertical padding; only the left side widens for the icon.
    expect(classesOf(search).has("py-1.5")).toBe(true);
    expect(classesOf(search).has("pl-8")).toBe(true);
  });

  it("IngotFieldInput text, number and secret share the box", () => {
    render(
      <>
        <IngotFieldInput
          field={{ key: "t", kind: "text", label: "T" }}
          value=""
          onChange={() => {}}
          testId="fi-text"
        />
        <IngotFieldInput
          field={{ key: "n", kind: "number", label: "N" }}
          value={1}
          onChange={() => {}}
          testId="fi-num"
        />
        <IngotFieldInput
          field={{ key: "s", kind: "secret", label: "S" }}
          value=""
          onChange={() => {}}
          testId="fi-secret"
        />
      </>,
    );
    for (const id of ["fi-text", "fi-num", "fi-secret"]) {
      expectHasAll(screen.getByTestId(id), [...FRAME, ...PAD, INPUT_BORDER]);
    }
  });

  it("IngotField draws the frame on the wrapper and pads the input inside it", () => {
    render(
      <IngotField label="Count" value="" onChange={() => {}} affix="pcs" testId="field" />,
    );
    const input = screen.getByTestId("field");
    const frame = input.parentElement!;
    expectHasAll(frame, [...FRAME, INPUT_BORDER, ...INPUT_FOCUS_WITHIN.split(" ")]);
    expectHasAll(input, PAD);
    // The input itself is transparent; the frame owns the surface.
    expect(classesOf(input).has("bg-transparent")).toBe(true);
  });

  it("an error swaps the resting border for the danger one, nothing else", () => {
    render(<IngotField label="X" value="" onChange={() => {}} error="Required" testId="err" />);
    const frame = screen.getByTestId("err").parentElement!;
    const have = classesOf(frame);
    expect(have.has(INPUT_BORDER_ERROR)).toBe(true);
    expect(have.has(INPUT_BORDER)).toBe(false);
    expectHasAll(frame, FRAME);
  });
});
