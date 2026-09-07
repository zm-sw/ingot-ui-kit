/**
 * The page-layout guide shows whole screens, so it is tested like one.
 *
 * The demos on a component page are fragments — one primitive doing one
 * thing. These are complete screens: a header, a toolbar, a table, paging;
 * a detail with facts; a form with an action bar. That is where the
 * accessibility mistakes actually live, because they are mistakes of
 * assembly rather than of a component: a table with no caption, two
 * headings that both claim to be the page's, a control nobody named.
 *
 * The screens also make a promise about width, and a promise made in a
 * guide is exactly the kind that stops being true quietly.
 */
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { IngotProvider } from "@/ingot";
import { LayoutsGuide } from "@/ingot-docs/guides/LayoutsGuide";
import { DOC_LANGS, type DocLang } from "@/ingot-docs/lang";

// Rules a fragment cannot satisfy, with the same reasoning as the demo
// sweep: the page frame around this content is the doc web's job, and
// contrast needs computed colours jsdom does not have.
const OFF = {
  "page-has-heading-one": { enabled: false },
  region: { enabled: false },
  "landmark-one-main": { enabled: false },
  "landmark-unique": { enabled: false },
  "color-contrast": { enabled: false },
};

async function renderSection(id: string, lang: DocLang) {
  const body = (await LayoutsGuide.body()).default;
  return render(<IngotProvider lang={lang}>{body[id][lang]}</IngotProvider>);
}

describe("the page layouts", () => {
  it.each(LayoutsGuide.sections.map((section) => section.id))(
    "%s passes axe as a whole screen",
    async (id) => {
      const { container } = await renderSection(id, "cs");
      const results = await axe(container, { rules: OFF });
      expect(results.violations.map((violation) => violation.id)).toEqual([]);
    },
    20000,
  );

  it.each(DOC_LANGS)("has every section in %s", async (lang) => {
    const body = (await LayoutsGuide.body()).default;
    for (const section of LayoutsGuide.sections) {
      expect(body[section.id][lang]).toBeTruthy();
      expect(section.title[lang].trim().length).toBeGreaterThan(0);
    }
  });

  // Each screen names the width it is an example of. A guide that shows a
  // list at reading width teaches the opposite of what it says.
  it.each([
    ["docs-layout-list", "max-w-page", false],
    ["docs-layout-detail", "max-w-page-wide", true],
    ["docs-layout-settings", "max-w-page-reading", true],
    ["docs-layout-empty", "max-w-page-card", true],
  ] as const)("%s is drawn at %s", async (testId, expected, present) => {
    const id = testId.replace("docs-layout-", "");
    const section = {
      list: "seznam",
      detail: "detail",
      settings: "nastaveni",
      empty: "prazdny-modul",
    }[id] as string;
    await renderSection(section, "cs");
    const content = screen.getByTestId(testId).firstElementChild;
    expect(content?.className.includes(expected)).toBe(present);
  });
});
