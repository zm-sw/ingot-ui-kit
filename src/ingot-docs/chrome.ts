/**
 * Texts of the doc web shell.
 *
 * Page content is ``Localized`` right where it lives (see ``types.ts``),
 * because it is prose with its own JSX. The shell, by contrast, is short
 * labels repeated on every page — those belong in one place so they are
 * not translated six times, each time slightly differently.
 *
 * ``Localized<string>`` is ``Record<DocLang, string>``, so adding a
 * language to ``DOC_LANGS`` fails the typecheck on every label missing in
 * that language. A language cannot be promised without its texts.
 */
import type { Localized } from "@/ingot-docs/lang";

export interface ChromeStrings {
  guides: Localized<string>;
  components: Localized<string>;
  /** Group headings in the left menu — see ``IngotGuideGroup``. */
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
  /** Section listing the tokens the component stands on. */
  tokens: Localized<string>;
  /** Sentence above that list — why it is there. */
  tokensNote: Localized<string>;
  /** Shown instead of the list when a primitive renders nothing of its own. */
  tokensNone: Localized<string>;
  propName: Localized<string>;
  propType: Localized<string>;
  propRequired: Localized<string>;
  propNote: Localized<string>;
  yes: Localized<string>;
  /** Status badge next to a component page heading. */
  statusStable: Localized<string>;
  statusBeta: Localized<string>;
  /** Tabs above the demo + the button copying its source. */
  previewTab: Localized<string>;
  codeTab: Localized<string>;
  copyCode: Localized<string>;
  copiedCode: Localized<string>;
  /** Prev/next footer between pages. */
  prevPage: Localized<string>;
  nextPage: Localized<string>;
  language: Localized<string>;
  theme: Localized<string>;
  themeLight: Localized<string>;
  themeDark: Localized<string>;
  themeSystem: Localized<string>;
  accent: Localized<string>;
  /** Button and heading of the drawer the menu and switches move into
   *  below ``md`` — on a narrow viewport there is no room for them in the bar. */
  openMenu: Localized<string>;
  closeMenu: Localized<string>;
  menuTitle: Localized<string>;
  /** Simple/Expert dictionary switch — see ``dictionary.ts``. Flat keys
   *  instead of a map for the same reason as ``themeLight``. */
  dictionary: Localized<string>;
  dictionarySimple: Localized<string>;
  dictionaryExpert: Localized<string>;
  dictionaryBoth: Localized<string>;
  /** Family names. Flat fields (not a map) for the same reason as
   *  ``themeLight``/``themeDark``: a missing translation then fails the
   *  typecheck on the concrete name, not on the shape of the map. */
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
  tokens: { cs: "Tokeny", en: "Tokens" },
  tokensNote: {
    cs: "Změna kteréhokoli z těchto tokenů se na téhle komponentě projeví všude v produktu.",
    en: "Changing any of these tokens shows up on this component everywhere in the product.",
  },
  tokensNone: {
    cs: "Primitivum nic nevykresluje — žádná změna tokenu se na něm neprojeví.",
    en: "The primitive renders nothing of its own — no token change reaches it.",
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
  openMenu: { cs: "Otevřít menu", en: "Open menu" },
  closeMenu: { cs: "Zavřít menu", en: "Close menu" },
  menuTitle: { cs: "Obsah", en: "Contents" },
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
