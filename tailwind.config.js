/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // colors: {
    //   background: "#8492a6",
    // },
    extend: {},
  },
  plugins: [require("daisyui")],
};
