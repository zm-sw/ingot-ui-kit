import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";

// KAN-615 — `waitFor` / `findBy*` wait 5 s, not the default 1 s.
//
// The default budget is built for an idle machine. This repository runs
// with 5–10 concurrent sessions and vitest starts its own workers on top,
// so a render that takes tens of ms on its own may wait longer than a
// second for a query. Measured 2026-08-26 on `AdminMailUxGaps` ("attach to
// contact"): in a run of the whole `tests/admin/` it failed on `waitFor`,
// on its own it passed — the POST simply did not get out within a second.
//
// A longer cap does NOT slow a passing test down: `waitFor` returns as soon
// as the condition holds. Only the time spent waiting for a test that fails
// anyway gets longer. The cap on the whole test is `testTimeout` in
// `vitest.config.ts`.
configure({ asyncUtilTimeout: 5_000 });
