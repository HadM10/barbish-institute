/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#201A4B', // indigo
        secondary: '#3F368A', // Light Purple
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
