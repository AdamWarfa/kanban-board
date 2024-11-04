/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fysio: {
          peach: "#f2b8b4",
          yellow: "#ffecbe",
        },
      },
    },
  },
  plugins: [],
};
