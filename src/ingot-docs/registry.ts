/**
 * Registry of doc pages — the single list the left menu is built from and
 * the one the ``ingot-doc-pages`` guard measures against.
 *
 * It is ONE list on purpose. If the menu came from a different source than
 * the check, they would drift: the guard would report green over a page
 * nobody can click through to. Adding a primitive? Add its ``…Doc`` here
 * and the guard lets you through — without it the gate fails, and that is
 * the point.
 */
import { A11yGuide } from "@/ingot-docs/guides/A11yGuide";
import { BasicsGuide } from "@/ingot-docs/guides/BasicsGuide";
import { ChangesGuide } from "@/ingot-docs/guides/ChangesGuide";
import { ComponentsGuide } from "@/ingot-docs/guides/ComponentsGuide";
import { DomainLayerGuide } from "@/ingot-docs/guides/DomainLayerGuide";
import { FormatsGuide } from "@/ingot-docs/guides/FormatsGuide";
import { IconsGuide } from "@/ingot-docs/guides/IconsGuide";
import { IntroGuide } from "@/ingot-docs/guides/IntroGuide";
import { TokensGuide } from "@/ingot-docs/guides/TokensGuide";
import { PublicPagesGuide } from "@/ingot-docs/guides/PublicPagesGuide";
import { ShellGuide } from "@/ingot-docs/guides/ShellGuide";
import { TranslationsGuide } from "@/ingot-docs/guides/TranslationsGuide";
import { UsageGuide } from "@/ingot-docs/guides/UsageGuide";
import { ButtonDoc } from "@/ingot-docs/pages/ButtonDoc";
import { CardDoc } from "@/ingot-docs/pages/CardDoc";
import { IngotAccentSwatchesDoc } from "@/ingot-docs/pages/IngotAccentSwatchesDoc";
import { IngotAttentionPanelDoc } from "@/ingot-docs/pages/IngotAttentionPanelDoc";
import { IngotBadgeDoc } from "@/ingot-docs/pages/IngotBadgeDoc";
import { IngotBreadcrumbsDoc } from "@/ingot-docs/pages/IngotBreadcrumbsDoc";
import { IngotCalloutDoc } from "@/ingot-docs/pages/IngotCalloutDoc";
import { IngotCheckboxDoc } from "@/ingot-docs/pages/IngotCheckboxDoc";
import { IngotCodeDoc } from "@/ingot-docs/pages/IngotCodeDoc";
import { IngotConfirmDoc } from "@/ingot-docs/pages/IngotConfirmDoc";
import { IngotDisclosureDoc } from "@/ingot-docs/pages/IngotDisclosureDoc";
import { IngotDrawerDoc } from "@/ingot-docs/pages/IngotDrawerDoc";
import { IngotEmptyStateDoc } from "@/ingot-docs/pages/IngotEmptyStateDoc";
import { IngotEyebrowDoc } from "@/ingot-docs/pages/IngotEyebrowDoc";
import { IngotFieldDoc } from "@/ingot-docs/pages/IngotFieldDoc";
import { IngotFieldInputDoc } from "@/ingot-docs/pages/IngotFieldInputDoc";
import { IngotFormDoc } from "@/ingot-docs/pages/IngotFormDoc";
import { IngotIconDoc } from "@/ingot-docs/pages/IngotIconDoc";
import { IngotListDoc } from "@/ingot-docs/pages/IngotListDoc";
import { IngotMarketingComparisonDoc } from "@/ingot-docs/pages/IngotMarketingComparisonDoc";
import { IngotMarketingCtaDoc } from "@/ingot-docs/pages/IngotMarketingCtaDoc";
import { IngotMarketingFaqDoc } from "@/ingot-docs/pages/IngotMarketingFaqDoc";
import { IngotMarketingPricingDoc } from "@/ingot-docs/pages/IngotMarketingPricingDoc";
import { IngotMarketingSectionHeadDoc } from "@/ingot-docs/pages/IngotMarketingSectionHeadDoc";
import { IngotMarketingSegmentsDoc } from "@/ingot-docs/pages/IngotMarketingSegmentsDoc";
import { IngotMarketingStepsDoc } from "@/ingot-docs/pages/IngotMarketingStepsDoc";
import { IngotMarketingTriDoc } from "@/ingot-docs/pages/IngotMarketingTriDoc";
import { IngotMegaMenuDoc } from "@/ingot-docs/pages/IngotMegaMenuDoc";
import { IngotMenuDoc } from "@/ingot-docs/pages/IngotMenuDoc";
import { IngotMetricsDoc } from "@/ingot-docs/pages/IngotMetricsDoc";
import { IngotModalDoc } from "@/ingot-docs/pages/IngotModalDoc";
import { IngotOpIconDoc } from "@/ingot-docs/pages/IngotOpIconDoc";
import { IngotOptionCardDoc } from "@/ingot-docs/pages/IngotOptionCardDoc";
import { IngotPageHeaderDoc } from "@/ingot-docs/pages/IngotPageHeaderDoc";
import { IngotPageHintDoc } from "@/ingot-docs/pages/IngotPageHintDoc";
import { IngotPageLayoutDoc } from "@/ingot-docs/pages/IngotPageLayoutDoc";
import { IngotPaginationDoc } from "@/ingot-docs/pages/IngotPaginationDoc";
import { IngotPopoverDoc } from "@/ingot-docs/pages/IngotPopoverDoc";
import { IngotProviderDoc } from "@/ingot-docs/pages/IngotProviderDoc";
import { IngotRadioGroupDoc } from "@/ingot-docs/pages/IngotRadioGroupDoc";
import { IngotRowActionsDoc } from "@/ingot-docs/pages/IngotRowActionsDoc";
import { IngotSearchInputDoc } from "@/ingot-docs/pages/IngotSearchInputDoc";
import { IngotSectionDoc } from "@/ingot-docs/pages/IngotSectionDoc";
import { IngotSegmentedDoc } from "@/ingot-docs/pages/IngotSegmentedDoc";
import { IngotSelectDoc } from "@/ingot-docs/pages/IngotSelectDoc";
import { IngotSideNavDoc } from "@/ingot-docs/pages/IngotSideNavDoc";
import { IngotStepCardDoc } from "@/ingot-docs/pages/IngotStepCardDoc";
import { IngotSwitchDoc } from "@/ingot-docs/pages/IngotSwitchDoc";
import { IngotTableDoc } from "@/ingot-docs/pages/IngotTableDoc";
import { IngotTabsDoc } from "@/ingot-docs/pages/IngotTabsDoc";
import { IngotToastDoc } from "@/ingot-docs/pages/IngotToastDoc";
import { IngotToolbarDoc } from "@/ingot-docs/pages/IngotToolbarDoc";
import { IngotTooltipDoc } from "@/ingot-docs/pages/IngotTooltipDoc";
import { IngotTopNavDoc } from "@/ingot-docs/pages/IngotTopNavDoc";
import { IngotUserMenuDoc } from "@/ingot-docs/pages/IngotUserMenuDoc";
import type { IngotDocPage, IngotGuidePage } from "@/ingot-docs/types";

/**
 * Pages that are NOT about a component — the intro, Translations, and the
 * other guides.
 *
 * **A list of its own, not mixed into ``INGOT_DOC_PAGES``.** That one is
 * paired with exports from ``@/ingot`` 1 : 1 in BOTH directions and the
 * ``ingot-doc-pages`` guard stands on that bidirectionality: a component
 * without a page is a lie just like a page without a component. An intro
 * added to the same array would be reported by the guard as a page about
 * something the barrel does not export — and the only way to silence it
 * would be to loosen that bidirectionality. That would lose the one thing
 * that forces the doc web to stay complete.
 *
 * The first item is also the doc web's **default screen**.
 */
/**
 * The order sets the number in the menu and the sequence of the prev/next
 * footer, and it is a reader's order: first what the kit IS (group
 * ``system``), then how screens are built from it (``app``), finally what
 * is expected of an author (``rules``).
 *
 * **Pages of ONE group must stand next to each other.** The menu does not
 * reorder groups — it prints them in this order and inserts a heading at
 * every change. A scattered order would therefore produce a group twice.
 */
export const INGOT_GUIDE_PAGES: readonly IngotGuidePage[] = [
  IntroGuide,
  BasicsGuide,
  // The palette as data, right after the page that explains what a token
  // is for. A reader who has just read "name the token, not the utility"
  // is exactly the reader who wants the list.
  TokensGuide,
  // Components overview — the individual primitives nest under it in the
  // menu, so it stands before Icons, not after them.
  ComponentsGuide,
  IconsGuide,
  ShellGuide,
  // Marketing blocks of the public web. The blocks THEMSELVES have had
  // their own component pages since the move into the kit; this guide is
  // about their composition — which rules the page holds rather than the
  // component.
  PublicPagesGuide,
  UsageGuide,
  // What in the kit is not the kit. It belongs next to the usage rules
  // because it answers the same kind of question: not "how do I call this"
  // but "does this belong to me at all".
  DomainLayerGuide,
  // What shipped when. It sits with the rules because it answers the same
  // kind of question: not how to call a thing, but what you may rely on.
  ChangesGuide,
  FormatsGuide,
  A11yGuide,
  TranslationsGuide,
];

export const INGOT_DOC_PAGES: readonly IngotDocPage[] = [
  // Alphabetical by the name the page shows — that is, without the
  // prefix: Badge, Breadcrumbs, Button… The menu is an index of some
  // thirty items and an index is searched alphabetically, not by the
  // order whoever wrote it imagined.
  //
  // Sorted by the DISPLAYED name, not the export name — otherwise Button
  // and Card would end up before everything else because they have no
  // prefix. A test guards the order; it is not hit by hand.
  IngotAccentSwatchesDoc,
  IngotAttentionPanelDoc,
  IngotBadgeDoc,
  IngotBreadcrumbsDoc,
  ButtonDoc,
  IngotCalloutDoc,
  CardDoc,
  IngotCheckboxDoc,
  IngotCodeDoc,
  IngotConfirmDoc,
  IngotDisclosureDoc,
  IngotDrawerDoc,
  IngotEmptyStateDoc,
  IngotEyebrowDoc,
  IngotFieldDoc,
  IngotFieldInputDoc,
  IngotFormDoc,
  IngotIconDoc,
  IngotListDoc,
  IngotMarketingComparisonDoc,
  IngotMarketingCtaDoc,
  IngotMarketingFaqDoc,
  IngotMarketingPricingDoc,
  IngotMarketingSectionHeadDoc,
  IngotMarketingSegmentsDoc,
  IngotMarketingStepsDoc,
  IngotMarketingTriDoc,
  IngotMegaMenuDoc,
  IngotMenuDoc,
  IngotMetricsDoc,
  IngotModalDoc,
  IngotOpIconDoc,
  IngotOptionCardDoc,
  IngotPageHeaderDoc,
  IngotPageHintDoc,
  IngotPageLayoutDoc,
  IngotPaginationDoc,
  IngotPopoverDoc,
  IngotProviderDoc,
  IngotRadioGroupDoc,
  IngotRowActionsDoc,
  IngotSearchInputDoc,
  IngotSectionDoc,
  IngotSegmentedDoc,
  IngotSelectDoc,
  IngotSideNavDoc,
  IngotStepCardDoc,
  IngotSwitchDoc,
  IngotTableDoc,
  IngotTabsDoc,
  IngotToastDoc,
  IngotToolbarDoc,
  IngotTooltipDoc,
  IngotTopNavDoc,
  IngotUserMenuDoc,
];
