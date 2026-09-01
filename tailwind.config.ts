import type { Config } from "tailwindcss";

import ingotPreset from "./src/ingot/tailwind-preset";

// Veškerá paleta a tokeny žijí v presetu balíčku (a v tokens.css) —
// tenhle soubor říká jen, KDE hledat třídy.
export default {
  presets: [ingotPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
