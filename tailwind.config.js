/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx,ts}",
    "./src/components/**/*.{html,js,jsx,tsx,ts}",
    "!./node_modules/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        textcol: "#ffffff",
        bgcol: "#000000",
        accent: "#E66799",
      },
    },
  },
  plugins: [],
};
