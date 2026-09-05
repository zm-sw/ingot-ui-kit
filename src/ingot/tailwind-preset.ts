import type { Config } from "tailwindcss";

/**
 * A token colour that also supports ``/opacity``.
 *
 * **A bare string ``"var(--ink)"`` does NOT support the modifier.**
 * Tailwind has nowhere to put the alpha, so it does not generate the
 * utility with a modifier at all — and that is not an error, it is a
 * no-op. Measured on 2026-08-25 over the built CSS: 228 uses like
 * ``bg-ink/40`` in the sources, zero matching selectors in the output.
 *
 * The worst part is what it does: ``bg-surface/95`` does not mean "a
 * translucent background" but NO background — and ``bg-ink/40`` under
 * modals meant the dimming under them never existed.
 *
 * The functional form fixes it without moving the palette:
 *
 * * WITHOUT ``opacityValue`` it returns ``var(--x)`` — base classes
 *   (``bg-ink``, ``text-ink-2``) do not change by a character;
 * * WITH it, it composes ``color-mix``, which carries alpha over ``var()``.
 *
 * Why not the channel notation (``--ink: 12 10 9`` +
 * ``rgb(var(--ink) / <alpha-value>)``): the tokens are read as
 * ``var(--ink)`` directly in places, so it would break — and a second
 * variable per colour is a second thing that can drift.
 */
function token(name: string): string {
  const resolve = ({ opacityValue }: { opacityValue?: string }): string => {
    // For a class WITHOUT a modifier the value is not ``undefined`` but the
    // string ``"var(--tw-bg-opacity)"``. The first version of this helper
    // pushed it straight into ``Number()`` and produced
    // ``color-mix(… NaN%, transparent)`` — invalid CSS for EVERY base token
    // class. Only the build caught it; the config gives no sign.
    const alpha = opacityValue === undefined ? NaN : Number(opacityValue);
    if (!Number.isFinite(alpha)) return `var(${name})`;
    return `color-mix(in srgb, var(${name}) ${alpha * 100}%, transparent)`;
  };
  // The cast is intent, not a way around the check. Tailwind documents the
  // functional colour form and supports it at runtime, but its
  // ``types/config.d.ts`` types a colour value as ``string`` —
  // ``satisfies Config`` would otherwise refuse it. That it really works is
  // held by a test over the generated CSS, not by the types.
  return resolve as unknown as string;
}

// The kit's shared Tailwind preset (@forgmatic/ingot/tailwind-preset).
// It maps utilities onto the tokens declared in tokens.css; the values
// live there, this file only tells Tailwind how to turn them into classes.
// A consumer adds its own `content` and nothing else.
export default {
  // Dark mode is a `.dark` class on <html>, applied by the consuming app's
  // theme switch. The palette itself is driven by the custom properties
  // re-declared under `:root.dark` in tokens.css, so token-based UI
  // (`bg-surface`, `text-ink`, …) themes for free; `dark:` variants exist
  // for the few spots that hard-code a colour and need an explicit
  // override.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Every colour MUST go through ``token()``. Do not write a bare
      // ``"var(--x)"`` here — its ``/opacity`` modifier would be dropped
      // silently.
      colors: {
        bg: token("--bg"),
        surface: token("--surface"),
        "surface-2": token("--surface-2"),
        "surface-3": token("--surface-3"),
        border: token("--border"),
        "border-strong": token("--border-strong"),
        ink: {
          DEFAULT: token("--ink"),
          2: token("--ink-2"),
          3: token("--ink-3"),
          4: token("--ink-4"),
          5: token("--ink-5"),
        },
        // Syntax-highlighting roles. Not new palette colours but names for
        // ``IngotCode`` — hence a family of their own rather than overloading
        // ``accent`` / ``ok`` / ``danger``, which serve another purpose in the
        // dark theme and would move for other reasons.
        code: {
          comment: token("--code-comment"),
          keyword: token("--code-keyword"),
          string: token("--code-string"),
          tag: token("--code-tag"),
          attr: token("--code-attr"),
          number: token("--code-number"),
          punct: token("--code-punct"),
        },
        accent: {
          DEFAULT: token("--accent"),
          ink: token("--accent-ink"),
          bg: token("--accent-bg"),
          border: token("--accent-border"),
        },
        ok: {
          DEFAULT: token("--ok"),
          bg: token("--ok-bg"),
          border: token("--ok-border"),
        },
        warn: {
          DEFAULT: token("--warn"),
          bg: token("--warn-bg"),
          border: token("--warn-border"),
        },
        danger: {
          DEFAULT: token("--danger"),
          bg: token("--danger-bg"),
          border: token("--danger-border"),
        },
        custom: {
          DEFAULT: token("--custom"),
          bg: token("--custom-bg"),
          border: token("--custom-border"),
        },
        plan: {
          DEFAULT: token("--plan"),
          bg: token("--plan-bg"),
          border: token("--plan-border"),
        },
      },
      // The radius scale of the Ingot v0.1 handoff (``--r-xs``…``--r-lg``).
      // Names are Tailwind's, values the handoff's: ``sm`` = r-xs 4,
      // DEFAULT = r-sm 6, ``md`` = r-md 10, ``lg`` = r-lg 14. ``xl`` has no
      // handoff counterpart and stays as it was.
      //
      // Values go through the tokens in ``tokens.css`` (owner's decision,
      // 2026-09-02, point 09) — the doc pages list them, so they must exist.
      // The px fallback keeps a tree rendered without tokens.css working
      // (isolated tests, a foreign host).
      borderRadius: {
        sm: "var(--r-xs, 4px)",
        DEFAULT: "var(--r-sm, 6px)",
        md: "var(--r-md, 10px)",
        lg: "var(--r-lg, 14px)",
        xl: "16px",
      },
      // The handoff's type scale (section 3 TYPE in ``ingot.css``). In the
      // handoff these are the classes ``.t-display``…``.t-eyebrow``; here
      // they are Tailwind ``fontSize`` entries because the kit builds on
      // utilities — an unused step is not generated into the CSS at all.
      fontSize: {
        display: [
          "clamp(40px, 5.4vw, 64px)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h1: ["40px", { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "600" }],
        h2: ["26px", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        lede: ["17px", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        body: ["14.5px", { lineHeight: "1.6" }],
        small: ["13px", { lineHeight: "1.55" }],
        eyebrow: [
          "11px",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "500" },
        ],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.025em",
        tight: "-0.02em",
        snug: "-0.01em",
        normal: "-0.005em",
      },
      // The kit's two motion tokens, wired into the utilities that use them
      // most. `--dur` and `--ease` lived in tokens.css from the start and
      // no component read them, so every transition picked Tailwind's
      // defaults and the timings drifted apart component by component.
      transitionDuration: {
        DEFAULT: "var(--dur, 0.22s)",
      },
      transitionTimingFunction: {
        DEFAULT: "var(--ease, cubic-bezier(0.2, 0.6, 0.3, 1))",
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        // Enter animations for the overlays. One duration and one curve,
        // both from the tokens, so a dialog and a drawer opening on the
        // same screen move at the same speed.
        "ingot-fade-in": "ingot-fade-in var(--dur, 0.22s) var(--ease) both",
        "ingot-scale-in": "ingot-scale-in var(--dur, 0.22s) var(--ease) both",
        "ingot-slide-in-right":
          "ingot-slide-in-right var(--dur, 0.22s) var(--ease) both",
        "ingot-slide-in-left":
          "ingot-slide-in-left var(--dur, 0.22s) var(--ease) both",
        "ingot-slide-in-up": "ingot-slide-in-up var(--dur, 0.22s) var(--ease) both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ingot-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // A dialog grows a little rather than sliding: it belongs to the
        // middle of the screen, and a slide would suggest it came from an
        // edge it has nothing to do with.
        "ingot-scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "ingot-slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "ingot-slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "ingot-slide-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;
