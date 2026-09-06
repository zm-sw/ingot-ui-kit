/**
 * `IngotCountPill` (KAN-945).
 *
 * The pill existed before this primitive did, but only inside `IngotTabs`,
 * so what is worth measuring is mostly about the seam:
 *
 * 1. **Zero is drawn.** The rule borrowed from unread-message badges would
 *    hide it, and an empty section would then look like one whose count
 *    nobody knows.
 * 2. **The label is optional, and it changes the reading.** Next to a
 *    heading the pill is text in reading order; standing alone it is one
 *    named element.
 * 3. **`IngotTabs` draws its counts with this component**, so the two
 *    cannot drift into two different pills.
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IngotCountPill, IngotTabs } from "@/ingot";

describe("IngotCountPill", () => {
  it("draws a zero rather than hiding it", () => {
    render(
      <IngotCountPill label="Počet archivovaných zakázek" testId="archive">
        0
      </IngotCountPill>,
    );

    // "0" is the answer to the reader's question — the view is empty.
    expect(screen.getByTestId("archive")).toHaveTextContent("0");
  });

  it("is a named element when it stands alone", () => {
    render(
      <IngotCountPill label="Počet bloků" testId="blocks">
        10
      </IngotCountPill>,
    );

    // "10" on its own means nothing; with a label it is read as one thing.
    expect(screen.getByRole("img", { name: "Počet bloků" })).toBe(
      screen.getByTestId("blocks"),
    );
  });

  it("is plain text in reading order when the neighbouring text names it", () => {
    render(<IngotCountPill testId="blocks">10</IngotCountPill>);

    const pill = screen.getByTestId("blocks");
    expect(pill).not.toHaveAttribute("role");
    expect(pill).not.toHaveAttribute("aria-label");
    expect(pill).toHaveTextContent("10");
  });

  it("carries its own colours on a dark surface", () => {
    render(
      <IngotCountPill onInk testId="onink">
        3
      </IngotCountPill>,
    );

    expect(screen.getByTestId("onink").className).toContain("text-surface");
  });
});

describe("IngotTabs draws its count with the pill", () => {
  it("renders the count through the shared primitive, not a span of its own", () => {
    render(
      <IngotTabs
        items={[
          { key: "overview", label: "Přehled" },
          { key: "items", label: "Položky", count: 12 },
        ]}
        value="overview"
        onChange={() => undefined}
        label="Pohledy"
        testId="tabs"
      />,
    );

    const tab = screen.getByTestId("tabs-tab-items");
    // The pill sits inside the tab, so the tab's own name already ends in
    // the count — a second label would only repeat it.
    expect(tab).toHaveAccessibleName("Položky 12");
    expect(within(tab).getByText("12").className).toContain("rounded-full");
  });
});
