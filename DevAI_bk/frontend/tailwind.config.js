/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffde22',
        secondary: '#ff414e',
        accent: '#ff8928',
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'general': ['General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}