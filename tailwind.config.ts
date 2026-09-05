import type { Config } from "tailwindcss";

import ingotPreset from "./src/ingot/tailwind-preset";

// The whole palette and the tokens live in the package preset (and in
// tokens.css) — this file only says WHERE to look for classes.
export default {
  presets: [ingotPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
