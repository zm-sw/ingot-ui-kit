/**
 * Every demo on the doc web, through axe (KAN-846).
 *
 * The kit's accessibility bar has been enforced one assertion at a time —
 * a focus trap here, an `aria-current` there — which catches what somebody
 * thought to check. This sweep catches the rest: a label that lost its
 * input, a heading level skipped, a colour-only state, an `aria-*`
 * attribute on a role that does not take it.
 *
 * It runs over the DEMOS rather than a fixture of its own, and that is the
 * point. The demo is the tree the doc web really renders and the one a
 * consumer copies; a fixture would drift from both, and would let a
 * primitive pass the sweep in a shape nobody ever uses.
 *
 * Two limits are worth stating, because a green sweep here is not a
 * promise of an accessible product:
 *
 * - **jsdom has no layout**, so colour contrast, focus visibility and
 *   anything measured in pixels cannot be judged. The palette's contrast is
 *   measured separately, over the real token values.
 * - **A demo is a fragment**, not a page: rules about landmarks and about a
 *   document having one `h1` are off, because the page frame around the
 *   fragment is the doc web's job and is measured in its own test.
 */
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { IngotProvider } from "@/ingot";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";

// Rules a fragment cannot satisfy, and the reason each one is off. Any
// other violation fails the test.
const OFF = {
  "page-has-heading-one": { enabled: false },
  region: { enabled: false },
  "landmark-one-main": { enabled: false },
  "landmark-unique": { enabled: false },
  // Contrast needs layout and computed colours; jsdom has neither, so axe
  // would report "incomplete" on every element. The palette is measured
  // against the real token values in the badge and accent tests.
  "color-contrast": { enabled: false },
};

describe("the doc web's demos pass axe", () => {
  it.each(INGOT_DOC_PAGES.map((page) => [page.name, page.demo] as const))(
    "%s",
    async (_name, load) => {
      // The demo arrives on demand now, so the sweep asks for it the way
      // the page does. Awaiting it here also means a demo that fails to
      // load fails this test rather than rendering as an empty container
      // that passes every accessibility rule by having nothing in it.
      const { default: Demo } = await load();
      // The provider is what a consumer mounts, so the sweep sees the
      // labels a real screen sees rather than the English fallbacks.
      const { container } = render(
        <IngotProvider lang="cs">
          <Demo lang="cs" />
        </IngotProvider>,
      );

      const results = await axe(container, { rules: OFF });
      const violations = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.html.slice(0, 120)),
      }));
      expect(violations).toEqual([]);
    },
    20000,
  );
});
