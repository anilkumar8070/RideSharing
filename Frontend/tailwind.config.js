/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // Tailwind green-500
        secondary: '#0f172a', // Tailwind slate-900
      }
    },
  },
  plugins: [],
}
