/**
 * Application frame and the blocks of configuration screens.
 *
 * Eight primitives that joined the kit during the alignment to the design
 * handoff. The tests measure the rules that would otherwise be lost at the
 * first "minor" refactor — the ones where the wrong variant looks just as
 * good as the right one:
 *
 * - a bar section is a **button** with ``aria-expanded``, not a link with
 *   ``aria-current``: it leads nowhere itself, it only unfolds a menu,
 * - the last crumb is **not a link**, even when given an ``href``, and
 *   below two crumbs the breadcrumbs are not drawn at all,
 * - a finished step is told by **shape** (a check), not only by a green
 *   header,
 * - a row action has a **required label**, otherwise to a screen reader it
 *   is just "button" twenty times in a row,
 * - the **whole** variant card is clickable, not just the radio,
 * - a metric value is mono with ``tabular-nums`` so digits line up.
 */

import { useState } from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  IngotBreadcrumbs,
  IngotMegaMenu,
  IngotMetrics,
  IngotOptionCard,
  IngotRowActions,
  IngotStepCard,
  IngotTopNav,
  IngotTopNavAccount,
  IngotUserMenu,
  IngotUserMenuRow,
  IngotUserMenuSection,
} from "@/ingot";

describe("IngotTopNav", () => {
  const SECTIONS = [
    { key: "provoz", label: "Provoz" },
    { key: "sklad", label: "Sklad" },
  ];

  it("renders a section as a button with aria-expanded, not as a link", async () => {
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        testId="nav"
      />,
    );

    const open = screen.getByRole("button", { name: "Provoz" });
    expect(open).toHaveAttribute("aria-expanded", "true");
    // The section leads nowhere, so aria-current would lie.
    expect(open).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link", { name: "Provoz" })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sklad" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("hover opens a section and click only opens — never closes", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        onOpenSection={onOpen}
      />,
    );

    await user.hover(screen.getByRole("button", { name: "Sklad" }));
    expect(onOpen).toHaveBeenLastCalledWith("sklad");
    // A click on an ALREADY open section reports open again, not close:
    // hover opened it before the click landed, and a toggle would put it
    // out right away.
    await user.click(screen.getByRole("button", { name: "Provoz" }));
    expect(onOpen).toHaveBeenLastCalledWith("provoz");
  });

  // Real timers on purpose: the delay is 120 ms and fake timers stalled
  // with userEvent in a way that a failing first test left the fake clock
  // on for the whole rest of the file.
  it("mouse leave closes only after the delay — the way into the panel stays open", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        onCloseSection={onClose}
        testId="nav"
      >
        <div data-testid="panel">menu</div>
      </IngotTopNav>,
    );

    await user.hover(screen.getByRole("button", { name: "Provoz" }));
    // Leaving and RETURNING to the panel within the delay — the close is revoked.
    await user.unhover(screen.getByTestId("nav"));
    expect(onClose).not.toHaveBeenCalled();
    await user.hover(screen.getByTestId("panel"));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(onClose).not.toHaveBeenCalled();
    // A leave nobody revokes closes after the delay.
    await user.unhover(screen.getByTestId("nav"));
    expect(onClose).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a single-screen section is a link, a locked one is a button with a lock", async () => {
    const user = userEvent.setup();
    const onLocked = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={[
          { key: "provoz", label: "Provoz" },
          { key: "sklad", label: "Sklad", href: "/cs/admin/materials", current: true },
          { key: "dilna", label: "Dílna", locked: true, onLockedClick: onLocked },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "Sklad" });
    expect(link).toHaveAttribute("href", "/cs/admin/materials");
    expect(link).toHaveAttribute("aria-current", "page");
    // A link section has no menu, so no aria-expanded either.
    expect(link).not.toHaveAttribute("aria-expanded");

    await user.click(screen.getByRole("button", { name: "Dílna" }));
    expect(onLocked).toHaveBeenCalledTimes(1);
  });

  it("renderMenu draws the panel into the wrapper of the open section", () => {
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="sklad"
        renderMenu={(key) => <div data-testid={`panel-${key}`}>menu</div>}
      />,
    );

    expect(screen.getByTestId("panel-sklad")).toBeInTheDocument();
    expect(screen.queryByTestId("panel-provoz")).toBeNull();
    // The panel is a sibling of its button in the same relative wrapper.
    expect(
      screen.getByRole("button", { name: "Sklad" }).parentElement,
    ).toContainElement(screen.getByTestId("panel-sklad"));
  });

  it("a click outside the bar closes the open section", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <div>
        <IngotTopNav
          brand="Forgmatic"
          sections={SECTIONS}
          openSection="provoz"
          onCloseSection={onClose}
        />
        <button type="button">vedle</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "vedle" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("Escape closes the open section", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <IngotTopNav
        brand="Forgmatic"
        sections={SECTIONS}
        openSection="provoz"
        onCloseSection={onClose}
      />,
    );

    screen.getByRole("button", { name: "Provoz" }).focus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("the account carries a screen-reader label, not just initials", () => {
    render(<IngotTopNavAccount initials="8S" label="Menu účtu" expanded />);
    const account = screen.getByRole("button", { name: "Menu účtu" });
    expect(account).toHaveAttribute("aria-expanded", "true");
    expect(account).toHaveTextContent("8S");
  });
});

/**
 * Keyboard in the open panel.
 *
 * A menu that opens on hover easily becomes a trap from the keyboard: the
 * panel is visible, but focus is still on the button and an arrow only
 * scrolls the page. These tests measure three places where it breaks and
 * where the wrong variant is indistinguishable from the right one by eye —
 * the panel lights up the same in both cases.
 *
 * The caller holds the section state, so the harness is controlled too: if
 * it tested against a permanently open section, "arrow on a closed section
 * opens and jumps inside" could not be measured at all.
 */
describe("IngotTopNav keyboard", () => {
  function Bar(): JSX.Element {
    const [open, setOpen] = useState<string | null>(null);
    return (
      <IngotTopNav
        brand="Forgmatic"
        sections={[
          { key: "provoz", label: "Provoz" },
          { key: "sklad", label: "Sklad" },
        ]}
        openSection={open}
        onOpenSection={setOpen}
        onCloseSection={() => setOpen(null)}
        renderMenu={() => (
          <IngotMegaMenu
            groups={[
              {
                items: [
                  { href: "#a", label: "Objednávky" },
                  { href: "#b", label: "Poptávky" },
                  { href: "#c", label: "Materiály" },
                ],
              },
            ]}
            label="Provoz"
          />
        )}
      />
    );
  }

  const item = (name: string) => screen.getByRole("link", { name });

  it("arrow down on a closed section opens it and jumps to the first item", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    const provoz = screen.getByRole("button", { name: "Provoz" });
    provoz.focus();
    await user.keyboard("{ArrowDown}");

    expect(provoz).toHaveAttribute("aria-expanded", "true");
    expect(item("Objednávky")).toHaveFocus();
  });

  it("arrow up on a closed section jumps to the last item", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    screen.getByRole("button", { name: "Provoz" }).focus();
    await user.keyboard("{ArrowUp}");

    expect(item("Materiály")).toHaveFocus();
  });

  it("arrows walk the items and wrap to the start at the end", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    screen.getByRole("button", { name: "Provoz" }).focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(item("Poptávky")).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(item("Objednávky")).toHaveFocus();

    // Going up past the first item exits to the last, not out of the panel.
    await user.keyboard("{ArrowUp}");
    expect(item("Materiály")).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(item("Objednávky")).toHaveFocus();
  });

  it("Tab does not fall out of the open panel — it cycles its items", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    screen.getByRole("button", { name: "Provoz" }).focus();
    await user.keyboard("{ArrowDown}");

    await user.tab();
    expect(item("Poptávky")).toHaveFocus();
    await user.tab();
    expect(item("Materiály")).toHaveFocus();

    // The last item does not lead to the neighbouring section but back to the first.
    await user.tab();
    expect(item("Objednávky")).toHaveFocus();
    expect(screen.getByRole("button", { name: "Sklad" })).not.toHaveFocus();

    await user.tab({ shift: true });
    expect(item("Materiály")).toHaveFocus();
  });

  it("Escape closes the panel and returns focus to the section button", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    const provoz = screen.getByRole("button", { name: "Provoz" });
    provoz.focus();
    await user.keyboard("{ArrowDown}");
    expect(item("Objednávky")).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(provoz).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Objednávky" })).not.toBeInTheDocument();
    // Without this, focus would fall to <body> and the reader would wake up
    // at the top of the page — one step back for a menu opened by arrow.
    expect(provoz).toHaveFocus();
  });

  it("a closed section leaves the keyboard alone — Tab goes to the next section", async () => {
    const user = userEvent.setup();
    render(<Bar />);

    screen.getByRole("button", { name: "Provoz" }).focus();
    await user.tab();

    expect(screen.getByRole("button", { name: "Sklad" })).toHaveFocus();
  });
});

describe("IngotMegaMenu", () => {
  const GROUPS = [
    {
      title: "Denní provoz",
      items: [
        {
          href: "#a",
          label: "Objednávky",
          description: "Co je přijaté a co čeká na potvrzení výroby.",
          count: 12,
          current: true,
        },
        {
          href: "#b",
          label: "Poptávky",
          description: "Nacenění, která zákazník zatím nepotvrdil.",
          count: 48,
        },
      ],
    },
  ];

  it("renders groups and counts and marks the open item", () => {
    render(<IngotMegaMenu groups={GROUPS} label="Provoz" testId="mega" />);

    const nav = screen.getByRole("navigation", { name: "Provoz" });
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
    // A link inside the menu leads SOMEWHERE, so aria-current fits here.
    expect(within(nav).getByRole("link", { name: /Objednávky/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByText("12")).toBeInTheDocument();
  });

  it("the preview starts on the first item and follows cursor and focus", async () => {
    const user = userEvent.setup();
    render(<IngotMegaMenu groups={GROUPS} label="Provoz" testId="mega" />);

    const preview = screen.getByTestId("mega-preview");
    expect(preview).toHaveTextContent("Co je přijaté a co čeká");

    await user.hover(screen.getByRole("link", { name: /Poptávky/ }));
    expect(preview).toHaveTextContent("Nacenění, která zákazník");

    // Focus switches the preview just like the mouse — the keyboard is not
    // a second class (owner decision of 2026-09-02, item 01). fireEvent,
    // not .focus(): jsdom focus outside act() does not bubble into React
    // state.
    fireEvent.focus(screen.getByRole("link", { name: /Objednávky/ }));
    expect(preview).toHaveTextContent("Co je přijaté a co čeká");
  });

  it("a locked item is a button with a callback, not a link — and its preview works", async () => {
    const user = userEvent.setup();
    const onLocked = vi.fn();
    render(
      <IngotMegaMenu
        groups={[
          {
            title: "Denní provoz",
            items: [GROUPS[0]!.items[0]!, { ...GROUPS[0]!.items[1]!, locked: true }],
          },
        ]}
        onLockedItemClick={onLocked}
        label="Provoz"
        testId="mega"
      />,
    );

    expect(screen.queryByRole("link", { name: /Poptávky/ })).toBeNull();
    const locked = screen.getByRole("button", { name: /Poptávky/ });
    await user.hover(locked);
    expect(screen.getByTestId("mega-preview")).toHaveTextContent(
      "Nacenění, která zákazník",
    );
    await user.click(locked);
    expect(onLocked).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Poptávky" }),
    );
  });

  it("a screen reader hears the description from the link — the preview column is aria-hidden", () => {
    render(<IngotMegaMenu groups={GROUPS} label="Provoz" testId="mega" />);

    expect(screen.getByTestId("mega-preview")).toHaveAttribute("aria-hidden", "true");
    const first = screen.getByRole("link", { name: /Objednávky/ });
    const descId = first.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent(
      "Co je přijaté a co čeká na potvrzení výroby.",
    );
  });
});

describe("IngotUserMenu", () => {
  it("binds the label to the control only when it has an id", () => {
    render(
      <IngotUserMenu label="Menu účtu" testId="user">
        <IngotUserMenuSection>
          <IngotUserMenuRow label="Jazyk" controlId="lang">
            <select id="lang" aria-label="Jazyk">
              <option>CS</option>
            </select>
          </IngotUserMenuRow>
          <IngotUserMenuRow label="Slovník">
            <span>Jednoduše</span>
          </IngotUserMenuRow>
        </IngotUserMenuSection>
      </IngotUserMenu>,
    );

    expect(screen.getByRole("group", { name: "Menu účtu" })).toBeInTheDocument();
    // With ``controlId`` the caption is a ``<label>``; without it the menu
    // would promise a binding it does not have.
    expect(screen.getByText("Jazyk").tagName).toBe("LABEL");
    expect(screen.getByText("Slovník").tagName).toBe("SPAN");
  });
});

describe("IngotBreadcrumbs", () => {
  it("does not render the last crumb as a link, even when given an href", () => {
    render(
      <IngotBreadcrumbs
        items={[
          { label: "Provoz", href: "#/provoz" },
          { label: "Objednávky", href: "#/objednavky" },
        ]}
        label="Kde se nacházíte"
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Provoz");
    const last = screen.getByText("Objednávky");
    expect(last.tagName).not.toBe("A");
    expect(last).toHaveAttribute("aria-current", "page");
  });

  it("does not render at all below two crumbs", () => {
    const { container } = render(
      <IngotBreadcrumbs items={[{ label: "Provoz" }]} label="Kde jste" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("IngotMetrics", () => {
  it("sets the value in mono with tabular digits, the label not", () => {
    render(
      <IngotMetrics
        items={[
          { label: "Po termínu", value: 2, note: "OBJ-2411", tone: "danger" },
          { label: "Ve výrobě", value: 18 },
        ]}
        label="Přehled"
        testId="metrics"
      />,
    );

    const value = screen.getByText("2");
    expect(value).toHaveClass("font-mono");
    expect(value).toHaveClass("tabular-nums");
    // The tone is information: a critical value is coloured, the others not.
    expect(value).toHaveClass("text-danger");
    expect(screen.getByText("18")).toHaveClass("text-ink");
  });

  it("both densities render the same data", () => {
    const items = [{ label: "skupiny", value: 2 }];
    const { rerender } = render(
      <IngotMetrics items={items} label="Souhrn" testId="m" />,
    );
    expect(screen.getByTestId("m")).toHaveTextContent("skupiny");
    rerender(<IngotMetrics items={items} variant="inline" label="Souhrn" testId="m" />);
    expect(screen.getByTestId("m")).toHaveTextContent("skupiny");
  });
});

describe("IngotStepCard", () => {
  it("a finished step is told by shape, not only by colour", () => {
    render(
      <IngotStepCard
        step="01"
        kicker="Krok 01"
        title="Země a měny"
        done
        doneLabel="Hotovo"
        testId="step"
      >
        <p>obsah</p>
      </IngotStepCard>,
    );

    // A check instead of a number — and it is labelled, so a screen reader reads it too.
    expect(screen.getByTitle("Hotovo")).toBeInTheDocument();
    expect(screen.queryByText("01")).not.toBeInTheDocument();
  });

  it("an unfinished step shows its ordinal", () => {
    render(
      <IngotStepCard step="02" kicker="Krok 02" title="Skupiny" testId="step">
        <p>obsah</p>
      </IngotStepCard>,
    );
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});

describe("IngotOptionCard", () => {
  it("the whole card is clickable, not just the radio", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IngotOptionCard
        name="basis"
        value="weight"
        checked={false}
        onChange={onChange}
        title="Podle hmotnosti"
        description="Cena vychází z hmotnosti dílu."
        testId="option"
      />,
    );

    // A click on the explanatory sentence, not on the radio — the trap the card solves.
    await user.click(screen.getByText("Cena vychází z hmotnosti dílu."));
    expect(onChange).toHaveBeenCalledWith("weight");
  });
});

describe("IngotRowActions", () => {
  it("every action has a label, so a screen reader hears more than a bare button", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <IngotRowActions
        actions={[
          { icon: "sliders", label: "Upravit vzorec", onClick: () => {} },
          {
            icon: "trash",
            label: "Smazat vzorec",
            tone: "danger",
            onClick: onDelete,
          },
        ]}
        testId="actions"
      />,
    );

    expect(screen.getByRole("button", { name: "Upravit vzorec" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Smazat vzorec" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
