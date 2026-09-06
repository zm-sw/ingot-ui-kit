# Ingot UI Kit

The Forgmatic design system: React + Tailwind primitives with a
consistency-and-accessibility bar (focus trap, ESC, scroll lock,
`aria-modal`, focus return), plus the public documentation web served at
[ingot.forgmatic.com](https://ingot.forgmatic.com).

It is one source of truth for how a form, a dialog, a table or a page frame
looks and behaves — in the tenant and platform admin, on the public web,
and in third-party apps built for Forgmatic.

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

## Installing

**Pin to a tag. Never to a commit.**

```jsonc
// package.json
"dependencies": { "@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#v1.1.1" }
```

A commit SHA looks more precise and is in fact less safe. The version in
`package.json` moves only when a release lands on `main`, so every commit
between two releases carries the previous release's number — one version
string, many different trees. npm caches a `github:` dependency under its
name and version, so under `@forgmatic/ingot@1.1.1` it may hold any of
them and hand back one that is not what the SHA points at. Nothing warns
you: `package.json`, `package-lock.json` and `node_modules` all agree.
Every release is tagged with an annotated tag, so a tag is exactly one
version and exactly one tree.

Available tags are on the [releases page](https://github.com/zm-sw/ingot-ui-kit/releases);
what each one changed is in [CHANGELOG.md](CHANGELOG.md).

## Two ways to install it

**From a tag.** What everything here assumes, and what works today:

```
"@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#v1.1.1"
```

**From GitHub Packages.** Once a release has been published there, the
same package is available under a semver range with an integrity hash,
which a git pin cannot give you:

```
@forgmatic:registry=https://npm.pkg.github.com
```

Publishing is off by default. It is the one step of the release that
cannot be taken back, so it happens only when the repository variable
`INGOT_PUBLISH` is set to `true`; until then every release still tags and
still cuts its GitHub release, and the tag is the pin.

## Is the package enough to build with?

`examples/consumer/` answers that from outside. It is a small application
that installs the **packed** kit — the same file list a consumer receives
— and never reaches into `src/`. A leaked relative path, a forgotten
export, an undeclared peer, or a type only this repository's tsconfig
supplies all fail there instead of at somebody's first install.

```bash
npm run consumer:pack
```

Then `npm install && npm run build` inside `examples/consumer`. CI runs it
on `main`, and on a pull request labelled `consumer`.

## Setting up a consumer

Three things, all of them once.

**1. Tailwind.** Take the preset and let Tailwind see the kit's sources,
otherwise its classes are not in your CSS:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import ingotPreset from "@forgmatic/ingot/tailwind-preset";

export default {
  presets: [ingotPreset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@forgmatic/ingot/src/ingot/**/*.{ts,tsx}",
  ],
} satisfies Config;
```

**2. Tokens.** Import the stylesheet once, at the entry point, before your
own styles. It carries the palette, both themes, the accent families and
the hint highlight:

```ts
// src/main.tsx
import "@forgmatic/ingot/tokens.css";
```

**3. Dark mode without a flash.** The theme is a class on `<html>`, so it
has to be set before the first paint — after React mounts is one frame too
late and the page flashes light. Copy the script out of the package, serve
it as a static file and load it in `<head>` before the app. It must stay a
plain, non-deferred `<script>`: a module is deferred, which is the flash it
exists to prevent.

```bash
cp node_modules/@forgmatic/ingot/src/ingot/theme-init.js public/
```

```html
<script src="/theme-init.js"></script>
```

The other half — reading the reader's choice, storing it, resolving it
against the system and putting it on the document — ships as
`@forgmatic/ingot/theme`. It is framework-free on purpose, so a shell wires
it into whatever state it already has:

```ts
import { applyTheme, readStoredTheme, writeStoredTheme } from "@forgmatic/ingot/theme";
```

## What the package exports

| Entry                              | What comes out of it                                                        |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `@forgmatic/ingot`                 | The primitives.                                                             |
| `@forgmatic/ingot/forgmatic`       | This platform's own layer: operation icons, schema adapters, product rules. |
| `@forgmatic/ingot/marketing`       | The public-page blocks, without the rest of the kit.                        |
| `@forgmatic/ingot/theme`           | Theme and accent: read, store, resolve, apply. No React.                    |
| `@forgmatic/ingot/theme-init.js`   | The anti-flash script, as a static file.                                    |
| `@forgmatic/ingot/tailwind-preset` | The Tailwind preset.                                                        |
| `@forgmatic/ingot/tokens.css`      | The token values, both themes, all five accents.                            |
| `@forgmatic/ingot/tokens.json`     | The same tokens as data.                                                    |

The kit has no translation namespace: every visible string arrives from
the caller already translated. The few labels a primitive says itself (the
undo action on a toast, the hint bulb, a secret field's placeholder) come
from `IngotProvider` and default to English:

```tsx
<IngotProvider lang="cs">
  <App />
</IngotProvider>
```

## Development

```bash
npm install
npm run dev     # doc web on http://localhost:5173
npm test        # unit tests
npm run check   # repo guards + lint + formatting
npm run build   # typecheck + doc web build
```

Before pushing, all four:

```bash
npm run typecheck && npm run check && npm test && npm run build
```

The doc web deploys via Vercel from this repository (`vercel.json`);
`/api/*` is proxied to the platform API so the language switcher can read
the platform's language registry without CORS.

## Rules that CI enforces

- Every value export matching `Ingot*` (plus `Button`, `Card`) from the
  barrel has a doc page, and every doc page documents a real export.
- A doc page imports its demo module twice — as code and as `?raw` text —
  so the "show code" listing can never drift from what renders.
- Every doc page declares the tokens its primitive stands on and says
  whether `className` is accepted, and for what.
- Demo modules carry no comments (they are published verbatim).
- The doc web hand-rolls no markup that has a kit counterpart.
- Rendered doc text names no issue keys, monorepo paths or guard names.
- No hard-coded Czech in the kit outside comments, and every comment and
  test name is English.
- A change to `src/ingot/` moves the version on the doc page it belongs
  to — a shared module on every page that imports it, a token on every
  page that declares it.
- ESLint and Prettier pass. `src/ingot` is deliberately outside Prettier's
  reach; see `.prettierignore` for why.

Working on the kit itself? `CLAUDE.md` carries the rules in full, including
how versions, branches and releases work.

## Licence

MIT — see [LICENSE](LICENSE).
