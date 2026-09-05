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

| commit | version | ships the `inbox` icon? |
| --- | --- | --- |
| before the icons landed | `1.0.1` | no |
| the commit that added them | `1.0.1` | yes |
| the commit after that | `1.0.1` | yes |

npm caches a `github:` dependency under its name and version, so under
`@forgmatic/ingot@1.0.1` it may hold any of those trees and hand back one
that is not what the SHA points at. Nothing warns you: `package.json`,
`package-lock.json` and `node_modules` all agree — `node_modules` is just
a *different* `1.0.1`. Debugging that costs a day and ends in a bug report
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

## Comments are English

Every comment in code is English: JSDoc, `//` lines, JSX comments, HTML,
CSS and workflow YAML comments, and the `describe` / `it` names in
`tests/`. The code
is read by people who do not read Czech, and a comment only half the
team can read is a comment that gets deleted at the next refactor.
User-facing text is content, not a comment — it stays localized, in the
`Localized` records and in the strings the tests look for.

The `ingot-comments-english` guard in `npm run check` reads comments and
test names (never string literals) and fails on Czech diacritics. If a
comment has to point at a Czech UI string, describe it in English rather
than quoting it.

## Before pushing

```bash
npm run typecheck && npm run check && npm test && npm run build
```

`npm run check` runs the repo guards; all four must be green.
