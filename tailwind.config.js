/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // ensure all pages and components are scanned
    ],
    theme: {
      extend: {},
    },
    corePlugins: {
      preflight: false, // prevent Tailwind from overwriting your base styles
    },
    plugins: [],
  }
  