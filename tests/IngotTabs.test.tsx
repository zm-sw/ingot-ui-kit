/**
 * View switching (KAN-657).
 *
 * The tests measure the contract from the Tabs v1.1 spec:
 *
 * - the ``tablist``/``tab``/``tabpanel`` roles and ``aria-selected``,
 * - roving tabindex (Tab stops only on the active tab),
 * - arrows, Home and End switch views — the component is controlled, so
 *   what is measured is that it calls ``onChange`` with the right key,
 * - the active tab is told without colour too (underline + weight),
 * - ``count`` renders next to the label.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { IngotTabs } from "@/ingot";

const ITEMS = [
  { key: "overview", label: "Přehled" },
  { key: "items", label: "Položky", count: 12 },
  { key: "history", label: "Historie", count: 4 },
];

function Controlled({ initial = "overview" }: { initial?: string }) {
  const [view, setView] = useState(initial);
  return (
    <IngotTabs
      items={ITEMS}
      value={view}
      onChange={setView}
      label="Pohledy"
      testId="tabs"
    >
      <span data-testid="panel-content">{view}</span>
    </IngotTabs>
  );
}

describe("IngotTabs — role a atributy", () => {
  it("renders a tablist, tabs with aria-selected and a tabpanel bound to the active tab", () => {
    render(<Controlled />);

    const tablist = screen.getByRole("tablist", { name: "Pohledy" });
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tablist).toContainElement(tabs[0]);

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");

    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[0].id);
    expect(tabs[0].getAttribute("aria-controls")).toBe(panel.id);
  });

  it("count renders in mono next to the label", () => {
    render(<Controlled />);
    const tab = screen.getByTestId("tabs-tab-items");
    expect(tab).toHaveTextContent("Položky");
    expect(tab).toHaveTextContent("12");
    expect(tab.querySelector(".font-mono")).toHaveTextContent("12");
  });

  it("the active tab is told without colour — underline and weight", () => {
    render(<Controlled />);
    const active = screen.getByTestId("tabs-tab-overview");
    const idle = screen.getByTestId("tabs-tab-items");
    expect(active.className).toContain("font-semibold");
    expect(active.className).toContain("border-ink");
    expect(idle.className).toContain("border-transparent");
  });

  it("roving tabindex: Tab stops only on the active tab", () => {
    render(<Controlled initial="items" />);
    expect(screen.getByTestId("tabs-tab-items")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByTestId("tabs-tab-overview")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("tabs-tab-history")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});

describe("IngotTabs — controls", () => {
  it("a click switches the view", () => {
    render(<Controlled />);
    fireEvent.click(screen.getByTestId("tabs-tab-history"));
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");
  });

  it("arrow right goes to the next tab, from the last back to the first", () => {
    render(<Controlled />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("items");
    expect(document.activeElement).toBe(screen.getByTestId("tabs-tab-items"));

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("overview");
  });

  it("arrow left goes to the previous tab, from the first to the last", () => {
    render(<Controlled />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");
  });

  it("Home goes to the first tab, End to the last", () => {
    render(<Controlled initial="items" />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("overview");
  });

  it("is controlled — without state of its own it calls onChange and leaves value alone", () => {
    const onChange = vi.fn();
    render(
      <IngotTabs items={ITEMS} value="overview" onChange={onChange} testId="tabs" />,
    );
    fireEvent.click(screen.getByTestId("tabs-tab-items"));
    expect(onChange).toHaveBeenCalledWith("items");
    expect(screen.getByTestId("tabs-tab-overview")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("without children no tabpanel renders", () => {
    render(
      <IngotTabs items={ITEMS} value="overview" onChange={vi.fn()} testId="tabs" />,
    );
    expect(screen.queryByRole("tabpanel")).toBeNull();
    expect(screen.getByTestId("tabs-tab-overview")).not.toHaveAttribute(
      "aria-controls",
    );
  });
});
