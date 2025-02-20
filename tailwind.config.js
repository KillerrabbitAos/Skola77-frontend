/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("tailwindcss/plugin")(({ addComponents, e }) => {
      addComponents({
        [`.${e('tooltip')}:hover::after`]: {
         
        },
      });
    }),
  ],
};
