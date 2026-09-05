import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The kit is distributed as TypeScript source, so it must go through the
// same pipeline as the app's own files instead of being pre-bundled as an
// opaque dependency. That is the one line of configuration a consumer
// needs beyond a stock Vite app, and it is here so the example proves it
// rather than the README claiming it.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ["@forgmatic/ingot"] },
});
