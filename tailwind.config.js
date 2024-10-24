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
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
      sans2: ["Bricolage Grotesque", "sans-serif"],
      serif: ["Merriweather", "serif"],
      script: ["Eyesome Script", "cursive"],
      luxury: ["Rollgates Luxury", "serif"], // Added the new font
    },
  },
  plugins: [],
};
