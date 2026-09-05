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

## How a primitive leaves, and how it grows up

The old rule — "a breaking change rewrites every call site in the same
change" — assumed every caller lives in this repository. It does not any
more: the public web installs the package from a tag, and third-party
apps for Forgmatic will. For them a removal without notice is a build
that stops on a Monday morning with nothing to read.

**A primitive leaves in three steps.**

1. `status: "deprecated"` on its doc page, with
   `deprecated: { since, replacedBy?, removeIn }`. The badge turns red and
   the page opens with the notice, before the demo.
2. It keeps working, unchanged, for **at least two releases**. A
   deprecation that removes the thing in the next version is a removal
   with extra steps.
3. It goes away in the version `removeIn` named — never sooner. Removing
   a primitive is a MINOR bump, not a patch: the release script reads the
   registry and treats a page that disappeared like a new one.

The `ingot-doc-pages` guard refuses a deprecation without `removeIn`: a
warning nobody can plan around is not a warning.

**A primitive grows up on evidence, not on age.** `beta` → `stable` needs
two things at once: **two consumers** using it (the doc web does not
count — it demonstrates everything), and **no major bump for two
releases**. Marking something `stable` because it looks finished is how a
design system ends up unable to fix its own mistakes: `stable` is a
promise that the next change will not be breaking, and that promise costs
whoever holds it.

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

### A consumer pins to a tag, never to a commit

The kit is installed from git, so the pin is the whole contract:

```
"@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#v1.1.0"
```

**That `#v1.1.0` must be a tag.** A commit SHA there looks more precise
and is in fact less safe, because the version in `package.json` moves
only when a release lands on `main`. Every commit between two releases
therefore carries the PREVIOUS release's number, and one version string
names many different trees:

| commit                     | version | ships the `inbox` icon? |
| -------------------------- | ------- | ----------------------- |
| before the icons landed    | `1.0.1` | no                      |
| the commit that added them | `1.0.1` | yes                     |
| the commit after that      | `1.0.1` | yes                     |

npm caches a `github:` dependency under its name and version, so under
`@forgmatic/ingot@1.0.1` it may hold any of those trees and hand back one
that is not what the SHA points at. Nothing warns you: `package.json`,
`package-lock.json` and `node_modules` all agree — `node_modules` is just
a _different_ `1.0.1`. Debugging that costs a day and ends in a bug report
against code that was never broken.

Every release is tagged with an annotated tag, so a tag is exactly one
version and exactly one tree. Pin to it.

When a typecheck fails on kit symbols you can see in the kit's own source,
suspect the install before the kit: compare the installed file against the
tag rather than against a version number, and `npm cache clean --force`
before re-measuring. A matching version number proves nothing.

## The remote holds exactly two branches

`main` and `dev` are the only long-lived branches. Everything else is a
working branch: it exists while its pull request is open, and deleting it
is part of merging it, not a separate errand. A branch on the remote with
no open pull request is a finding, not a leftover — stale branches are
how a repository stops telling the truth about what is in flight.

Work flows one way:

- A working branch starts from `dev` and returns to `dev` by pull
  request, **squash** merged. One feature, one commit on `dev`. Merge it
  with `gh pr merge --squash --delete-branch`, or press the button the
  web interface offers afterwards.
- `dev` reaches `main` by pull request, **merge** commit, when a batch is
  ready to release. `main` is what ships; `dev` is where things are
  proven first.

The promotion is a merge commit and nothing else on purpose. Squashing or
rebasing it would give `main` new commit ids for work that `dev` already
holds under the old ones, and `dev` would then have to be reset by hand
after every promotion — a step nobody remembers and no bot may take,
because the `dev` ruleset refuses a write that did not arrive by pull
request. A merge commit leaves `dev`'s history untouched, so `dev` is
simply a few commits behind `main` and needs no maintenance at all. That
is why `main` does not require a linear history.

`release/vX.Y.Z` is the exception to the one-way flow: the release
automation opens it against `main` directly, because the version it
carries describes what is already on `main`, and deletes it once the
request lands. Nobody writes to that branch by hand.

### What the rulesets enforce

Neither branch accepts a direct push, a force push, or a deletion. Every
change arrives as a pull request with `gate` and `version-guard` green.
A `main` pull request must additionally have its review threads resolved
— `main` is the branch a consumer installs from, so it is the one that
gets the stricter gate. `dev` additionally requires a linear history,
which its squash merges give it for free.

Approvals are not required. A gate nobody can satisfy is a gate that gets
switched off; the checks are the gate here, and a reviewer is welcome
rather than mandatory.

## The API rules every primitive follows

These four hold for every export of `src/ingot/`, and a new primitive
that breaks one of them is a finding in review, not a variation.

- **`className` is layout, never look.** Width, spacing, placement in a
  grid — nothing that changes colour, radius, weight or padding of the
  primitive itself. A primitive whose whole point is to look the same
  everywhere (a status badge, an overlay, a page heading) does not take
  it at all: that is a decision, not an omission, and its doc page says
  so in `classNameNote`.
- **Anything with a DOM target takes `ref`.** A caller that focuses a
  field, scrolls a row into view or sets `indeterminate` must reach the
  element through the API. Reaching in with `querySelector` binds the
  caller to the primitive's insides, and renaming an element inside the
  kit then breaks a screen no kit test covers. `forwardRef` points at the
  element the caller means — the `<input>`, not the wrapper.
- **A label a screen reader needs is a required prop.** Not an optional
  one with a default: an optional label is a label somebody forgets, and
  nobody sees the hole on screen. The few labels the kit says itself live
  in the `IngotProvider` dictionary and default to English.
- **Every visible string arrives translated.** The kit has no i18n
  namespace; `ingot-no-hardcoded-text` keeps it that way.

Both `classNameNote` on the doc page and the guards are how these stay
true: the page answers "may I pass `className` here?" for every
primitive, and `npm run check` fails a page that does not answer.

## Comments are English

Every comment in code is English: JSDoc, `//` lines, JSX comments, HTML,
CSS and workflow YAML comments, and the `describe` / `it` names in
every test file. The code
is read by people who do not read Czech, and a comment only half the
team can read is a comment that gets deleted at the next refactor.
User-facing text is content, not a comment — it stays localized, in the
`Localized` records and in the strings the tests look for.

The `ingot-comments-english` guard in `npm run check` reads comments and
test names (never string literals) and fails on Czech diacritics. If a
comment has to point at a Czech UI string, describe it in English rather
than quoting it.

## Lint and formatting

`npm run check` runs the guards, then ESLint, then Prettier. Two things
about it are deliberate and would otherwise look like oversights.

**`src/ingot` is outside Prettier's reach** (`.prettierignore`). Letting
Prettier rewrap the kit changes about thirty component files without
changing a line of behaviour, and the version guard would then demand a
version bump on about thirty doc pages. A version that moves for a line
break stops meaning "behaviour changed", and that meaning is the one
thing the release automation stands on. The kit gets formatted with the
next kit epoch — a `release!:` commit, where one version move covers the
whole tree.

**Two hook rules are warnings, not errors.** `react-hooks/refs` and
`react-hooks/set-state-in-effect` point at four real places where the fix
is a behaviour change rather than a formatting one. An error there leaves
two options: rush those rewrites into an unrelated pull request, or switch
the rule off and lose the finding. A warning keeps it in sight until the
rewrite lands on its own.

## Before pushing

```bash
npm run typecheck && npm run check && npm test && npm run build
```

`npm run check` runs the repo guards, ESLint and Prettier; all four
commands must be green.
