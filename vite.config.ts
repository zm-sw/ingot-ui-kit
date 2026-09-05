import { readFileSync } from "node:fs";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * Serves the kit's anti-flash script at ``/theme-init.js``.
 *
 * The file itself ships in the package (``@forgmatic/ingot/theme-init.js``)
 * and index.html loads it as a plain, blocking script — a module would be
 * deferred, which is the flash it exists to prevent. It used to sit in
 * ``public/`` as a hand-kept copy, and a copy of a file whose storage key
 * has to match the theme module is a copy that goes stale silently.
 *
 * So the doc web reads the shipped file directly: served from memory in
 * dev, emitted as an asset at build. One file, one truth, and the doc web
 * consumes the kit the same way a consumer does.
 */
function themeInit(): Plugin {
  const file = path.resolve(__dirname, "./src/ingot/theme-init.js");
  const read = (): string => readFileSync(file, "utf-8");

  return {
    name: "ingot-theme-init",
    configureServer(server) {
      server.middlewares.use("/theme-init.js", (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.end(read());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "theme-init.js", source: read() });
    },
  };
}

// Builds the doc web (index.html -> src/ingot-docs). The kit itself
// (src/ingot) is distributed as source via the package `exports` field —
// consumers compile it with their own toolchain.
export default defineConfig({
  plugins: [react(), themeInit()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        // The Forgmatic layer in its own chunk. It is forty-three glyphs
        // and the schema adapters — code the doc web draws on two pages and
        // no consumer outside this platform wants at all. Splitting it here
        // makes that visible as a number in the build output; making the doc
        // web fetch it only on those two pages is a separate change.
        manualChunks(id) {
          if (id.includes("/src/ingot/forgmatic/")) return "forgmatic";
          return undefined;
        },
      },
    },
  },
});
