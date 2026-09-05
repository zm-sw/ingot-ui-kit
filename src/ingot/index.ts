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
// --- atoms without the Ingot prefix ---------------------------------
//
// Button and Card predate the prefix convention. Renaming them would touch
// JSX in every consumer for no gain in behaviour, so the doc-page guard
// knows them by name (DOCUMENTED_UNPREFIXED in scripts/checks.mjs) and
// demands a doc page for them like for everything else.
export { Button } from "./Button";
export { Card, CardHeader, CardTitle } from "./Card";

// --- ikony (KAN-649) -------------------------------------------------
//
// Dvě sady, ne jedna: rozhraní (``IngotIcon``) se barví a škáluje volně,
// kdežto ikona výrobní operace nese klíč, který ukládá backend, a má
// vlastní pravidla sazby. Jeden společný komponent by ta pravidla musel
// rozvolnit na průnik obojího.
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

// --- skořápka obrazovky (KAN-628) ------------------------------------
//
// Doc web kit vyučuje, takže stránka, která si sama skládá třídy, ho
// svým vlastním příkladem popírá. Tahle pětice je to, co si skládal:
// nadpis, sekce, výčet, boční menu a kód v textu.
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
// 🪤 Sbalitelná sekce je VLASTNÍ primitivum, ne prop na ``IngotSection``.
// Ta sází nadpis a drží osnovu stránky; tahle je popisek bloku v panelu.
// Jeden prop nad dvěma sazbami by byly dvě komponenty za přepínačem.
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
export {
  useModalLayer,
  MENU_LAYER,
  BASE_MODAL_LAYER,
  MAX_MODAL_LAYER,
} from "./modalLayer";
export { IngotConfirm, useConfirmVeto } from "./IngotConfirm";
export { IngotTable, type IngotColumn, type IngotSort } from "./IngotTable";
export { IngotEmptyState } from "./IngotEmptyState";
// --- list obrazovka kolem tabulky (KAN-654) --------------------------
//
// Závazné pořadí bloků: toolbar → (bulk bar) → tabulka → pager. Bulk bar
// kreslí IngotTable (visí na jejím výběru), toolbar a pager jsou
// samostatné — tabulka není jejich jediný konzument a stav drží volající.
export { IngotToolbar } from "./IngotToolbar";
export { IngotPagination } from "./IngotPagination";
export { IngotField } from "./IngotField";
export {
  IngotFieldInput,
  SECRET_PLACEHOLDER_SET,
  SECRET_PLACEHOLDER_UNSET,
} from "./IngotFieldInput";
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

// --- shell a patterny nastavení (dorovnání na handoff) ---------------
// Rám aplikace: horní lišta místo bočního menu, mega menu sekce, menu
// účtu a drobečky. Boční menu (``IngotSideNav``) zůstává pro rejstříky.
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
// Rozhodnutí vlastníka 2026-09-02: filtrační atomy (bod 06), rám obsahu
// stránky (05) a pojmenovaná výjimka z principu 02 (08).
export { IngotSelect, type IngotSelectOption } from "./IngotSelect";
export { IngotCheckbox } from "./IngotCheckbox";
export { IngotSearchInput } from "./IngotSearchInput";
export { IngotPageLayout } from "./IngotPageLayout";
export { IngotAttentionPanel } from "./IngotAttentionPanel";

// --- volba akcentu a přepínač chromu ---------------------------------
// Akcentové rodiny jsou tokeny kitu (``tokens.css``, bloky
// ``[data-accent]``), takže jejich výčet i puntíky, kterými se vybírají,
// patří sem. Ukládání volby (localStorage, účet) zůstává aplikaci.
export {
  ACCENT_CHOICES,
  DEFAULT_ACCENT,
  type AccentChoice,
} from "./accent";
export { IngotAccentSwatches } from "./IngotAccentSwatches";
export { IngotSegmented, type IngotSegmentedOption } from "./IngotSegmented";

// --- marketingové bloky veřejných stránek ----------------------------
//
// Handoff „Veřejné stránky", ingot.css sekce 13. Bydlely mimo kit
// s odůvodněním „v adminu nemají konzumenta", jenže tím se ocitly i mimo
// distribuci: ``files`` pouští ven jen ``src/ingot``, takže veřejný web,
// pro který vznikly, si je nemohl nainstalovat a musel by je opsat.
// Opsaný blok je přesně ta druhá pravda, které se kit brání jinde.
//
// Kreslí se výhradně tokeny kitu — žádná vlastní barva, žádný gradient —
// jen s většími rozestupy a trojsloupcovou mřížkou. Pravidla skladby
// (akcent nejvýš na jednom prvku sekce, tmavý blok nejvýš 2× na stránku,
// pod 1100 px jeden sloupec) drží stránka, ne komponenta; popisuje je
// průvodce „Veřejné stránky".
//
// Texty i ceny jsou OBSAH (branding/CMS/plány) — chodí přes props,
// nikdy jako konstanty v JSX.
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
