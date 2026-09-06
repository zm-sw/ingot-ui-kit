/**
 * The menu's keyboard (KAN-847).
 *
 * A menu is where the roles promise behaviour: once something says
 * `role="menu"`, a screen reader user expects arrows to walk it, Home and
 * End to jump, typing to find, and Tab to LEAVE. A panel that carries the
 * role without the behaviour is worse than one that carries neither,
 * because the promise is what the reader acts on.
 *
 * The trap this pins down: focus has to enter the menu on open. Without
 * that the panel is visible, focus is still on the button, and an arrow
 * key only scrolls the page — which looks, from the keyboard, exactly like
 * a menu that did not open.
 */
import { useRef, useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotMenu, type IngotMenuItem } from "@/ingot";

function Harness({ items }: { items: readonly IngotMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Akce
      </button>
      <IngotMenu
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        label="Akce objednávky"
        items={items}
        testId="menu"
      />
    </div>
  );
}

const ITEMS: IngotMenuItem[] = [
  { key: "open", label: "Otevřít detail", onSelect: vi.fn() },
  { key: "copy", label: "Duplikovat", onSelect: vi.fn() },
  { key: "export", label: "Exportovat", disabled: true, onSelect: vi.fn() },
  {
    key: "delete",
    label: "Smazat",
    tone: "danger",
    separatorBefore: true,
    onSelect: vi.fn(),
  },
];

function open() {
  fireEvent.click(screen.getByRole("button", { name: "Akce" }));
  return screen.getByRole("menu", { name: "Akce objednávky" });
}

describe("IngotMenu", () => {
  it("is a named menu of menu items and takes focus on open", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();

    expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);
    // Focus enters the menu, otherwise an arrow key only scrolls the page.
    expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Otevřít detail" }),
    );
  });

  it("arrows walk the items and wrap at the ends", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Duplikovat");

    // The disabled item is skipped by the arrows but stays in the menu.
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Smazat");

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Otevřít detail");

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toHaveTextContent("Smazat");
  });

  it("Home and End jump to the ends", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();

    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toHaveTextContent("Smazat");

    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toHaveTextContent("Otevřít detail");
  });

  it("typing finds an item by its first letters", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();

    fireEvent.keyDown(menu, { key: "d" });
    expect(document.activeElement).toHaveTextContent("Duplikovat");
  });

  it("Tab leaves the menu instead of cycling inside it", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();

    fireEvent.keyDown(menu, { key: "Tab" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("selecting runs the action, closes the menu and returns focus", () => {
    const onSelect = vi.fn();
    render(<Harness items={[{ key: "open", label: "Otevřít detail", onSelect }]} />);
    const menu = open();

    fireEvent.click(within(menu).getByRole("menuitem", { name: "Otevřít detail" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Akce" }));
  });

  it("a disabled item stays visible, is announced, and does nothing", () => {
    const onSelect = vi.fn();
    render(
      <Harness
        items={[
          { key: "open", label: "Otevřít detail", onSelect: vi.fn() },
          { key: "export", label: "Exportovat", disabled: true, onSelect },
        ]}
      />,
    );
    const menu = open();

    const disabled = within(menu).getByRole("menuitem", { name: "Exportovat" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(disabled);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("draws a separator where a group ends", () => {
    render(<Harness items={ITEMS} />);
    const menu = open();
    expect(within(menu).getAllByRole("separator")).toHaveLength(1);
  });
});
