/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qpl-purple': '#6E2991',
      },
      fontFamily: {
        feather: ['Champion-HTF-Featherweight', 'mono'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
