/**
 * Collapsible panel section — `<details>` holds the state, not React.
 *
 * What is measured here and why exactly that:
 *
 * 1. **The caption is NOT a heading.** Visually the mistake would go
 *    unnoticed: mono uppercase looks the same whether a `<span>` or an
 *    `<h3>` is underneath. Only a screen reader hears the difference, and
 *    its page outline would break.
 * 2. **The element carries the state.** If unfolding were rewritten to
 *    `useState`, a test for "the content is visible after a click" would
 *    still pass — and find-in-page, print and `open` from the markup would
 *    quietly be lost. Hence `open` on the `<details>` itself is measured.
 * 3. **A group has one name for all its sections and foreign ones do not.**
 *    The browser keeps exclusivity via `name`; a collision of two groups on
 *    one page is exactly the bug nobody looks for until two panels meet on
 *    one screen.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { IngotDisclosure, IngotDisclosureGroup } from "@/ingot";

describe("IngotDisclosure", () => {
  it("the caption is a caption, not a heading — the page outline stays with IngotSection", () => {
    render(
      <IngotDisclosure title="Doklady" count={2}>
        <p>Nabídka 2026-0412</p>
      </IngotDisclosure>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Doklady")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("the element holds the state, not React — and defaultOpen fits in the markup", async () => {
    const user = userEvent.setup();
    render(
      <IngotDisclosure title="Poznámky" testId="sekce">
        <p>Dodat do konce měsíce.</p>
      </IngotDisclosure>,
    );

    const details = screen.getByTestId("sekce") as HTMLDetailsElement;
    expect(details.open).toBe(false);

    await user.click(screen.getByText("Poznámky"));
    expect(details.open).toBe(true);
  });

  it("defaultOpen opens the section right away", () => {
    render(
      <IngotDisclosure title="Soubory" defaultOpen testId="sekce">
        <p>vykres.pdf</p>
      </IngotDisclosure>,
    );

    expect((screen.getByTestId("sekce") as HTMLDetailsElement).open).toBe(true);
  });

  it("without count no number is drawn at all", () => {
    render(
      <IngotDisclosure title="Štítky" testId="sekce">
        <p>Žádné</p>
      </IngotDisclosure>,
    );

    expect(screen.getByTestId("sekce").querySelector("summary")).toHaveTextContent(
      "Štítky",
    );
    // count={0} is a legitimate value, so it must not hide together with undefined.
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("count={0} is shown — zero is information, not emptiness", () => {
    render(
      <IngotDisclosure title="Soubory" count={0}>
        <p>Zatím nic.</p>
      </IngotDisclosure>,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("IngotDisclosureGroup", () => {
  it("gives its sections a shared name the browser uses to keep exclusivity", () => {
    render(
      <IngotDisclosureGroup testId="skupina">
        <IngotDisclosure title="Osa" testId="a">
          <p>a</p>
        </IngotDisclosure>
        <IngotDisclosure title="Doklady" testId="b">
          <p>b</p>
        </IngotDisclosure>
      </IngotDisclosureGroup>,
    );

    const first = screen.getByTestId("a").getAttribute("name");
    const second = screen.getByTestId("b").getAttribute("name");

    expect(first).toBeTruthy();
    expect(second).toBe(first);
  });

  it("two groups on a page do not intertwine", () => {
    render(
      <>
        <IngotDisclosureGroup>
          <IngotDisclosure title="Osa" testId="a">
            <p>a</p>
          </IngotDisclosure>
        </IngotDisclosureGroup>
        <IngotDisclosureGroup>
          <IngotDisclosure title="Doklady" testId="b">
            <p>b</p>
          </IngotDisclosure>
        </IngotDisclosureGroup>
      </>,
    );

    expect(screen.getByTestId("a").getAttribute("name")).not.toBe(
      screen.getByTestId("b").getAttribute("name"),
    );
  });

  it("a section outside a group gets no name — a standalone one must bind to nothing", () => {
    render(
      <IngotDisclosure title="Osa" testId="sama">
        <p>a</p>
      </IngotDisclosure>,
    );

    expect(screen.getByTestId("sama")).not.toHaveAttribute("name");
  });
});
