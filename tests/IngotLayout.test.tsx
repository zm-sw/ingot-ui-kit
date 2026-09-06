/**
 * The page furniture: heading, list, side menu, accent picker, segmented
 * switch (KAN-846).
 *
 * Five primitives nobody had written a test for, and all five are the kind
 * where the wrong version looks right. A heading that is a `<div>` reads
 * fine and leaves a screen reader without an outline. A list that is a
 * stack of `<div>`s loses "list, 4 items". A menu that marks the current
 * page with a colour and no `aria-current` says nothing about where you
 * are.
 *
 * What is measured is therefore the semantics, not the pixels: the element
 * a screen reader meets, the name it hears, and the state it is told.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  IngotAccentSwatches,
  IngotList,
  IngotPageHeader,
  IngotSegmented,
  IngotSideNav,
  type IngotNavItem,
} from "@/ingot";

describe("IngotPageHeader", () => {
  it("is the page's h1 and carries the actions next to it", () => {
    render(
      <IngotPageHeader
        title="Objednávky"
        description="Vše, co je rozpracované."
        actions={<button type="button">Nová objednávka</button>}
        testId="header"
      />,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Objednávky" });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("Vše, co je rozpracované.")).toBeInTheDocument();
    // The action belongs to the header, not to a floating bar somewhere:
    // that is the rule the layout guide states and nothing else enforces.
    expect(
      within(screen.getByTestId("header")).getByRole("button", {
        name: "Nová objednávka",
      }),
    ).toBeInTheDocument();
  });

  it("renders without a description or actions", () => {
    render(<IngotPageHeader title="Objednávky" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Objednávky");
  });
});

describe("IngotList", () => {
  it("is a real list, so a screen reader counts the items", () => {
    render(<IngotList items={["První", "Druhý", "Třetí"]} testId="list" />);

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("an ordered list is <ol>, not a bullet list with numbers typed in", () => {
    render(<IngotList variant="ordered" items={["První", "Druhý"]} testId="steps" />);
    expect(screen.getByTestId("steps").tagName).toBe("OL");
  });

  it("takes nodes, not only strings", () => {
    render(<IngotList items={[<strong key="a">Tučně</strong>]} />);
    expect(screen.getByText("Tučně").tagName).toBe("STRONG");
  });
});

describe("IngotSideNav", () => {
  const ITEMS: IngotNavItem[] = [
    { label: "Úvod", href: "#/uvod" },
    { label: "Základy", href: "#/zaklady", current: true },
  ];

  it("is a named navigation and marks the current item with aria-current", () => {
    render(<IngotSideNav label="Obsah" items={ITEMS} testId="nav" />);

    const nav = screen.getByRole("navigation", { name: "Obsah" });
    expect(within(nav).getByRole("link", { name: /Základy/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    // Colour alone would leave a screen reader with two identical links.
    expect(within(nav).getByRole("link", { name: /Úvod/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("nests children under their parent in the DOM, not only visually", () => {
    render(
      <IngotSideNav
        label="Obsah"
        items={[
          {
            label: "Komponenty",
            href: "#/komponenty",
            children: [{ label: "Badge", href: "#/IngotBadge" }],
          },
        ]}
        testId="nav"
      />,
    );

    const parent = screen.getByRole("link", { name: /Komponenty/ }).closest("li");
    expect(
      within(parent as HTMLElement).getByRole("link", { name: "Badge" }),
    ).toBeInTheDocument();
  });
});

describe("IngotSegmented", () => {
  it("is a named radio group and reports the new value", () => {
    const onChange = vi.fn();
    render(
      <IngotSegmented
        options={[
          { value: "light", label: "Světlý" },
          { value: "dark", label: "Tmavý" },
        ]}
        value="light"
        onChange={onChange}
        label="Motiv"
        testId="theme"
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "Motiv" });
    expect(within(group).getByRole("radio", { name: "Světlý" })).toBeChecked();

    fireEvent.click(within(group).getByRole("radio", { name: "Tmavý" }));
    expect(onChange).toHaveBeenCalledWith("dark");
  });
});

describe("IngotAccentSwatches", () => {
  it("is a named radio group and hands the choice out", () => {
    const onChange = vi.fn();
    render(
      <IngotAccentSwatches
        value="blue"
        onChange={onChange}
        groupLabel="Akcent"
        optionLabel={(choice) => choice}
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "Akcent" });
    const radios = within(group).getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(1);
    expect(within(group).getByRole("radio", { name: "blue" })).toBeChecked();

    const other = radios.find(
      (radio) => radio !== screen.getByRole("radio", { name: "blue" }),
    );
    fireEvent.click(other as HTMLElement);
    expect(onChange).toHaveBeenCalled();
  });

  it("paints each dot from the family it advertises, not from a hex", () => {
    render(
      <IngotAccentSwatches
        value="blue"
        onChange={() => undefined}
        groupLabel="Akcent"
        optionLabel={(choice) => choice}
      />,
    );

    // Every dot carries data-accent and draws itself with var(--accent);
    // a hex here would be a second truth about what emerald looks like.
    const dots = screen
      .getByRole("radiogroup", { name: "Akcent" })
      .querySelectorAll("[data-accent]");
    expect(dots.length).toBeGreaterThan(1);
    for (const dot of dots) {
      expect(dot.getAttribute("style") ?? "").not.toMatch(/#[0-9a-f]{3,6}/i);
    }
  });
});
