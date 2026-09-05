/**
 * Icon layer of the kit (KAN-649) — two sets, two sets of rules.
 *
 * What is measured here and why exactly that:
 *
 * 1. **Decorative is the DEFAULT state.** An icon next to its label that a
 *    screen reader reads means the user hears the same thing twice. The
 *    regression would be invisible — visually nothing changes.
 * 2. **An unknown key must not vanish quietly.** ``icon_key`` flows from
 *    the database, so the typecheck does not catch it; a silent blank is
 *    then hunted across half the application. It is measured that the
 *    component renders nothing AND says so loudly in development.
 * 3. **``IngotOpIcon`` does not duplicate the drawings.** If it copied the
 *    geometry, a test for "something rendered" would still pass and both
 *    copies would drift quietly. Hence the comparison against what the
 *    operations library itself returns — not against a constant in the
 *    test.
 * 4. **The fill is ONE named exception.** The set is line art;
 *    ``star-filled`` is the second shape of a state glyph, not a licence to
 *    draw filled icons. Without the test a second fill would be added in
 *    passing and the sentence in Limits would quietly stop being true.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotIcon, INGOT_ICON_NAMES } from "@/ingot";
import { IngotOpIcon, INGOT_OP_ICON_KEYS, resolveProcessIcon } from "@/ingot/forgmatic";

const OP = INGOT_OP_ICON_KEYS[0];
const OTHER_OP = INGOT_OP_ICON_KEYS[1];

describe("IngotIcon", () => {
  it("is decorative without title and a named image with it", () => {
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

  it("keeps the handoff technique — 24×24, currentColor, the check as the exception", () => {
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

  it("renders nothing and warns when the set does not know the key", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const unknown = "rozhodne-neexistuje" as (typeof INGOT_ICON_NAMES)[number];

    const { container } = render(<IngotIcon name={unknown} />);

    expect(container.querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("rozhodne-neexistuje"));
    warn.mockRestore();
  });

  it("only one glyph has a fill and it shares geometry with its line pair", () => {
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

  it("lists every key of its own and all of them render", () => {
    expect(INGOT_ICON_NAMES.length).toBeGreaterThan(30);

    for (const name of INGOT_ICON_NAMES) {
      const { container, unmount } = render(<IngotIcon name={name} />);
      expect(container.querySelector("svg")?.childNodes.length).toBeGreaterThan(0);
      unmount();
    }
  });
});

describe("IngotOpIcon", () => {
  it("takes the drawing from the operations library, not from its own copy", () => {
    const { container } = render(<IngotOpIcon token={OP} />);

    const { container: library } = render(<span>{resolveProcessIcon(OP)?.icon}</span>);

    expect(container.querySelector("svg")?.innerHTML).toBe(
      library.querySelector("svg")?.innerHTML,
    );
  });

  it("takes the process category colour, but for :black the token carries the colour", () => {
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

  it("is decorative without title and a named image with it", () => {
    const { container, rerender } = render(
      <IngotOpIcon token={OTHER_OP} testId="op" />,
    );
    expect(container.querySelector('[data-testid="op"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(<IngotOpIcon token={OTHER_OP} title="Název operace" testId="op" />);
    expect(screen.getByRole("img", { name: "Název operace" })).toBeInTheDocument();
  });

  it("returns nothing for an unknown or empty token so the caller can fall back elsewhere", () => {
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
