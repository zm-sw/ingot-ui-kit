/**
 * Ingot UI Kit v1 (KAN-382, program KAN-376).
 *
 * Sdílená primitiva admin obrazovek: deklarativní formulář (KAN-382),
 * skořápka dialogu (KAN-580), potvrzovací dialog (KAN-583) a tabulka
 * s prázdným stavem (KAN-585). Další přibude, až si o něj řekne konkrétní
 * obrazovka — primitivum bez konzumenta je nezapojený slib.
 *
 * Každé primitivum drží a11y laťku z rozhodnutí vlastníka 2026-08-25: focus
 * trap, ESC, scroll lock, ``role``/``aria-*`` a návrat fokusu na spouštěč.
 *
 * **Tenhle soubor JE veřejné API Ingotu** (KAN-590). Co odsud nevede ven, je
 * vnitřek modulu a smí se přejmenovat nebo rozdělit bez ohlášení; konzument
 * proto importuje ``@/ingot``, nikdy ``@/ingot/IngotTable``. Uvnitř modulu
 * hluboká cesta zůstává — pravidlo je o konzumentech.
 *
 * Breaking change primitiva je povolený jedině v témž PR, který převede
 * všechny konzumenty: všichni žijí v tomhle repu a gate je staví, takže
 * deprecation okno by jen prodloužilo dobu, kdy platí dvě pravdy. Podrobně
 * i s odpovědí na Aplikace třetích stran: ``docs/INGOT_INVENTORY.md`` § 5e.
 *
 * Guardy (``scripts/repo_checks.py``): ``ingot-inventory`` ratchetuje počet
 * nepřevedených admin obrazovek, ``apps-on-ingot`` drží tvrdou podmínku pro
 * Aplikace (bez baseline) a ``ingot-public-api`` hlídá hranici výše.
 */
// --- atomy, které se do kitu přestěhovaly v KAN-628 ------------------
//
// 🚨 Do KAN-628 bydlely v ``@/components/ui`` a pravidlo „doc web se smí
// kreslit jen komponentami kitu" mělo proto DVĚ čtení: patří tlačítko do
// kitu, nebo ne? Teď bydlí tady, takže čtení je jedno.
//
// Jména zůstala BEZ prefixu ``Ingot`` schválně. Přejmenovat je by
// znamenalo sáhnout do JSX ve ~150 souborech, což je diff, který se
// nedá přečíst a v repu s 5–10 souběžnými sessions se nedá ani
// zmergovat. Guard ``ingot-doc-pages`` je proto zná jménem
// (``_INGOT_UNPREFIXED_COMPONENTS``) a doc stránku po nich chce stejně
// jako po ostatních.
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
