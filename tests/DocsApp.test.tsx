/**
 * Shell of the Ingot doc web.
 *
 * The `ingot-doc-pages` guard checks FILES — that a primitive has a page,
 * that the page has a module and that the module imports from `@/ingot`.
 * What the guard by principle cannot see is whether it all renders at
 * all; "the page exists" and "the page mounts" are two different claims.
 *
 * Hence these tests:
 *
 * 1. **The menu has as many items as there are primitives** — and takes
 *    them from the registry, so a new primitive shows up in the menu by
 *    itself.
 * 2. **The demo really renders.** The real component is rendered, not a
 *    description of it.
 * 3. **An anchor in the right column must not switch the page.** The
 *    router runs on the hash (`#/IngotModal`), but "On this page" anchors
 *    to `#ukazka` inside the same page. The first version took such a hash
 *    as a route too, so clicking an anchor threw the content back to the
 *    first primitive.
 *
 * Content, pages without a component and the code listing:
 *
 * 4. **Sections with content really carry content.** `useWhen` /
 *    `avoidWhen` / `a11y` / `i18n` are required fields, so a page without
 *    them is refused by `tsc` — but an empty array (`[]`) PASSES the
 *    typecheck. The type can enforce that a section exists; that there is
 *    something in it, a test must enforce.
 * 5. **The right column links to sections that are on the page.**
 * 6. **The intro is the default screen** and an unknown hash falls to it.
 * 7. **Guides must not mix in among components**, not even in the DOM.
 * 8. **The code listing must come from the real module.** `?raw` returns
 *    the WHOLE file, so it has to contain the imports and the function
 *    header too.
 *
 * Languages and theme:
 *
 * 9. **Every translatable text exists in ALL languages and is non-empty.**
 *    `Record<DocLang, …>` enforces that the key is there; not that
 *    something is behind it.
 * 10. **Only languages the platform enabled AND the doc web has text for
 *     are offered.** Switching to an empty page is worse than not offering
 *     the language — and when the API does not answer, what the bundle
 *     carries is kept.
 * 11. **The theme puts `.dark` on `<html>`** and the choice survives a
 *     reload.
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CHROME } from "@/ingot-docs/chrome";
import { DocsApp } from "@/ingot-docs/DocsApp";
import { DOC_LANGS, type DocLang } from "@/ingot-docs/lang";
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES, INGOT_GUIDE_PAGES } from "@/ingot-docs/registry";
import { ACCENT_CHOICES } from "@/lib/accent";

const LANG_KEY = "forgmatic.ingot.docs.lang";
const THEME_KEY = "forgmatic.ingot.theme";
const ACCENT_KEY = "forgmatic.ingot.accent";

/** Response of ``/public/languages`` — NEW every time, a body cannot be read twice. */
function languagesResponse(codes: readonly string[]): Response {
  return new Response(
    JSON.stringify({
      languages: codes.map((code) => ({
        code,
        label: code.toUpperCase(),
        is_default: code === "cs",
        source: "builtin",
      })),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("DocsApp", () => {
  beforeEach(() => {
    window.location.hash = "";
    // The language is pinned on purpose: jsdom reports navigator.language
    // "en-US", so without it the default language would depend on the
    // environment, not on the test.
    window.localStorage.setItem(LANG_KEY, "cs");
    window.localStorage.removeItem(THEME_KEY);
    window.localStorage.removeItem(ACCENT_KEY);
    document.documentElement.classList.remove("dark");
    delete document.documentElement.dataset.accent;
    // Most tests are not about languages; keep them off the network entirely.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs", "en"]))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("lists every primitive from the registry in the menu", () => {
    // The component list is visible only in its section — collapsed elsewhere.
    window.location.hash = "#/komponenty";
    render(<DocsApp />);
    // Components nest under the overview page in the "System" group.
    const nav = screen.getByRole("navigation", { name: CHROME.groupSystem.cs });
    for (const page of INGOT_DOC_PAGES) {
      // The menu shows the name without the prefix; the address keeps the full name.
      expect(within(nav).getByText(displayName(page.name))).toBeInTheDocument();
    }
  });

  it("renders the live demo of the selected primitive, not just its description", () => {
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 1, name: "EmptyState" }),
    ).toBeInTheDocument();
    // The real IngotEmptyState, not text about it: its own testid.
    expect(screen.getByTestId("docs-empty")).toBeInTheDocument();
    expect(screen.getByText("Zatím tu nic není")).toBeInTheDocument();
  });

  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page] as const))(
    "%s má v každém jazyce a v každé povinné sekci aspoň jednu položku",
    (_name, page) => {
      // Record<DocLang, …> enforces that the KEY exists. Not that there is
      // something behind it — and an empty section is exactly the half
      // truth that got the spec headers deleted in this repo.
      // Statuses and versions feed the badges next to the heading — a page
      // without them would silently promise a stability nobody declared.
      expect(["stable", "beta"]).toContain(page.status);
      expect(page.version).toMatch(/^\d+\.\d+$/);
      // The selector and the tokens are a contract for review: what to call
      // the element and what a token change breaks.
      expect(page.tag.trim().length).toBeGreaterThan(0);
      expect(page.tokens.length).toBeGreaterThan(0);
      for (const lang of DOC_LANGS) {
        expect(page.summary[lang].trim().length).toBeGreaterThan(0);
        expect(page.useWhen[lang].length).toBeGreaterThan(0);
        expect(page.avoidWhen[lang].length).toBeGreaterThan(0);
        expect(page.a11y[lang].length).toBeGreaterThan(0);
        expect(page.i18n[lang].length).toBeGreaterThan(0);
        if (page.limits) expect(page.limits[lang].length).toBeGreaterThan(0);
        for (const row of page.props) {
          expect(row.note[lang]).toBeTruthy();
        }
        for (const group of page.extraProps ?? []) {
          expect(group.note[lang]).toBeTruthy();
          for (const row of group.props) expect(row.note[lang]).toBeTruthy();
        }
      }
    },
  );

  it.each(INGOT_GUIDE_PAGES.map((guide) => [guide.slug, guide] as const))(
    "průvodce %s má text ve všech jazycích",
    (_slug, guide) => {
      for (const lang of DOC_LANGS) {
        expect(guide.title[lang].trim().length).toBeGreaterThan(0);
        expect(guide.summary[lang].trim().length).toBeGreaterThan(0);
        expect(guide.sections.length).toBeGreaterThan(0);
        for (const section of guide.sections) {
          expect(section.title[lang].trim().length).toBeGreaterThan(0);
          expect(section.body[lang]).toBeTruthy();
        }
      }
    },
  );

  it("renders sections with content and links to them from the right column", () => {
    window.location.hash = "#/IngotTable";
    render(<DocsApp />);

    for (const title of [
      CHROME.demo.cs,
      CHROME.useWhen.cs,
      CHROME.avoidWhen.cs,
      CHROME.props.cs,
      CHROME.a11y.cs,
      CHROME.tokens.cs,
      CHROME.i18n.cs,
      // IngotTable is the only page with the optional `limits` section.
      CHROME.limits.cs,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }

    // The right column is derived from the same array that rendered the
    // content — every anchor must therefore point to a section that really
    // is on the page.
    const aside = screen.getByRole("complementary", {
      name: CHROME.onThisPage.cs,
    });
    const anchors = within(aside).getAllByRole("link");
    expect(anchors).toHaveLength(8);
    for (const anchor of anchors) {
      const id = anchor.getAttribute("href")?.slice(1);
      expect(id).toBeTruthy();
      expect(document.getElementById(id as string)).not.toBeNull();
    }
  });

  it("lists the IngotColumn type props on the IngotTable page too", () => {
    window.location.hash = "#/IngotTable";
    render(<DocsApp />);

    // `cell` and `cellClassName` do not live on IngotTable but on IngotColumn.
    const extra = screen.getByTestId("docs-props-ingotcolumn-row");
    expect(within(extra).getByText("cell")).toBeInTheDocument();
    expect(within(extra).getByText("cellClassName")).toBeInTheDocument();
  });

  it("opens the intro without a hash, not the first primitive in the registry", () => {
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INGOT_GUIDE_PAGES[0].title.cs,
      }),
    ).toBeInTheDocument();
  });

  it("an unknown hash falls back to the intro, not to the first component", () => {
    window.location.hash = "#/NeexistujiciStranka";
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INGOT_GUIDE_PAGES[0].title.cs,
      }),
    ).toBeInTheDocument();
  });

  it("renders the Translations page as a standalone page without a component", () => {
    window.location.hash = "#/preklady";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Překlady" }),
    ).toBeInTheDocument();
    // A page without a component has NO demo and no props table — that is
    // the whole reason it is its own type and not another IngotDocPage.
    expect(
      screen.queryByRole("heading", { level: 2, name: CHROME.demo.cs }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("docs-props")).not.toBeInTheDocument();
  });

  it("splits the menu into groups and puts every guide into exactly one", () => {
    // In the components section the index is expanded — the full link count.
    window.location.hash = "#/komponenty";
    render(<DocsApp />);

    const navs = [
      CHROME.groupSystem.cs,
      CHROME.groupApp.cs,
      CHROME.groupRules.cs,
    ].map((name) => screen.getByRole("navigation", { name }));

    // The total has to add up: every guide in one group plus the components
    // nested under the overview page.
    const links = navs.flatMap((nav) => within(nav).getAllByRole("link"));
    expect(links).toHaveLength(
      INGOT_GUIDE_PAGES.length + INGOT_DOC_PAGES.length,
    );
    for (const guide of INGOT_GUIDE_PAGES) {
      expect(screen.getAllByTestId(`docs-nav-${guide.slug}`)).toHaveLength(1);
    }
  });

  it("sorts components alphabetically by the name it shows", () => {
    // An index of some thirty items is walked alphabetically. By the
    // DISPLAYED name: by export name Button and Card would end up first
    // because they have no prefix.
    const shown = INGOT_DOC_PAGES.map((page) => displayName(page.name));
    const sorted = [...shown].sort((a, b) => a.localeCompare(b, "en"));
    expect(shown).toEqual(sorted);
  });

  it("numbers guides by their order in the registry, not by hand", () => {
    render(<DocsApp />);
    INGOT_GUIDE_PAGES.forEach((guide, index) => {
      expect(screen.getByTestId(`docs-nav-${guide.slug}`)).toHaveTextContent(
        String(index).padStart(2, "0"),
      );
    });
  });

  it("nests components under the overview page, not next to it", () => {
    window.location.hash = "#/komponenty";
    render(<DocsApp />);

    // The sublist hangs on the overview item — nesting is structure, so it
    // must be visible from the DOM too, not only from indentation.
    const catalogue = screen.getByTestId("docs-nav-komponenty");
    const sublist = catalogue.closest("li")?.querySelector("ul");
    expect(sublist).not.toBeNull();
    expect(within(sublist as HTMLElement).getAllByRole("link")).toHaveLength(
      INGOT_DOC_PAGES.length,
    );
  });

  it("outside the components section the index is collapsed, on a component page expanded", () => {
    // Owner instruction of 2026-09-02: 31 expanded items on every page
    // turned the menu into an index in which the other groups had to be
    // found by scrolling.
    window.location.hash = "#/preklady";
    const first = render(<DocsApp />);
    expect(
      screen.getByTestId("docs-nav-komponenty").closest("li")?.querySelector("ul"),
    ).toBeNull();
    first.unmount();

    window.location.hash = "#/IngotTable";
    render(<DocsApp />);
    expect(
      screen.getByTestId("docs-nav-komponenty").closest("li")?.querySelector("ul"),
    ).not.toBeNull();
  });

  it("no guide slug collides with a primitive name", () => {
    const names = new Set(INGOT_DOC_PAGES.map((page) => page.name));
    for (const guide of INGOT_GUIDE_PAGES) {
      expect(names.has(guide.slug)).toBe(false);
    }
    const slugs = INGOT_GUIDE_PAGES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("shows the preview and switches to the source via the Preview/Code tabs", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    // The default view is the preview on the stage; the source is not rendered.
    expect(screen.getByTestId("docs-demo-stage")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-source")).not.toBeInTheDocument();

    const codeTab = screen.getByRole("tab", { name: CHROME.codeTab.cs });
    expect(codeTab).toHaveAttribute("aria-selected", "false");

    await user.click(codeTab);

    expect(codeTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("docs-source")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-demo-stage")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: CHROME.previewTab.cs }));
    expect(screen.getByTestId("docs-demo-stage")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-source")).not.toBeInTheDocument();
  });

  it("copies the demo source to the clipboard with the Copy button", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    await user.click(screen.getByTestId("docs-copy"));

    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotEmptyState");
    expect(await window.navigator.clipboard.readText()).toBe(
      page!.demoSource,
    );
    // The confirmation shows in the button label and disappears again after a moment.
    expect(screen.getByTestId("docs-copy")).toHaveTextContent(
      CHROME.copiedCode.cs,
    );
  });

  it("renders the Tokens section with the component token list", () => {
    window.location.hash = "#/IngotBadge";
    render(<DocsApp />);

    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.tokens.cs }),
    ).toBeInTheDocument();
    const list = screen.getByTestId("docs-tokens");
    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotBadge");
    for (const token of page!.tokens) {
      expect(within(list).getByText(token)).toBeInTheDocument();
    }
  });

  it("ukazuje vedle nadpisu selektor prvku", () => {
    window.location.hash = "#/IngotBadge";
    render(<DocsApp />);
    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotBadge");
    expect(screen.getByTestId("docs-tag")).toHaveTextContent(page!.tag);
  });

  it("ukazuje vedle nadpisu badge stavu a verze", () => {
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    const page = INGOT_DOC_PAGES.find((p) => p.name === "IngotEmptyState");
    const statusLabel =
      page!.status === "stable" ? CHROME.statusStable.cs : CHROME.statusBeta.cs;
    expect(screen.getByTestId("docs-status")).toHaveTextContent(statusLabel);
    expect(screen.getByTestId("docs-version")).toHaveTextContent(
      `v${page!.version}`,
    );
  });

  it("a guide has neither a status nor a version badge", () => {
    window.location.hash = "#/uvod";
    render(<DocsApp />);
    expect(screen.queryByTestId("docs-status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("docs-version")).not.toBeInTheDocument();
  });

  // --- prev/next footer -----------------------------------------------

  it("the first page has no Previous and the last has no Next", () => {
    window.location.hash = `#/${INGOT_GUIDE_PAGES[0].slug}`;
    const { unmount } = render(<DocsApp />);
    expect(screen.queryByTestId("docs-prev")).not.toBeInTheDocument();
    expect(screen.getByTestId("docs-next")).toBeInTheDocument();
    unmount();

    const last = INGOT_DOC_PAGES[INGOT_DOC_PAGES.length - 1];
    window.location.hash = `#/${last.name}`;
    render(<DocsApp />);
    expect(screen.getByTestId("docs-prev")).toBeInTheDocument();
    expect(screen.queryByTestId("docs-next")).not.toBeInTheDocument();
  });

  it("the footer leads from the last guide to the first component", () => {
    const lastGuide = INGOT_GUIDE_PAGES[INGOT_GUIDE_PAGES.length - 1];
    window.location.hash = `#/${lastGuide.slug}`;
    render(<DocsApp />);

    const next = screen.getByTestId("docs-next");
    expect(next).toHaveAttribute("href", `#/${INGOT_DOC_PAGES[0].name}`);
    const prev = screen.getByTestId("docs-prev");
    expect(prev).toHaveAttribute(
      "href",
      `#/${INGOT_GUIDE_PAGES[INGOT_GUIDE_PAGES.length - 2].slug}`,
    );
  });

  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page] as const))(
    "%s vypisuje zdroj ukázky ze SKUTEČNÉHO modulu, ne z ručního řetězce",
    (name, page) => {
      // A ?raw import returns the WHOLE file, so it has to contain its
      // imports and the function header too — not just a piece of JSX that
      // could be copied.
      expect(page.demoSource).toContain('from "@/ingot"');
      expect(page.demoSource).toContain("export function Demo()");
      expect(page.demoSource).toContain(name);
    },
  );

  it("leaves the page alone when the hash points to an anchor inside it", () => {
    window.location.hash = "#/IngotModal";
    render(<DocsApp />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Modal" }),
    ).toBeInTheDocument();

    window.location.hash = "#ukazka";
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Modal" }),
    ).toBeInTheDocument();
  });

  // --- jazyky (KAN-627) ----------------------------------------------

  it("switches content and shell to the chosen language and remembers the choice", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/IngotEmptyState";
    render(<DocsApp />);

    const enButton = await screen.findByTestId("docs-lang-en");
    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.demo.cs }),
    ).toBeInTheDocument();

    await user.click(enButton);

    // Shell and page content both — not just one of them.
    expect(
      screen.getByRole("heading", { level: 2, name: CHROME.demo.en }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: CHROME.codeTab.en }),
    ).toBeInTheDocument();

    const emptyState = INGOT_DOC_PAGES.find(
      (page) => page.name === "IngotEmptyState",
    );
    expect(screen.getByText(emptyState!.summary.en)).toBeInTheDocument();

    expect(window.localStorage.getItem(LANG_KEY)).toBe("en");
    // `index.html` ships lang="cs"; after a switch it would be a lie a
    // screen reader pays for and nobody sees.
    expect(document.documentElement.lang).toBe("en");
  });

  it("offers only the languages the platform enabled", async () => {
    // The platform has only Czech enabled → nothing to switch, and the
    // switch is not offered at all. A choice with a single option promises
    // a choice that is not there.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs"]))),
    );
    render(<DocsApp />);
    await waitFor(() => {
      expect(screen.queryByTestId("docs-lang")).not.toBeInTheDocument();
    });
  });

  it("does not offer a platform language the doc web has no text for", async () => {
    // The platform may have a language enabled that the doc web is not
    // translated into. Switching to an empty page is worse than not
    // offering the language.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(languagesResponse(["cs", "en", "de"]))),
    );
    render(<DocsApp />);

    const picker = await screen.findByTestId("docs-lang");
    const values = within(picker)
      .getAllByRole("radio")
      .map((button) => button.textContent?.toLowerCase());
    expect(values).toEqual(["cs", "en"]);
    expect(values).not.toContain("de");
    for (const value of values) {
      expect(DOC_LANGS).toContain(value as DocLang);
    }
  });

  it("when the platform cannot be asked, offers what it has text for", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    render(<DocsApp />);

    const picker = await screen.findByTestId("docs-lang");
    const values = within(picker)
      .getAllByRole("radio")
      .map((button) => button.textContent?.toLowerCase());
    expect(values).toEqual([...DOC_LANGS]);
  });

  // --- motiv (KAN-627) -----------------------------------------------

  it("puts .dark on <html> and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    expect(document.documentElement).not.toHaveClass("dark");

    await user.click(screen.getByTestId("docs-theme-dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");

    await user.click(screen.getByTestId("docs-theme-light"));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("respects the stored theme choice on load", () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    render(<DocsApp />);
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("docs-theme-dark")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  // --- akcent (KAN-648) -----------------------------------------------

  it("offers every accent family and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    // The dots come from ACCENT_CHOICES, so a new family shows up by itself.
    for (const choice of ACCENT_CHOICES) {
      expect(screen.getByTestId(`accent-swatch-${choice}`)).toBeInTheDocument();
    }
    expect(document.documentElement.dataset.accent).toBeUndefined();

    await user.click(screen.getByTestId("accent-swatch-slate"));
    expect(document.documentElement.dataset.accent).toBe("slate");
    expect(window.localStorage.getItem(ACCENT_KEY)).toBe("slate");

    // Back to the default family → the attribute disappears, it is not rewritten to "blue".
    await user.click(screen.getByTestId("accent-swatch-blue"));
    expect(document.documentElement.dataset.accent).toBeUndefined();
    expect(window.localStorage.getItem(ACCENT_KEY)).toBe("blue");
  });

  it("respects the stored accent choice on load", () => {
    window.localStorage.setItem(ACCENT_KEY, "orange");
    render(<DocsApp />);
    expect(document.documentElement.dataset.accent).toBe("orange");
    expect(screen.getByTestId("accent-swatch-orange")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("the accent survives a theme switch — the cascade does not recompute it", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    await user.click(screen.getByTestId("accent-swatch-violet"));
    await user.click(screen.getByTestId("docs-theme-dark"));

    // The family does not change, only which of its blocks the cascade
    // picks. If the theme rewrote the accent (the prototype ``applyTheme``
    // called ``applyAccent``), this attribute would fall to the default
    // after a switch.
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.dataset.accent).toBe("violet");
  });

  // The shell on a narrow viewport (drawer with the menu):
  //
  // Column widths CANNOT be verified here — jsdom does no layout, so every
  // `getBoundingClientRect` returns zeros and a test for "the content is
  // at least 360 px wide" would pass over a broken page too. What can be
  // verified, and what was really missing in that regression, is the PATH:
  // below `md` the menu is hidden and the only way between pages leads
  // through this button. If it vanished, the doc web would have no
  // navigation on mobile at all.
  it("opens the menu in a drawer and offers the whole navigation there", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    expect(screen.queryByTestId("docs-nav-drawer")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("docs-menu-open"));

    const drawer = screen.getByTestId("docs-nav-drawer");
    // The groups are the same as in the column — the drawer is another
    // place, not another list. If it kept its own, they would drift.
    for (const group of [
      CHROME.groupSystem.cs,
      CHROME.groupApp.cs,
      CHROME.groupRules.cs,
    ]) {
      expect(
        within(drawer).getByRole("navigation", { name: group }),
      ).toBeInTheDocument();
    }
    // The switches are there too: in the bar `md:hidden` hides them below
    // `md`, so without them neither theme nor language could be switched
    // on mobile.
    expect(within(drawer).getByTestId("docs-drawer-theme")).toBeInTheDocument();
  });

  it("the drawer closes after a page is picked", async () => {
    const user = userEvent.setup();
    render(<DocsApp />);

    await user.click(screen.getByTestId("docs-menu-open"));
    const drawer = screen.getByTestId("docs-nav-drawer");

    await user.click(within(drawer).getByTestId("docs-drawer-nav-zaklady"));

    // Staying open over the content the reader just chose is the one thing
    // they do not want after a menu click.
    await waitFor(() => {
      expect(screen.queryByTestId("docs-nav-drawer")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { level: 1, name: "Základy" }),
    ).toBeInTheDocument();
  });

  it("the Basics page shows all five families", () => {
    window.location.hash = "#/zaklady";
    render(<DocsApp />);

    const table = screen.getByTestId("docs-accent-families");
    // The rows are generated from ACCENT_CHOICES — a family added to the kit
    // shows up on the page without anyone having to remember it.
    expect(
      table.querySelectorAll("tbody tr").length,
    ).toBe(ACCENT_CHOICES.length);
    for (const choice of ACCENT_CHOICES) {
      expect(table.querySelectorAll(`[data-accent="${choice}"]`).length).toBe(
        4,
      );
    }
  });
});
