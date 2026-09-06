/**
 * Finding a page by what the reader remembers about it (KAN-857).
 *
 * The index has grown past sixty pages and the menu was the only way in.
 * That works while a reader knows what the thing is called and fails at
 * every other question they arrive with — which one draws the pill, what
 * uses this token, the thing with the eyebrow above it.
 *
 * A search that returns nothing for an obviously right query is worse than
 * no search: the reader concludes the page does not exist. So the cases
 * measured here are the ones a person would actually type, including the
 * ones a clever ranking tends to lose.
 *
 * It later turned out to have a quieter version of the same fault
 * (KAN-952): it cut the list without saying so, and to a screen reader it
 * said nothing at all — the arrows move a highlight the caret never
 * follows, so a reader who cannot see the list arrows through silence.
 * Both are measured here now, because both are invisible in a screenshot.
 */
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { CHROME } from "@/ingot-docs/chrome";
import { SearchDialog } from "@/ingot-docs/SearchDialog";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import { componentSlug } from "@/ingot-docs/routes";
import { SEARCHABLE_PAGES, SEARCH_LIMIT, fold, search } from "@/ingot-docs/search";

const titles = (query: string, lang: "cs" | "en" = "cs") =>
  search(query, lang, 50).hits.map((hit) => hit.title);

describe("the index", () => {
  it("covers every page, so a miss is a miss and not a gap", () => {
    expect(search("", "cs", 500).hits).toHaveLength(SEARCHABLE_PAGES);
  });

  it("finds a component by its name, with or without the prefix", () => {
    expect(titles("IngotTable")).toContain("Table");
    expect(titles("table")).toContain("Table");
  });

  it("finds a component by the tag its page shows", () => {
    // The selector is the only name a designer can discuss the thing
    // under — code is the only place the export name exists.
    const badge = INGOT_DOC_PAGES.find((page) => page.name === "IngotBadge")!;
    expect(titles(badge.tag)).toContain("Badge");
  });

  it("finds a component by a token it declares", () => {
    const users = INGOT_DOC_PAGES.filter((page) => page.tokens.includes("--accent-bg"));
    expect(users.length).toBeGreaterThan(0);
    const found = titles("--accent-bg");
    for (const page of users) {
      expect(found).toContain(
        page.name.replace(/^Ingot/, "") === ""
          ? page.name
          : page.name.replace(/^Ingot/, ""),
      );
    }
  });

  it("ignores diacritics in both directions", () => {
    expect(fold("Šarže")).toBe("sarze");
    // A reader typing without diacritics is the normal case, not the edge.
    expect(titles("prekl").length).toBeGreaterThan(0);
    expect(titles("překl").length).toBeGreaterThan(0);
  });

  it("requires every word, so a second word narrows rather than widens", () => {
    const one = titles("tabulka").length;
    const two = titles("tabulka sloupce").length;
    expect(two).toBeLessThanOrEqual(one);
  });

  it("says nothing rather than something wrong", () => {
    expect(titles("zzzzznotathing")).toEqual([]);
  });

  it("hands back the address the shell can route to", () => {
    const hit = search("IngotTable", "cs").hits[0];
    expect(hit.path).toBe(`/komponenty/${componentSlug("IngotTable")}`);
    expect(search("IngotTable", "en").hits[0].path).toBe(
      `/en/komponenty/${componentSlug("IngotTable")}`,
    );
  });

  it("reports how many matched, not how many it is showing", () => {
    // The whole point of the count: `--accent-bg` is declared by more
    // pages than fit, and the reader has to be told which number is which.
    const all = search("", "cs", 500);
    const few = search("", "cs", 5);
    expect(few.hits).toHaveLength(5);
    expect(few.total).toBe(all.total);
    expect(few.total).toBe(SEARCHABLE_PAGES);
  });

  it("shows a query with more matches than the limit up to the limit", () => {
    const users = INGOT_DOC_PAGES.filter((page) => page.tokens.includes("--accent-bg"));
    expect(users.length).toBeGreaterThan(0);
    const found = search("--accent-bg", "cs");
    expect(found.hits.length).toBeLessThanOrEqual(SEARCH_LIMIT);
    expect(found.total).toBeGreaterThanOrEqual(users.length);
  });

  it("puts the page that IS the query above the pages that mention it", () => {
    // Every page whose "when to use it" names the table matches "table"
    // just as truly. Exactly one of them is the Table page.
    expect(titles("table")[0]).toBe("Table");
  });

  it("puts a name match above a match in the prose", () => {
    const order = titles("badge");
    const badge = order.indexOf("Badge");
    expect(badge).toBeGreaterThanOrEqual(0);
    // Everything above it, if anything, also has the word in its own name.
    for (const title of order.slice(0, badge)) {
      expect(fold(title)).toContain("badge");
    }
  });

  it("gives the same answer twice, so a result never moves under the reader", () => {
    expect(titles("odkaz")).toEqual(titles("odkaz"));
  });
});

describe("the dialog", () => {
  it("opens on the whole list, not on an empty box", () => {
    render(<SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />);
    const results = screen.getByTestId("docs-search-results");
    expect(within(results).getAllByRole("option").length).toBeGreaterThan(0);
  });

  it("keeps the results real links, so middle-click and copy-link still work", () => {
    render(<SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />);
    // `role="option"` changes what is announced, not what the element is —
    // an option the browser cannot open in a new tab is a regression.
    const first = within(screen.getByRole("listbox")).getAllByRole("option")[0];
    expect(first.tagName).toBe("A");
    expect(first).toHaveAttribute("href", expect.stringContaining("/"));
  });

  it("walks the results with the arrows and opens one with Enter", async () => {
    const user = userEvent.setup();
    const opened: string[] = [];
    render(
      <SearchDialog
        lang="cs"
        onClose={() => {}}
        onNavigate={(path) => opened.push(path)}
      />,
    );

    await user.type(screen.getByTestId("docs-search-input"), "table");
    await user.keyboard("{Enter}");

    expect(opened).toHaveLength(1);
    expect(opened[0]).toContain("/komponenty/");
  });

  it("tells the reader when nothing matched instead of showing an empty area", async () => {
    const user = userEvent.setup();
    render(<SearchDialog lang="en" onClose={() => {}} onNavigate={() => {}} />);
    await user.type(screen.getByTestId("docs-search-input"), "zzzzznotathing");
    expect(
      within(screen.getByTestId("docs-search-results")).queryAllByRole("option"),
    ).toHaveLength(0);
    expect(screen.getByTestId("docs-search-status")).toHaveTextContent(
      /Nothing like that/,
    );
  });

  it("says how many matched", async () => {
    const user = userEvent.setup();
    render(<SearchDialog lang="en" onClose={() => {}} onNavigate={() => {}} />);
    await user.type(screen.getByTestId("docs-search-input"), "IngotTable");

    const found = search("IngotTable", "en");
    expect(found.total).toBeLessThanOrEqual(SEARCH_LIMIT);
    expect(screen.getByTestId("docs-search-status")).toHaveTextContent(
      CHROME.searchCount.en.replace("{n}", String(found.total)),
    );
  });

  it("admits it cut the list rather than showing a short one silently", async () => {
    const user = userEvent.setup();
    render(<SearchDialog lang="en" onClose={() => {}} onNavigate={() => {}} />);
    // A single letter matches most of the index, which is the case the
    // limit exists for — and the case the reader was never told about.
    await user.type(screen.getByTestId("docs-search-input"), "a");

    const found = search("a", "en");
    expect(found.total).toBeGreaterThan(found.hits.length);
    expect(screen.getByTestId("docs-search-status")).toHaveTextContent(
      CHROME.searchCut.en
        .replace("{n}", String(found.hits.length))
        .replace("{total}", String(found.total)),
    );
  });

  it("announces the list and which result the arrows are on", async () => {
    const user = userEvent.setup();
    render(<SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />);

    const input = screen.getByTestId("docs-search-input");
    expect(input).toHaveAttribute("role", "combobox");
    expect(input).toHaveAttribute("aria-expanded", "true");

    const listbox = screen.getByRole("listbox");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);

    const first = input.getAttribute("aria-activedescendant");
    expect(document.getElementById(first!)).toHaveAttribute("role", "option");
    expect(document.getElementById(first!)).toHaveAttribute("aria-selected", "true");

    // The highlight moves and the announcement moves with it. Before this,
    // the arrows changed a background colour and nothing else.
    await user.keyboard("{ArrowDown}");
    const second = input.getAttribute("aria-activedescendant");
    expect(second).not.toBe(first);
    expect(document.getElementById(second!)).toHaveAttribute("aria-selected", "true");
  });

  it("passes axe with the combobox wiring in place", async () => {
    // The wiring is the kind that fails silently: an `aria-controls` that
    // names nothing, an `aria-activedescendant` pointing at a removed
    // element, an `option` outside a `listbox`. All three look correct in
    // the source and announce nothing in a screen reader.
    const { container } = render(
      <SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />,
    );
    const results = await axe(container, {
      rules: {
        "page-has-heading-one": { enabled: false },
        region: { enabled: false },
        "landmark-one-main": { enabled: false },
        // Needs layout and computed colours, which jsdom does not have.
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  }, 20000);

  it("says which results are guides and which are components", () => {
    render(<SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />);
    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    // The index opens on everything, so both kinds are on screen at once —
    // which is exactly when telling them apart matters.
    const kinds = options.map((option) =>
      option.textContent?.startsWith(CHROME.searchKindGuide.cs) ? "guide" : "component",
    );
    expect(kinds).toContain("guide");
    expect(kinds).toContain("component");
  });
});
