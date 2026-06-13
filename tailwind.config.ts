import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // SmartETF brand
        teal: {
          50:  "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          300: "#2DB887",
          400: "#1D9E75",
          500: "#1D9E75",
          600: "#0F6E56",
          700: "#085041",
          800: "#04342C",
          900: "#022018",
        },
        // SmartSuper brand
        purple: {
          50:  "#EEEDFE",
          100: "#CECBF6",
          200: "#AFA9EC",
          300: "#9590E4",
          400: "#7F77DD",
          500: "#7F77DD",
          600: "#534AB7",
          700: "#3C3489",
          800: "#26215C",
          900: "#14102E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
