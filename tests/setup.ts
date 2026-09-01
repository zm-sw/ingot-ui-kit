import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";

// KAN-615 — `waitFor` / `findBy*` čekají 5 s, ne výchozí 1 s.
//
// Výchozí rozpočet je stavěný na nezatížený stroj. Tenhle repozitář běží
// s 5–10 souběžnými sessions a vitest k tomu pouští vlastní workery, takže
// render, který sám o sobě trvá desítky ms, může na dotaz čekat déle než
// vteřinu. Změřeno 2026-08-26 na `AdminMailUxGaps` („připojení ke kontaktu"):
// v běhu celého `tests/admin/` spadl na `waitFor`, samostatně prošel — POST
// prostě nestihl odejít do vteřiny.
//
// Delší strop NEZPOMALUJE úspěšný test: `waitFor` se vrací hned, jak
// podmínka platí. Prodlouží se jen doba, po kterou se čeká na test, který
// stejně spadne. Strop na celý test drží `testTimeout` ve `vitest.config.ts`.
configure({ asyncUtilTimeout: 5_000 });
