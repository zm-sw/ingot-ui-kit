/**
 * Registr doc stránek — jediný seznam, ze kterého se staví levé menu
 * i proti kterému měří guard ``ingot-doc-pages``.
 *
 * 🚨 Je to JEDEN seznam schválně. Kdyby menu vzniklo z jiného zdroje než
 * kontrola, rozejdou se: guard by hlásil zeleno nad stránkou, na kterou
 * se nikdo neproklikne. Přidáváš primitivum? Přidej sem jeho ``…Doc``
 * a guard tě pustí — bez toho spadne gate, a to je smysl KAN-581.
 */
import { A11yGuide } from "@/ingot-docs/guides/A11yGuide";
import { BasicsGuide } from "@/ingot-docs/guides/BasicsGuide";
import { ComponentsGuide } from "@/ingot-docs/guides/ComponentsGuide";
import { FormatsGuide } from "@/ingot-docs/guides/FormatsGuide";
import { IconsGuide } from "@/ingot-docs/guides/IconsGuide";
import { IntroGuide } from "@/ingot-docs/guides/IntroGuide";
import { PublicPagesGuide } from "@/ingot-docs/guides/PublicPagesGuide";
import { ShellGuide } from "@/ingot-docs/guides/ShellGuide";
import { TranslationsGuide } from "@/ingot-docs/guides/TranslationsGuide";
import { UsageGuide } from "@/ingot-docs/guides/UsageGuide";
import { ButtonDoc } from "@/ingot-docs/pages/ButtonDoc";
import { CardDoc } from "@/ingot-docs/pages/CardDoc";
import { IngotAttentionPanelDoc } from "@/ingot-docs/pages/IngotAttentionPanelDoc";
import { IngotBadgeDoc } from "@/ingot-docs/pages/IngotBadgeDoc";
import { IngotBreadcrumbsDoc } from "@/ingot-docs/pages/IngotBreadcrumbsDoc";
import { IngotCheckboxDoc } from "@/ingot-docs/pages/IngotCheckboxDoc";
import { IngotCodeDoc } from "@/ingot-docs/pages/IngotCodeDoc";
import { IngotConfirmDoc } from "@/ingot-docs/pages/IngotConfirmDoc";
import { IngotDisclosureDoc } from "@/ingot-docs/pages/IngotDisclosureDoc";
import { IngotDrawerDoc } from "@/ingot-docs/pages/IngotDrawerDoc";
import { IngotEmptyStateDoc } from "@/ingot-docs/pages/IngotEmptyStateDoc";
import { IngotFieldDoc } from "@/ingot-docs/pages/IngotFieldDoc";
import { IngotFieldInputDoc } from "@/ingot-docs/pages/IngotFieldInputDoc";
import { IngotFormDoc } from "@/ingot-docs/pages/IngotFormDoc";
import { IngotIconDoc } from "@/ingot-docs/pages/IngotIconDoc";
import { IngotListDoc } from "@/ingot-docs/pages/IngotListDoc";
import { IngotMegaMenuDoc } from "@/ingot-docs/pages/IngotMegaMenuDoc";
import { IngotMetricsDoc } from "@/ingot-docs/pages/IngotMetricsDoc";
import { IngotModalDoc } from "@/ingot-docs/pages/IngotModalDoc";
import { IngotOpIconDoc } from "@/ingot-docs/pages/IngotOpIconDoc";
import { IngotOptionCardDoc } from "@/ingot-docs/pages/IngotOptionCardDoc";
import { IngotPageHeaderDoc } from "@/ingot-docs/pages/IngotPageHeaderDoc";
import { IngotPageHintDoc } from "@/ingot-docs/pages/IngotPageHintDoc";
import { IngotPageLayoutDoc } from "@/ingot-docs/pages/IngotPageLayoutDoc";
import { IngotPaginationDoc } from "@/ingot-docs/pages/IngotPaginationDoc";
import { IngotRowActionsDoc } from "@/ingot-docs/pages/IngotRowActionsDoc";
import { IngotSearchInputDoc } from "@/ingot-docs/pages/IngotSearchInputDoc";
import { IngotSectionDoc } from "@/ingot-docs/pages/IngotSectionDoc";
import { IngotSelectDoc } from "@/ingot-docs/pages/IngotSelectDoc";
import { IngotSideNavDoc } from "@/ingot-docs/pages/IngotSideNavDoc";
import { IngotStepCardDoc } from "@/ingot-docs/pages/IngotStepCardDoc";
import { IngotTableDoc } from "@/ingot-docs/pages/IngotTableDoc";
import { IngotTabsDoc } from "@/ingot-docs/pages/IngotTabsDoc";
import { IngotToastDoc } from "@/ingot-docs/pages/IngotToastDoc";
import { IngotToolbarDoc } from "@/ingot-docs/pages/IngotToolbarDoc";
import { IngotTopNavDoc } from "@/ingot-docs/pages/IngotTopNavDoc";
import { IngotUserMenuDoc } from "@/ingot-docs/pages/IngotUserMenuDoc";
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
/**
 * Pořadí určuje číslo v menu i posloupnost prev/next patičky, a je
 * čtenářské: nejdřív co kit JE (skupina ``system``), pak jak se z něj
 * staví obrazovky (``app``), nakonec co se od autora čeká (``rules``).
 *
 * 🚨 **Stránky JEDNÉ skupiny musí stát vedle sebe.** Menu skupiny
 * nepřerovnává — vypisuje je v tomhle pořadí a nadpis vloží při každé
 * změně. Rozházené pořadí by tedy vyrobilo skupinu dvakrát.
 */
export const INGOT_GUIDE_PAGES: readonly IngotGuidePage[] = [
  IntroGuide,
  BasicsGuide,
  // Rozcestník komponent — v menu se pod něj vnořují jednotlivá
  // primitiva, takže stojí před Ikonami, ne až za nimi.
  ComponentsGuide,
  IconsGuide,
  ShellGuide,
  // Marketingové bloky veřejného webu (KAN-664) — bloky nejsou export
  // ``@/ingot`` (v adminu nemají konzumenta), proto průvodce, ne
  // komponentní stránka.
  PublicPagesGuide,
  UsageGuide,
  FormatsGuide,
  A11yGuide,
  TranslationsGuide,
];

export const INGOT_DOC_PAGES: readonly IngotDocPage[] = [
  // Abecedně podle jména, které stránka ukazuje — tedy bez prefixu:
  // Badge, Breadcrumbs, Button… Menu je rejstřík o jedenatřiceti
  // položkách a v rejstříku se hledá podle abecedy, ne podle toho, jak
  // si pořadí představil ten, kdo ho psal.
  //
  // 🪤 Řadí se podle ZOBRAZENÉHO jména, ne podle jména exportu — jinak
  // by Button a Card skončily před vším ostatním, protože prefix nemají.
  // Pořadí hlídá test; ručně se netrefuje.
  IngotAttentionPanelDoc,
  IngotBadgeDoc,
  IngotBreadcrumbsDoc,
  ButtonDoc,
  CardDoc,
  IngotCheckboxDoc,
  IngotCodeDoc,
  IngotConfirmDoc,
  IngotDisclosureDoc,
  IngotDrawerDoc,
  IngotEmptyStateDoc,
  IngotFieldDoc,
  IngotFieldInputDoc,
  IngotFormDoc,
  IngotIconDoc,
  IngotListDoc,
  IngotMegaMenuDoc,
  IngotMetricsDoc,
  IngotModalDoc,
  IngotOpIconDoc,
  IngotOptionCardDoc,
  IngotPageHeaderDoc,
  IngotPageHintDoc,
  IngotPageLayoutDoc,
  IngotPaginationDoc,
  IngotRowActionsDoc,
  IngotSearchInputDoc,
  IngotSectionDoc,
  IngotSelectDoc,
  IngotSideNavDoc,
  IngotStepCardDoc,
  IngotTableDoc,
  IngotTabsDoc,
  IngotToastDoc,
  IngotToolbarDoc,
  IngotTopNavDoc,
  IngotUserMenuDoc,
];
