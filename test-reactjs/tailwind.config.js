/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./src/**/*.{html,js}", flowbite.content()],
  plugins: [
    // ...
    flowbite.plugin(),
  ],
  theme: {
    extend: {},
  },
};
