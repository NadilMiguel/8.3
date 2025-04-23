/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          orangeLight: '#FFAC31',
          orangeDark: '#E68A00',
          brown: '#041E42',
          brownLight: '#374759',
          brownDark: '#131A22',
        },
        walmart: {
          blue: '#0071DC',
          blueLight: '#0084FF',
          blueDark: '#004F9A',
        },
        text: {
          primary: '#232F3E',
          secondary: '#374759',
          muted: '#637381',
        },
      },
    },
  },
  plugins: [],
};