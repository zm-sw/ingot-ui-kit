/**
 * Marketingové bloky veřejných stránek (KAN-664) — handoff
 * ``Ingot-Verejne-Stranky.html`` + ``ingot.css`` sekce 13.
 *
 * ## Proč vlastní modul, a ne ``@/ingot``
 *
 * Ingot barrel je veřejné API admin kitu a guard ``ingot-doc-pages``
 * páruje každý jeho export s doc stránkou komponenty 1 : 1. Marketingové
 * bloky dávají smysl jen veřejnému webu — v adminu nemají konzumenta,
 * takže do admin kitu nepatří (primitivum bez konzumenta je nezapojený
 * slib). Žijí proto vedle, se STEJNOU kázní: kreslí se výhradně tokeny
 * kitu (žádná vlastní barva, žádný gradient), jen s většími rozestupy
 * a trojsloupcovou mřížkou. Na doc webu je popisuje stránka průvodce
 * „Veřejné stránky", ne komponentní registr.
 *
 * ## Pravidla skladby (handoff)
 *
 * - akcent nejvýš na jednom prvku sekce,
 * - trojsloupcová mřížka výchozí, pod 1100 px jeden sloupec,
 * - tmavý blok nejvýš 2× na stránku (CTA + patička),
 * - bloky se píší light-first (marketing shell dark mode zatím nenabízí),
 *   ale tokeny, ať pozdější dark nebolí,
 * - texty i ceny jsou OBSAH (branding/CMS/plány) — přicházejí přes
 *   props, nikdy jako konstanty v JSX.
 */
export { MarketingSectionHead } from "./MarketingSectionHead";
export { MarketingTri, type MarketingTriItem } from "./MarketingTri";
export { MarketingSteps, type MarketingStepItem } from "./MarketingSteps";
export {
  MarketingSegments,
  type MarketingSegmentItem,
} from "./MarketingSegments";
export {
  MarketingComparison,
  type MarketingComparisonCell,
  type MarketingComparisonHeaders,
  type MarketingComparisonRow,
} from "./MarketingComparison";
export { MarketingPricing, type MarketingPlan } from "./MarketingPricing";
export { MarketingFaq, type MarketingFaqItem } from "./MarketingFaq";
export { MarketingCta, type MarketingCtaAction } from "./MarketingCta";
