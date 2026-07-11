/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width',
        'height': 'height'
      },
    },
  },
  plugins: [],
}
