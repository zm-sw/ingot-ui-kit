import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: false,
    // ``examples`` has a node_modules of its own — the reference consumer
    // installs the packed kit there. A bare "node_modules" entry does not
    // match a nested one, and vitest happily ran a dependency's own test
    // suite.
    exclude: ["**/node_modules/**", "**/dist/**", "examples/**"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
