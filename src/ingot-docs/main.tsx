/**
 * Entry point of the Ingot doc web (`index.html`).
 *
 * Deliberately without an i18n runtime or a data client: the doc web has
 * no tenant, no session and nothing to fetch. The demos are purely
 * client-side; the only network call is the optional language list.
 *
 * The one thing it waits for is this page's own text. Every address is
 * prerendered, so the file the reader already has shows the page in full;
 * handing over to React before the body has arrived would replace that
 * with a skeleton and put it back a heartbeat later. The file preloads
 * that chunk (see `scripts/prerender.mjs`), so by this point it is
 * usually already here — and if it never comes, the application boots
 * anyway rather than leaving a page that cannot be clicked.
 */
import ReactDOM from "react-dom/client";

import "@/styles/globals.css";
import { loadBody } from "@/ingot-docs/bodies";
import { DocsApp } from "@/ingot-docs/DocsApp";
import { EmbedApp, isEmbedPath } from "@/ingot-docs/EmbedApp";
import { locationFromPath } from "@/ingot-docs/routes";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

if (isEmbedPath(window.location.pathname)) {
  // `/embed/button` is one demo and no chrome — the address a design tool
  // puts in a panel. It forks ahead of everything else because both steps
  // below are about a PAGE: the shell is the chrome an embed exists to
  // leave out, and there is no prerendered body here to wait for.
  ReactDOM.createRoot(rootEl).render(<EmbedApp />);
} else {
  const start = (): void => {
    ReactDOM.createRoot(rootEl).render(<DocsApp />);
  };

  const here = locationFromPath(window.location.pathname);
  if (here === null) start();
  else void loadBody(here.page).then(start, start);
}
