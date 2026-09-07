import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

import { INGOT_TYPE_SCALE } from "./tokens.generated";

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

/**
 * The token source's type scale, in the shape Tailwind's ``fontSize`` takes.
 *
 * A step declares only what it decides: ``body`` has no letter-spacing and
 * no weight of its own, and writing ``undefined`` for those would have
 * Tailwind emit ``letter-spacing: undefined``. So the options object is
 * built from the properties the token actually carries.
 */
function typeScale(): Record<string, [string, Record<string, string>]> {
  return Object.fromEntries(
    Object.entries(INGOT_TYPE_SCALE).map(([step, { fontSize, ...rest }]) => [
      step,
      [
        fontSize,
        Object.fromEntries(
          Object.entries(rest).filter(([, value]) => value !== undefined),
        ) as Record<string, string>,
      ],
    ]),
  );
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
      //
      // The NAMES below are checked against tokens.json by the
      // ``ingot-tokens-fresh`` guard: a colour added to the source and not
      // offered as a utility here is a token nobody can use, and a utility
      // pointing at a token that no longer exists resolves to nothing.
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
      //
      // The numbers are READ from the token source now, not written here.
      // They used to live only in this file, which meant the one layer a
      // designer needs most reached no export the kit writes: the palette,
      // the spacing and the radii could be handed over and the type scale
      // could not.
      fontSize: typeScale(),
      // The width of a whole screen, from `--frame`. It is a utility rather
      // than a number each application repeats: `max-w-7xl` here and
      // `max-w-[1440px]` there is how two products built from the same kit
      // stop being the same width.
      maxWidth: {
        frame: "var(--frame, 1440px)",
        // The three shapes a page's content can have inside that frame.
        // They are here rather than as `max-w-3xl` and friends for the
        // reason above: the nearest Tailwind step is a number somebody
        // reached for, not a width anybody decided.
        "page-card": "var(--page-card, 448px)",
        "page-reading": "var(--page-reading, 768px)",
        "page-wide": "var(--page-wide, 1024px)",
      },
      // The standing side index. Same reasoning as the frame: a number
      // written into each screen is a number that stops agreeing with the
      // next screen.
      width: {
        aside: "var(--aside, 224px)",
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
  plugins: [
    /**
     * The keyboard focus ring, as one utility.
     *
     * It was drawn by hand in five files and missing from eleven, which
     * meant that on most of the kit the ring a keyboard user sees was
     * whatever their browser draws — a different shape in every browser
     * and in none of the kit's colours. A person who navigates by keyboard
     * cannot use a component whose focus they cannot find, so this is not
     * a polish item.
     *
     * Three utilities, because a ring has three situations:
     *
     * - `focus-ring` sits OUTSIDE the control, with a gap painted in the
     *   page colour so the ring reads against a dark button and a light
     *   one alike. For anything standing on its own — buttons, switches,
     *   inputs, chips.
     * - `focus-ring-inset` draws INSIDE the element. For a row in a
     *   scrolling list (a menu item, a nav item): an outside ring on a
     *   full-width row is clipped by the container that scrolls it, so
     *   half of it is simply not there.
     * - `focus-ring-within` puts the outside ring on a WRAPPER whose
     *   focusable element is a child — a field with an affix inside the
     *   same frame. It has to be `:focus-within`, because
     *   `:focus-visible` never matches the `<div>` that holds the input.
     *
     * The first two are `:focus-visible`, never `:focus` — a ring that
     * appears on a mouse click is noise, and noise is what makes people
     * switch rings off. A text field is the exception the browsers already
     * make for us: they treat a focused text input as focus-visible even
     * when it was clicked, because it IS about to receive keystrokes.
     */
    // `PluginAPI` is Tailwind's own type for the argument, and its
    // `addUtilities` takes a `CSSRuleObject`. Naming it here rather than
    // describing the one method we use keeps the object below checked
    // against Tailwind's shape instead of against our guess at it.
    ({ addUtilities }: PluginAPI) => {
      const ring = {
        outline: "none",
        boxShadow:
          "0 0 0 var(--focus-ring-offset, 2px) var(--bg), 0 0 0 calc(var(--focus-ring-offset, 2px) + var(--focus-ring, 2px)) var(--accent)",
      };
      addUtilities({
        ".focus-ring:focus-visible": ring,
        ".focus-ring-within:focus-within": ring,
        ".focus-ring-inset:focus-visible": {
          outline: "none",
          boxShadow: "inset 0 0 0 var(--focus-ring, 2px) var(--accent)",
        },
      });
    },
  ],
} satisfies Partial<Config>;
