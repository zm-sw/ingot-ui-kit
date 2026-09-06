/**
 * Entry point of the Ingot doc web (`index.html`).
 *
 * Deliberately without an i18n runtime or a data client: the doc web has
 * no tenant, no session and nothing to fetch. The demos are purely
 * client-side; the only network call is the optional language list.
 */
import ReactDOM from "react-dom/client";

import "@/styles/globals.css";
import { DocsApp } from "@/ingot-docs/DocsApp";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

ReactDOM.createRoot(rootEl).render(<DocsApp />);
