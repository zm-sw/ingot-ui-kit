/**
 * The public-page blocks, as their own package entry:
 * ``@forgmatic/ingot/marketing``.
 *
 * They are exported from the main barrel too — they are Ingot primitives
 * like any other and the doc web documents them the same way. The separate
 * entry exists for the consumer these blocks were built for: a marketing
 * site that needs the hero, the pricing table and the FAQ, and has no
 * business pulling in tables, drawers and the form runtime to get them.
 *
 * Texts and prices are CONTENT and arrive through props. A block that
 * spelled a price would be a second place where the price is true.
 */
export { IngotMarketingSectionHead } from "./IngotMarketingSectionHead";
export { IngotMarketingTri, type IngotMarketingTriItem } from "./IngotMarketingTri";
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
export { IngotMarketingFaq, type IngotMarketingFaqItem } from "./IngotMarketingFaq";
export { IngotMarketingCta, type IngotMarketingCtaAction } from "./IngotMarketingCta";
