/**
 * Přepínání pohledů (KAN-657).
 *
 * Testy měří kontrakt ze specu Tabs v1.1:
 *
 * - role ``tablist``/``tab``/``tabpanel`` a ``aria-selected``,
 * - roving tabindex (Tab zastaví jen na aktivním tabu),
 * - šipky, Home a End přepínají pohledy — komponenta je řízená, takže
 *   se měří, že volá ``onChange`` se správným klíčem,
 * - aktivní tab je poznat i bez barvy (podtržení + tučnost),
 * - ``count`` se vykreslí vedle popisku.
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
  it("vykreslí tablist, taby s aria-selected a tabpanel svázaný s aktivním tabem", () => {
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

  it("count se vykreslí mono vedle popisku", () => {
    render(<Controlled />);
    const tab = screen.getByTestId("tabs-tab-items");
    expect(tab).toHaveTextContent("Položky");
    expect(tab).toHaveTextContent("12");
    expect(tab.querySelector(".font-mono")).toHaveTextContent("12");
  });

  it("aktivní tab je poznat i bez barvy — podtržení a tučnost", () => {
    render(<Controlled />);
    const active = screen.getByTestId("tabs-tab-overview");
    const idle = screen.getByTestId("tabs-tab-items");
    expect(active.className).toContain("font-semibold");
    expect(active.className).toContain("border-ink");
    expect(idle.className).toContain("border-transparent");
  });

  it("roving tabindex: Tab zastaví jen na aktivním tabu", () => {
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

describe("IngotTabs — ovládání", () => {
  it("kliknutí přepne pohled", () => {
    render(<Controlled />);
    fireEvent.click(screen.getByTestId("tabs-tab-history"));
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");
  });

  it("šipka doprava jde na další tab, z posledního se vrací na první", () => {
    render(<Controlled />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("items");
    expect(document.activeElement).toBe(screen.getByTestId("tabs-tab-items"));

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("overview");
  });

  it("šipka doleva jde na předchozí tab, z prvního na poslední", () => {
    render(<Controlled />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");
  });

  it("Home jde na první, End na poslední tab", () => {
    render(<Controlled initial="items" />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("history");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(screen.getByTestId("panel-content")).toHaveTextContent("overview");
  });

  it("je řízená — bez vlastního stavu volá onChange a value nemění", () => {
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

  it("bez children se žádný tabpanel nevykreslí", () => {
    render(
      <IngotTabs items={ITEMS} value="overview" onChange={vi.fn()} testId="tabs" />,
    );
    expect(screen.queryByRole("tabpanel")).toBeNull();
    expect(screen.getByTestId("tabs-tab-overview")).not.toHaveAttribute(
      "aria-controls",
    );
  });
});
