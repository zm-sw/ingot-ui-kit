/**
 * Texty skořápky doc webu (KAN-627).
 *
 * Obsah stránek je ``Localized`` přímo u sebe (viz ``types.ts``), protože
 * je to próza s vlastním JSX. Skořápka jsou naopak krátké popisky, které
 * se opakují na každé stránce — ty patří na jedno místo, aby se
 * nepřekládaly šestkrát a pokaždé o kousek jinak.
 *
 * ``Localized<string>`` je ``Record<DocLang, string>``, takže přidání
 * jazyka do ``DOC_LANGS`` shodí typecheck na každém popisku, který
 * v tom jazyce chybí. Slíbit jazyk bez textů tedy nejde.
 */
import type { Localized } from "@/ingot-docs/lang";

export interface ChromeStrings {
  guides: Localized<string>;
  components: Localized<string>;
  /** Nadpisy skupin v levém menu — viz ``IngotGuideGroup``. */
  groupSystem: Localized<string>;
  groupApp: Localized<string>;
  groupRules: Localized<string>;
  onThisPage: Localized<string>;
  demo: Localized<string>;
  useWhen: Localized<string>;
  avoidWhen: Localized<string>;
  props: Localized<string>;
  a11y: Localized<string>;
  i18n: Localized<string>;
  limits: Localized<string>;
  propName: Localized<string>;
  propType: Localized<string>;
  propRequired: Localized<string>;
  propNote: Localized<string>;
  yes: Localized<string>;
  /** Badge stavu vedle nadpisu stránky komponenty. */
  statusStable: Localized<string>;
  statusBeta: Localized<string>;
  /** Taby nad ukázkou + tlačítko kopírování jejího zdroje. */
  previewTab: Localized<string>;
  codeTab: Localized<string>;
  copyCode: Localized<string>;
  copiedCode: Localized<string>;
  /** Patička prev/next mezi stránkami. */
  prevPage: Localized<string>;
  nextPage: Localized<string>;
  language: Localized<string>;
  theme: Localized<string>;
  themeLight: Localized<string>;
  themeDark: Localized<string>;
  themeSystem: Localized<string>;
  accent: Localized<string>;
  /** Přepínač slovníku Jednoduše/Expert — viz ``dictionary.ts``. Ploché
   *  klíče místo mapy ze stejného důvodu jako ``themeLight``. */
  dictionary: Localized<string>;
  dictionarySimple: Localized<string>;
  dictionaryExpert: Localized<string>;
  dictionaryBoth: Localized<string>;
  /** Jména rodin. Plochá pole (ne mapa) ze stejného důvodu jako
   *  ``themeLight``/``themeDark``: chybějící překlad tak shodí typecheck
   *  na konkrétním jménu, ne až na tvaru mapy. */
  accentBlue: Localized<string>;
  accentEmerald: Localized<string>;
  accentOrange: Localized<string>;
  accentViolet: Localized<string>;
  accentSlate: Localized<string>;
}

export const CHROME: ChromeStrings = {
  guides: { cs: "Průvodce", en: "Guides" },
  components: { cs: "Komponenty", en: "Components" },
  groupSystem: { cs: "Systém", en: "System" },
  groupApp: { cs: "Aplikace", en: "Application" },
  groupRules: { cs: "Pravidla", en: "Rules" },
  onThisPage: { cs: "Co je na stránce", en: "On this page" },
  demo: { cs: "Ukázka", en: "Demo" },
  useWhen: { cs: "Kdy použít", en: "When to use it" },
  avoidWhen: { cs: "Kdy nepoužít", en: "When not to use it" },
  props: { cs: "Vlastnosti", en: "Properties" },
  a11y: { cs: "Přístupnost", en: "Accessibility" },
  i18n: { cs: "Překlady", en: "Translations" },
  limits: {
    cs: "Co první verze neumí",
    en: "What the first version cannot do",
  },
  propName: { cs: "Vlastnost", en: "Property" },
  propType: { cs: "Typ", en: "Type" },
  propRequired: { cs: "Povinné", en: "Required" },
  propNote: { cs: "K čemu", en: "What for" },
  yes: { cs: "ano", en: "yes" },
  statusStable: { cs: "stabilní", en: "stable" },
  statusBeta: { cs: "beta", en: "beta" },
  previewTab: { cs: "Náhled", en: "Preview" },
  codeTab: { cs: "Kód", en: "Code" },
  copyCode: { cs: "Kopírovat", en: "Copy" },
  copiedCode: { cs: "Zkopírováno", en: "Copied" },
  prevPage: { cs: "Předchozí", en: "Previous" },
  nextPage: { cs: "Další", en: "Next" },
  language: { cs: "Jazyk", en: "Language" },
  theme: { cs: "Motiv", en: "Theme" },
  themeLight: { cs: "Světlý", en: "Light" },
  themeDark: { cs: "Tmavý", en: "Dark" },
  themeSystem: { cs: "Systém", en: "System" },
  accent: { cs: "Akcent", en: "Accent" },
  dictionary: { cs: "Slovník", en: "Dictionary" },
  dictionarySimple: { cs: "Jednoduše", en: "Simple" },
  dictionaryExpert: { cs: "Expert", en: "Expert" },
  dictionaryBoth: { cs: "Obojí", en: "Both" },
  accentBlue: { cs: "modrý", en: "blue" },
  accentEmerald: { cs: "smaragdový", en: "emerald" },
  accentOrange: { cs: "oranžový", en: "orange" },
  accentViolet: { cs: "fialový", en: "violet" },
  accentSlate: { cs: "břidlicový", en: "slate" },
};
