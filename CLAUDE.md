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

## Kit version vX.Y.Z is written by a machine

`package.json` version and the doc-web footer are written by
`scripts/release.mjs` (GitHub Actions, on every push to `main`). Never
edit them by hand.

The bump reaches `main` the same way everything else does — as a pull
request from `release/vX.Y.Z` that merges itself once the checks pass.
The tag is cut afterwards, on the merged commit, and it is annotated:
`git push --follow-tags` carries annotated tags only, and a lightweight
one silently never leaves the runner.

- **Z** — anything that changed since the last tag (component patches,
  tokens, docs, chrome).
- **Y** — a new primitive, or a MAJOR bump of any component (read from
  the doc-page registry, which is the machine-readable contract).
- **X** — a kit-wide epoch. A machine cannot judge that, so it moves
  ONLY when a commit subject starts with `release!:`.

The PR check `version-guard` fails any PR that touches `src/ingot/`
without moving a `version:` on a doc page — the release automation
stands on those versions, so a version that does not move is a release
that never ships.

## The remote holds exactly two branches

`main` and `dev` are the only long-lived branches. Everything else is a
working branch: it exists while its pull request is open and is deleted
the moment that request is merged or closed. A branch on the remote with
no open pull request is a finding, not a leftover — stale branches are
how a repository stops telling the truth about what is in flight.

Work flows one way:

- A working branch starts from `dev` and returns to `dev` by pull
  request, **squash** merged. One feature, one commit on `dev`.
- `dev` reaches `main` by pull request, **rebase** merged, when a batch
  is ready to release. `main` is what ships; `dev` is where things are
  proven first.
- A promotion consumes `dev`. The repository deletes a merged pull
  request's head branch, and `dev` is the head of that request; even if
  it survived, rebase merging would have left it holding commit ids that
  no longer exist on `main`. Recreate it from `main` —
  `git push origin main:refs/heads/dev` — before opening the next working
  branch. Repository admins bypass the `dev` ruleset for exactly this one
  move, and for nothing else.

`release/vX.Y.Z` is the single exception: the release automation opens it
against `main` directly, because the version it carries describes what is
already on `main`. Nobody writes to that branch by hand.

Merge commits are disabled repository-wide. Both branches require a
linear history, so a merge commit could not land anyway; turning the
option off keeps the choice from being offered.

### What the rulesets enforce

Neither branch accepts a direct push, a force push, or a deletion. Every
change arrives as a pull request with `gate` and `version-guard` green.
A `main` pull request must additionally be up to date with `main` before
it can merge, and its review threads must be resolved — `main` is the
branch a consumer installs from, so it is the one that gets the stricter
gate.

Approvals are not required. A gate nobody can satisfy is a gate that gets
switched off; the checks are the gate here, and a reviewer is welcome
rather than mandatory.

## Before pushing

```bash
npm run typecheck && npm run check && npm test && npm run build
```

`npm run check` runs the repo guards; all four must be green.
