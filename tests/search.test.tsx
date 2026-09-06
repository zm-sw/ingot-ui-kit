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
 */
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchDialog } from "@/ingot-docs/SearchDialog";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import { componentSlug } from "@/ingot-docs/routes";
import { SEARCHABLE_PAGES, fold, search } from "@/ingot-docs/search";

const titles = (query: string, lang: "cs" | "en" = "cs") =>
  search(query, lang, 50).map((hit) => hit.title);

describe("the index", () => {
  it("covers every page, so a miss is a miss and not a gap", () => {
    expect(search("", "cs", 500)).toHaveLength(SEARCHABLE_PAGES);
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
    const hit = search("IngotTable", "cs")[0];
    expect(hit.path).toBe(`/komponenty/${componentSlug("IngotTable")}`);
    expect(search("IngotTable", "en")[0].path).toBe(
      `/en/komponenty/${componentSlug("IngotTable")}`,
    );
  });
});

describe("the dialog", () => {
  it("opens on the whole list, not on an empty box", () => {
    render(<SearchDialog lang="cs" onClose={() => {}} onNavigate={() => {}} />);
    const results = screen.getByTestId("docs-search-results");
    expect(within(results).getAllByRole("link").length).toBeGreaterThan(0);
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
    const results = screen.getByTestId("docs-search-results");
    expect(within(results).queryAllByRole("link")).toHaveLength(0);
    expect(within(results).getByText(/Nothing like that/)).toBeInTheDocument();
  });
});
