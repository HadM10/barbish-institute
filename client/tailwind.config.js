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
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        float: 'float 6s ease-in-out infinite',
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      backgroundImage: {
        'logo': "url('/src/assets/fonts/Barbish_institute_logo.png')",
      }
    },
  },
  plugins: [],
};