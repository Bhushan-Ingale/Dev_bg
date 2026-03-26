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
        dark: '#0a0a0a',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        general: ['General Sans', 'sans-serif'],
      },
      keyframes: {
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeInLeft: 'fadeInLeft 0.6s ease-out',
        fadeInRight: 'fadeInRight 0.6s ease-out',
        spin: 'spin 1s linear infinite',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}