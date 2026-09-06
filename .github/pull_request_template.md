<!--
The checks below are what CI runs anyway; the list is here so a red gate is
never the first time you read the rule. Tick what applies, delete what does
not.
-->

## What changed and why

<!-- One paragraph. The reason matters more than the diff. -->

## Before merging

- [ ] **A changed component moved its version** on its own doc page. Patch
      when callers touch nothing, major when a prop was removed, renamed or
      a default changed — with the call sites updated in the same change.
- [ ] **A new primitive arrives with its doc page and its demo**, and the
      demo imports the real component (`Demo` + `?raw` from one module).
- [ ] **Behaviour is covered by a test**, not only by the demo.
- [ ] **No hard-coded user-facing text in the kit.** Labels arrive from the
      caller; the few the kit says itself live in the `IngotProvider`
      dictionary.
- [ ] **Comments are English**, including `describe` / `it` names.
- [ ] `npm run typecheck && npm run check && npm test && npm run build`
