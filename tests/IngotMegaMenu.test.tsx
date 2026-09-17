import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotMegaMenu } from "@/ingot";

function renderMenu() {
  return render(
    <IngotMegaMenu
      label="Menu"
      testId="mega"
      art={<span data-testid="menu-art" />}
      groups={[
        {
          items: [
            { href: "#a", label: "A" },
            { href: "#b", label: "B", art: <span data-testid="item-art" /> },
          ],
        },
      ]}
    />,
  );
}

describe("IngotMegaMenu art", () => {
  it("draws the menu art for an item without its own", () => {
    renderMenu();
    const preview = screen.getByTestId("mega-preview");
    expect(preview.querySelector("[data-testid='menu-art']")).not.toBeNull();
    expect(preview.querySelector("[data-testid='item-art']")).toBeNull();
  });

  it("draws the previewed item's own art instead", () => {
    renderMenu();
    fireEvent.mouseEnter(screen.getByText("B"));
    const preview = screen.getByTestId("mega-preview");
    expect(preview.querySelector("[data-testid='item-art']")).not.toBeNull();
    expect(preview.querySelector("[data-testid='menu-art']")).toBeNull();
  });
});
