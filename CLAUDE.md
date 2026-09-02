# CLAUDE.md

Instructions for working in this repository. These are requirements, not
suggestions — CI enforces some of them, and the rest are enforced in review.

## Component status and version — MANDATORY

Every component doc page in `src/ingot-docs/pages/` declares `status` and
`version`. Both render as badges next to the page title, so both are a
promise made to whoever reads the page.

**Changing a component means bumping its `version` in the same commit.**
There is no exception for "small" changes: if the rendered output, the
props, or the behaviour changed, the version moves. A component whose
behaviour changed under an unchanged version makes every earlier page
screenshot and every consumer's assumption silently wrong.

- **Patch** (`1.0` → `1.1`) — behaviour or markup changed, callers do not
  have to touch anything.
- **Major** (`1.0` → `2.0`) — a prop was removed or renamed, a default
  changed, or existing call sites must be edited.

### What the status badge promises

- **`stable`** — the API does not change without notice. Breaking changes
  are rare, deliberate, and land as a major bump with the call sites
  updated in the same change. Do not mark something `stable` to make it
  look finished; mark it `stable` when you are willing to hold that line.
- **`beta`** — the shape is still being found. Breaking changes are
  expected and fine here, which is exactly why the badge exists: it tells
  a reader whether they may build on it yet.

Promoting `beta` → `stable` is itself a version bump.

## The doc web is the contract

A primitive without a doc page does not exist, and a doc page without a
primitive is a lie. Adding a component and adding its page is ONE change,
not two.

Each doc page imports its demo module twice — once as code (it renders)
and once as `?raw` text (the code listing) — so the listing can never
drift from what the demo shows. Never hand-write a code listing.

Demo modules in `src/ingot-docs/demos/` are published verbatim on a public
page, so they carry no comments.

The doc web teaches the kit, so it hand-rolls no markup that has a kit
counterpart. If you need a primitive that does not exist, that is a
finding — add the primitive, do not hand-roll the markup.

The doc web is PUBLIC. Rendered text names no issue keys, no repository
paths and no guard names. Put that in a comment; comments in `pages/` and
`guides/` are not rendered.

## The design handoff is the source of truth

Pages are aligned to the Ingot v0.1 design handoff. When implementation
and handoff disagree, the handoff wins unless there is a written reason
in a comment saying why it does not.

Token names are part of the system's vocabulary. Documentation names
tokens (`--surface-2`, `t-h1`, `s-3`, `r-md`), not the utility classes
that happen to implement them — a shared vocabulary between designer and
developer is the point of the system.

## Before pushing

```bash
npm run typecheck && npm run check && npm test && npm run build
```

`npm run check` runs the repo guards; all four must be green.
