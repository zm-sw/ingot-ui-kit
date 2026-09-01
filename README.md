# Ingot UI Kit

The Forgmatic admin design system: React + Tailwind primitives with a
consistency-and-accessibility bar (focus trap, ESC, scroll lock,
`aria-modal`, focus return), plus the public documentation web served at
[ingot.forgmatic.com](https://ingot.forgmatic.com).

## Layout

- `src/ingot/` — the kit. This is the published package surface
  (`@forgmatic/ingot`): source-distributed TypeScript/TSX, compiled by the
  consumer's own toolchain. The public API is exactly what
  `src/ingot/index.ts` re-exports.
- `src/ingot-docs/` — the doc web (Vite app, entry `index.html`). The doc
  web is the single source of truth for how a primitive looks and behaves:
  every export gets a doc page, and demos import the real component — CI
  fails otherwise (`npm run check`).
- `tests/` — vitest + Testing Library unit tests.

## Consuming the kit

The package ships source, not a bundle:

```jsonc
// package.json
"dependencies": { "@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#<commit>" }
```

The consumer needs:

1. React 18 and Tailwind — add
   `./node_modules/@forgmatic/ingot/src/ingot/**/*.{ts,tsx}` to Tailwind
   `content`, and provide the design tokens (`--bg`, `--ink`, `--accent`, …)
   this repo's `tailwind.config.ts` + `src/styles/globals.css` define.
2. A resolver entry if aliasing (the Forgmatic app maps `@/ingot` to this
   package so existing imports keep working).

## Development

```bash
npm install
npm run dev     # doc web on http://localhost:5173
npm test        # unit tests
npm run check   # doc-pages / kit-only / no-internal-prose guards
npm run build   # typecheck + doc web build
```

The doc web deploys via Vercel from this repository (`vercel.json`);
`/api/*` is proxied to the platform API so the language switcher can read
the platform's language registry without CORS.

## Rules that CI enforces

- Every value export matching `Ingot*` (plus `Button`, `Card`) from the
  barrel has a doc page, and every doc page documents a real export.
- A doc page imports its demo module twice — as code and as `?raw` text —
  so the "show code" listing can never drift from what renders.
- Demo modules carry no comments (they are published verbatim).
- The doc web hand-rolls no markup that has a kit counterpart.
- Rendered doc text names no issue keys, monorepo paths or guard names.
