/**
 * Entry point doc webu Ingotu (KAN-581) — `ingot.html`.
 *
 * 🚨 VLASTNÍ entry, ne routa v `apps/web`. Dvě věci na tom stojí:
 *
 *  1. **Bundle.** Rozhodnutí 3 v KAN-581: doc web nesmí být přílepek
 *     k entry chunku aplikace. Vlastní rollup input znamená, že si ho
 *     zákazník nikdy nestáhne.
 *  2. **Shell.** `resolveShell()` klasifikuje marketing host PŘESNOU
 *     shodou s apexem nebo `www.<apex>`, takže `ingot.forgmatic.com` by
 *     propadl až na závěrečné `return "tenant"` a tiše skončil na
 *     `DEFAULT_TENANT_SLUG` — táž třída chyby jako KAN-11/KAN-39, jen
 *     na `.com` místo na `.app`. Vlastní entry `resolveShell()` vůbec
 *     nespouští, takže past nevzniká.
 *
 * Bez i18n a bez QueryClientu schválně: doc web nemá tenanta, nemá
 * session a nemá co načítat. Ukázky jsou čistě klientské.
 */
import ReactDOM from "react-dom/client";

import "@/styles/globals.css";
import { DocsApp } from "@/ingot-docs/DocsApp";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

ReactDOM.createRoot(rootEl).render(<DocsApp />);
