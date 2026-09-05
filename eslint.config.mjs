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
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
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
      // Warnings, not errors, and on purpose. Both rules point at four real
      // places (the form's reset on a new record, the doc web's demo reset
      // and language fetch, the overlay's opener capture) where the fix is a
      // behaviour change, not a formatting one — the form reset is its own
      // ticket. An error here would leave two options: rush those rewrites
      // into an unrelated pull request, or switch the rule off and lose the
      // finding. A warning keeps it in sight until the rewrite lands.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  {
    // Scripts run under plain node, outside the app's globals.
    files: ["scripts/**/*.mjs", "*.config.{ts,js,mjs}"],
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
    // The anti-flash script is browser code a consumer serves as a static
    // file, not part of any bundle, so it gets the browser globals and
    // nothing else. It ships from the kit, which is why it is matched there
    // and not under public/ — that copy is gone.
    files: ["src/ingot/**/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
  },
  prettier,
);
