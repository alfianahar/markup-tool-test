/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Light mode colors
        'text': '#000000',
        'background': '#ffffff',
        'primary-button': '#4a967a',
        'secondary-button': '#040d02',
        'accent': '#4a8c96',


        // Dark mode colors
        dark: {
          'text': '#ffffff',
          'background': '#121212',
          'primary-button': '#4a967a',
          'secondary-button': '#eaf3f5',
          'accent': '#4a8c96',
        }
      },
    },
    variants: {
      extend: {
        backgroundColor: ['dark'],
        textColor: ['dark'],
        // ...
      }
    },
    plugins: [],
  }
}
