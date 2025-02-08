import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Ensures dark mode works based on class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(15, 76, 58)",
        "primary-foreground": "rgb(255, 255, 255)",
        secondary: "rgb(20, 184, 166)",
        "secondary-foreground": "rgb(15, 76, 58)",
        accent: "rgb(16, 185, 129)",
        "accent-foreground": "rgb(255, 255, 255)",
        background: "rgb(248, 250, 252)",
        foreground: "rgb(15, 23, 42)",
        muted: "rgb(30, 41, 59)",
        "muted-foreground": "rgb(100, 116, 139)",
        border: "rgb(226, 232, 240)",
        input: "rgb(226, 232, 240)",
        ring: "rgb(16, 185, 129)",

        // Dark mode variants
        dark: {
          background: "rgb(15, 23, 42)", // Dark background
          foreground: "rgb(248, 250, 252)", // Light text
          muted: "rgb(55, 65, 81)", // Softer darks
          "muted-foreground": "rgb(156, 163, 175)", // Softer greys
          border: "rgb(75, 85, 99)", // Darker borders
          input: "rgb(55, 65, 81)", // Input background in dark mode
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
} satisfies Config;
