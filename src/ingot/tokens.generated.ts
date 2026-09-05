/*
 * GENERATED FROM tokens.json — do not edit.
 *
 * Run `npm run tokens` after changing the source. The Tailwind preset and
 * the doc web read the palette from here instead of repeating its names,
 * which is how the three copies used to drift apart.
 */

/** Every colour token the two themes define, by name without the -- prefix. */
export const INGOT_COLOR_TOKENS = [
  "bg",
  "surface",
  "surface-2",
  "surface-3",
  "border",
  "border-strong",
  "ink",
  "ink-2",
  "ink-3",
  "ink-4",
  "ink-5",
  "blue-accent",
  "blue-accent-ink",
  "blue-accent-bg",
  "blue-accent-border",
  "accent",
  "accent-ink",
  "accent-bg",
  "accent-border",
  "ok",
  "ok-bg",
  "ok-border",
  "warn",
  "warn-bg",
  "warn-border",
  "danger",
  "danger-bg",
  "danger-border",
  "custom",
  "custom-bg",
  "custom-border",
  "plan",
  "plan-bg",
  "plan-border",
  "code-comment",
  "code-keyword",
  "code-string",
  "code-tag",
  "code-attr",
  "code-number",
  "code-punct"
] as const;

/** The accent families, in the order the picker shows them. */
export const INGOT_ACCENT_FAMILIES = [
  "blue",
  "emerald",
  "orange",
  "violet",
  "slate"
] as const;

/** Light and dark values of every colour token — for the doc web's token page. */
export const INGOT_TOKEN_VALUES: Record<string, { light: string; dark?: string }> = {
  "bg": {
    "light": "#f1f0ed",
    "dark": "#0b0a09"
  },
  "surface": {
    "light": "#ffffff",
    "dark": "#2e2b27"
  },
  "surface-2": {
    "light": "#f4f3f0",
    "dark": "#3e3934"
  },
  "surface-3": {
    "light": "#e6e4df",
    "dark": "#4e473f"
  },
  "border": {
    "light": "#ddd9d3",
    "dark": "#665d53"
  },
  "border-strong": {
    "light": "#c4bfb8",
    "dark": "#877c6f"
  },
  "ink": {
    "light": "#0c0a09",
    "dark": "#fffefd"
  },
  "ink-2": {
    "light": "#3f3b37",
    "dark": "#eeeae3"
  },
  "ink-3": {
    "light": "#57534e",
    "dark": "#cbc3b7"
  },
  "ink-4": {
    "light": "#696460",
    "dark": "#aba398"
  },
  "ink-5": {
    "light": "#d6d3d1",
    "dark": "#605c57"
  },
  "blue-accent": {
    "light": "#2563eb",
    "dark": "#5192f7"
  },
  "blue-accent-ink": {
    "light": "#1d4ed8",
    "dark": "#bfdbfe"
  },
  "blue-accent-bg": {
    "light": "#eff6ff",
    "dark": "#0f1b30"
  },
  "blue-accent-border": {
    "light": "#bfdbfe",
    "dark": "#1e3a8a"
  },
  "accent": {
    "light": "var(--blue-accent)",
    "dark": "var(--blue-accent)"
  },
  "accent-ink": {
    "light": "var(--blue-accent-ink)",
    "dark": "var(--blue-accent-ink)"
  },
  "accent-bg": {
    "light": "var(--blue-accent-bg)",
    "dark": "var(--blue-accent-bg)"
  },
  "accent-border": {
    "light": "var(--blue-accent-border)",
    "dark": "var(--blue-accent-border)"
  },
  "ok": {
    "light": "#047454",
    "dark": "#22c55e"
  },
  "ok-bg": {
    "light": "#eaf7ee",
    "dark": "#0a2013"
  },
  "ok-border": {
    "light": "#a7dfba",
    "dark": "#166534"
  },
  "warn": {
    "light": "#b05109",
    "dark": "#f59e0b"
  },
  "warn-bg": {
    "light": "#fffbeb",
    "dark": "#2a1e07"
  },
  "warn-border": {
    "light": "#fde68a",
    "dark": "#92400e"
  },
  "danger": {
    "light": "#b91c1c",
    "dark": "#f36464"
  },
  "danger-bg": {
    "light": "#fef2f2",
    "dark": "#2a1010"
  },
  "danger-border": {
    "light": "#fecaca",
    "dark": "#991b1b"
  },
  "custom": {
    "light": "#6d28d9",
    "dark": "#ae94fa"
  },
  "custom-bg": {
    "light": "#f5f3ff",
    "dark": "#1e1533"
  },
  "custom-border": {
    "light": "#ddd6fe",
    "dark": "#6d28d9"
  },
  "plan": {
    "light": "#faf5ff",
    "dark": "#faf5ff"
  },
  "plan-bg": {
    "light": "#6b21a8",
    "dark": "#9333ea"
  },
  "plan-border": {
    "light": "#7e22ce",
    "dark": "#a855f7"
  },
  "code-comment": {
    "light": "#696460",
    "dark": "#aba398"
  },
  "code-keyword": {
    "light": "#6d28d9",
    "dark": "#c4aefc"
  },
  "code-string": {
    "light": "#047454",
    "dark": "#5ddb99"
  },
  "code-tag": {
    "light": "#2563eb",
    "dark": "#7ab0fa"
  },
  "code-attr": {
    "light": "#b05109",
    "dark": "#f5b74a"
  },
  "code-number": {
    "light": "#b91c1c",
    "dark": "#f79a9a"
  },
  "code-punct": {
    "light": "#57534e",
    "dark": "#cbc3b7"
  }
};

/** The spacing scale in px, by step. */
export const INGOT_SPACE: Record<string, string> = {
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "24px",
  "6": "32px",
  "7": "48px",
  "8": "72px"
};

/** The radius scale, by name. */
export const INGOT_RADIUS: Record<string, string> = {
  "xs": "4px",
  "sm": "6px",
  "md": "10px",
  "lg": "14px"
};
