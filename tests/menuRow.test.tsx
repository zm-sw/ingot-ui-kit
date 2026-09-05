import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import { IngotMegaMenu, IngotSideNav, IngotTopNav } from "@/ingot";

/**
 * One spelling of a navigation row's states. TopNav, MegaMenu and SideNav
 * used to write current / muted / hover / locked three different ways.
 */

const KIT_DIR = join(__dirname, "..", "src", "ingot");

describe("menu row", () => {
  it("no navigation component writes the hover colour by hand", () => {
    for (const file of ["IngotTopNav.tsx", "IngotMegaMenu.tsx", "IngotSideNav.tsx"]) {
      const src = readFileSync(join(KIT_DIR, file), "utf-8");
      expect(src, `${file} spells hover:bg-surface-2 itself`).not.toMatch(
        /hover:bg-surface-2/,
      );
    }
  });

  it("a locked section in the bar and a locked item in the menu are the same row", () => {
    render(
      <>
        <IngotTopNav
          brand="B"
          sections={[{ key: "l", label: "Locked section", locked: true }]}
        />
        <IngotMegaMenu
          label="Menu"
          groups={[{ items: [{ href: "#x", label: "Locked item", locked: true }] }]}
        />
      </>,
    );
    const section = screen.getByRole("button", { name: /Locked section/ });
    const item = screen.getByRole("button", { name: /Locked item/ });
    for (const el of [section, item]) {
      expect(el).toHaveClass("text-ink-4");
      expect(el).toHaveClass("hover:bg-surface-2");
      expect(el.querySelectorAll("svg").length).toBe(1);
    }
  });

  it("current reads the same in the bar and in the menu", () => {
    render(
      <>
        <IngotTopNav
          brand="B"
          sections={[{ key: "c", label: "Current section", href: "#c", current: true }]}
        />
        <IngotMegaMenu
          label="Menu"
          groups={[{ items: [{ href: "#y", label: "Current item", current: true }] }]}
        />
      </>,
    );
    for (const name of ["Current section", "Current item"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveClass("bg-surface-2");
      expect(link).toHaveClass("font-medium");
      expect(link).toHaveAttribute("aria-current", "page");
    }
  });

  it("on the page background the current side nav row is a small card, children rest one step lighter", () => {
    render(
      <IngotSideNav
        label="System"
        items={[
          {
            href: "#a",
            label: "Parent",
            current: true,
            children: [{ href: "#a1", label: "Child" }],
          },
        ]}
      />,
    );
    const parent = screen.getByRole("link", { name: "Parent" });
    expect(parent).toHaveClass("bg-surface");
    expect(parent).toHaveClass("border-border");
    expect(parent).toHaveClass("shadow-sm");
    const child = screen.getByRole("link", { name: "Child" });
    expect(child).toHaveClass("text-ink-3");
    expect(child).toHaveClass("hover:bg-surface-2");
  });
});
