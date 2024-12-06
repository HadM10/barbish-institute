/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Dark Blue
        secondary: '#6366F1', // Light Purple
        accent: '#F97316', // Orange
        'accent-dark': '#E85D04', // Darker Orange (adjust as needed)
        background: '#F9FAFB', // Light Gray
        text: '#111827', // Almost Black
        border: '#D1D5DB', // Light Gray
      },
    },
  },
  plugins: [],
};
