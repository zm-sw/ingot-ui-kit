/**
 * Registr doc stránek — jediný seznam, ze kterého se staví levé menu
 * i proti kterému měří guard ``ingot-doc-pages``.
 *
 * 🚨 Je to JEDEN seznam schválně. Kdyby menu vzniklo z jiného zdroje než
 * kontrola, rozejdou se: guard by hlásil zeleno nad stránkou, na kterou
 * se nikdo neproklikne. Přidáváš primitivum? Přidej sem jeho ``…Doc``
 * a guard tě pustí — bez toho spadne gate, a to je smysl KAN-581.
 */
import { BasicsGuide } from "@/ingot-docs/guides/BasicsGuide";
import { IntroGuide } from "@/ingot-docs/guides/IntroGuide";
import { TranslationsGuide } from "@/ingot-docs/guides/TranslationsGuide";
import { ButtonDoc } from "@/ingot-docs/pages/ButtonDoc";
import { CardDoc } from "@/ingot-docs/pages/CardDoc";
import { IngotBadgeDoc } from "@/ingot-docs/pages/IngotBadgeDoc";
import { IngotCodeDoc } from "@/ingot-docs/pages/IngotCodeDoc";
import { IngotConfirmDoc } from "@/ingot-docs/pages/IngotConfirmDoc";
import { IngotDrawerDoc } from "@/ingot-docs/pages/IngotDrawerDoc";
import { IngotEmptyStateDoc } from "@/ingot-docs/pages/IngotEmptyStateDoc";
import { IngotFieldDoc } from "@/ingot-docs/pages/IngotFieldDoc";
import { IngotFieldInputDoc } from "@/ingot-docs/pages/IngotFieldInputDoc";
import { IngotFormDoc } from "@/ingot-docs/pages/IngotFormDoc";
import { IngotIconDoc } from "@/ingot-docs/pages/IngotIconDoc";
import { IngotListDoc } from "@/ingot-docs/pages/IngotListDoc";
import { IngotModalDoc } from "@/ingot-docs/pages/IngotModalDoc";
import { IngotOpIconDoc } from "@/ingot-docs/pages/IngotOpIconDoc";
import { IngotPageHeaderDoc } from "@/ingot-docs/pages/IngotPageHeaderDoc";
import { IngotPaginationDoc } from "@/ingot-docs/pages/IngotPaginationDoc";
import { IngotSectionDoc } from "@/ingot-docs/pages/IngotSectionDoc";
import { IngotSideNavDoc } from "@/ingot-docs/pages/IngotSideNavDoc";
import { IngotTableDoc } from "@/ingot-docs/pages/IngotTableDoc";
import { IngotTabsDoc } from "@/ingot-docs/pages/IngotTabsDoc";
import { IngotToastDoc } from "@/ingot-docs/pages/IngotToastDoc";
import { IngotToolbarDoc } from "@/ingot-docs/pages/IngotToolbarDoc";
import type { IngotDocPage, IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránky, které NEJSOU o komponentě (KAN-625) — úvod a Překlady.
 *
 * 🚨 **Vlastní seznam, ne přimíchání do ``INGOT_DOC_PAGES``.** Ten je
 * spárovaný s exporty z ``@/ingot`` 1 : 1 v OBOU směrech a guard
 * ``ingot-doc-pages`` na té obousměrnosti stojí: komponenta bez stránky je
 * lež stejně jako stránka bez komponenty. Úvod přidaný do téhož pole by
 * guard nahlásil jako stránku o něčem, co barrel neexportuje — a jediná
 * cesta, jak ho umlčet, by bylo tu obousměrnost rozvolnit. Tím by se
 * ztratilo to jediné, co doc web nutí zůstat úplný.
 *
 * První položka je zároveň **výchozí obrazovka** doc webu.
 */
export const INGOT_GUIDE_PAGES: readonly IngotGuidePage[] = [
  IntroGuide,
  BasicsGuide,
  TranslationsGuide,
];

export const INGOT_DOC_PAGES: readonly IngotDocPage[] = [
  // Pořadí je od nejmenšího stavebního kamene ke složeným celkům, ne
  // abecední: čtenář, který kit nezná, potřebuje nejdřív tlačítko a
  // plochu, teprve pak formulář postavený z obojího.
  ButtonDoc,
  CardDoc,
  IngotCodeDoc,
  IngotIconDoc,
  IngotOpIconDoc,
  IngotBadgeDoc,
  IngotListDoc,
  IngotSectionDoc,
  IngotPageHeaderDoc,
  IngotSideNavDoc,
  IngotTabsDoc,
  IngotFormDoc,
  IngotFieldInputDoc,
  IngotFieldDoc,
  IngotModalDoc,
  IngotDrawerDoc,
  IngotConfirmDoc,
  IngotToastDoc,
  // Bloky list obrazovky v pořadí, ve kterém stojí na stránce (KAN-654):
  // filtr bar → tabulka (s bulk barem) → prázdný stav → pager.
  IngotToolbarDoc,
  IngotTableDoc,
  IngotEmptyStateDoc,
  IngotPaginationDoc,
];
