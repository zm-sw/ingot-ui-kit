import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Builds the doc web (index.html -> src/ingot-docs). The kit itself
// (src/ingot) is distributed as source via the package `exports` field —
// consumers compile it with their own toolchain.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
