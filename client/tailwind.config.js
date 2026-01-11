const { colors } = require("./src/config/colors.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["Edu SA Beginner", "cursive"],
      mono: ["Roboto Mono", "monospace"],
    },

    extend: {
      // Extend colors instead of replacing them to preserve Tailwind defaults
      colors: colors,
      maxWidth: {
        maxContent: "1560px",
        maxContentTab: "650px",
      },
    },
  },
  plugins: [],
};
