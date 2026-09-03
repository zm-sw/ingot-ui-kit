/**
 * Ikonová vrstva kitu (KAN-649) — dvě sady, dvoje pravidla.
 *
 * Co se tu měří a proč zrovna to:
 *
 * 1. **Dekorativní je VÝCHOZÍ stav.** Ikona vedle svého popisku, kterou
 *    odečítač přečte, znamená, že uživatel slyší totéž dvakrát. Regrese
 *    by byla neviditelná — vizuálně se nezmění nic.
 * 2. **Neznámý klíč nesmí zmizet potichu.** ``icon_key`` teče z databáze,
 *    takže typecheck ho nechytí; tiché prázdno se pak hledá přes půl
 *    aplikace. Měří se, že komponenta nevykreslí nic A že to ve vývoji
 *    řekne nahlas.
 * 3. **``IngotOpIcon`` kresby neduplikuje.** Kdyby si geometrii opsal,
 *    test na „něco se vykreslilo" by pořád procházel a obě kopie by se
 *    rozešly tiše. Proto se porovnává s tím, co vrací sama knihovna
 *    operací — ne s konstantou v testu.
 * 4. **Výplň je JEDNA pojmenovaná výjimka.** Sada je čára; ``star-filled``
 *    je druhý tvar ke stavovému glyfu, ne povolení kreslit plné ikony.
 *    Bez testu by se druhá výplň přidala mimochodem a ta věta v Limitech
 *    by tiše přestala platit.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  IngotIcon,
  IngotOpIcon,
  INGOT_ICON_NAMES,
  INGOT_OP_ICON_KEYS,
} from "@/ingot";
import { resolveProcessIcon } from "@/ingot";

const OP = INGOT_OP_ICON_KEYS[0];
const OTHER_OP = INGOT_OP_ICON_KEYS[1];

describe("IngotIcon", () => {
  it("je bez title dekorativní a s ním pojmenovaný obrázek", () => {
    const { container, rerender } = render(<IngotIcon name="upload" />);

    const decorative = container.querySelector("svg");
    expect(decorative).toHaveAttribute("aria-hidden", "true");
    expect(decorative).not.toHaveAttribute("role");
    expect(container.querySelector("title")).toBeNull();

    rerender(<IngotIcon name="upload" title="Nahrát výkres" />);

    const labelled = screen.getByRole("img", { name: "Nahrát výkres" });
    expect(labelled).not.toHaveAttribute("aria-hidden");
    expect(labelled.querySelector("title")).toHaveTextContent("Nahrát výkres");
  });

  it("drží techniku handoffu — 24×24, currentColor, výjimka u fajfky", () => {
    const { container, rerender } = render(<IngotIcon name="upload" />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("stroke-width", "1.6");
    expect(svg).toHaveAttribute("width", "14");

    rerender(<IngotIcon name="check" />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "2.2");
  });

  it("nevykreslí nic a varuje, když klíč sada nezná", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const unknown = "rozhodne-neexistuje" as (typeof INGOT_ICON_NAMES)[number];

    const { container } = render(<IngotIcon name={unknown} />);

    expect(container.querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("rozhodne-neexistuje"),
    );
    warn.mockRestore();
  });

  it("výplň má jediný glyf a s čárovým párem sdílí geometrii", () => {
    const { container: line } = render(<IngotIcon name="star" />);
    const { container: filled } = render(<IngotIcon name="star-filled" />);

    const outline = line.querySelector("polygon");
    const solid = filled.querySelector("polygon");

    expect(solid?.getAttribute("points")).toBe(outline?.getAttribute("points"));
    expect(solid).toHaveAttribute("fill", "currentColor");
    expect(outline).not.toHaveAttribute("fill");

    const withFill = INGOT_ICON_NAMES.filter((name) => {
      const { container, unmount } = render(<IngotIcon name={name} />);
      const fills = container.innerHTML.includes('fill="currentColor"');
      unmount();
      return fills;
    });
    expect(withFill).toEqual(["star-filled"]);
  });

  it("vypisuje každý svůj klíč a všechny se vykreslí", () => {
    expect(INGOT_ICON_NAMES.length).toBeGreaterThan(30);

    for (const name of INGOT_ICON_NAMES) {
      const { container, unmount } = render(<IngotIcon name={name} />);
      expect(container.querySelector("svg")?.childNodes.length).toBeGreaterThan(0);
      unmount();
    }
  });
});

describe("IngotOpIcon", () => {
  it("bere kresbu z knihovny operací, ne z vlastní kopie", () => {
    const { container } = render(<IngotOpIcon token={OP} />);

    const { container: library } = render(
      <span>{resolveProcessIcon(OP)?.icon}</span>,
    );

    expect(container.querySelector("svg")?.innerHTML).toBe(
      library.querySelector("svg")?.innerHTML,
    );
  });

  it("obarví se kategorií procesu, ale u :black si barvu nese token", () => {
    const { container: byCategory } = render(
      <IngotOpIcon token={OP} categoryColor="rgb(1, 2, 3)" testId="op" />,
    );
    expect(byCategory.querySelector('[data-testid="op"]')).toHaveStyle({
      color: "rgb(1, 2, 3)",
    });

    const { container: fixed } = render(
      <IngotOpIcon token={`${OP}:black`} categoryColor="rgb(1, 2, 3)" testId="op" />,
    );
    expect(fixed.querySelector('[data-testid="op"]')).toHaveStyle({
      color: "var(--ink)",
    });
  });

  it("je bez title dekorativní a s ním pojmenovaný obrázek", () => {
    const { container, rerender } = render(<IngotOpIcon token={OTHER_OP} testId="op" />);
    expect(container.querySelector('[data-testid="op"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(<IngotOpIcon token={OTHER_OP} title="Název operace" testId="op" />);
    expect(screen.getByRole("img", { name: "Název operace" })).toBeInTheDocument();
  });

  it("na neznámý i prázdný token vrátí nic, ať volající může spadnout jinam", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { container: unknown } = render(<IngotOpIcon token="neexistuje" />);
    expect(unknown.querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("neexistuje"));

    warn.mockClear();
    const { container: empty } = render(<IngotOpIcon token={null} />);
    expect(empty.querySelector("svg")).toBeNull();
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });
});
