import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bfd3ff",
          300: "#93b5ff",
          400: "#638fff",
          500: "#3f6fff",
          600: "#244fda",
          700: "#193cae",
          800: "#182f86",
          900: "#1b2f6e",
          950: "#0c1c4d"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(17, 46, 122, 0.12)"
      }
    },
  },
  plugins: [],
};

export default config;
