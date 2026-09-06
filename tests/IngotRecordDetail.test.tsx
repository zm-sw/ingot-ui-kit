/**
 * The two blocks a record's detail is made of (KAN-960).
 *
 * Both were drawn by hand in every screen that needed them. The label-value
 * list was a hand-rolled `dl` here, a grid of spans there, a two-column
 * table somewhere else — three shapes of one thing, and only one of them
 * told a screen reader that "Customer" names the text beside it. The
 * avatar existed exactly once, inside the top bar's account button, so the
 * first screen that needed one in a list drew a second at a different size.
 *
 * What is measured here is the part that looks the same either way and is
 * not: the semantics of the pairing, and that a person is announced once
 * rather than twice or not at all.
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotAvatar, IngotDescriptionList, IngotTopNavAccount } from "@/ingot";

describe("the facts about a record", () => {
  const items = [
    { label: "Číslo zakázky", value: "ZAK-2026-0184", mono: true },
    { label: "Zákazník", value: "Strojírny Beneš" },
  ];

  it("says which label names which value, not just eight texts in a row", () => {
    const { container } = render(<IngotDescriptionList items={items} testId="dl" />);
    // A grid of spans looks identical and tells a screen reader nothing.
    expect(container.querySelector("dl")).not.toBeNull();
    expect(container.querySelectorAll("dt")).toHaveLength(2);
    expect(container.querySelectorAll("dd")).toHaveLength(2);
    expect(screen.getByText("Číslo zakázky").tagName).toBe("DT");
    expect(screen.getByText("ZAK-2026-0184").tagName).toBe("DD");
  });

  it("sets a fact in mono, so a column of them can be compared", () => {
    // In the body face the digits are different widths and two rows under
    // each other cannot be read against one another.
    render(<IngotDescriptionList items={items} testId="dl" />);
    expect(screen.getByText("ZAK-2026-0184").className).toContain("font-mono");
    expect(screen.getByText("ZAK-2026-0184").className).toContain("tabular-nums");
    expect(screen.getByText("Strojírny Beneš").className).not.toContain("font-mono");
  });

  it("keeps a pair together, so a long value cannot drag a label out of line", () => {
    const { container } = render(
      <IngotDescriptionList items={items} columns={2} testId="dl" />,
    );
    const pairs = container.querySelectorAll("dl > div");
    expect(pairs).toHaveLength(2);
    for (const pair of pairs) {
      expect(within(pair as HTMLElement).getAllByRole("term")).toHaveLength(1);
    }
  });

  it("reads down the page until a screen asks for two columns", () => {
    const { container, rerender } = render(
      <IngotDescriptionList items={items} testId="dl" />,
    );
    expect(container.firstElementChild?.className).not.toContain("grid-cols-2");
    rerender(<IngotDescriptionList items={items} columns={2} testId="dl" />);
    // And it folds back below `sm`, where two columns leave room for
    // neither the label nor the value.
    expect(container.firstElementChild?.className).toContain("sm:grid-cols-2");
  });
});

describe("the person beside them", () => {
  it("is one named thing, whether the picture loaded or not", () => {
    render(<IngotAvatar initials="JM" label="Jan Marek" testId="av" />);
    const avatar = screen.getByRole("img", { name: "Jan Marek" });
    expect(avatar).toBe(screen.getByTestId("av"));
    expect(avatar).toHaveTextContent("JM");
  });

  it("keeps the initials under the picture as the fallback", () => {
    // A broken or slow image leaves a letter showing rather than an empty
    // circle, and the picture itself says nothing — the wrapper has the
    // name and a second one would read the person twice.
    render(<IngotAvatar initials="JM" label="Jan Marek" src="/jm.png" testId="av" />);
    const avatar = screen.getByTestId("av");
    expect(avatar).toHaveTextContent("JM");
    const image = avatar.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("says nothing of its own where the name already stands beside it", () => {
    render(<IngotAvatar initials="MK" label="Marie Krátká" decorative testId="av" />);
    const avatar = screen.getByTestId("av");
    expect(avatar).toHaveAttribute("aria-hidden", "true");
    expect(avatar).not.toHaveAttribute("role");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("announces the account in the bar once, not twice", () => {
    // The button carries the person's name; the circle inside it is the
    // same person. Two names on one control are read twice.
    render(<IngotTopNavAccount initials="JM" label="Účet Jan Marek" testId="acc" />);
    const button = screen.getByRole("button", { name: "Účet Jan Marek" });
    expect(within(button).queryByRole("img")).toBeNull();
    expect(button).toHaveTextContent("JM");
  });
});
