/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1c1a4b", // Dark Indigo
        secondary: "#3F368A", // Light Purple
        highlight: "#f16146", // Red-Orange
        accent: "#216082", // Deep Blue
        sky: "#409cd6", // Sky Blue
        background: "#f0f8ff", // Light Azure
        text: "#111827", // Dark Charcoal
        border: "#D1D5DB", // Light Silver
      },
    },
  },
  plugins: [],
};
