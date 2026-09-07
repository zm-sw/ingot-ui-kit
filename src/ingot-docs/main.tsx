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
import { EmbedApp, isEmbedPath } from "@/ingot-docs/EmbedApp";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

// `/embed/button` is one demo and no chrome — the address a design tool
// puts in a panel. It is not a page of the site (no menu, no sitemap, no
// prerendered file), so it forks here rather than inside the shell: the
// shell IS the chrome, and an embed that renders the shell and then hides
// it would still pay for it.
ReactDOM.createRoot(rootEl).render(
  isEmbedPath(window.location.pathname) ? <EmbedApp /> : <DocsApp />,
);
