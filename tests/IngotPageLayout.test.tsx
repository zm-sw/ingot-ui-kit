/**
 * The page layout on a screen that has no room for a standing index
 * (KAN-955).
 *
 * The side column was `w-56 shrink-0 sticky` with no breakpoint at all. At
 * 375 px that left 224 px of index standing beside the content, the
 * content squeezed to about a hundred, and the text breaking one word per
 * line. The primitive's own doc page overflowed sideways — the component
 * that exists to hold a page's shape could not hold its own.
 *
 * A standing index is a wide-screen instrument. Below `md` it becomes a
 * collapsed block above the content, and the content takes the whole
 * width; that is a different thing, not the same thing narrower.
 *
 * jsdom lays nothing out, so width cannot be measured here. What CAN be
 * measured is the decision that produces it: which shape the layout picks,
 * that the index is not in the document twice, and that the content never
 * carries a class that would squeeze it.
 */
import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { IngotPageLayout, IngotSideNav } from "@/ingot";

/**
 * Pretends the viewport is wide or narrow.
 *
 * jsdom ships no `matchMedia` at all, which is also the case the component
 * has to survive in an old browser — so the narrow shape is what it falls
 * back to. That is the right way round: the narrow shape fits everywhere,
 * the wide one does not.
 */
function viewport(wide: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: wide,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    })),
  );
}

const INDEX = (
  <IngotSideNav
    label="Obsah nastavení"
    items={[
      { href: "#profil", label: "Profil firmy", current: true },
      { href: "#dane", label: "Daňové údaje" },
    ]}
  />
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the side index on a wide screen", () => {
  it("stands in its own column, at the width the token says", () => {
    viewport(true);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );

    const column = screen.getByRole("navigation", {
      name: "Obsah nastavení",
    }).parentElement;
    expect(column?.className).toContain("w-aside");
    // It stays at hand while the content scrolls — that is the whole
    // reason a standing index is worth its width.
    expect(column?.className).toContain("sticky");
  });

  it("does not collapse the index into a block the reader has to open", () => {
    viewport(true);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    expect(
      within(screen.getByTestId("layout")).queryByText("Obsah"),
    ).not.toBeInTheDocument();
  });
});

describe("the side index on a narrow screen", () => {
  it("becomes a block above the content instead of a column beside it", () => {
    viewport(false);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );

    const layout = screen.getByTestId("layout");
    // Above the content in reading order: an index that came after what it
    // indexes would be a table of contents at the back of the book.
    const order = layout.textContent ?? "";
    expect(order.indexOf("Obsah")).toBeLessThan(order.indexOf("obsah"));
    expect(within(layout).getByText("Obsah")).toBeInTheDocument();
  });

  it("opens and closes, and starts closed", () => {
    viewport(false);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    // A reader who scrolled to this page wants the content; the index is
    // the shortcut past it, not the thing in front of it.
    const details = screen.getByTestId("layout").querySelector("details");
    expect(details).not.toBeNull();
    expect(details?.open).toBe(false);
  });

  it("never squeezes the content into a column beside something", () => {
    viewport(false);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    // The old bug in one assertion: with a flex row and a fixed 224 px
    // sibling, `flex-1 min-w-0` shrinks to nothing rather than overflowing.
    expect(screen.getByTestId("layout").className).not.toContain("flex");
  });

  it("puts the index in the document once, not twice", () => {
    viewport(false);
    render(
      <IngotPageLayout aside={INDEX} asideLabel="Obsah" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    // Rendering both shapes and hiding one with a breakpoint would be the
    // easy way to switch, and it would put every link in the document
    // twice: a screen reader reads both, and any id inside them collides.
    expect(screen.getAllByRole("link", { name: "Profil firmy" })).toHaveLength(1);
  });
});

describe("the shapes that have no index", () => {
  it("keeps the reading width for a screen that is read", () => {
    viewport(true);
    render(
      <IngotPageLayout width="reading" testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    expect(screen.getByText("obsah").parentElement?.className).toContain("max-w-3xl");
  });

  it("lets a list or a table have the whole width", () => {
    viewport(true);
    render(
      <IngotPageLayout testId="layout">
        <p>obsah</p>
      </IngotPageLayout>,
    );
    expect(screen.getByText("obsah").parentElement?.className).not.toContain(
      "max-w-3xl",
    );
  });
});
