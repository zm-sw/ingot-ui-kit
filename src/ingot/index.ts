/**
 * Ingot UI Kit — the public API of `@forgmatic/ingot`.
 *
 * Shared primitives for the Forgmatic admin screens, the public web and,
 * in time, third-party apps built for Forgmatic: one source of truth for
 * how a form, a dialog, a table or a page frame looks and behaves. A
 * primitive is added when a concrete screen asks for it — a primitive
 * without a consumer is an unwired promise.
 *
 * Every primitive holds the accessibility bar decided by the owner on
 * 2026-08-25: focus trap, ESC, scroll lock, `role` / `aria-*`, and focus
 * returned to the opener.
 *
 * **This file IS the public API.** Whatever is not re-exported here is a
 * module internal and may be renamed or split without notice; a consumer
 * imports `@forgmatic/ingot`, never `@forgmatic/ingot/IngotTable`. Inside
 * the kit, deep relative paths are fine — the rule is about consumers.
 *
 * Breaking changes: a primitive's version on its doc page moves (major)
 * and the change ships with a deprecation path, because consumers no
 * longer live in this repository. The `version-guard` CI check refuses a
 * change to `src/ingot/` that does not move a doc-page version.
 */
// --- kit-wide defaults --------------------------------------------------
//
// The kit has no translation namespace. The handful of labels a primitive
// has to say itself (undo, hint bulb, secret placeholder) come from this
// provider — English without one, so a consumer in another language is
// never handed Czech by default.
export {
  IngotProvider,
  useIngotLabels,
  INGOT_LABELS,
  type IngotLang,
  type IngotLabels,
} from "./IngotProvider";

// --- atoms without the Ingot prefix ---------------------------------
//
// Button and Card predate the prefix convention. Renaming them would touch
// JSX in every consumer for no gain in behaviour, so the doc-page guard
// knows them by name (DOCUMENTED_UNPREFIXED in scripts/checks.mjs) and
// demands a doc page for them like for everything else.
export { Button } from "./Button";
export { Card, CardHeader, CardTitle } from "./Card";

// --- icons ------------------------------------------------------------
//
// Two sets, not one: the interface set (``IngotIcon``) colours and scales
// freely, while a production-operation icon carries a key the backend
// stores and has its own typesetting rules. One shared component would
// have to loosen those rules to the intersection of both.
export {
  IngotIcon,
  INGOT_ICON_NAMES,
  type IngotIconName,
} from "./IngotIcon";
export {
  IngotOpIcon,
  INGOT_OP_ICON_KEYS,
  type IngotOpIconVariant,
} from "./IngotOpIcon";

// --- page shell -------------------------------------------------------
//
// The doc web teaches the kit, so a page that composes its own classes
// contradicts it by example. These five are what it used to compose:
// heading, section, list, side menu and inline code.
export {
  IngotPageHeader,
  INGOT_PAGE_TITLE_CLASS,
  INGOT_PAGE_DESC_CLASS,
} from "./IngotPageHeader";
export { IngotSection } from "./IngotSection";
// The small mono caption every component used to draw by hand; one
// primitive so the idiom has one size and one weight.
export {
  IngotEyebrow,
  type IngotEyebrowSize,
  type IngotEyebrowTone,
} from "./IngotEyebrow";
// A collapsible section is its OWN primitive, not a prop on
// ``IngotSection``. That one sets a heading and holds the page outline;
// this one is a block caption in a panel. One prop over two typesettings
// would be two components behind a switch.
export {
  IngotDisclosure,
  IngotDisclosureGroup,
} from "./IngotDisclosure";
export { IngotList } from "./IngotList";
export { IngotSideNav, type IngotNavItem } from "./IngotSideNav";
export { IngotCode } from "./IngotCode";

export {
  IngotBadge,
  type IngotBadgeTone,
} from "./IngotBadge";
export { IngotForm } from "./IngotForm";
export { IngotModal } from "./IngotModal";
export { IngotDrawer } from "./IngotDrawer";
export { IngotToast, toast, type IngotToastOptions } from "./IngotToast";
export {
  IngotPageHint,
  INGOT_HINT_DURATION_MS,
  type IngotPageHintLevel,
} from "./IngotPageHint";
export { IngotTabs, type IngotTabItem } from "./IngotTabs";
// --- floating panels ---------------------------------------------------
//
// One answer to the four questions every panel used to answer for itself:
// where it lands, what closes it, where focus goes, and which layer it sits
// on. IngotMenu stands on the popover; IngotTooltip replaces the `title`
// attribute, which a touch screen never shows and a screen reader may skip.
export {
  IngotPopover,
} from "./IngotPopover";
export { IngotMenu, type IngotMenuItem } from "./IngotMenu";
export { IngotTooltip, INGOT_TOOLTIP_DELAY_MS } from "./IngotTooltip";
export { type IngotPlacement } from "./placement";
export {
  useModalLayer,
  MENU_LAYER,
  BASE_MODAL_LAYER,
  MAX_MODAL_LAYER,
} from "./modalLayer";
export { IngotConfirm, useConfirmVeto } from "./IngotConfirm";
export { IngotTable, type IngotColumn, type IngotSort } from "./IngotTable";
export { IngotEmptyState } from "./IngotEmptyState";
// --- the list screen around the table ---------------------------------
//
// Binding block order: toolbar → (bulk bar) → table → pager. The bulk bar
// is drawn by IngotTable (it hangs on its selection); toolbar and pager
// are separate — the table is not their only consumer and the caller owns
// the state.
export { IngotToolbar } from "./IngotToolbar";
export { IngotPagination } from "./IngotPagination";
export { IngotField, type IngotFieldType } from "./IngotField";
// --- form controls beyond a text field ---------------------------------
//
// A switch is not a checkbox: it takes effect NOW, which is a promise, not
// a shape. A radio group is the plain "read them and pick one" that sat
// between the select and the option cards. A callout is the ordinary note
// that every screen used to draw by hand, in three shades of amber.
export { IngotSwitch } from "./IngotSwitch";
export { IngotRadioGroup, type IngotRadioOption } from "./IngotRadioGroup";
export { IngotCallout, type IngotCalloutTone } from "./IngotCallout";
export { IngotFieldInput } from "./IngotFieldInput";
export {
  fieldsFromConfigSchema,
  fieldsFromIntegrationManifest,
  isNumericKind,
  type IngotFieldSpec,
  type IngotFieldKind,
  type IngotSchemaProperty,
} from "./fields";
export {
  ingotFormPayload,
  useIngotForm,
  type IngotFormState,
} from "./useIngotForm";
export {
  MAX_QUICK_CREATE_DEPTH,
  ModalDepthProvider,
  useCanQuickCreate,
  useModalDepth,
} from "./ModalDepthContext";
export {
  PROCESS_ICON_CATEGORIES,
  PROCESS_ICON_VARIANT_INKS,
  ProcessIconGlyph,
  parseProcessIconKey,
  processIconInk,
  processIconToken,
  resolveProcessIcon,
  type ProcessIconCategory,
  type ProcessIconItem,
  type ProcessIconVariant,
  type ResolvedProcessIcon,
} from "./processIconLibrary";

// --- shell and settings patterns (aligned to the handoff) -------------
// The application frame: a top bar instead of a side menu, a section mega
// menu, the account menu and breadcrumbs. The side menu (``IngotSideNav``)
// stays for indexes.
export {
  IngotTopNav,
  IngotTopNavAccount,
  type IngotTopNavSection,
} from "./IngotTopNav";
export {
  IngotMegaMenu,
  type IngotMegaMenuGroup,
  type IngotMegaMenuItem,
} from "./IngotMegaMenu";
export {
  IngotUserMenu,
  IngotUserMenuRow,
  IngotUserMenuSection,
} from "./IngotUserMenu";
export { IngotBreadcrumbs, type IngotCrumb } from "./IngotBreadcrumbs";
export { IngotMetrics, type IngotMetric } from "./IngotMetrics";
export { IngotStepCard } from "./IngotStepCard";
export { IngotOptionCard } from "./IngotOptionCard";
export { IngotRowActions, type IngotRowAction } from "./IngotRowActions";
// Owner's decision, 2026-09-02: filter atoms (point 06), the page content
// frame (05) and the named exception to principle 02 (08).
export { IngotSelect, type IngotSelectOption } from "./IngotSelect";
export { IngotCheckbox } from "./IngotCheckbox";
export { IngotSearchInput } from "./IngotSearchInput";
export { IngotPageLayout } from "./IngotPageLayout";
export { IngotAttentionPanel } from "./IngotAttentionPanel";

// --- accent choice and chrome switch ---------------------------------
// The accent families are tokens of the kit (``tokens.css``,
// ``[data-accent]`` blocks), so their list and the dots that pick them
// belong here. Persisting the choice (localStorage, account) stays with
// the application.
export {
  ACCENT_CHOICES,
  DEFAULT_ACCENT,
  type AccentChoice,
} from "./accent";
export { IngotAccentSwatches } from "./IngotAccentSwatches";
export { IngotSegmented, type IngotSegmentedOption } from "./IngotSegmented";

// --- marketing blocks of the public pages -----------------------------
//
// Handoff "Public pages", ingot.css section 13. They used to live outside
// the kit on the grounds that "the admin has no consumer for them" — which
// also put them outside the distribution: ``files`` ships only
// ``src/ingot``, so the public web they were made for could not install
// them and would have had to copy them. A copied block is exactly the
// second truth the kit guards against elsewhere.
//
// Drawn exclusively with kit tokens — no colour of their own, no gradient
// — only with larger spacing and a three-column grid. Composition rules
// (accent on at most one element per section, a dark block at most twice
// per page, one column below 1100 px) are held by the page, not the
// component; the "Public pages" guide describes them.
//
// Texts and prices are CONTENT (branding / CMS / plans) — they arrive
// through props, never as constants in JSX.
export { IngotMarketingSectionHead } from "./IngotMarketingSectionHead";
export {
  IngotMarketingTri,
  type IngotMarketingTriItem,
} from "./IngotMarketingTri";
export {
  IngotMarketingSteps,
  type IngotMarketingStepItem,
} from "./IngotMarketingSteps";
export {
  IngotMarketingSegments,
  type IngotMarketingSegmentItem,
} from "./IngotMarketingSegments";
export {
  IngotMarketingComparison,
  type IngotMarketingComparisonCell,
  type IngotMarketingComparisonHeaders,
  type IngotMarketingComparisonRow,
} from "./IngotMarketingComparison";
export {
  IngotMarketingPricing,
  type IngotMarketingPlan,
} from "./IngotMarketingPricing";
export {
  IngotMarketingFaq,
  type IngotMarketingFaqItem,
} from "./IngotMarketingFaq";
export {
  IngotMarketingCta,
  type IngotMarketingCtaAction,
} from "./IngotMarketingCta";
