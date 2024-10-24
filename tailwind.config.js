// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
      },
      animation: {
        kenburns: "kenburns 20s ease infinite",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
      sans2: ["Bricolage Grotesque", "sans-serif"],
      serif: ["Merriweather", "serif"],
      script: ["Eyesome Script", "cursive"],
      luxury: ["Rollgates Luxury", "serif"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
