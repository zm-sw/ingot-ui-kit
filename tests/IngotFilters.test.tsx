/**
 * Filter atoms, page frame and attention panel (owner decision of
 * 2026-09-02, items 05–08). The tests measure rules where the wrong
 * variant looks just as good as the right one:
 *
 * - a checkbox caption is a ``<label>`` wrapping the input — a click on the
 *   text checks and the name comes for free,
 * - the search field and the select carry their name via ``aria-label``,
 *   not via placeholder or the first option,
 * - the attention panel is a named ``section``, not a dark div,
 * - a metric curve is decoration (``aria-hidden``) and is not drawn below
 *   two points at all.
 */

import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  IngotAttentionPanel,
  IngotCheckbox,
  IngotMetrics,
  IngotPageLayout,
  IngotSearchInput,
  IngotSelect,
} from "@/ingot";

describe("IngotSelect", () => {
  it("carries its name via aria-label and reports the new value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotSelect
        value="all"
        onChange={onChange}
        label="Filtr stavu"
        options={[
          { value: "all", label: "Všechny stavy" },
          { value: "active", label: "Aktivní" },
        ]}
      />,
    );

    const select = screen.getByRole("combobox", { name: "Filtr stavu" });
    await user.selectOptions(select, "active");
    expect(onChange).toHaveBeenCalledWith("active");
  });
});

describe("IngotCheckbox", () => {
  it("a click on the text checks — the label wraps the input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotCheckbox
        checked={false}
        onChange={onChange}
        label="Jen vyžadující zásah"
      />,
    );

    await user.click(screen.getByText("Jen vyžadující zásah"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("checkbox", { name: "Jen vyžadující zásah" }),
    ).toBeInTheDocument();
  });

  it("a disabled option reports nothing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotCheckbox checked onChange={onChange} label="Uzamčeno" disabled />,
    );

    await user.click(screen.getByText("Uzamčeno"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("IngotSearchInput", () => {
  it("the name is carried by aria-label, not placeholder; the magnifier is decoration", () => {
    render(
      <IngotSearchInput
        value=""
        onChange={() => undefined}
        label="Hledat v položkách"
        placeholder="Hledat podle názvu…"
        testId="search"
      />,
    );

    const input = screen.getByRole("searchbox", { name: "Hledat v položkách" });
    expect(input).toHaveAttribute("type", "search");
    // The icon must not be a second name next to the label.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("reports every keystroke", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotSearchInput value="" onChange={onChange} label="Hledat" />,
    );

    await user.type(screen.getByRole("searchbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  // The "jump to search" shortcut needs a path to the field in the API, not
  // through querySelector into the wrapper internals.
  it("exposes a ref to the input, not to the wrapper", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <IngotSearchInput
        value=""
        onChange={() => undefined}
        label="Hledat"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByRole("searchbox"));
    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });
});

describe("IngotAttentionPanel", () => {
  it("is a named section — a landmark, not a dark div", () => {
    render(
      <IngotAttentionPanel title="Co řešit teď">
        <p>5 položek vyžaduje pozornost.</p>
      </IngotAttentionPanel>,
    );

    expect(
      screen.getByRole("region", { name: "Co řešit teď" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Co řešit teď" }),
    ).toBeInTheDocument();
  });
});

describe("IngotPageLayout", () => {
  it("the index stands before the content in the DOM too", () => {
    render(
      <IngotPageLayout
        aside={<nav aria-label="Obsah">rejstřík</nav>}
        testId="layout"
      >
        <p>obsah</p>
      </IngotPageLayout>,
    );

    const layout = screen.getByTestId("layout");
    const order = layout.textContent ?? "";
    expect(order.indexOf("rejstřík")).toBeLessThan(order.indexOf("obsah"));
  });
});

describe("IngotMetrics — trend", () => {
  it("the curve is decoration and is not drawn below two points", () => {
    const { container } = render(
      <IngotMetrics
        items={[
          { label: "Ve výrobě", value: 18, trend: [9, 12, 15, 18] },
          { label: "Po termínu", value: 2, trend: [2] },
          { label: "Volná kapacita", value: "19 h" },
        ]}
        label="Přehled"
      />,
    );

    const sparklines = container.querySelectorAll("svg");
    expect(sparklines).toHaveLength(1);
    expect(sparklines[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("a window with no movement is a dashed line, not a solid one", () => {
    const { container } = render(
      <IngotMetrics
        items={[{ label: "Po termínu", value: 0, trend: [0, 0, 0, 0] }]}
        label="Přehled"
      />,
    );

    // A solid horizontal line would claim a stable non-zero value; a dashed
    // one says "nothing happened here".
    expect(container.querySelector("line[stroke-dasharray]")).not.toBeNull();
    expect(container.querySelector("polyline")).toBeNull();
  });
});
