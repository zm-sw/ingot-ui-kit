import type { Config } from "tailwindcss";

/**
 * Tokenová barva, která umí i ``/opacity``.
 *
 * 🚨 **Holý řetězec ``"var(--ink)"`` modifikátor NEUMÍ.** Tailwind do něj
 * nemá kam vložit alfu, takže utilitu s modifikátorem **nevygeneruje
 * vůbec** — a to není chyba, je to no-op. Změřeno 2026-08-25 nad
 * buildnutým CSS: 228 volání typu ``bg-ink/40`` ve zdrojácích, **nula**
 * odpovídajících selektorů ve výstupu (KAN-574).
 *
 * Nejhorší na tom je, co to udělá: ``bg-surface/95`` neznamená
 * „průsvitné pozadí", ale **žádné pozadí** — a ``bg-ink/40`` pod modály
 * znamenalo, že ztmavení pod nimi nikdy nebylo.
 *
 * Funkční tvar to řeší, aniž by se hnula paleta:
 *
 * * **bez** ``opacityValue`` vrátí ``var(--x)`` — základní třídy
 *   (``bg-ink``, ``text-ink-2``) se ve výstupu nezmění o znak;
 * * **s** ním složí ``color-mix``, který alfu unese i nad ``var()``.
 *
 * Proč ne kanálový zápis (``--ink: 12 10 9`` + ``rgb(var(--ink) /
 * <alpha-value>)``): ``globals.css`` čte ``var(--ink)`` i přímo
 * (React Flow ``--xy-*``), takže by se rozbil — a druhá proměnná na
 * barvu je druhá věc, která se dá rozejít.
 */
function token(name: string): string {
  const resolve = ({ opacityValue }: { opacityValue?: string }): string => {
    // 🪤 U třídy BEZ modifikátoru nepřijde ``undefined``, ale řetězec
    // ``"var(--tw-bg-opacity)"``. První verze tohohle helperu ho hnala
    // rovnou do ``Number()`` a vyrobila ``color-mix(… NaN%, transparent)``
    // — tedy neplatné CSS pro ÚPLNĚ KAŽDOU základní tokenovou třídu.
    // Zachytil to až build; z configu se to nepozná.
    const alpha = opacityValue === undefined ? NaN : Number(opacityValue);
    if (!Number.isFinite(alpha)) return `var(${name})`;
    return `color-mix(in srgb, var(${name}) ${alpha * 100}%, transparent)`;
  };
  // Přetypování je záměr, ne obcházení kontroly. Tailwind funkční tvar
  // barvy dokumentuje a za běhu ho podporuje, ale v ``types/config.d.ts``
  // má hodnotu barvy jako ``string`` — ``satisfies Config`` by ji jinak
  // odmítl. Že to opravdu funguje, drží ``tests/tailwindTokens.test.ts``
  // na skutečně vygenerovaném CSS, ne na typech.
  return resolve as unknown as string;
}

// Sdílený Tailwind preset Ingot UI Kitu (@forgmatic/ingot/tailwind-preset).
// Mapuje utility na tokeny z tokens.css; hodnoty tokenů deklaruje
// tokens.css, tenhle soubor jen říká Tailwindu, jak z nich dělat třídy.
// Konzument (doc web i Forgmatic appka) si doplní jen `content`.
export default {
  // Dark mode is a `.dark` class on <html>, applied by the admin/operator
  // shell only (see ThemeProvider + AdminLayout). The palette itself is
  // driven by the CSS custom properties re-declared under `:root.dark` in
  // globals.css, so most token-based UI (`bg-surface`, `text-ink`, …)
  // themes for free; `dark:` variants are available for the few spots
  // that hardcode a colour and need an explicit override.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // ⚠️ Každá barva MUSÍ jít přes ``token()``. Holý ``"var(--x)"``
      // sem nepiš — modifikátor ``/opacity`` by se u ní tiše zahazoval.
      // Hlídá to ``tests/tailwindTokens.test.ts``.
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
        // Role zvýrazněné syntaxe. Nejsou to nové barvy palety, ale
        // jména pro ``IngotCode`` — proto vlastní rodina a ne přetížení
        // ``accent``/``ok``/``danger``, které v tmavém motivu slouží
        // jinému účelu a hýbaly by se z jiných důvodů.
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
      // Rádiusová škála Ingot handoffu v0.1 (``--r-xs``…``--r-lg``).
      // Jména jsou Tailwindová, hodnoty handoffové: ``sm`` = r-xs 4,
      // DEFAULT = r-sm 6, ``md`` = r-md 10, ``lg`` = r-lg 14. ``xl``
      // v handoffu protějšek nemá a zůstává, jak bylo.
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "10px",
        lg: "14px",
        xl: "16px",
      },
      // Typografická škála handoffu (sekce 3 TYPE v ``ingot.css``).
      // V handoffu jsou to třídy ``.t-display``…``.t-eyebrow``; tady
      // jde o Tailwind ``fontSize``, protože kit staví na utilitách —
      // nepoužitý krok se do CSS nevygeneruje vůbec.
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
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        "fade-up": {
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
