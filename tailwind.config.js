/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{js,jsx}'] },
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        primary: "#D99A1C", // mustard yellow
        accent: "#F5B025",
        black: "#111111",
      },
    },
  },
  plugins: [],
}

