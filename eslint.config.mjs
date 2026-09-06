/**
 * Lint rules for the kit, the doc web, the tests and the repo scripts.
 *
 * The repository carried `eslint-disable` comments long before it carried
 * an ESLint: they were inherited from the monorepo this kit was pulled out
 * of, and disabled rules nobody runs are just noise. This config is the
 * other half of those comments.
 *
 * What it is NOT: a style engine. Formatting belongs to Prettier, and
 * `eslint-config-prettier` turns off every rule that would argue with it —
 * two tools fighting over a line break is how a lint step gets switched
 * off. What stays is the part a human reviewer misses: hook dependencies,
 * accessibility of hand-written elements, unused code, floating promises.
 *
 * Type-aware linting is deliberately off. It would need a second
 * TypeScript program on every run for rules `tsc --noEmit` already covers
 * in `npm run typecheck`, and a slow check is a check people skip.
 */
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      // The reference consumer builds its own app against a vendored copy
      // of the kit. Both are build output: linting them would mean linting
      // this repository's own source a second time, minified.
      "dist-ssr/**",
      "examples/*/dist/**",
      "examples/*/vendor/**",
      "examples/*/public/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        requestAnimationFrame: "readonly",
        matchMedia: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLDivElement: "readonly",
        Element: "readonly",
        Event: "readonly",
        KeyboardEvent: "readonly",
        MouseEvent: "readonly",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // The kit's own JSX is measured by the accessibility tests; what this
      // catches is a hand-written element in a demo or a guide, which is
      // exactly where nobody looks.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // A React component file is TSX; a bare `any` in it is usually a
      // shortcut around a prop type, which is the type the consumer reads.
      "@typescript-eslint/no-explicit-any": "error",
      // Errors now. They were warnings while eleven real places still had
      // to be rewritten — an error then would have meant either rushing
      // those rewrites into an unrelated pull request or switching the rule
      // off and losing the finding. The rewrites have landed, so the rule
      // can hold the line instead of describing it.
      //
      // Three places carry an inline exemption with the reason written
      // next to it: the tooltip passing a ref object on (which the rule
      // cannot tell from reading one), the doc web's one-time migration of
      // a legacy hash, and the form's derived values, whose branch clears
      // its own condition and so cannot fire twice in a row.
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/refs": "error",
    },
  },
  {
    // Scripts run under plain node, outside the app's globals. The
    // example has its own — the one file a consumer has to copy out of
    // the package cannot be imported, so something has to copy it.
    files: ["scripts/**/*.mjs", "examples/*/scripts/**/*.mjs", "*.config.{ts,js,mjs}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
  },
  {
    // Scripts that run before anything is bundled: the kit's anti-flash
    // script, which a consumer serves as a static file, and the doc web's
    // own one that decides the language of the site root. Browser globals
    // and nothing else.
    files: ["src/ingot/**/*.js", "public/**/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
      },
    },
  },
  prettier,
);
