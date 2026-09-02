/**
 * Filtrační atomy, rám stránky a panel pozornosti (rozhodnutí vlastníka
 * 2026-09-02, body 05–08). Testy měří pravidla, kde je špatná varianta
 * na pohled stejně dobrá jako správná:
 *
 * - popisek zaškrtávátka je ``<label>`` obalující input — klik na text
 *   zaškrtává a jméno jede zadarmo,
 * - hledací pole i select nesou jméno přes ``aria-label``, ne přes
 *   placeholder nebo první volbu,
 * - panel pozornosti je pojmenovaná ``section``, ne tmavý div,
 * - křivka metriky je dekorace (``aria-hidden``) a pod dva body se
 *   nekreslí vůbec.
 */

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
  it("nese jméno přes aria-label a hlásí novou hodnotu", async () => {
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
  it("klik na text zaškrtává — popisek je label obalující input", async () => {
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

  it("vypnutá volba nehlásí nic", async () => {
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
  it("jméno nese aria-label, ne placeholder; lupa je dekorace", () => {
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
    // Ikona nesmí být druhé jméno vedle labelu.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("hlásí každý úhoz", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotSearchInput value="" onChange={onChange} label="Hledat" />,
    );

    await user.type(screen.getByRole("searchbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});

describe("IngotAttentionPanel", () => {
  it("je pojmenovaná section — orientační bod, ne tmavý div", () => {
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
  it("rejstřík stojí před obsahem i v DOM", () => {
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
  it("křivka je dekorace a pod dva body se nekreslí", () => {
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
});
