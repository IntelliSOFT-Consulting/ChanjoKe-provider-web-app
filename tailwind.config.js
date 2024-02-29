/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#163C94',
        dark: '#292929',
      },
     
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

