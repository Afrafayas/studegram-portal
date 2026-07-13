/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D99A1C", // mustard yellow
        accent: "#F5B025",
        black: "#111111",
      },
    },
  },
  plugins: [],
}

