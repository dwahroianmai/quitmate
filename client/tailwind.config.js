/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        tile: "0 0 15px grey",
        form: "0 0 15px #14532d",
        inset: "0 0 10px grey inset",
      },
      colors: { white: "#ffffff" },
      borderRadius: { lft: "0% 59% 51% 81% / 10% 65% 61% 36% " },
    },
  },
  plugins: [],
};
