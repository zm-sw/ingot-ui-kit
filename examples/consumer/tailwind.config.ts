import type { Config } from "tailwindcss";

import ingotPreset from "@forgmatic/ingot/tailwind-preset";

// Two things, both necessary. The preset names the utilities after the
// kit's tokens; the content glob adds the kit's own sources, because a
// class that only appears inside node_modules is a class Tailwind never
// generates and a component that renders unstyled.
export default {
  presets: [ingotPreset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@forgmatic/ingot/src/ingot/**/*.{ts,tsx}",
  ],
} satisfies Config;
