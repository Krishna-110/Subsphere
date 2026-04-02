/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS is the magic line that fixes the white screen
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}