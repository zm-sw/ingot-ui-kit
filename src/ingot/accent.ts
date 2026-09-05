/**
 * Akcentové rodiny kitu — typ a pořadí, ve kterém se nabízejí.
 *
 * Patří to sem, protože tady jsou i hodnoty: ``tokens.css`` nese pro
 * každou rodinu čtveřici ``--accent`` / ``--accent-ink`` / ``--accent-bg``
 * / ``--accent-border`` pod ``[data-accent="…"]``, ve světlé i tmavé
 * variantě. Seznam rodin mimo kit by byl druhá pravda o tom, kolik jich
 * je — a ta, která se nekontroluje proti CSS.
 *
 * 🚨 **Jen výčet, žádné ukládání.** Perzistence volby (localStorage
 * mirror, účet operátora) je věc aplikace, ne kitu; ta část zůstává
 * v ``lib/accent.ts``, které si tenhle výčet naimportuje. Kit ví, jaké
 * rodiny existují; kde si uživatel svou volbu pamatuje, ho nezajímá.
 */

export type AccentChoice = "blue" | "emerald" | "orange" | "violet" | "slate";

/** Pořadí je pořadí, ve kterém přepínače kreslí — modrá první, je výchozí. */
export const ACCENT_CHOICES: readonly AccentChoice[] = [
  "blue",
  "emerald",
  "orange",
  "violet",
  "slate",
];

export const DEFAULT_ACCENT: AccentChoice = "blue";
