/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'amharic': ['Noto Sans Ethiopic', 'sans-serif'],
        'english': ['Noto Sans', 'Inter', 'Roboto', 'sans-serif'],
      },
      colors: {
        'mayor-deep-blue': '#0D47A1',
        'mayor-royal-blue': '#1565C0',
        'mayor-highlight-blue': '#1E88E5',
        'mayor-gray-divider': '#E3E3E3',
        'mayor-navy': '#0A2A4A',
      },
      borderRadius: {
        'gov': '8px',
        'gov-lg': '12px',
        'gov-xl': '16px',
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}

